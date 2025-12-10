"""Parse MLA 9th citations."""
from __future__ import annotations

import re

from ..reference import Reference
from .common import clean_locator, generate_cite_key, normalize_pages, split_authors_delimited, strip_trailing_period


def parse_mla_citation(text: str) -> Reference:
    raw = text.strip()
    if not raw:
        raise ValueError("Empty MLA citation string")

    if ". " not in raw:
        raise ValueError("MLA citation missing title separator")
    authors_segment, remainder = raw.split(". ", 1)

    title_match = re.search(r"\"(.+?)\"\s", remainder)
    if not title_match:
        raise ValueError("MLA citation missing title")
    title = strip_trailing_period(title_match.group(1).strip())
    after_title = remainder[title_match.end() :].strip()

    locator = None
    locator_match = re.search(r"(https?://\S+|10\.\S+)\.?$", after_title)
    if locator_match:
        locator = locator_match.group(1).strip()
        after_title = after_title[: locator_match.start()].strip().rstrip(",")

    container_match = re.search(r"\*([^*]+)\*", after_title)
    container = container_match.group(1).strip() if container_match else None

    volume = issue = year = pages = None
    vol_match = re.search(r"vol\.\s*([\w]+)", after_title, re.IGNORECASE)
    if vol_match:
        volume = vol_match.group(1)
    issue_match = re.search(r"no\.\s*([\w]+)", after_title, re.IGNORECASE)
    if issue_match:
        issue = issue_match.group(1)
    year_match = re.search(r"(\d{4})", after_title)
    if year_match:
        year = year_match.group(1)
    pages_match = re.search(r"pp\.\s*([\w–-]+)", after_title, re.IGNORECASE)
    if pages_match:
        pages = normalize_pages(pages_match.group(1))

    reference = Reference(
        entry_type="article",
        cite_key=generate_cite_key([], year, title),
        title=title,
        authors=_parse_authors(authors_segment),
        journal=container,
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
    if "et al." in segment:
        head = segment.split(" et al.", 1)[0].strip()
        return [head, "et al."] if head else ["et al."]
    parts = split_authors_delimited(segment.replace(", and ", " and "), separators=[" and ", ","])
    return parts


__all__ = ["parse_mla_citation"]
