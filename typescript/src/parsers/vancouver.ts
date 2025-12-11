import { Reference } from "../reference";
import { applyLocator, capitalizeSentence, generateCiteKey, normalizePages } from "./shared";

export function parseVancouverCitation(text: string): Reference {
    const raw = text.trim();
    if (!raw) throw new Error("Empty Vancouver citation string");

    const segments = raw.split(".").map((s) => s.trim()).filter(Boolean);
    if (segments.length < 3) throw new Error("Vancouver citation missing expected segments");

    const authorsSegment = segments[0];
    const title = capitalizeSentence(segments[1].replace(/\.$/, ""));
    const journalSegment = segments[2];
    const timelineSegment = segments[3] ?? "";
    const locatorSegment = segments[4] ?? "";

    let year: string | undefined;
    let volume: string | undefined;
    let issue: string | undefined;
    let pages: string | undefined;

    const timelineMatch = timelineSegment.match(/(\d{4});?([\d()]+)?:?([\w–-]+)?/);
    if (timelineMatch) {
        year = timelineMatch[1];
        const volIssue = timelineMatch[2] ?? "";
        if (volIssue.includes("(")) {
            volume = volIssue.split("(", 2)[0];
            issue = volIssue.split("(", 2)[1].replace(")", "");
        } else if (volIssue) {
            volume = volIssue;
        }
        pages = normalizePages(timelineMatch[3] ?? undefined);
    }

    const authors = authorsSegment.split(",").map((a) => a.trim()).filter(Boolean);
    const reference = new Reference({
        entryType: "article",
        citeKey: generateCiteKey(authors, year, title),
        title,
        authors,
        journal: journalSegment,
        volume,
        issue,
        pages,
        year,
    });

    applyLocator(reference, locatorSegment);
    return reference;
}

export const __all__ = ["parseVancouverCitation"];
