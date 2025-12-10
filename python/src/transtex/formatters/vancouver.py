"""Vancouver (NLM) formatter."""
from __future__ import annotations

from typing import List, Optional

from ..reference import Reference
from .shared import name_parts, preferred_locator


def format_vancouver(reference: Reference) -> str:
    sections: List[Optional[str]] = [
        _author_section(reference),
        _title_section(reference),
        *_source_sections(reference),
        _locator_section(reference),
    ]
    sentence = " ".join(section.strip() for section in sections if section)
    if sentence and not sentence.endswith("."):
        sentence += "."
    return sentence


def _vancouver_authors(authors: List[str]) -> str:
    if not authors:
        return ""
    converted = []
    for name in authors:
        last, given_names = name_parts(name)
        if not last:
            converted.append(name.strip())
            continue
        initials = "".join(part[0].upper() for part in given_names if part)
        converted.append(f"{last} {initials}".strip())
    return ", ".join(converted)


def _author_section(reference: Reference) -> str:
    authors = _vancouver_authors(reference.normalized_authors())
    return f"{authors}." if authors else ""


def _title_section(reference: Reference) -> str:
    return f"{reference.title}." if reference.title else ""


def _source_sections(reference: Reference) -> List[str]:
    if reference.journal:
        return _journal_segments(reference)
    return _book_segments(reference)


def _journal_segments(reference: Reference) -> List[str]:
    timeline = reference.year or "n.d."
    if reference.volume:
        timeline += f";{reference.volume}"
        if reference.issue:
            timeline += f"({reference.issue})"
    elif reference.issue:
        timeline += f";({reference.issue})"
    if reference.pages:
        timeline += f":{reference.pages}"
    return [f"{reference.journal}.", f"{timeline}."]


def _book_segments(reference: Reference) -> List[str]:
    segments: List[str] = []
    publisher_bits = []
    if reference.publisher:
        publisher_bits.append(reference.publisher)
    if reference.year:
        publisher_bits.append(reference.year)
    if publisher_bits:
        segments.append("; ".join(publisher_bits) + ".")
    if reference.pages:
        segments.append(f"{reference.pages}.")
    return segments


def _locator_section(reference: Reference) -> str:
    locator = preferred_locator(reference, prefix_doi="doi:")
    if not locator:
        return ""
    return locator if locator.endswith(".") else f"{locator}."


__all__ = ["format_vancouver"]
