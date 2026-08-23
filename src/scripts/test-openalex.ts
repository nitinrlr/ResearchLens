import { searchWorks } from "@/lib/openalex";

async function main() {
    const papers = await searchWorks("transformer");

    console.log(papers);
}

main();