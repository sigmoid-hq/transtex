// Run with: npx ts-node examples/citationToBibtex.ts
import { citationToBibtex, formatApa, formatIeee, parseBibtexEntry } from "../src";

const EXAMPLE = `@article{doe2020deep,
  author = {John Doe and Jane Smith},
  title = {Deep Learning for Everything},
  journal = {Journal of Omniscience},
  year = {2020},
  volume = {42},
  number = {7},
  pages = {1-10},
  doi = {10.1000/j.jo.2020.01.001},
  url = {https://example.com/article}
}`;

function main(): void {
    const reference = parseBibtexEntry(EXAMPLE);
    const apaCitation = formatApa(reference);
    const ieeeCitation = formatIeee(reference);

    console.log("APA citation:");
    console.log(apaCitation);
    console.log("\nBibTeX from APA:");
    console.log(citationToBibtex("apa", apaCitation));

    console.log("\nIEEE citation:");
    console.log(ieeeCitation);
    console.log("\nBibTeX from IEEE:");
    console.log(citationToBibtex("ieee", ieeeCitation));
}

main();
