import { describe, expect, it } from "vitest";
import { convertCitation, formatReference } from "../src/converter";
import {
    formatApa,
    formatApa7,
    formatChicago,
    formatIeee,
    formatMla,
    formatVancouver,
} from "../src/formatters";
import { parseCitation } from "../src/parsing";
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

const apaText = formatApa(baseReference);
const apa7Text = formatApa7(baseReference);
const parsedFromApa = parseCitation("apa", apaText);
const ieeeText = formatIeee(parsedFromApa);
const mlaText = formatMla(parsedFromApa);
const chicagoText = formatChicago(parsedFromApa);
const vancouverText = formatVancouver(parsedFromApa);
const ieeeFromReference = formatIeee(baseReference);

describe("formatReference", () => {
    it("dispatches by style", () => {
        expect(formatReference("apa", baseReference)).toBe(apaText);
        expect(formatReference("ieee", baseReference)).toBe(ieeeFromReference);
    });

    it("rejects unsupported style", () => {
        expect(() => formatReference("unknown", baseReference)).toThrow();
    });
});

describe("convertCitation", () => {
    it("converts APA to IEEE", () => {
        expect(convertCitation("apa", "ieee", apaText)).toBe(ieeeText);
    });

    it("converts IEEE to APA", () => {
        expect(convertCitation("ieee", "apa", ieeeText)).toBe(apaText);
    });

    it("converts APA to MLA/Chicago/Vancouver", () => {
        expect(convertCitation("apa", "mla", apaText)).toBe(mlaText);
        expect(convertCitation("apa", "chicago", apaText)).toBe(chicagoText);
        expect(convertCitation("apa", "vancouver", apaText)).toBe(vancouverText);
    });

    it("handles APA7 as source", () => {
        const parsedApa7 = parseCitation("apa7", apa7Text);
        const apaFromApa7 = formatApa(parsedApa7);
        expect(convertCitation("apa7", "apa", apa7Text)).toBe(apaFromApa7);
    });
});
