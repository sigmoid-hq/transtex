import { Reference } from "./reference";
import { formatApa, formatApa7, formatChicago, formatIeee, formatMla, formatVancouver } from "./formatters";
import { parseCitation } from "./parsing";

export class ConversionError extends Error {}

type FormatterFn = (reference: Reference) => string;

const FORMATTERS: Record<string, FormatterFn> = {
    apa: formatApa,
    apa6: formatApa,
    apa7: formatApa7,
    ieee: formatIeee,
    mla: formatMla,
    chicago: formatChicago,
    vancouver: formatVancouver,
};

export function formatReference(style: string, reference: Reference): string {
    const normalized = style.trim().toLowerCase();
    const formatter = FORMATTERS[normalized];
    if (!formatter) {
        throw new ConversionError(
            `Unsupported style '${style}'. Supported styles: ${Object.keys(FORMATTERS).sort().join(", ")}`,
        );
    }
    return formatter(reference);
}

export function convertCitation(fromStyle: string, toStyle: string, text: string): string {
    try {
        const reference = parseCitation(fromStyle, text);
        return formatReference(toStyle, reference);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Conversion failed";
        throw new ConversionError(message);
    }
}

export const __all__ = ["ConversionError", "convertCitation", "formatReference"];
