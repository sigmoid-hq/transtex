"""Parsing helpers for formatted citation strings."""
from __future__ import annotations

import re
from typing import Callable

from .reference import Reference


class CitationParseError(ValueError):
    """Raised when a formatted citation string cannot be parsed."""


def parse_citation(style: str, text: str) -> Reference:
    """Parse a formatted citation string into a Reference."""
    normalized_style = style.strip().lower()
    parsers: dict[str, Callable[[str], Reference]] = {
        "apa": parse_apa_citation,
        "ieee": parse_ieee_citation,
    }
    parser = parsers.get(normalized_style)
    if not parser:
        raise CitationParseError(f"Unsupported style '{style}'. Supported: apa, ieee")
    return parser(text)


def parse_apa_citation(text: str) -> Reference:
    """Parse a citation formatted by :func:`format_apa`."""
    raw = text.strip()
    if not raw:
        raise CitationParseError("Empty APA citation string")

    year_match = re.search(r"\(([^)]+)\)\.", raw)
    if not year_match:
        raise CitationParseError("APA citation missing year segment '(year).'")

    authors_segment = raw[: year_match.start()].strip()
    remainder = raw[year_match.end() :].strip()
    year = year_match.group(1).strip() or None

    if ". " not in remainder:
        raise CitationParseError("APA citation missing title/container separation")
    title, remainder = remainder.split(". ", 1)
    title = title.strip()

    locator = None
    locator_match = re.search(r"(https?://\S+|10\.\S+)$", remainder)
    if locator_match:
        locator = locator_match.group(1).strip()
        remainder = remainder[: locator_match.start()].strip()

    container_segment = remainder.rstrip(".").strip()
    container, volume, issue, pages = _parse_apa_container(container_segment)

    authors = _parse_apa_authors(authors_segment)
    cite_key = _generate_cite_key(authors, year, title)
    reference = Reference(
        entry_type="article",
        cite_key=cite_key,
        title=title or None,
        authors=authors,
        journal=container,
        volume=volume,
        issue=issue,
        pages=pages,
        year=year,
    )
    if locator:
        if locator.lower().startswith("10."):
            reference.doi = locator
        else:
            reference.url = locator
    return reference


def _parse_apa_container(segment: str) -> tuple[str | None, str | None, str | None, str | None]:
    if not segment:
        return None, None, None, None
    match = re.match(
        r"(?P<container>.+?)(?:,\s*(?P<volume>\d+)(?:\((?P<issue>[^)]+)\))?)?(?:,\s*(?P<pages>[\w-]+))?$",
        segment,
    )
    if not match:
        return segment, None, None, None
    return (
        (match.group("container") or "").strip() or None,
        (match.group("volume") or "").strip() or None,
        (match.group("issue") or "").strip() or None,
        (match.group("pages") or "").strip() or None,
    )


def _parse_apa_authors(segment: str) -> list[str]:
    cleaned = segment.rstrip(".").strip()
    if not cleaned:
        return []
    raw_authors = re.split(r"\s*(?:,?\s*&|,?\s+and)\s+", cleaned)
    authors = []
    for author in raw_authors:
        name = author.strip().lstrip("& ").strip()
        if not name:
            continue
        if not name.endswith("."):
            name += "."
        authors.append(name)
    return authors


def parse_ieee_citation(text: str) -> Reference:
    """Parse a citation formatted by :func:`format_ieee`."""
    raw = text.strip().rstrip(".")
    if not raw:
        raise CitationParseError("Empty IEEE citation string")

    title_match = re.search(r"\"([^\"]+)\"", raw)
    if not title_match:
        raise CitationParseError("IEEE citation missing title content")
    title = title_match.group(1).strip().rstrip(",")
    authors_segment = raw[: title_match.start()].rstrip(", ").strip()
    post_title = raw[title_match.end() :].strip()

    tokens = [token.strip() for token in post_title.split(",") if token.strip()]
    if not tokens:
        raise CitationParseError("IEEE citation missing container segment")

    container = tokens[0]
    volume = issue = pages = year = doi = None
    for token in tokens[1:]:
        lowered = token.lower()
        if lowered.startswith("vol."):
            volume = token.split(" ", 1)[1].strip()
        elif lowered.startswith("no."):
            issue = token.split(" ", 1)[1].strip()
        elif lowered.startswith("pp."):
            pages = token.split(" ", 1)[1].strip()
        elif lowered.startswith("doi"):
            doi = token.split(":", 1)[-1].strip()
        elif re.fullmatch(r"\d{4}", token):
            year = token

    authors = _parse_ieee_authors(authors_segment)
    cite_key = _generate_cite_key(authors, year, title)
    reference = Reference(
        entry_type="article",
        cite_key=cite_key,
        title=title or None,
        authors=authors,
        journal=container or None,
        volume=volume,
        issue=issue,
        pages=pages,
        year=year,
        doi=doi,
    )
    return reference


def _parse_ieee_authors(segment: str) -> list[str]:
    cleaned = segment.replace(" and ", ", ").strip()
    if not cleaned:
        return []
    pattern = r"(?:[A-Z]\.\s*)+[A-Za-z0-9'`.-]+"
    matches = re.findall(pattern, cleaned)
    if matches:
        return [match.strip() for match in matches]
    return [part.strip() for part in cleaned.split(",") if part.strip()]


def _generate_cite_key(authors: list[str], year: str | None, title: str | None) -> str:
    def _slug(value: str) -> str:
        alnum = re.sub(r"[^A-Za-z0-9]+", "", value)
        return alnum.lower()

    first_author = authors[0] if authors else ""
    author_piece = _slug(first_author.split(",")[0] if "," in first_author else first_author.split()[-1] if first_author else "anon")
    year_piece = _slug(year or "nd")
    title_piece = _slug(title or "")
    key_parts = [part for part in (author_piece, year_piece, title_piece) if part]
    return "".join(key_parts) or "reference"


__all__ = [
    "CitationParseError",
    "parse_citation",
    "parse_apa_citation",
    "parse_ieee_citation",
]
