import { Reference, ReferenceInit } from "./reference";

export class BibTeXError extends Error {}

export function parseBibtexEntry(entry: string): Reference {
    const text = entry.trim();
    if (!text) {
        throw new BibTeXError("Empty BibTeX entry");
    }
    if (!text.startsWith("@")) {
        throw new BibTeXError("BibTeX entry must start with '@'");
    }

    const typeEnd = text.indexOf("{");
    if (typeEnd === -1) {
        throw new BibTeXError("Missing opening brace for entry");
    }
    const entryType = text.slice(1, typeEnd).trim();
    if (!entryType) {
        throw new BibTeXError("Entry type is missing");
    }

    let remainder = text.slice(typeEnd + 1).trim();
    if (!remainder.endsWith("}")) {
        throw new BibTeXError("BibTeX entry must end with '}'");
    }
    remainder = remainder.slice(0, -1).trim();
    const firstComma = remainder.indexOf(",");
    if (firstComma === -1) {
        throw new BibTeXError("BibTeX entry is missing fields");
    }

    const citeKey = remainder.slice(0, firstComma).trim();
    if (!citeKey) {
        throw new BibTeXError("Entry cite key is missing");
    }
    const fieldBlob = remainder.slice(firstComma + 1);

    const fields = parseFields(fieldBlob);
    return referenceFromFields(entryType, citeKey, fields);
}

export function referenceToBibtex(reference: Reference): string {
    if (!reference.entryType.trim()) {
        throw new BibTeXError("Reference entry_type is required for BibTeX output");
    }
    if (!reference.citeKey.trim()) {
        throw new BibTeXError("Reference cite_key is required for BibTeX output");
    }

    const fields = reference.mergedFields();
    const order = [
        "author",
        "title",
        "journal",
        "booktitle",
        "publisher",
        "year",
        "volume",
        "number",
        "pages",
        "doi",
        "url",
    ];

    const orderedItems: Array<[string, string]> = [];
    for (const key of order) {
        const value = fields[key];
        if (value) {
            orderedItems.push([key, value]);
            delete fields[key];
        }
    }
    for (const key of Object.keys(fields).sort()) {
        orderedItems.push([key, fields[key]]);
    }

    if (orderedItems.length === 0) {
        return `@${reference.entryType}{${reference.citeKey}}`;
    }

    const body = orderedItems.map(([key, value]) => `  ${key} = {${value}}`).join(",\n");
    return `@${reference.entryType}{${reference.citeKey},\n${body}\n}`;
}

function parseFields(blob: string): Record<string, string> {
    const fields: Record<string, string> = {};
    let idx = 0;
    const length = blob.length;

    while (idx < length) {
        idx = consumeWhitespace(blob, idx);
        if (idx >= length) break;

        const [name, afterName] = consumeFieldName(blob, idx);
        idx = consumeWhitespace(blob, afterName);
        idx = expectChar(blob, idx, "=", `Field '${name}' misses '=' sign`);
        idx = consumeWhitespace(blob, idx);

        const [value, afterValue] = consumeValue(blob, idx);
        fields[name] = cleanValue(value);
        idx = consumeDelimiter(blob, afterValue);
    }

    return fields;
}

function consumeValue(text: string, start: number): [string, number] {
    if (start >= text.length) {
        return ["", start];
    }
    const char = text[start];
    if (char === "{") {
        return consumeBracedValue(text, start);
    }
    if (char === '"') {
        return consumeQuotedValue(text, start);
    }
    return consumeBareValue(text, start);
}

function consumeBracedValue(text: string, start: number): [string, number] {
    let depth = 0;
    let idx = start + 1;
    while (idx < text.length) {
        const current = text[idx];
        if (current === "{") {
            depth += 1;
        } else if (current === "}") {
            if (depth === 0) {
                return [text.slice(start + 1, idx), idx + 1];
            }
            depth -= 1;
        }
        idx += 1;
    }
    throw new BibTeXError("Missing closing brace in value");
}

function consumeQuotedValue(text: string, start: number): [string, number] {
    let idx = start + 1;
    let escaped = false;
    while (idx < text.length) {
        const current = text[idx];
        if (current === '"' && !escaped) {
            return [text.slice(start + 1, idx), idx + 1];
        }
        escaped = current === "\\" && !escaped;
        if (current !== "\\") {
            escaped = false;
        }
        idx += 1;
    }
    throw new BibTeXError("Missing closing quote in value");
}

function consumeBareValue(text: string, start: number): [string, number] {
    let idx = start;
    while (idx < text.length && !",\n\r".includes(text[idx])) {
        idx += 1;
    }
    return [text.slice(start, idx).trim(), idx];
}

function cleanValue(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function consumeWhitespace(text: string, start: number): number {
    let idx = start;
    while (idx < text.length && (/\s/.test(text[idx]) || text[idx] === ",")) {
        idx += 1;
    }
    return idx;
}

function consumeFieldName(text: string, start: number): [string, number] {
    let idx = start;
    while (idx < text.length && /[A-Za-z0-9_-]/.test(text[idx])) {
        idx += 1;
    }
    const name = text.slice(start, idx).toLowerCase();
    if (!name) {
        throw new BibTeXError("Field name missing in BibTeX entry");
    }
    return [name, idx];
}

function expectChar(text: string, idx: number, expected: string, error: string): number {
    if (idx >= text.length || text[idx] !== expected) {
        throw new BibTeXError(error);
    }
    return idx + 1;
}

function consumeDelimiter(text: string, idx: number): number {
    let cursor = idx;
    while (cursor < text.length && /\s/.test(text[cursor])) {
        cursor += 1;
    }
    if (cursor < text.length && text[cursor] === ",") {
        cursor += 1;
    }
    return cursor;
}

function referenceFromFields(entryType: string, citeKey: string, fields: Record<string, string>): Reference {
    const authorsField = fields["author"] ?? "";
    const authors = splitAuthors(authorsField);
    const standardKeys = new Set([
        "author",
        "title",
        "journal",
        "booktitle",
        "publisher",
        "year",
        "volume",
        "number",
        "pages",
        "doi",
        "url",
    ]);
    const extra: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
        if (!standardKeys.has(key)) {
            extra[key] = value;
        }
    }
    const init: ReferenceInit = {
        entryType,
        citeKey,
        title: fields["title"],
        authors,
        journal: fields["journal"],
        booktitle: fields["booktitle"],
        publisher: fields["publisher"],
        year: fields["year"],
        volume: fields["volume"],
        issue: fields["number"],
        pages: fields["pages"],
        doi: fields["doi"],
        url: fields["url"],
        extraFields: extra,
    };
    return new Reference(init);
}

function splitAuthors(raw: string): string[] {
    if (!raw) return [];
    return raw.split(" and ").map((author) => author.trim()).filter(Boolean);
}
