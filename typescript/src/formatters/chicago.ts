import { Reference } from "../reference";
import {
    buildDetailSection,
    formatAuthorList,
    joinClauses,
    joinWithPeriod,
    normalizePageRange,
    preferredLocator,
    sentenceCase,
} from "./shared";

export function formatChicago(reference: Reference): string {
    const pieces = [
        authorSegment(reference),
        reference.year ?? "n.d.",
        titleSegment(reference),
        detailSegment(reference),
        preferredLocator(reference, "https://doi.org/"),
    ];
    return joinWithPeriod(pieces.filter(Boolean));
}

function authorSegment(reference: Reference): string {
    return formatAuthorList(reference.normalizedAuthors(), {
        invertFirst: true,
        conjunction: "and",
        separator: ",",
        finalSeparator: ",",
        maxNames: 3,
        etAlAfterFirst: true,
    });
}

function titleSegment(reference: Reference): string {
    if (!reference.title) return "";
    const title = reference.title;
    if (reference.primaryContainer()) {
        return `"${title}."`;
    }
    return `*${title}*`;
}

function detailSegment(reference: Reference): string {
    if (reference.journal) {
        return journalDetail(reference);
    }
    return nonJournalDetail(reference);
}

function journalDetail(reference: Reference): string {
    const volumeIssue = volumeIssueText(reference.volume, reference.issue);
    const journal = joinClauses([`*${reference.journal}*`, volumeIssue], " ");
    const pages = normalizePageRange(reference.pages);
    const pageSegment = pages ? `: ${pages}` : "";
    return `${journal}${pageSegment}`.trim();
}

function volumeIssueText(volume?: string, issue?: string): string {
    if (volume && issue) return `${volume} (${issue})`;
    if (volume) return volume;
    return "";
}

function nonJournalDetail(reference: Reference): string {
    const bookPhrase = bookPhraseText(reference.booktitle, reference.pages);
    const publisher = reference.publisher ?? "";
    return buildDetailSection(bookPhrase, undefined, publisher, undefined, undefined, undefined);
}

function bookPhraseText(booktitle?: string, pages?: string): string | undefined {
    if (!booktitle) return undefined;
    const pageClause = pages ? `, ${pages}` : "";
    return `In *${booktitle}*${pageClause}`;
}

export const __all__ = ["formatChicago"];
