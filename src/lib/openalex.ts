import { SearchPaper } from "@/types/paper";

const BASE_URL = "https://api.openalex.org";

// OpenAlex's id for the Computer Science field. Without this filter a search
// for "transformer" also returns electrical engineering papers.
const COMPUTER_SCIENCE_FIELD_ID = 17;

// Page ranges outside these are almost always bad metadata, not a real paper.
// Many journals list an article number as both first and last page ("1"-"1"),
// and a sample of those papers' PDFs ran 4 to 47 pages, so 1-2 is not trusted.
const MIN_PLAUSIBLE_PAGES = 3;
const MAX_PLAUSIBLE_PAGES = 150;

// OpenAlex occasionally answers 429 or a 5xx (we have seen 504s) and succeeds
// on the next try, so those are retried with a growing delay: 1s, then 2s.
const MAX_ATTEMPTS = 3;

// The most OpenAlex returns per request.
const PER_PAGE = 200;

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
  /** Every copy of the paper OpenAlex knows about. */
  locations?: { pdf_url: string | null }[];
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
  meta: {
    next_cursor: string | null;
  };
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

/** Pages from OpenAlex's page range, or null when it's missing or implausible. */
export function pageCountFromBiblio(biblio: OpenAlexWork["biblio"]) {
  const first = Number.parseInt(biblio?.first_page ?? "", 10);
  const last = Number.parseInt(biblio?.last_page ?? "", 10);

  // Electronic article numbers like "e1003" parse to NaN and land here too.
  if (!Number.isFinite(first) || !Number.isFinite(last)) {
    return null;
  }

  const pages = last - first + 1;

  return pages >= MIN_PLAUSIBLE_PAGES && pages <= MAX_PLAUSIBLE_PAGES ? pages : null;
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

/** One request to OpenAlex's works endpoint, with the API key if there is one. */
async function getWorks<T>(params: URLSearchParams): Promise<T> {
  // Read at call time, not module load, so scripts that load .env after
  // importing this file still pick the key up.
  const apiKey = process.env.OPENALEX_API_KEY;

  if (apiKey) {
    params.set("api_key", apiKey);
  }

  const response = await fetchWithRetry(`${BASE_URL}/works?${params}`);

  if (!response.ok) {
    throw new Error(`OpenAlex returned ${response.status}`);
  }

  // Postgres rejects the null character, which turns up in some source text.
  return JSON.parse((await response.text()).replaceAll("\\u0000", "")) as T;
}

const ARXIV_PDF =/^https?:\/\/(www\.|export\.)?arxiv\.org\/pdf\//;

// Publishers whose open PDFs reliably download, so their final version wins
// over an arXiv preprint.
const RELIABLE_PUBLISHER_PDF = /^https?:\/\/(www\.)?(aclanthology|aclweb)\.org\//;

/**
 * Prefers an arXiv copy when there is one: arXiv allows downloads and
 * embedding, while many publishers block both.
 */
export function choosePdfUrl(
  work: Pick<OpenAlexWork, "best_oa_location" | "primary_location" | "open_access" | "locations">
) {
  const publisher =
    work.best_oa_location?.pdf_url ||
    work.primary_location?.pdf_url ||
    work.open_access?.oa_url ||
    null;

  if (publisher && RELIABLE_PUBLISHER_PDF.test(publisher)) {
    return publisher;
  }

  const arxiv = work.locations?.find((location) => location.pdf_url && ARXIV_PDF.test(location.pdf_url));

  return arxiv?.pdf_url?.replace(/^http:/, "https:") || publisher;
}

/** Some OpenAlex titles carry markup such as <i>in vivo</i>. */
function cleanTitle(title: string) {
  return title
    .replace(/<[^>]+>/g, "")
    .replaceAll("\\n", " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** OpenAlex's Computer Science subfields, for importing one area at a time. */
export const SUBFIELDS = {
  artificialIntelligence: 1702,
  theory: 1703,
  graphics: 1704,
  networks: 1705,
  applications: 1706,
  computerVision: 1707,
  hardware: 1708,
  humanComputerInteraction: 1709,
  informationSystems: 1710,
  signalProcessing: 1711,
  software: 1712,
} as const;

export type WorksQuery = {
  /** Only papers whose main topic is in one of these subfields. */
  subfields?: number[];
  /** An OpenAlex work type, such as "review" for surveys and tutorials. */
  type?: string;
  /** Exactly these works (at most 100), whatever their field. */
  ids?: string[];
};

/** The OpenAlex filter for a query: open-access English CS papers unless ids are given. */
export function worksFilter({ subfields, type, ids }: WorksQuery = {}) {
  if (ids) {
    return `openalex:${ids.map((id) => id.replace("https://openalex.org/", "")).join("|")}`;
  }

  return [
    subfields?.length
      ? `primary_topic.subfield.id:${subfields.join("|")}`
      : `primary_topic.field.id:${COMPUTER_SCIENCE_FIELD_ID}`,
    "has_abstract:true",
    "is_oa:true",
    "is_retracted:false",
    "language:en",
    ...(type ? [`type:${type}`] : []),
  ].join(",");
}

/**
 * One page of open-access Computer Science papers, most-cited first. Pass "*"
 * for the first page, then the returned cursor. It's null after the last page.
 */
export async function fetchMostCitedPage(
  cursor: string,
  query: WorksQuery = {}
): Promise<{ papers: SearchPaper[]; nextCursor: string | null }> {
  const params = new URLSearchParams({
    filter: worksFilter(query),
    sort: "cited_by_count:desc",
    per_page: String(PER_PAGE),
    cursor,
    select: [
      "id",
      "title",
      "publication_date",
      "doi",
      "primary_location",
      "best_oa_location",
      "open_access",
      "locations",
      "authorships",
      "topics",
      "abstract_inverted_index",
      "biblio",
    ].join(","),
  });

  const data = await getWorks<OpenAlexWorksResponse>(params);

  const papers = data.results
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

      pdfUrl: choosePdfUrl(paper),

      pageCount: pageCountFromBiblio(paper.biblio),

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

  return {
    papers,
    nextCursor: data.results.length > 0 ? data.meta.next_cursor : null,
  };
}

/** OpenAlex accepts up to 100 values in one "or" filter. */
export const PAGE_RANGE_BATCH_SIZE = 100;

/**
 * Page counts for up to 100 works, keyed by OpenAlex id. Works without a
 * usable page range are left out.
 */
export async function fetchPageCounts(openAlexIds: string[]) {
  const data = await getWorks<{ results: Pick<OpenAlexWork, "id" | "biblio">[] }>(
    new URLSearchParams({
      filter: worksFilter({ ids: openAlexIds }),
      select: "id,biblio",
      per_page: String(PAGE_RANGE_BATCH_SIZE),
    })
  );
  const pages = new Map<string, number>();

  for (const work of data.results) {
    const count = pageCountFromBiblio(work.biblio);
    if (count) pages.set(work.id, count);
  }

  return pages;
}

export type WorkFacts = {
  citations: number;
  type: string;
  /** The subfield of each of the paper's topics. */
  subfields: number[];
};

/** Citation count, type and topic subfields for up to 100 works, keyed by OpenAlex id. */
export async function fetchWorkFacts(openAlexIds: string[]) {
  const data = await getWorks<{
    results: { id: string; cited_by_count: number; type: string; topics: { subfield: { id: string } }[] }[];
  }>(
    new URLSearchParams({
      filter: worksFilter({ ids: openAlexIds }),
      select: "id,cited_by_count,type,topics",
      per_page: String(PAGE_RANGE_BATCH_SIZE),
    })
  );

  return new Map<string, WorkFacts>(
    data.results.map((work) => [
      work.id,
      {
        citations: work.cited_by_count,
        type: work.type,
        subfields: work.topics.map((topic) => Number(topic.subfield.id.split("/").pop())),
      },
    ])
  );
}
