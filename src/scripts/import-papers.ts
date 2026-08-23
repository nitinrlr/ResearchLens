import { searchWorks } from "@/lib/openalex";
import { importPapers } from "@/services/paper-import.service";

async function main() {
  console.log("Fetching papers...");

  const papers = await searchWorks("transformer");

  console.log(`Found ${papers.length} papers`);

  await importPapers(papers);

  console.log("Import complete!");
}

main().catch(console.error);