import { Reference } from "../reference";
import { authorInitials, joinClauses, normalizePageRange, preferredLocator, sentenceCase } from "./shared";

export function formatApa7(reference: Reference): string {
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
    return apa7Authors(reference.normalizedAuthors());
}

function apa7Authors(authors: string[]): string {
    const formatted = authorInitials(authors);
    const count = formatted.length;
    if (count === 0) return "";
    if (count === 1) return formatted[0];
    if (count <= 20) {
        return `${formatted.slice(0, -1).join(", ")}, & ${formatted[formatted.length - 1]}`;
    }
    const leading = formatted.slice(0, 19).join(", ");
    const trailing = formatted[formatted.length - 1];
    return `${leading}, ... ${trailing}`;
}

function yearSection(reference: Reference): string {
    return reference.year ? `(${reference.year}).` : "";
}

function titleSection(reference: Reference): string {
    const title = sentenceCase(reference.title ?? "");
    if (!title) return "";
    if (reference.reportNumber) {
        return `${title} (Report No. ${reference.reportNumber}).`;
    }
    return `${title}.`;
}

function containerSection(reference: Reference): string {
    const container = reference.primaryContainer();
    if (!container) return "";
    const pages = normalizePageRange(reference.pages) ?? "";
    if (reference.journal) {
        const volumeIssueSegment = reference.volume
            ? reference.issue
                ? `${reference.volume}(${reference.issue})`
                : reference.volume
            : "";
        const body = joinClauses([container, volumeIssueSegment, pages]);
        return `${body}.`;
    }
    if (reference.booktitle) {
        const chapterPages = pages ? `(pp. ${pages})` : "";
        const edition = reference.edition ? `(${reference.edition})` : "";
        return `${joinClauses([`In ${reference.booktitle}`, edition, chapterPages, reference.publisher ?? ""])}.`;
    }
    if (reference.eventTitle) {
        const chapterPages = pages ? `(pp. ${pages})` : "";
        const location = reference.eventLocation ?? reference.place ?? "";
        return `${joinClauses([`In ${reference.eventTitle}`, chapterPages, location, reference.publisher ?? ""])}.`;
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

function locatorSection(reference: Reference): string {
    return preferredLocator(reference, "https://doi.org/") || "";
}

export const __all__ = ["formatApa7"];
