import {
    Reference,
    formatApa,
    formatApa7,
    formatChicago,
    formatIeee,
    formatMla,
    formatVancouver,
} from "../src";

function bookExample(): Reference {
    return new Reference({
        entryType: "book",
        citeKey: "turing1950",
        title: "Computing Machinery and Intelligence",
        authors: ["Alan M. Turing"],
        publisher: "Oxford University Press",
        place: "Oxford, UK",
        year: "1950",
        edition: "2nd ed.",
        pages: "1-120",
        doi: "10.1000/book.1950.01",
    });
}

function conferenceExample(): Reference {
    return new Reference({
        entryType: "inproceedings",
        citeKey: "doe2023conf",
        title: "Neural Widgets for Everything",
        authors: ["John Doe", "Jane Smith"],
        eventTitle: "Proceedings of the 40th International Neural Conference",
        eventLocation: "Berlin, Germany",
        publisher: "Neural Press",
        year: "2023",
        pages: "101-110",
        doi: "10.1000/conf.2023.101",
    });
}

function webExample(): Reference {
    return new Reference({
        entryType: "misc",
        citeKey: "ada1843web",
        title: "Sketch of the Analytical Engine",
        authors: ["Ada Lovelace"],
        year: "1843",
        url: "https://example.org/analytical-engine",
        accessedDate: "2024-02-10",
    });
}

function printAll(label: string, ref: Reference): void {
    const formatters = [
        ["APA 6th", formatApa],
        ["APA 7th", formatApa7],
        ["IEEE", formatIeee],
        ["MLA 9th", formatMla],
        ["Chicago (Author-Date)", formatChicago],
        ["Vancouver", formatVancouver],
    ] as const;

    console.log(`== ${label} ==`);
    for (const [name, fn] of formatters) {
        console.log(`${name}:`);
        console.log(fn(ref));
    }
    console.log();
}

function main(): void {
    printAll("Book", bookExample());
    printAll("Conference", conferenceExample());
    printAll("Web", webExample());
}

main();
