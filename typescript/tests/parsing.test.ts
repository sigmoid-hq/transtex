import { describe, expect, it } from "vitest";
import {
    citationToBibtex,
    parseCitation,
    parseApaCitation,
    parseChicagoCitation,
    parseIeeeCitation,
    parseMlaCitation,
    parseVancouverCitation,
} from "../src/parsing";
import {
    formatApa,
    formatApa7,
    formatChicago,
    formatIeee,
    formatMla,
    formatVancouver,
} from "../src/formatters";
import { Reference } from "../src/reference";

const baseReference = new Reference({
    entryType: "article",
    citeKey: "doe2020deep",
    title: "Deep Learning for Everything",
    authors: ["John Doe", "Jane Smith"],
    journal: "Journal of Omniscience",
    year: "2020",
    volume: "42",
    issue: "7",
    pages: "1-10",
    doi: "10.1000/j.jo.2020.01.001",
});

describe("parsers", () => {
    it("parses APA", () => {
        const parsed = parseApaCitation(formatApa(baseReference));
        expect(parsed.title?.toLowerCase()).toBe(baseReference.title.toLowerCase());
        expect(parsed.journal).toBe(baseReference.journal);
        expect(parsed.pages).toBe("1–10");
    });

    it("parses APA via dispatcher", () => {
        const parsed = parseCitation("apa7", formatApa7(baseReference));
        expect(parsed.year).toBe("2020");
    });

    it("parses IEEE", () => {
        const parsed = parseIeeeCitation(formatIeee(baseReference));
        expect(parsed.volume).toBe("42");
        expect(parsed.issue).toBe("7");
    });

    it("parses Chicago", () => {
        const parsed = parseChicagoCitation(formatChicago(baseReference));
        expect(parsed.journal).toBe(baseReference.journal);
        expect(parsed.volume).toBe(baseReference.volume);
    });

    it("parses MLA", () => {
        const parsed = parseMlaCitation(formatMla(baseReference));
        expect(parsed.issue).toBe(baseReference.issue);
        expect(parsed.volume).toBe(baseReference.volume);
    });

    it("parses Vancouver", () => {
        const parsed = parseVancouverCitation(formatVancouver(baseReference));
        expect(parsed.title.toLowerCase()).toBe(baseReference.title.toLowerCase());
        expect(parsed.volume).toBe(baseReference.volume);
    });

    it("round-trips to BibTeX", () => {
        const bibtex = citationToBibtex("ieee", formatIeee(baseReference));
        expect(bibtex).toContain("@article");
        expect(bibtex).toContain("doe2020deep");
    });
});
