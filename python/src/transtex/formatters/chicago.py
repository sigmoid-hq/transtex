"""Chicago (author-date) formatter."""
from __future__ import annotations

from typing import Iterable, List, Optional

from ..reference import Reference
from .shared import (
    build_detail_section,
    format_author_list,
    join_with_period,
    preferred_locator,
)


def format_chicago(reference: Reference) -> str:
    pieces: List[Optional[str]] = [
        _author_segment(reference),
        reference.year or "n.d.",
        _title_segment(reference),
        _detail_segment(reference),
        preferred_locator(reference),
    ]
    return join_with_period(piece for piece in pieces if piece)


def _chicago_authors(authors: List[str]) -> str:
    return format_author_list(
        authors,
        invert_first=True,
        conjunction="and",
        separator=",",
        final_separator=",",
        max_names=3,
        et_al_after_first=True,
    )


def _author_segment(reference: Reference) -> str:
    return _chicago_authors(reference.normalized_authors())


def _title_segment(reference: Reference) -> str:
    if not reference.title:
        return ""
    if reference.primary_container():
        return f'"{reference.title}"'
    return f"*{reference.title}*"


def _detail_segment(reference: Reference) -> str:
    if reference.journal:
        container = reference.journal
        if reference.volume:
            container += f" {reference.volume}"
            if reference.issue:
                container += f", no. {reference.issue}"
        elif reference.issue:
            container += f" no. {reference.issue}"
        detail = container
        if reference.pages:
            detail += f": {reference.pages}"
        return detail
    book_phrase = None
    if reference.booktitle:
        book_phrase = f"In *{reference.booktitle}*"
        if reference.pages:
            book_phrase += f", {reference.pages}"
    publisher = reference.publisher or ""
    return build_detail_section(
        book_phrase,
        None,
        publisher,
        None,
        None,
        preferred_locator(reference),
    )


__all__ = ["format_chicago"]
