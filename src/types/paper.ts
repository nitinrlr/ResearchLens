export interface SearchAuthor {
  openAlexId: string;
  name: string;
  institution: string | null;
}

export interface SearchTopic {
  name: string;
}

export interface SearchPaper {
  externalId: string;

  title: string;

  abstract: string | null;

  publishedDate: Date;

  paperUrl: string;

  pdfUrl: string | null;

  authors: SearchAuthor[];

  topics: SearchTopic[];
}
