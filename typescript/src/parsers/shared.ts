import { Reference } from "../reference";

export function cleanLocator(locator: string | null | undefined): { doi?: string; url?: string } {
    if (!locator) return {};
    const lowered = locator.toLowerCase();
    if (lowered.startsWith("10.")) return { doi: locator };
    if (lowered.startsWith("http")) return { url: locator };
    return {};
}

export function generateCiteKey(authors: string[], year: string | undefined | null, title: string | undefined | null): string {
    const slug = (value: string): string => value.replace(/[^A-Za-z0-9]+/g, "").toLowerCase();
    const firstAuthor = authors[0] ?? "";
    const authorPiece = slug(firstAuthor.includes(",") ? firstAuthor.split(",")[0] : firstAuthor.split(" ").slice(-1)[0] ?? "anon");
    const yearPiece = slug(year ?? "nd");
    const titlePiece = slug(title ?? "");
    const parts = [authorPiece, yearPiece, titlePiece].filter(Boolean);
    return parts.join("") || "reference";
}

export function normalizePages(pages: string | undefined | null): string | undefined {
    if (!pages) return undefined;
    return pages.replace(/(?<=\d)-(?=\d)/g, "–");
}

export function stripTrailingPeriod(text: string): string {
    return text.endsWith(".") ? text.slice(0, -1) : text;
}

export function splitAuthorsDelimiters(segment: string, delimiters: RegExp): string[] {
    const cleaned = segment.trim().replace(/\.$/, "");
    if (!cleaned) return [];
    return cleaned.split(delimiters).map((part) => part.trim()).filter(Boolean);
}

export function capitalizeSentence(text: string): string {
    if (!text) return "";
    return text[0].toUpperCase() + text.slice(1);
}

export function applyLocator(reference: Reference, locator: string | null | undefined): void {
    const { doi, url } = cleanLocator(locator);
    if (doi) reference.doi = doi;
    if (url) reference.url = url;
    if (!doi && url?.toLowerCase().includes("doi.org/")) {
        reference.doi = url.split(/doi\.org\//i)[1];
        reference.url = url;
    }
}
