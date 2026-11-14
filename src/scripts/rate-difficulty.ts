import { buildDifficultyPrompt, DIFFICULTY_INSTRUCTION, parseDifficultyReply } from "@/lib/difficulty";
import { DailyQuotaError, generateText, ModelsBusyError, RateLimitError } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { readingTimeFor } from "@/lib/reading-time";

// The chat's last fallback model. The free tier's daily limits are per model,
// so the default cap leaves room for the chat on days this runs.
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_MAX_REQUESTS = 250;
const PAPERS_PER_REQUEST = 20;

// About 12 requests a minute, under the free tier's per-minute limit.
const DELAY_MS = 5_000;
const RATE_LIMIT_WAIT_MS = 60_000;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function option(args: string[], name: string) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

/** Asks for one batch of ratings, waiting out short rate limits and busy spells. */
async function requestRatings(model: string, prompt: string) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await generateText({ model, system: DIFFICULTY_INSTRUCTION, text: prompt });
    } catch (error) {
      const temporary = error instanceof RateLimitError || error instanceof ModelsBusyError;
      if (!temporary || attempt > MAX_RETRIES) throw error;

      console.log(`  ${error instanceof RateLimitError ? "Rate limited" : "Model busy"}, waiting a minute...`);
      await sleep(RATE_LIMIT_WAIT_MS);
    }
  }
}

async function main() {
  // `npm run rate:difficulty -- --max-requests 250`, or `-- --dry-run --limit 20`
  // to print ratings without saving them.
  const args = process.argv.slice(2);
  const model = option(args, "--model") ?? DEFAULT_MODEL;
  const maxRequests = Number(option(args, "--max-requests") ?? DEFAULT_MAX_REQUESTS);
  const limit = Number(option(args, "--limit") ?? Infinity);
  const dryRun = args.includes("--dry-run");

  // Papers the model skipped this run, so they aren't asked about again until next time.
  const skipped: string[] = [];
  let requests = 0;
  let sent = 0;
  let rated = 0;

  while (requests < maxRequests && sent < limit) {
    const papers = await prisma.paper.findMany({
      where: { difficulty: null, id: { notIn: skipped } },
      // Newest first, matching Explore's order.
      orderBy: [{ publishedDate: "desc" }, { id: "asc" }],
      take: Math.min(PAPERS_PER_REQUEST, limit - sent),
      select: {
        id: true,
        title: true,
        abstract: true,
        pageCount: true,
        paperTopics: { select: { topic: { select: { name: true } } } },
      },
    });

    if (papers.length === 0) break;

    let reply: string;

    try {
      reply = await requestRatings(
        model,
        buildDifficultyPrompt(papers.map((paper) => ({ ...paper, topics: paper.paperTopics.map((link) => link.topic.name) })))
      );
    } catch (error) {
      if (error instanceof DailyQuotaError) {
        console.log("\nToday's free-tier quota for this model is used up. Run again tomorrow.");
        break;
      }
      throw error;
    }

    requests++;
    sent += papers.length;
    const ratings = parseDifficultyReply(reply, papers.length);

    const toSave = papers.flatMap((paper, index) => {
      const rating = ratings.get(index + 1);

      if (!rating) {
        skipped.push(paper.id);
        return [];
      }

      if (dryRun) {
        console.log(`${rating.difficulty}/5  ${paper.title.slice(0, 70)}
      ${rating.reason}`);
        // Also skipped next loop, since nothing is saved.
        skipped.push(paper.id);
        return [];
      }

      return [{ ...rating, id: paper.id, minutes: readingTimeFor(paper.pageCount, rating.difficulty) }];
    });

    // One statement per batch: separate updates are too slow over the network.
    if (toSave.length > 0) {
      await prisma.$executeRaw`
        UPDATE "Paper" AS p
        SET "difficulty" = v.difficulty, "difficultyReason" = v.reason, "readingTime" = v.minutes
        FROM unnest(
          ${toSave.map((row) => row.id)}::text[],
          ${toSave.map((row) => row.difficulty)}::int[],
          ${toSave.map((row) => row.reason)}::text[],
          ${toSave.map((row) => row.minutes)}::int[]
        ) AS v(id, difficulty, reason, minutes)
        WHERE p.id = v.id
      `;
    }

    rated += ratings.size;
    console.log(`Request ${requests}/${maxRequests}: ${ratings.size}/${papers.length} rated`);

    await sleep(DELAY_MS);
  }

  const unrated = await prisma.paper.count({ where: { difficulty: null } });
  console.log(`\n${dryRun ? "Shown" : "Rated"} ${rated} papers in ${requests} requests. Still unrated: ${unrated}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
