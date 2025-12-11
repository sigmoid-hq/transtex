import { Reference } from "../reference";

export function preferredLocator(reference: Reference, prefixDoi = ""): string {
    if (reference.doi) {
        const doi = reference.doi.trim();
        const lowered = doi.toLowerCase();
        if (lowered.startsWith("http")) {
            return doi;
        }
        if (lowered.startsWith("10.")) {
            const glue = prefixDoi.endsWith(" ") || prefixDoi.endsWith(":") || prefixDoi.endsWith("/") ? "" : " ";
            return prefixDoi ? `${prefixDoi}${glue}${doi}` : doi;
        }
        return doi;
    }
    if (reference.url) {
        return reference.url;
    }
    return "";
}

export function splitNameWithInitials(name: string): [string, string[]] {
    const raw = name.trim();
    if (!raw) return ["", []];
    if (raw.includes(",")) {
        const [last, remaining] = raw.split(",", 1);
        const givenNames = remaining.split(" ").map((chunk) => chunk.trim()).filter(Boolean);
        const initials = givenNames.map((part) => `${part[0]?.toUpperCase()}.`).filter(Boolean);
        return [last.trim(), initials];
    }
    const parts = raw.split(" ").filter(Boolean);
    if (parts.length === 0) return ["", []];
    const last = parts[parts.length - 1];
    const initials = parts.slice(0, -1).map((part) => `${part[0]?.toUpperCase()}.`).filter(Boolean);
    return [last, initials];
}

export function nameParts(name: string): [string, string[]] {
    const raw = name.trim();
    if (!raw) return ["", []];
    if (raw.includes(",")) {
        const [last, remaining] = raw.split(",", 1);
        const givenNames = remaining.split(" ").map((chunk) => chunk.trim()).filter(Boolean);
        return [last.trim(), givenNames];
    }
    const parts = raw.split(" ").filter(Boolean);
    if (parts.length === 0) return ["", []];
    return [parts[parts.length - 1], parts.slice(0, -1)];
}

export function formatName(name: string, invert = false): string {
    const [last, given] = nameParts(name);
    if (!last) return name.trim();
    const givenText = given.join(" ").trim();
    if (invert) {
        return `${last}, ${givenText}`.trim().replace(/,$/, "");
    }
    return `${givenText} ${last}`.trim();
}

export function formatAuthorList(
    authors: readonly string[],
    options: {
        invertFirst?: boolean;
        conjunction?: string;
        separator?: string;
        finalSeparator?: string;
        maxNames?: number | null;
        etAlText?: string;
        etAlAfterFirst?: boolean;
        etAlSeparator?: string;
    } = {}
): string {
    const {
        invertFirst = true,
        conjunction = "and",
        separator = ",",
        finalSeparator = ",",
        maxNames = null,
        etAlText = "et al.",
        etAlAfterFirst = false,
        etAlSeparator = ", ",
    } = options;

    const formatted = authors
        .map((name, index) => formatName(name, invertFirst && index === 0) || name.trim())
        .filter(Boolean);
    if (formatted.length === 0) return "";
    let output = formatted;
    if (maxNames !== null && formatted.length > maxNames) {
        if (etAlAfterFirst) {
            return `${formatted[0]}${etAlSeparator}${etAlText}`.trim();
        }
        output = [...formatted.slice(0, maxNames), etAlText];
    }
    if (output.length === 1) return output[0];
    if (output.length === 2) {
        const joiner = finalSeparator ? `${finalSeparator} ${conjunction} ` : ` ${conjunction} `;
        return `${output[0]}${joiner}${output[1]}`.trim();
    }
    const body = `${output.slice(0, -1).join(`${separator} `)}`;
    const tail = finalSeparator ? `${finalSeparator} ${conjunction} ` : ` ${conjunction} `;
    return `${body}${tail}${output[output.length - 1]}`.trim();
}

export function buildDetailSection(
    container: string | undefined,
    volumeIssue: string | undefined,
    publisher: string | undefined,
    year: string | undefined,
    pages: string | undefined,
    locator: string | undefined
): string {
    const segments: string[] = [];
    if (publisher) segments.push(publisher);
    if (container) segments.push(container);
    if (volumeIssue) segments.push(volumeIssue);
    if (year) segments.push(year);
    if (pages) segments.push(pages);
    let detail = segments.join(", ");
    if (locator) {
        detail = detail ? `${detail}, ${locator}` : locator;
    }
    if (detail && !/[.!?"]$/.test(detail)) {
        detail += ".";
    }
    return detail;
}

export function joinWithPeriod(parts: Iterable<string>): string {
    const cleaned = Array.from(parts, (segment) => segment.trim()).filter(Boolean);
    if (cleaned.length === 0) return "";
    let sentence = cleaned[0];
    for (const segment of cleaned.slice(1)) {
        const separator = endsWithTerminal(sentence) ? " " : ". ";
        sentence = `${sentence}${separator}${segment}`;
    }
    if (sentence && !/[.!?"]$/.test(sentence)) {
        sentence += ".";
    }
    return sentence;
}

function endsWithTerminal(text: string): boolean {
    return [".", "!", "?", '."', "!\"", "?\"", ".'", "!'", "?'", '."'].some((p) => text.endsWith(p));
}

export function joinClauses(parts: Iterable<string>, separator = ", "): string {
    const cleaned = Array.from(parts, (segment) => segment?.trim()).filter((v): v is string => Boolean(v));
    return cleaned.join(separator);
}

export function authorInitials(authors: readonly string[], splitInitials = true): string[] {
    return authors.map((author) => {
        const [last, initials] = splitNameWithInitials(author);
        if (!last) return author.trim();
        const joined = splitInitials ? initials.join(" ") : initials.join("");
        return joined ? `${last}, ${joined}`.trim().replace(/,$/, "") : last;
    });
}

export function sentenceCase(text: string): string {
    if (!text) return "";
    const parts = text.trim().split(/(\s+)/);
    const result: string[] = [];
    let first = true;
    for (const part of parts) {
        if (!part.trim()) {
            result.push(part);
            continue;
        }
        if (first) {
            result.push(part[0].toUpperCase() + part.slice(1).toLowerCase());
            first = false;
        } else {
            result.push(part === part.toUpperCase() ? part : part.toLowerCase());
        }
    }
    return result.join("");
}

export function normalizePageRange(pages?: string | null): string | undefined {
    if (!pages) return undefined;
    return pages.replace(/(?<=\d)-(?=\d)/g, "–");
}
