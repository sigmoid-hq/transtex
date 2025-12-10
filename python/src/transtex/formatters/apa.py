"""APA 6th formatter implementation."""
from __future__ import annotations

from typing import List

from ..reference import Reference
from .shared import preferred_locator, split_name_with_initials


def format_apa(reference: Reference) -> str:
    sections = [
        _author_section(reference),
        _year_section(reference),
        _title_section(reference),
        _container_section(reference),
        _locator_section(reference),
    ]
    return " ".join(section for section in sections if section).strip()


def _apa_authors(authors: List[str]) -> str:
    if not authors:
        return ""

    formatted = [_apa_single_author(author) for author in authors]
    if len(formatted) == 1:
        return formatted[0]
    return ", ".join(formatted[:-1]) + f", & {formatted[-1]}"


def _apa_single_author(name: str) -> str:
    last, initials = split_name_with_initials(name)
    if not last:
        return name.strip()
    return f"{last}, {' '.join(initials)}".strip()


def _author_section(reference: Reference) -> str:
    return _apa_authors(reference.normalized_authors())


def _year_section(reference: Reference) -> str:
    return f"({reference.year})." if reference.year else ""


def _title_section(reference: Reference) -> str:
    return f"{reference.title}." if reference.title else ""


def _container_section(reference: Reference) -> str:
    container = reference.primary_container()
    if not container:
        return ""
    parts = [container]
    volume = reference.volume or ""
    issue = reference.issue or ""
    if volume and issue:
        parts.append(f"{volume}({issue})")
    elif volume:
        parts.append(volume)
    if reference.pages:
        parts.append(reference.pages)
    return ", ".join(parts) + "."


def _locator_section(reference: Reference) -> str:
    locator = preferred_locator(reference)
    if not locator:
        return ""
    if reference.doi and not reference.doi.lower().startswith("http"):
        return f"https://doi.org/{reference.doi}"
    return locator


__all__ = ["format_apa"]
