import { SearchPaper } from "@/types/paper";

const BASE_URL = "https://api.openalex.org";

// OpenAlex's id for the Computer Science field. Without this filter a search
// for "transformer" also returns electrical engineering papers.
const COMPUTER_SCIENCE_FIELD_ID = 17;

// Dense academic prose reads at roughly 4 minutes per page.
const MINUTES_PER_PAGE = 4;

// Page ranges outside this are almost always bad metadata, not a real paper.
const MAX_PLAUSIBLE_PAGES = 150;

// OpenAlex occasionally answers 429 or a 5xx (we have seen 504s) and succeeds
// on the next try, so those are retried with a growing delay: 1s, then 2s.
const MAX_ATTEMPTS = 3;

type OpenAlexInstitution = {
  display_name: string;
};

type OpenAlexAuthorship = {
  author: {
    id: string | null;
    display_name: string;
  };
  institutions: OpenAlexInstitution[];
};

type OpenAlexTopic = {
  display_name: string;
};

type OpenAlexWork = {
  id: string;
  title: string | null;
  publication_date: string;
  doi: string | null;
  primary_location: {
    landing_page_url: string | null;
    pdf_url: string | null;
  } | null;
  best_oa_location: {
    landing_page_url: string | null;
    pdf_url: string | null;
  } | null;
  open_access: {
    oa_url: string | null;
  } | null;
  authorships: OpenAlexAuthorship[];
  topics: OpenAlexTopic[];
  /** word -> every position it appears at. OpenAlex never sends plain text. */
  abstract_inverted_index: Record<string, number[]> | null;
  biblio: {
    first_page: string | null;
    last_page: string | null;
  } | null;
};

type OpenAlexWorksResponse = {
  results: OpenAlexWork[];
};

/**
 * OpenAlex stores abstracts as an inverted index ({ "deep": [0], "learning": [1, 7] })
 * for licensing reasons. Putting each word back at its positions rebuilds the text.
 */
function rebuildAbstract(index: Record<string, number[]> | null) {
  if (!index) {
    return null;
  }

  const placed: [number, string][] = [];

  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) {
      placed.push([position, word]);
    }
  }

  // Sorting pairs rather than writing into words[position] keeps one bad,
  // huge position from allocating a giant sparse array.
  placed.sort((a, b) => a[0] - b[0]);

  const text = placed.map(([, word]) => word).join(" ").trim();

  return text || null;
}

function estimateReadingTime(biblio: OpenAlexWork["biblio"]) {
  const first = Number.parseInt(biblio?.first_page ?? "", 10);
  const last = Number.parseInt(biblio?.last_page ?? "", 10);

  // Electronic article numbers like "e1003" parse to NaN and land here too.
  if (!Number.isFinite(first) || !Number.isFinite(last)) {
    return null;
  }

  const pages = last - first + 1;

  if (pages < 1 || pages > MAX_PLAUSIBLE_PAGES) {
    return null;
  }

  // Round to the nearest 5 minutes; a precise-looking "43 min" would overstate
  // how good this estimate is.
  return Math.max(5, Math.round((pages * MINUTES_PER_PAGE) / 5) * 5);
}

function isRetryable(status: number) {
  return status === 429 || status >= 500;
}

async function fetchWithRetry(url: string) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url);

      if (!isRetryable(response.status) || attempt === MAX_ATTEMPTS) {
        return response;
      }
    } catch (error) {
      // fetch throws on network failures (DNS, reset connections), which are
      // just as temporary as a 504.
      if (attempt === MAX_ATTEMPTS) {
        throw error;
      }
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * 2 ** (attempt - 1))
    );
  }
}

/** Some OpenAlex titles carry markup such as <i>in vivo</i>. */
function cleanTitle(title: string) {
  return title.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * The most-cited open-access Computer Science papers whose title or abstract
 * contains `phrase`.
 *
 * The phrase is matched exactly, not word by word: unquoted, "large language
 * model" matched any heavily cited paper containing those three words anywhere.
 */
export async function searchWorks(
  phrase: string,
  perPage = 25
): Promise<SearchPaper[]> {
  // Commas separate OpenAlex filters and quotes delimit the phrase, so neither
  // can appear inside it.
  const cleanPhrase = phrase.replace(/[",]/g, " ").trim();

  const params = new URLSearchParams({
    filter: [
      `primary_topic.field.id:${COMPUTER_SCIENCE_FIELD_ID}`,
      `title_and_abstract.search:"${cleanPhrase}"`,
      "has_abstract:true",
      "is_oa:true",
    ].join(","),
    sort: "cited_by_count:desc",
    per_page: String(perPage),
    select: [
      "id",
      "title",
      "publication_date",
      "doi",
      "primary_location",
      "best_oa_location",
      "open_access",
      "authorships",
      "topics",
      "abstract_inverted_index",
      "biblio",
    ].join(","),
  });

  // Read at call time, not module load, so scripts that load .env after
  // importing this file still pick the key up.
  const apiKey = process.env.OPENALEX_API_KEY;

  if (apiKey) {
    params.set("api_key", apiKey);
  }

  const response = await fetchWithRetry(`${BASE_URL}/works?${params}`);

  if (!response.ok) {
    throw new Error(
      `OpenAlex returned ${response.status} for "${cleanPhrase}"`
    );
  }

  const data = (await response.json()) as OpenAlexWorksResponse;

  return data.results
    .filter((paper) => paper.title)
    .map((paper) => ({
      externalId: paper.id,

      title: cleanTitle(paper.title!),

      abstract: rebuildAbstract(paper.abstract_inverted_index),

      publishedDate: new Date(paper.publication_date),

      paperUrl:
        paper.primary_location?.landing_page_url ||
        paper.best_oa_location?.landing_page_url ||
        paper.doi ||
        paper.id,

      pdfUrl:
        paper.best_oa_location?.pdf_url ||
        paper.primary_location?.pdf_url ||
        paper.open_access?.oa_url ||
        null,

      readingTime: estimateReadingTime(paper.biblio),

      authors: paper.authorships
        .filter((authorship) => authorship.author.id)
        .map((authorship) => ({
          openAlexId: authorship.author.id!,

          name: authorship.author.display_name,

          institution:
            authorship.institutions.length > 0
              ? authorship.institutions[0].display_name
              : null,
        })),

      topics: paper.topics.map((topic) => ({
        name: topic.display_name,
      })),
    }));
}
