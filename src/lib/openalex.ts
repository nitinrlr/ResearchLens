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

        paperUrl: paper.primary_location?.landing_page_url || paper.best_oa_location?.landing_page_url || paper.doi || paper.id,

        pdfUrl: paper.best_oa_location?.pdf_url || paper.primary_location?.pdf_url || paper.open_access?.oa_url || null,

        authors: paper.authorships.map((authorship: any) => ({
            openAlexId: authorship.author.id,

            name: authorship.author.display_name,

            institution:
                authorship.institutions.length > 0
                    ? authorship.institutions[0].display_name
                    : null,
        })),

        topics: paper.topics.map((topic: any) => ({
            name: topic.display_name,
        })),
        }));

}