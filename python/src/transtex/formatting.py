"""Formatting helpers for converting :class:`Reference` objects to strings."""
from __future__ import annotations

from typing import List, Tuple

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
    locator = _preferred_locator(reference, prefix_doi="doi: ")
    if locator:
        parts.append(locator)

    sentence = ", ".join(part for part in parts if part)
    if sentence:
        sentence += "."
    return sentence


def format_mla(reference: Reference) -> str:
    """Return a Works Cited entry that follows the MLA 9th core elements."""
    parts: List[str] = []
    author_text = _mla_authors(reference.normalized_authors())
    if author_text:
        parts.append(f"{author_text}.")
    if reference.title:
        if reference.primary_container():
            parts.append(f'"{reference.title}."')
        else:
            parts.append(f"*{reference.title}.*")
    container = reference.primary_container()
    detail_bits = []
    if container:
        detail_bits.append(f"*{container}*")
    vol_bits = []
    if reference.volume:
        vol_bits.append(f"vol. {reference.volume}")
    if reference.issue:
        vol_bits.append(f"no. {reference.issue}")
    if vol_bits:
        detail_bits.append(", ".join(vol_bits))
    if reference.year:
        detail_bits.append(reference.year)
    if reference.publisher and not container:
        detail_bits.insert(0, reference.publisher)
    if reference.pages:
        detail_bits.append(f"pp. {reference.pages}")
    detail_text = ", ".join(detail_bits)
    if detail_text:
        parts.append(detail_text)
    locator = _preferred_locator(reference)
    if locator:
        if detail_text:
            parts[-1] = f"{parts[-1]}, {locator}"
        else:
            parts.append(locator)
    sentence = " ".join(segment.strip() for segment in parts if segment.strip())
    if sentence and not sentence.endswith("."):
        sentence += "."
    return sentence


def format_chicago(reference: Reference) -> str:
    """Return a citation following the Chicago author-date pattern."""
    parts: List[str] = []
    author_text = _chicago_authors(reference.normalized_authors())
    if author_text:
        parts.append(author_text)
    parts.append(reference.year or "n.d.")
    if reference.title:
        if reference.primary_container():
            parts.append(f'"{reference.title}"')
        else:
            parts.append(f"*{reference.title}*")

    if reference.journal:
        journal = reference.journal
        if reference.volume:
            journal += f" {reference.volume}"
            if reference.issue:
                journal += f", no. {reference.issue}"
        elif reference.issue:
            journal += f" no. {reference.issue}"
        if reference.pages:
            journal += f": {reference.pages}"
        parts.append(journal)
    elif reference.booktitle:
        phrase = f"In *{reference.booktitle}*"
        if reference.pages:
            phrase += f", {reference.pages}"
        parts.append(phrase)
    if reference.publisher and not reference.journal:
        parts.append(reference.publisher)
    locator = _preferred_locator(reference)
    if locator:
        parts.append(locator)

    cleaned = [segment.strip() for segment in parts if segment.strip()]
    sentence = ". ".join(cleaned)
    if sentence and sentence[-1] not in ".!?\"":
        sentence += "."
    return sentence


def format_vancouver(reference: Reference) -> str:
    """Return a reference formatted using the Vancouver (NLM) style."""
    segments: List[str] = []
    author_text = _vancouver_authors(reference.normalized_authors())
    if author_text:
        segments.append(f"{author_text}.")
    if reference.title:
        segments.append(f"{reference.title}.")
    if reference.journal:
        segments.append(f"{reference.journal}.")
        timeline = reference.year or "n.d."
        if reference.volume:
            timeline += f";{reference.volume}"
            if reference.issue:
                timeline += f"({reference.issue})"
        elif reference.issue:
            timeline += f";({reference.issue})"
        if reference.pages:
            timeline += f":{reference.pages}"
        timeline += "."
        segments.append(timeline)
    else:
        publisher_bits = []
        if reference.publisher:
            publisher_bits.append(reference.publisher)
        if reference.year:
            publisher_bits.append(reference.year)
        if publisher_bits:
            segments.append("; ".join(publisher_bits) + ".")
        if reference.pages:
            segments.append(f"{reference.pages}.")
    locator = _preferred_locator(reference, prefix_doi="doi:")
    if locator:
        suffix = locator if locator.endswith(".") else f"{locator}."
        segments.append(suffix)
    sentence = " ".join(segment.strip() for segment in segments if segment.strip())
    if sentence and not sentence.endswith("."):
        sentence += "."
    return sentence


def _preferred_locator(reference: Reference, prefix_doi: str = "") -> str:
    if reference.doi:
        doi = reference.doi
        if doi.lower().startswith("http"):
            return doi
        if doi.lower().startswith("10.") and prefix_doi:
            glue = "" if prefix_doi.endswith((" ", ":")) else " "
            return f"{prefix_doi}{glue}{doi}".strip()
        if doi.lower().startswith("10."):
            return doi
        return doi
    if reference.url:
        return reference.url
    return ""


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


def _mla_authors(authors: List[str]) -> str:
    if not authors:
        return ""
    formatted = []
    for index, name in enumerate(authors):
        last, given_names = _name_parts(name)
        if not last:
            formatted.append(name.strip())
            continue
        given = " ".join(given_names)
        if index == 0:
            text = f"{last}, {given}".strip()
        else:
            text = f"{given} {last}".strip()
        formatted.append(text)
    if len(formatted) == 1:
        return formatted[0]
    if len(formatted) == 2:
        return f"{formatted[0]}, and {formatted[1]}"
    return f"{formatted[0]}, et al."


def _chicago_authors(authors: List[str]) -> str:
    if not authors:
        return ""
    formatted = []
    for index, name in enumerate(authors):
        last, given_names = _name_parts(name)
        if not last:
            formatted.append(name.strip())
            continue
        given = " ".join(given_names)
        if index == 0:
            formatted.append(f"{last}, {given}".strip())
        else:
            formatted.append(f"{given} {last}".strip())
    if len(formatted) == 1:
        return formatted[0]
    if len(formatted) == 2:
        return f"{formatted[0]}, and {formatted[1]}"
    if len(formatted) <= 3:
        return ", ".join(formatted[:-1]) + ", and " + formatted[-1]
    return f"{formatted[0]}, et al."


def _vancouver_authors(authors: List[str]) -> str:
    if not authors:
        return ""
    converted = []
    for name in authors:
        last, given_names = _name_parts(name)
        if not last:
            converted.append(name.strip())
            continue
        initials = "".join(part[0].upper() for part in given_names if part)
        converted.append(f"{last} {initials}".strip())
    return ", ".join(converted)


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


def _split_name(name: str) -> Tuple[str, List[str]]:
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


def _name_parts(name: str) -> Tuple[str, List[str]]:
    raw = name.strip()
    if not raw:
        return "", []
    if "," in raw:
        last, remaining = raw.split(",", 1)
        given_names = [chunk.strip() for chunk in remaining.split() if chunk.strip()]
        return last.strip(), given_names
    parts = raw.split()
    if not parts:
        return "", []
    return parts[-1], parts[:-1]


__all__ = [
    "format_apa",
    "format_chicago",
    "format_ieee",
    "format_mla",
    "format_vancouver",
]
