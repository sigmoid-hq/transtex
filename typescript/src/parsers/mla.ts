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
    const afterTitleRaw = remainderRaw.slice((titleMatch.index ?? 0) + titleMatch[0].length).trim();

    let locator: string | undefined;
    const locatorMatch = afterTitleRaw.match(/(https?:\/\/\S+|10\.\S+)\.?$/);
    let afterTitle = afterTitleRaw;
    if (locatorMatch) {
        locator = locatorMatch[1].trim();
        afterTitle = afterTitle.slice(0, locatorMatch.index).trim().replace(/,$/, "");
    }

    const afterTitleSanitized = afterTitle.replace(/\*/g, "").trim();
    const parts = afterTitleSanitized.split(",").map((p) => p.trim()).filter(Boolean);
    const container = parts[0]?.replace(/vol\..*/i, "").trim().replace(/\.$/, "") || parts[0];

    const volumeMatch = raw.match(/vol\.\s*([\w]+)/i);
    const issueMatch = raw.match(/no\.\s*([\w]+)/i);
    const yearMatch = raw.match(/(\d{4})/);
    const pagesMatch = raw.match(/pp\.\s*([\w–-]+)/i);

    const volume = volumeMatch ? volumeMatch[1] : undefined;
    const issue = issueMatch ? issueMatch[1] : undefined;
    const year = yearMatch ? yearMatch[1] : undefined;
    const pages = normalizePages(pagesMatch ? pagesMatch[1] : undefined);

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
    if (segment.includes("et al.")) {
        const head = segment.split(" et al.", 1)[0].trim();
        return head ? [head, "et al."] : ["et al."];
    }
    const replaced = segment.replace(", and ", " and ");
    return splitAuthorsDelimiters(replaced, /\s+and\s+|,/);
}

export const __all__ = ["parseMlaCitation"];
