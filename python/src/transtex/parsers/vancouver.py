"""Parse Vancouver (NLM) citations."""
from __future__ import annotations

import re

from ..reference import Reference
from .common import capitalize_sentence, clean_locator, generate_cite_key, normalize_pages


def parse_vancouver_citation(text: str) -> Reference:
    raw = text.strip()
    if not raw:
        raise ValueError("Empty Vancouver citation string")

    segments = [segment.strip() for segment in raw.split(".") if segment.strip()]
    if len(segments) < 3:
        raise ValueError("Vancouver citation missing expected segments")

    authors_segment = segments[0]
    title = capitalize_sentence(segments[1].rstrip("."))
    journal_segment = segments[2]
    timeline_segment = segments[3] if len(segments) > 3 else ""
    locator_segment = segments[4] if len(segments) > 4 else ""

    year = volume = issue = pages = None
    timeline_match = re.match(r"(\d{4});?([\d()]+)?:?([\w–-]+)?", timeline_segment)
    if timeline_match:
        year = timeline_match.group(1)
        vol_issue = timeline_match.group(2) or ""
        if "(" in vol_issue and ")" in vol_issue:
            volume = vol_issue.split("(", 1)[0]
            issue = vol_issue.split("(", 1)[1].rstrip(")")
        else:
            volume = vol_issue if vol_issue else None
        pages = normalize_pages(timeline_match.group(3) or None)

    reference = Reference(
        entry_type="article",
        cite_key=generate_cite_key([], year, title),
        title=title,
        authors=_parse_authors(authors_segment),
        journal=journal_segment,
        volume=volume,
        issue=issue,
        pages=pages,
        year=year,
    )

    doi, url = _parse_locator(locator_segment)
    reference.doi = doi
    reference.url = url
    return reference


def _parse_authors(segment: str) -> list[str]:
    cleaned = segment.strip()
    if not cleaned:
        return []
    return [author.strip() for author in cleaned.split(",") if author.strip()]


def _parse_locator(segment: str) -> tuple[str | None, str | None]:
    locator = segment.strip()
    if not locator:
        return None, None
    lowered = locator.lower()
    if lowered.startswith("doi"):
        value = locator.split(":", 1)[-1].strip()
        return value, None
    if lowered.startswith("http"):
        return None, locator
    return None, None


__all__ = ["parse_vancouver_citation"]
