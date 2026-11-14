interface SearchAuthor {
  openAlexId: string;
  name: string;
  institution: string | null;
}

interface SearchTopic {
  name: string;
}

export interface SearchPaper {
  externalId: string;

  title: string;

  abstract: string | null;

  publishedDate: Date;

  paperUrl: string;

  pdfUrl: string | null;

  /** From OpenAlex's page range. Null when it has none. */
  pageCount: number | null;

  authors: SearchAuthor[];

  topics: SearchTopic[];
}
