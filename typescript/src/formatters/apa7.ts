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
    return title ? `${title}.` : "";
}

function containerSection(reference: Reference): string {
    const container = reference.primaryContainer();
    if (!container) return "";
    const pages = normalizePageRange(reference.pages) ?? "";
    const journal = `*${container}*`;
    const volumeText = reference.volume ? `*${reference.volume}*` : "";
    const issueText = reference.issue ? `(${reference.issue})` : "";
    const volumeIssueSegment = `${volumeText}${issueText}`.trim();
    const body = joinClauses([journal, volumeIssueSegment, pages]);
    return `${body}.`;
}

function locatorSection(reference: Reference): string {
    return preferredLocator(reference, "https://doi.org/") || "";
}

export const __all__ = ["formatApa7"];
