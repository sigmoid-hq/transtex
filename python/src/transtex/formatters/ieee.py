"""IEEE formatter implementation."""
from __future__ import annotations

from typing import List, Optional, Tuple

from ..reference import Reference
from .shared import preferred_locator, split_name_with_initials


def format_ieee(reference: Reference) -> str:
    segments = [
        _author_segment(reference),
        *_title_and_container(reference),
        _volume_issue_segment(reference),
        _pages_segment(reference),
        reference.year or "",
        preferred_locator(reference, prefix_doi="doi: "),
    ]
    sentence = ", ".join(segment for segment in segments if segment)
    if sentence:
        sentence += "."
    return sentence


def _author_segment(reference: Reference) -> str:
    authors = [_ieee_name(author) for author in reference.normalized_authors()]
    if not authors:
        return ""
    if len(authors) == 1:
        return authors[0]
    if len(authors) == 2:
        return " and ".join(authors)
    return ", ".join(authors[:-1]) + ", and " + authors[-1]


def _title_and_container(reference: Reference) -> Tuple[Optional[str], Optional[str]]:
    container = reference.primary_container()
    if reference.title:
        title_segment = f'"{reference.title},"'
        if container:
            return f'{title_segment} {container}', None
        return title_segment, None
    return None, container


def _volume_issue_segment(reference: Reference) -> str:
    if reference.volume:
        segment = f"vol. {reference.volume}"
        if reference.issue:
            segment += f", no. {reference.issue}"
        return segment
    if reference.issue:
        return f"no. {reference.issue}"
    return ""


def _pages_segment(reference: Reference) -> str:
    return f"pp. {reference.pages}" if reference.pages else ""


def _ieee_name(author: str) -> str:
    last, initials = split_name_with_initials(author)
    if not last:
        return author.strip()
    joined_initials = " ".join(initials)
    if joined_initials:
        return f"{joined_initials} {last}"
    return last


__all__ = ["format_ieee"]
