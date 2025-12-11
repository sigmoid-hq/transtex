import { Reference } from "../reference";
import { applyLocator, generateCiteKey, normalizePages, splitAuthorsDelimiters, stripTrailingPeriod } from "./shared";

export function parseMlaCitation(text: string): Reference {
    const raw = text.trim();
    if (!raw) throw new Error("Empty MLA citation string");
    if (!raw.includes(". ")) throw new Error("MLA citation missing title separator");

    const [authorsSegment, remainderRaw] = raw.split(". ", 2);
    const titleMatch = remainderRaw.match(/"(.+?)"\s/);
    if (!titleMatch) throw new Error("MLA citation missing title");
    const title = stripTrailingPeriod(titleMatch[1].trim());
    let afterTitle = remainderRaw.slice((titleMatch.index ?? 0) + titleMatch[0].length).trim();

    let locator: string | undefined;
    const locatorMatch = afterTitle.match(/(https?:\/\/\S+|10\.\S+)\.?$/);
    if (locatorMatch) {
        locator = locatorMatch[1].trim();
        afterTitle = afterTitle.slice(0, locatorMatch.index).trim().replace(/,$/, "");
    }

    const containerMatch = afterTitle.match(/\*([^*]+)\*/);
    const container = containerMatch ? containerMatch[1].trim() : undefined;

    const volumeMatch = afterTitle.match(/vol\.\s*([\w]+)/i);
    const issueMatch = afterTitle.match(/no\.\s*([\w]+)/i);
    const yearMatch = afterTitle.match(/(\d{4})/);
    const pagesMatch = afterTitle.match(/pp\.\s*([\w–-]+)/i);

    const authors = parseAuthors(authorsSegment);
    const reference = new Reference({
        entryType: "article",
        citeKey: generateCiteKey(authors, yearMatch ? yearMatch[1] : undefined, title),
        title,
        authors,
        journal: container,
        volume: volumeMatch ? volumeMatch[1] : undefined,
        issue: issueMatch ? issueMatch[1] : undefined,
        pages: normalizePages(pagesMatch ? pagesMatch[1] : undefined),
        year: yearMatch ? yearMatch[1] : undefined,
    });
    applyLocator(reference, locator);
    return reference;
}

function parseAuthors(segment: string): string[] {
    if (segment.includes("et al.")) {
        const head = segment.split(" et al.", 1)[0].trim();
        return head ? [head, "et al."] : ["et al."];
    }
    const replaced = segment.replace(", and ", " and ");
    return splitAuthorsDelimiters(replaced, /\s+and\s+|,/);
}

export const __all__ = ["parseMlaCitation"];
