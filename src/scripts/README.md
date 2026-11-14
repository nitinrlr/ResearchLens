# Scripts

## import-papers

Imports research papers from OpenAlex into PostgreSQL.

It goes through English open-access Computer Science papers from most-cited down, and
saves them with their abstracts, authors and topics until the database reaches
the total you ask for.

```bash
npm run import:papers -- 10000
```

With no number, it fills the database to 50,000 papers.

Running it again is safe, and picks up where it left off. Papers already in the
database are skipped, along with duplicates and any paper missing a PDF link,
authors or a real abstract. Existing papers are not updated.

Set `OPENALEX_API_KEY` in `.env` to get your own daily OpenAlex budget instead
of sharing one with your network. Each request fetches 200 papers.

To add papers from one area instead, use `--add` with an OpenAlex subfield
(see `SUBFIELDS` in `src/lib/openalex.ts`), and optionally `--type review` for
surveys and tutorials:

```bash
npm run import:papers -- --add 1000 --subfield 1703 --type review
npm run import:papers -- --ids-file src/scripts/data/classic-papers.txt
```

`--ids-file` imports exact OpenAlex works, one id per line.

## trim-papers

Removes the least-cited papers whose topics are all AI or computer vision, to
make room for other areas. Surveys are kept, as is any paper someone has read,
saved or chatted about, and any id in `--keep-file`. The removed papers' ids
are written to `backups/`, so `import:papers -- --ids-file` can bring them back.

```bash
npm run trim:papers -- 10000 --dry-run
npm run trim:papers -- 10000 --keep-file keep.txt
```

To browse the result:

```bash
npx prisma studio
```

## count-pages

Fills in each paper's page count. It first reads OpenAlex's page ranges (about 3 minutes for 50,000 papers), then downloads the PDFs of papers without one and counts their pages with PDF.js. arXiv asks for one request every 3 seconds, so a full run takes a few hours; it can be stopped and run again, and skips papers it has already tried.

```bash
npm run count:pages
npm run count:pages -- --pdfs-only --limit 200
```

To stop part-way, press Ctrl+C once: the papers already downloading finish and are saved, then it exits. Press it again to quit immediately; the papers in progress are simply tried again next run.

## rate-difficulty

Rates each paper's difficulty from 1 to 5 with Gemini, from its title, topics and abstract, and saves a one-line reason. Twenty papers go in each request, newest first. It stops after `--max-requests` (250 by default) or when the day's free-tier quota runs out, so run it once a day until every paper is rated.

```bash
npm run rate:difficulty
npm run rate:difficulty -- --dry-run --limit 20
```

Reading time is filled in by whichever script finishes a paper second: page count × minutes per page for its difficulty (see `src/lib/reading-time.ts`).
