import { Reference } from "../reference";
import { buildDetailSection, formatAuthorList, normalizePageRange, preferredLocator } from "./shared";

export function formatMla(reference: Reference): string {
    const sections = [authorSection(reference), titleSection(reference), detailSection(reference)];
    let sentence = sections.filter(Boolean).map((s) => s.trim()).join(" ");
    if (sentence && !sentence.endsWith(".")) {
        sentence += ".";
    }
    return sentence;
}

function mlaAuthors(authors: string[]): string {
    return formatAuthorList(authors, {
        invertFirst: true,
        conjunction: "and",
        separator: ",",
        finalSeparator: ",",
        maxNames: 2,
        etAlAfterFirst: true,
    });
}

function authorSection(reference: Reference): string {
    const authorText = mlaAuthors(reference.normalizedAuthors());
    return authorText ? `${authorText}.` : "";
}

function titleSection(reference: Reference): string {
    if (!reference.title) return "";
    if (reference.primaryContainer()) return `"${reference.title}."`;
    return `${reference.title}.`;
}

function detailSection(reference: Reference): string {
    const container = reference.primaryContainer();
    const publisher = reference.publisher ?? "";
    const includePublisher = Boolean(publisher && !reference.journal);
    const volumeIssue = volumeIssueText(reference);
    const pagesValue = normalizePageRange(reference.pages);
    const pages = pagesValue ? `pp. ${pagesValue}` : "";
    const locator = preferredLocator(reference, "https://doi.org/");

    // Books / reports without container
    if (!container && publisher) {
        const parts = [reference.place ?? "", publisher, reference.year ?? "", pages].filter(Boolean);
        let detail = parts.join(", ");
        if (locator) detail = detail ? `${detail}. ${locator}` : locator;
        if (detail && !detail.endsWith(".")) detail += ".";
        return detail;
    }

    const ordered = [container ?? "", volumeIssue, includePublisher ? publisher : "", reference.year ?? "", pages]
        .filter(Boolean)
        .join(", ");
    let detail = ordered;
    if (locator) detail = detail ? `${detail}. ${locator}` : locator;
    if (detail && !detail.endsWith(".")) detail += ".";
    return detail;
}

function volumeIssueText(reference: Reference): string {
    const bits: string[] = [];
    if (reference.volume) bits.push(`vol. ${reference.volume}`);
    if (reference.issue) bits.push(`no. ${reference.issue}`);
    return bits.join(", ");
}

export const __all__ = ["formatMla"];
