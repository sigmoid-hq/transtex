"""Chicago (author-date) formatter."""
from __future__ import annotations

from typing import List, Optional

from ..reference import Reference
from .shared import (
    build_detail_section,
    format_author_list,
    join_clauses,
    join_with_period,
)


def format_chicago(reference: Reference) -> str:
    pieces: List[Optional[str]] = [
        _author_segment(reference),
        reference.year or "n.d.",
        _title_segment(reference),
        _detail_segment(reference),
        reference.doi or reference.url,
    ]
    return join_with_period(piece for piece in pieces if piece)


def _author_segment(reference: Reference) -> str:
    return _chicago_authors(reference.normalized_authors())


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


def _title_segment(reference: Reference) -> str:
    if not reference.title:
        return ""
    if reference.primary_container():
        return f'"{reference.title}"'
    return f"*{reference.title}*"


def _detail_segment(reference: Reference) -> str:
    if reference.journal:
        return _journal_detail(reference)
    return _non_journal_detail(reference)


def _journal_detail(reference: Reference) -> str:
    volume_issue = _volume_issue(reference.volume, reference.issue)
    journal = join_clauses([reference.journal, volume_issue], separator=" ")
    page_segment = f": {reference.pages}" if reference.pages else ""
    return f"{journal}{page_segment}".strip()


def _volume_issue(volume: str | None, issue: str | None) -> str:
    if volume and issue:
        return f"{volume}, no. {issue}"
    if volume:
        return volume
    if issue:
        return f"no. {issue}"
    return ""


def _non_journal_detail(reference: Reference) -> str:
    book_phrase = _book_phrase(reference.booktitle, reference.pages)
    publisher = reference.publisher or ""
    return build_detail_section(
        book_phrase,
        None,
        publisher,
        None,
        None,
        None,
    )


def _book_phrase(booktitle: str | None, pages: str | None) -> Optional[str]:
    if not booktitle:
        return None
    page_clause = f", {pages}" if pages else ""
    return f"In *{booktitle}*{page_clause}"


__all__ = ["format_chicago"]
