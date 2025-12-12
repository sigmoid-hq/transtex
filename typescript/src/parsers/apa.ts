import { Reference } from "../reference";
import { applyLocator, generateCiteKey, normalizePages, splitAuthorsDelimiters, stripTrailingPeriod } from "./shared";

export function parseApaCitation(text: string): Reference {
    const raw = text.trim();
    if (!raw) {
        throw new Error("Empty APA citation string");
    }

    const yearMatch = raw.match(/\(([^)]+)\)\./);
    if (!yearMatch) {
        throw new Error("APA citation missing year segment '(year).'");
    }

    const authorsSegment = raw.slice(0, yearMatch.index).trim();
    const remainder = raw.slice((yearMatch.index ?? 0) + yearMatch[0].length).trim();
    const year = yearMatch[1].trim() || undefined;

    const titleSplit = remainder.split(". ");
    const title = stripTrailingPeriod(titleSplit[0].trim());
    const afterTitle = titleSplit.slice(1).join(". ").trim();

    let locator: string | undefined;
    const locatorMatch = afterTitle.match(/(https?:\/\/\S+|10\.\S+)$/);
    let containerSegment = afterTitle;
    if (locatorMatch) {
        locator = locatorMatch[1].trim();
        containerSegment = afterTitle.slice(0, locatorMatch.index).trim();
    }
    containerSegment = containerSegment.replace(/\.$/, "").trim();

    const { container, volume, issue, pages } = parseContainer(containerSegment);
    const authors = parseAuthors(authorsSegment);
    const reference = new Reference({
        entryType: container ? "article" : "book",
        citeKey: generateCiteKey(authors, year, title),
        title: title || undefined,
        authors,
        journal: container,
        publisher: !volume && !issue && !pages ? container : undefined,
        volume,
        issue,
        pages: normalizePages(pages),
        year,
    });
    applyLocator(reference, locator);
    return reference;
}

function parseContainer(segment: string): { container?: string; volume?: string; issue?: string; pages?: string } {
    if (!segment) return {};
    const match = segment.match(
        /(?<container>.+?)(?:,\s*(?<volume>\d+)(?:\((?<issue>[^)]+)\))?)?(?:,\s*(?<pages>[\w\-–]+))?$/
    );
    if (!match || !match.groups) {
        return { container: segment };
    }
    const { container, volume, issue, pages } = match.groups;
    return {
        container: container?.trim() || undefined,
        volume: volume?.trim() || undefined,
        issue: issue?.trim() || undefined,
        pages: pages?.trim() || undefined,
    };
}

function parseAuthors(segment: string): string[] {
    const parts = splitAuthorsDelimiters(segment, /\s*(?:,?\s*&|,?\s+and)\s+/);
    return parts.map((part) => (part.endsWith(".") ? part : `${part}.`));
}

export const __all__ = ["parseApaCitation"];
