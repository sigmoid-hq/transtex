import { Reference } from "../reference";
import { applyLocator, generateCiteKey, normalizePages, splitAuthorsDelimiters } from "./shared";

export function parseIeeeCitation(text: string): Reference {
    const raw = text.trim().replace(/\.$/, "");
    if (!raw) throw new Error("Empty IEEE citation string");

    const titleMatch = raw.match(/"([^"]+)"/);
    if (!titleMatch) throw new Error("IEEE citation missing title content");
    const title = titleMatch[1].trim().replace(/,$/, "");
    const authorsSegment = raw.slice(0, titleMatch.index).replace(/,$/, "").trim();
    const postTitle = raw.slice((titleMatch.index ?? 0) + titleMatch[0].length).trim();

    const tokens = postTitle.split(",").map((t) => t.trim()).filter(Boolean);
    if (tokens.length === 0) throw new Error("IEEE citation missing container segment");

    const container = tokens[0];
    let volume: string | undefined;
    let issue: string | undefined;
    let pages: string | undefined;
    let year: string | undefined;
    let locator: string | undefined;

    for (const token of tokens.slice(1)) {
        const lowered = token.toLowerCase();
        if (lowered.startsWith("vol.")) {
            volume = token.split(" ", 2)[1]?.trim();
        } else if (lowered.startsWith("no.")) {
            issue = token.split(" ", 2)[1]?.trim();
        } else if (lowered.startsWith("pp.")) {
            pages = normalizePages(token.split(" ", 2)[1]?.trim() ?? "") ?? undefined;
        } else if (lowered.startsWith("doi")) {
            locator = token.split(":", 2)[1]?.trim();
        } else if (/^\d{4}$/.test(token)) {
            year = token;
        }
    }

    const authors = parseAuthors(authorsSegment);
    const reference = new Reference({
        entryType: "article",
        citeKey: generateCiteKey(authors, year, title),
        title,
        authors,
        journal: container,
        volume,
        issue,
        pages,
        year,
    });
    applyLocator(reference, locator);
    return reference;
}

function parseAuthors(segment: string): string[] {
    return splitAuthorsDelimiters(segment, /\s*,\s*|\s+and\s+/);
}

export const __all__ = ["parseIeeeCitation"];
