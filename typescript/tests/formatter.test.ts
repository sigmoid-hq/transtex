import { describe, expect, it } from "vitest";
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

describe("formatters", () => {
    it("formats APA 6th", () => {
        expect(formatApa(baseReference)).toBe(
            "Doe, J., & Smith, J. (2020). Deep learning for everything. Journal of Omniscience, 42(7), 1–10. https://doi.org/10.1000/j.jo.2020.01.001",
        );
    });

    it("formats APA 7th", () => {
        expect(formatApa7(baseReference)).toBe(
            "Doe, J., & Smith, J. (2020). Deep learning for everything. *Journal of Omniscience*, *42*(7), 1–10. https://doi.org/10.1000/j.jo.2020.01.001",
        );
    });

    it("formats IEEE", () => {
        expect(formatIeee(baseReference)).toBe(
            'J. Doe and J. Smith, "Deep Learning for Everything," Journal of Omniscience, vol. 42, no. 7, pp. 1–10, 2020, doi: 10.1000/j.jo.2020.01.001.',
        );
    });

    it("formats MLA", () => {
        expect(formatMla(baseReference)).toBe(
            'Doe, John, and Jane Smith. "Deep Learning for Everything." *Journal of Omniscience*, vol. 42, no. 7, 2020, pp. 1–10. https://doi.org/10.1000/j.jo.2020.01.001.',
        );
    });

    it("formats Chicago", () => {
        expect(formatChicago(baseReference)).toBe(
            'Doe, John, and Jane Smith. 2020. "Deep Learning for Everything." *Journal of Omniscience* 42 (7): 1–10. https://doi.org/10.1000/j.jo.2020.01.001.',
        );
    });

    it("formats Vancouver", () => {
        expect(formatVancouver(baseReference)).toBe(
            "Doe J, Smith J. Deep learning for everything. Journal of Omniscience. 2020;42(7):1–10. doi:10.1000/j.jo.2020.01.001.",
        );
    });
});
