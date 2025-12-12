// Run with: yarn ts-node examples/convertCitationStyles.ts
import { convertCitation } from "../src";

function main(): void {
    const ieeeCitation =
        'John Doe and Jane Smith, "Deep Learning for Everything," Journal of Omniscience, vol. 42, no. 7, pp. 1–10, 2020, doi: 10.1000/j.jo.2020.01.001.';
    const targets = ["apa7", "mla", "chicago", "vancouver"];

    console.log("Starting citation (IEEE):");
    console.log(ieeeCitation);
    console.log("\nConverted citations:");
    for (const style of targets) {
        const converted = convertCitation("ieee", style, ieeeCitation);
        console.log(`- ${style.toUpperCase()}: ${converted}`);
    }

    const apaCitation =
        "Doe, J., & Smith, J. (2020). Deep learning for everything. Journal of Omniscience, 42(7), 1–10. https://doi.org/10.1000/j.jo.2020.01.001";
    const backToIeee = convertCitation("apa", "ieee", apaCitation);
    console.log("\nRound-trip APA -> IEEE:");
    console.log(backToIeee);
}

main();
