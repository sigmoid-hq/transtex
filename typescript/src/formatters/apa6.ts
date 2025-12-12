import { Reference } from "../reference";
import { authorInitials, joinClauses, normalizePageRange, preferredLocator, sentenceCase } from "./shared";

export function formatApa(reference: Reference): string {
    const parts = [
        authorSection(reference),
        yearSection(reference),
        titleSection(reference),
        containerSection(reference),
        locatorSection(reference),
    ];
    return parts.filter(Boolean).join(" ").trim();
}

function authorSection(reference: Reference): string {
    const formatted = authorInitials(reference.normalizedAuthors());
    if (formatted.length === 0) return "";
    if (formatted.length === 1) return formatted[0];
    if (formatted.length <= 7) {
        return `${formatted.slice(0, -1).join(", ")}, & ${formatted[formatted.length - 1]}`;
    }
    const leading = formatted.slice(0, 6).join(", ");
    const trailing = formatted[formatted.length - 1];
    return `${leading}, ... ${trailing}`;
}

function yearSection(reference: Reference): string {
    return reference.year ? `(${reference.year}).` : "";
}

function titleSection(reference: Reference): string {
    const title = sentenceCase(reference.title ?? "");
    return title ? `${title}.` : "";
}

function containerSection(reference: Reference): string {
    const container = reference.primaryContainer();
    if (!container) return "";
    const volumeIssue = volumeIssueText(reference.volume, reference.issue);
    const pages = normalizePageRange(reference.pages) ?? "";
    if (reference.journal) {
        return `${joinClauses([container, volumeIssue, pages])}.`;
    }
    if (reference.booktitle) {
        const chapterPages = pages ? `(pp. ${pages})` : "";
        const edition = reference.edition ? `(${reference.edition})` : "";
        return `${joinClauses([`In ${reference.booktitle}`, edition, chapterPages, reference.publisher ?? ""])}.`;
    }
    const parts = [
        container,
        reference.edition ?? "",
        reference.place ?? "",
        reference.publisher ?? "",
        pages,
        reference.accessedDate ? `Retrieved ${reference.accessedDate}` : "",
    ];
    return `${joinClauses(parts)}.`;
}

function volumeIssueText(volume?: string, issue?: string): string {
    if (volume && issue) return `${volume}(${issue})`;
    if (volume) return volume;
    return "";
}

function locatorSection(reference: Reference): string {
    const locator = preferredLocator(reference);
    if (!locator) return "";
    if (reference.doi && !reference.doi.toLowerCase().startsWith("http")) {
        return `https://doi.org/${reference.doi}`;
    }
    return locator;
}

export const __all__ = ["formatApa"];
