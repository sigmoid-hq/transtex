"""Parse Chicago author-date citations."""
from __future__ import annotations

import re

from ..reference import Reference
from .shared import (
    clean_locator,
    generate_cite_key,
    normalize_pages,
    split_authors_delimited,
    strip_trailing_period,
)


def parse_chicago_citation(text: str) -> Reference:
    raw = text.strip()
    if not raw:
        raise ValueError("Empty Chicago citation string")

    parts = raw.split(". ", 2)
    if len(parts) < 3:
        raise ValueError("Chicago citation missing expected segments")
    authors_segment, year_segment, remainder = parts[0], parts[1], parts[2]
    year = strip_trailing_period(year_segment.strip()) or None

    title_match = re.search(r"\"(.+?)\"\s", remainder)
    if not title_match:
        raise ValueError("Chicago citation missing title")
    title = strip_trailing_period(title_match.group(1).strip())
    after_title = remainder[title_match.end() :].strip()

    locator = None
    locator_match = re.search(r"(https?://\S+|10\.\S+)$", after_title)
    if locator_match:
        locator = locator_match.group(1).strip()
        after_title = after_title[: locator_match.start()].strip()

    journal_match = re.match(r"\*([^*]+)\*\s+([\d]+)\s*\(([^)]+)\):\s*([^\s]+)", after_title)
    journal = volume = issue = pages = None
    if journal_match:
        journal = journal_match.group(1).strip()
        volume = journal_match.group(2).strip()
        issue = journal_match.group(3).strip()
        pages = normalize_pages(journal_match.group(4).strip())

    reference = Reference(
        entry_type="article",
        cite_key=generate_cite_key([], year, title),
        title=title,
        authors=_parse_authors(authors_segment),
        journal=journal,
        volume=volume,
        issue=issue,
        pages=pages,
        year=year,
    )
    doi, url = clean_locator(locator)
    reference.doi = doi
    reference.url = url
    return reference


def _parse_authors(segment: str) -> list[str]:
    parts = split_authors_delimited(segment, separators=[" and ", ","])
    return [part.strip() for part in parts if part.strip()]


__all__ = ["parse_chicago_citation"]
