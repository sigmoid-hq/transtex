import { Reference } from "../reference";
import { nameParts, normalizePageRange, preferredLocator, sentenceCase } from "./shared";

export function formatVancouver(reference: Reference): string {
    const sections = [
        authorSection(reference),
        titleSection(reference),
        ...sourceSections(reference),
        locatorSection(reference),
    ];
    let sentence = sections.filter(Boolean).map((s) => s.trim()).join(" ");
    if (sentence && !sentence.endsWith(".")) {
        sentence += ".";
    }
    return sentence;
}

function authorSection(reference: Reference): string {
    const authors = vancouverAuthors(reference.normalizedAuthors());
    return authors ? `${authors}.` : "";
}

function vancouverAuthors(authors: string[]): string {
    const converted: string[] = [];
    for (const name of authors) {
        const [last, given] = nameParts(name);
        if (!last) {
            converted.push(name.trim());
            continue;
        }
        const initials = given.map((part) => part[0]?.toUpperCase() ?? "").join("");
        converted.push(`${last} ${initials}`.trim());
    }
    return converted.join(", ");
}

function titleSection(reference: Reference): string {
    return reference.title ? `${sentenceCase(reference.title)}.` : "";
}

function sourceSections(reference: Reference): string[] {
    if (reference.journal) return journalSegments(reference);
    return bookSegments(reference);
}

function journalSegments(reference: Reference): string[] {
    let timeline = reference.year ?? "n.d.";
    if (reference.volume) {
        timeline += `;${reference.volume}`;
        if (reference.issue) {
            timeline += `(${reference.issue})`;
        }
    } else if (reference.issue) {
        timeline += `;(${reference.issue})`;
    }
    const pages = normalizePageRange(reference.pages);
    if (pages) {
        timeline += `:${pages}`;
    }
    return [`${reference.journal}.`, `${timeline}.`];
}

function bookSegments(reference: Reference): string[] {
    const segments: string[] = [];
    const publisherBits: string[] = [];
    if (reference.publisher) publisherBits.push(reference.publisher);
    if (reference.year) publisherBits.push(reference.year);
    if (publisherBits.length > 0) {
        segments.push(`${publisherBits.join("; ")}.`);
    }
    const pages = normalizePageRange(reference.pages);
    if (pages) {
        segments.push(`${pages}.`);
    }
    return segments;
}

function locatorSection(reference: Reference): string {
    const locator = preferredLocator(reference, "doi:");
    if (!locator) return "";
    return locator.endsWith(".") ? locator : `${locator}.`;
}

export const __all__ = ["formatVancouver"];
