import { Reference } from "../reference";
import { applyLocator, generateCiteKey, normalizePages, splitAuthorsDelimiters, stripTrailingPeriod } from "./shared";

export function parseChicagoCitation(text: string): Reference {
    const raw = text.trim();
    if (!raw) throw new Error("Empty Chicago citation string");

    const parts = raw.split(". ", 2);
    if (parts.length < 2) throw new Error("Chicago citation missing expected segments");
    const authorsSegment = parts[0];
    const remainder = raw.slice(authorsSegment.length + 2);

    const yearMatch = remainder.match(/^([0-9n.dND\.]+)\.\s+(.*)$/);
    if (!yearMatch) throw new Error("Chicago citation missing year segment");
    const year = stripTrailingPeriod(yearMatch[1].trim()) || undefined;
    const afterYear = yearMatch[2].trim();

    const titleMatch = afterYear.match(/"(.+?)"\s/);
    if (!titleMatch) throw new Error("Chicago citation missing title");
    const title = stripTrailingPeriod(titleMatch[1].trim());
    const afterTitle = afterYear.slice((titleMatch.index ?? 0) + titleMatch[0].length).trim();

    let locator: string | undefined;
    const locatorMatch = afterTitle.match(/(https?:\/\/\S+|10\.\S+)$/);
    let detailSegment = afterTitle;
    if (locatorMatch) {
        locator = locatorMatch[1].trim();
        detailSegment = afterTitle.slice(0, locatorMatch.index).trim();
    }

    let journal: string | undefined;
    let volume: string | undefined;
    let issue: string | undefined;
    let pages: string | undefined;

    const journalMatch = detailSegment.match(/\*([^*]+)\*\s+([\d]+)\s*\(([^)]+)\):\s*([^\s]+)/);
    if (journalMatch) {
        journal = journalMatch[1].trim();
        volume = journalMatch[2].trim();
        issue = journalMatch[3].trim();
        pages = normalizePages(journalMatch[4].trim());
    }

    const authors = parseAuthors(authorsSegment);
    const reference = new Reference({
        entryType: "article",
        citeKey: generateCiteKey(authors, year, title),
        title,
        authors,
        journal,
        volume,
        issue,
        pages,
        year,
    });
    applyLocator(reference, locator);
    return reference;
}

function parseAuthors(segment: string): string[] {
    return splitAuthorsDelimiters(segment, /\s+and\s+|,/);
}

export const __all__ = ["parseChicagoCitation"];
