export interface SearchPaper {
  externalId: string;
  title: string;
  abstract: string | null;

  publishedDate: Date;

  paperUrl: string;
  pdfUrl: string | null;

  authors: string[];

  topics: string[];
}