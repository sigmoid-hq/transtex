import { referenceToBibtex } from "./bibtex";
import { Reference } from "./reference";
import {
    parseApaCitation as parseApaCitationImpl,
    parseChicagoCitation as parseChicagoCitationImpl,
    parseIeeeCitation as parseIeeeCitationImpl,
    parseMlaCitation as parseMlaCitationImpl,
    parseVancouverCitation as parseVancouverCitationImpl,
} from "./parsers";

export class CitationParseError extends Error {}

type ParserFn = (text: string) => Reference;

const PARSERS: Record<string, ParserFn> = {
    apa: parseApaCitation,
    apa6: parseApaCitation,
    apa7: parseApaCitation,
    ieee: parseIeeeCitation,
    chicago: parseChicagoCitation,
    mla: parseMlaCitation,
    vancouver: parseVancouverCitation,
};

export function parseCitation(style: string, text: string): Reference {
    const normalized = style.trim().toLowerCase();
    const parser = PARSERS[normalized];
    if (!parser) {
        throw new CitationParseError(`Unsupported style '${style}'. Supported: ${Object.keys(PARSERS).join(", ")}`);
    }
    return parser(text);
}

export function citationToBibtex(style: string, text: string): string {
    const reference = parseCitation(style, text);
    return referenceToBibtex(reference);
}

export function parseApaCitation(text: string): Reference {
    return wrapParser(parseApaCitationImpl, text);
}

export function parseIeeeCitation(text: string): Reference {
    return wrapParser(parseIeeeCitationImpl, text);
}

export function parseChicagoCitation(text: string): Reference {
    return wrapParser(parseChicagoCitationImpl, text);
}

export function parseMlaCitation(text: string): Reference {
    return wrapParser(parseMlaCitationImpl, text);
}

export function parseVancouverCitation(text: string): Reference {
    return wrapParser(parseVancouverCitationImpl, text);
}

function wrapParser(fn: ParserFn, text: string): Reference {
    try {
        return fn(text);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to parse citation";
        throw new CitationParseError(message);
    }
}
