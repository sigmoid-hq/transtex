"""Formatting helpers for converting :class:`Reference` objects to strings."""
from __future__ import annotations

from typing import List

from .reference import Reference


def format_apa(reference: Reference) -> str:
    """Return a string formatted following a simplified APA 6th style."""
    parts = []
    author_text = _apa_authors(reference.normalized_authors())
    if author_text:
        parts.append(author_text)
    if reference.year:
        parts.append(f"({reference.year}).")
    if reference.title:
        parts.append(f"{reference.title}.")

    container = reference.primary_container()
    container_parts = []
    if container:
        container_parts.append(container)
        volume = reference.volume or ""
        issue = reference.issue or ""
        if volume and issue:
            container_parts.append(f"{volume}({issue})")
        elif volume:
            container_parts.append(volume)
        if reference.pages:
            container_parts.append(reference.pages)
        container_sentence = ", ".join(container_parts) + "."
        parts.append(container_sentence)

    locator = reference.doi or reference.url
    if locator:
        locator_value = locator
        if reference.doi and not reference.doi.lower().startswith("http"):
            locator_value = f"https://doi.org/{reference.doi}"
        parts.append(locator_value)

    return " ".join(part.strip() for part in parts if part.strip())


def format_ieee(reference: Reference) -> str:
    """Return a string formatted following a simplified IEEE style."""
    parts = []
    author_text = _ieee_authors(reference.normalized_authors())
    if author_text:
        parts.append(author_text)
    container = reference.primary_container()
    if reference.title:
        title_segment = f'"{reference.title},"'
        if container:
            title_segment = f'{title_segment} {container}'
            container = None
        parts.append(title_segment)
    if container:
        parts.append(container)
    if reference.volume:
        vol = f"vol. {reference.volume}"
        if reference.issue:
            vol += f", no. {reference.issue}"
        parts.append(vol)
    elif reference.issue:
        parts.append(f"no. {reference.issue}")
    if reference.pages:
        parts.append(f"pp. {reference.pages}")
    if reference.year:
        parts.append(reference.year)
    if reference.doi:
        doi = reference.doi
        if not doi.lower().startswith("10.") and not doi.lower().startswith("http"):
            doi = f"doi: {doi}"
        elif doi.lower().startswith("10."):
            doi = f"doi: {doi}"
        parts.append(doi)
    elif reference.url:
        parts.append(reference.url)

    sentence = ", ".join(part for part in parts if part)
    if sentence:
        sentence += "."
    return sentence


def _apa_authors(authors: List[str]) -> str:
    if not authors:
        return ""

    formatted = [_apa_single_author(author) for author in authors]
    if len(formatted) == 1:
        return formatted[0]
    return ", ".join(formatted[:-1]) + f", & {formatted[-1]}"


def _apa_single_author(name: str) -> str:
    last, initials = _split_name(name)
    if not last:
        return name.strip()
    return f"{last}, {' '.join(initials)}".strip()


def _ieee_authors(authors: List[str]) -> str:
    if not authors:
        return ""
    formatted = [_ieee_single_author(author) for author in authors]
    if len(formatted) == 1:
        return formatted[0]
    if len(formatted) == 2:
        return " and ".join(formatted)
    return ", ".join(formatted[:-1]) + ", and " + formatted[-1]


def _ieee_single_author(name: str) -> str:
    last, initials = _split_name(name)
    if not last:
        return name.strip()
    joined_initials = " ".join(initials)
    if joined_initials:
        return f"{joined_initials} {last}"
    return last


def _split_name(name: str) -> tuple[str, List[str]]:
    raw = name.strip()
    if not raw:
        return "", []
    if "," in raw:
        last, remaining = raw.split(",", 1)
        given_names = [chunk.strip() for chunk in remaining.split() if chunk.strip()]
        initials = [f"{part[0].upper()}." for part in given_names]
        return last.strip(), initials
    parts = raw.split()
    if not parts:
        return "", []
    last = parts[-1]
    initials = [f"{part[0].upper()}." for part in parts[:-1]]
    return last, initials


__all__ = ["format_apa", "format_ieee"]
