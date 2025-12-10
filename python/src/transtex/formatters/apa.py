"""APA 6th formatter implementation."""
from __future__ import annotations

from typing import List

from ..reference import Reference
from .shared import author_initials, join_clauses, preferred_locator


def format_apa(reference: Reference) -> str:
    """Format a reference using simplified APA 6th rules."""
    parts = [
        _author_section(reference),
        _year_section(reference),
        _title_section(reference),
        _container_section(reference),
        _locator_section(reference),
    ]
    return " ".join(part for part in parts if part).strip()


def _author_section(reference: Reference) -> str:
    authors = _apa_authors(reference.normalized_authors())
    return authors


def _apa_authors(authors: List[str]) -> str:
    formatted = author_initials(authors)
    if not formatted:
        return ""
    if len(formatted) == 1:
        return formatted[0]
    if len(formatted) <= 7:
        return ", ".join(formatted[:-1]) + f", & {formatted[-1]}"
    # APA 6th: first six authors, ellipsis, final author
    leading = ", ".join(formatted[:6])
    trailing = formatted[-1]
    return f"{leading}, ... {trailing}"


def _year_section(reference: Reference) -> str:
    return f"({reference.year})." if reference.year else ""


def _title_section(reference: Reference) -> str:
    return f"{reference.title}." if reference.title else ""


def _container_section(reference: Reference) -> str:
    container = reference.primary_container()
    if not container:
        return ""
    volume_issue = _volume_issue(reference.volume, reference.issue)
    pages = reference.pages or ""
    return join_clauses([container, volume_issue, pages]) + "."


def _volume_issue(volume: str | None, issue: str | None) -> str:
    if volume and issue:
        return f"{volume}({issue})"
    if volume:
        return volume
    return ""


def _locator_section(reference: Reference) -> str:
    locator = preferred_locator(reference)
    if not locator:
        return ""
    if reference.doi and not reference.doi.lower().startswith("http"):
        return f"https://doi.org/{reference.doi}"
    return locator


__all__ = ["format_apa"]
