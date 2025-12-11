// Run with: npx ts-node examples/formatFromBibtex.ts
import {
    formatApa,
    formatApa7,
    formatChicago,
    formatIeee,
    formatMla,
    formatVancouver,
    parseBibtexEntry,
} from "../src";

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
    console.log("APA 6th:");
    console.log(formatApa(reference));
    console.log("\nAPA 7th:");
    console.log(formatApa7(reference));
    console.log("\nIEEE:");
    console.log(formatIeee(reference));
    console.log("\nMLA 9th:");
    console.log(formatMla(reference));
    console.log("\nChicago (Author-Date):");
    console.log(formatChicago(reference));
    console.log("\nVancouver:");
    console.log(formatVancouver(reference));
}

main();
