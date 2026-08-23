import { SearchPaper } from "@/types/paper";

const BASE_URL = "https://api.openalex.org"

export async function searchWorks(
  query: string
): Promise<SearchPaper[]> {
    const url = 
    `${BASE_URL}/works?search=${encodeURIComponent(query)}&per_page=5`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch papers from OpenAlex");
    }

    const data = await response.json();

    return data.results.map((paper: any) => ({
        externalId: paper.id,

        title: paper.title,

        abstract: null,

        publishedDate: new Date(paper.publication_date),

        paperUrl: paper.primary_location?.landing_page_url ?? paper.id,

        pdfUrl: paper.primary_location?.pdf_url ?? null,

        authors: paper.authorships.map(
            (author: any) => author.author.display_name
        ),

        topics: paper.topics.map(
            (topic: any) => topic.display_name
        ),
        }));

}