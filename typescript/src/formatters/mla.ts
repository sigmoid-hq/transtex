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
    if (reference.primaryContainer()) {
        return `"${reference.title}."`;
    }
    return `*${reference.title}.*`;
}

function detailSection(reference: Reference): string {
    const container = reference.primaryContainer();
    const publisher = container ? "" : reference.publisher;
    const volumeIssue = volumeIssueText(reference);
    const pagesValue = normalizePageRange(reference.pages);
    const pages = pagesValue ? `pp. ${pagesValue}` : "";
    const locator = preferredLocator(reference, "https://doi.org/");
    const ordered = [container ? `*${container}*` : "", volumeIssue, publisher ?? "", reference.year ?? "", pages]
        .filter(Boolean)
        .join(", ");
    let detail = ordered;
    if (locator) {
        detail = detail ? `${detail}. ${locator}` : locator;
    }
    if (detail && !detail.endsWith(".")) {
        detail += ".";
    }
    return detail;
}

function volumeIssueText(reference: Reference): string {
    const bits: string[] = [];
    if (reference.volume) bits.push(`vol. ${reference.volume}`);
    if (reference.issue) bits.push(`no. ${reference.issue}`);
    return bits.join(", ");
}

export const __all__ = ["formatMla"];
