import { Reference } from "../reference";
import { normalizePageRange, preferredLocator, splitNameWithInitials } from "./shared";

const IEEE_MAX_AUTHORS = 6;

export function formatIeee(reference: Reference): string {
    const container = reference.primaryContainer();
    const common: Array<string | undefined> = [
        authorSegment(reference),
        titleSegment(reference),
        container,
        volumeIssueSegment(reference),
        pagesSegment(reference),
        reference.year ?? "",
        preferredLocator(reference, "doi: "),
    ];

    if (reference.journal || reference.volume || reference.issue) {
        const sentence = joinIeeeSegments(common.filter(Boolean) as string[]);
        return sentence ? `${sentence}.` : "";
    }

    const fallback: Array<string | undefined> = [
        authorSegment(reference),
        titleSegment(reference),
        reference.booktitle ?? container ?? reference.publisher ?? "",
        reference.place ?? "",
        reference.publisher && reference.booktitle ? reference.publisher : "",
        pagesSegment(reference),
        reference.year ?? "",
        preferredLocator(reference, "doi: "),
    ];
    const sentence = joinIeeeSegments(fallback.filter(Boolean) as string[]);
    return sentence ? `${sentence}.` : "";
}

function authorSegment(reference: Reference): string {
    const authors = reference.normalizedAuthors().map(ieeeName);
    if (authors.length === 0) return "";
    if (authors.length > IEEE_MAX_AUTHORS) return `${authors[0]} et al.`;
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}`;
}

function titleSegment(reference: Reference): string {
    if (!reference.title) return "";
    return `"${reference.title},"`;
}

function volumeIssueSegment(reference: Reference): string {
    if (reference.volume) {
        const pieces = [`vol. ${reference.volume}`];
        if (reference.issue) pieces.push(`no. ${reference.issue}`);
        return pieces.join(", ");
    }
    if (reference.issue) return `no. ${reference.issue}`;
    return "";
}

function pagesSegment(reference: Reference): string {
    const pages = normalizePageRange(reference.pages);
    return pages ? `pp. ${pages}` : "";
}

function joinIeeeSegments(parts: string[]): string {
    if (parts.length === 0) return "";
    let sentence = parts[0];
    for (let i = 1; i < parts.length; i++) {
        const previous = sentence;
        const current = parts[i];
        const separator = previous.endsWith(',"') ? " " : ", ";
        sentence = `${previous}${separator}${current}`;
    }
    return sentence;
}

function ieeeName(author: string): string {
    const [last, initials] = splitNameWithInitials(author);
    if (!last) return author.trim();
    const joined = initials.join(" ");
    return joined ? `${joined} ${last}` : last;
}

export const __all__ = ["formatIeee"];
