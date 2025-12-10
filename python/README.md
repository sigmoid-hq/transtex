# TransTex (Python)

Reference conversion helpers for BibTeX plus APA 6th/7th, IEEE, MLA 9th, Chicago (author-date), and Vancouver styles.

## Features

- Parse BibTeX entries into structured `Reference` objects.
- Serialize references back to clean BibTeX.
- Format references using simplified APA 6th/7th, IEEE, MLA 9th, Chicago (author-date), and Vancouver styles that follow `CITATION_RULE.md`.
- Provide runnable examples and unit tests.

## Project layout

```
src/        # Library source code (transtex package)
tests/      # Unit tests built with unittest
examples/   # Small runnable scripts demonstrating the API
```

## Getting started

Use [uv](https://github.com/astral-sh/uv) to run commands without mutating the base environment:

```bash
uv run python examples/format_from_bibtex.py
```

You can also round-trip formatted citations back into BibTeX:

```bash
uv run python examples/citation_to_bibtex.py
```

## Usage

Format a `Reference` in multiple styles:

```python
from transtex import (
    Reference,
    format_apa,
    format_apa7,
    format_ieee,
    format_mla,
    format_chicago,
    format_vancouver,
    reference_to_bibtex,
)

ref = Reference(
    entry_type="article",
    cite_key="doe2020deep",
    title="Deep Learning for Everything",
    authors=["John Doe", "Jane Smith"],
    journal="Journal of Omniscience",
    year="2020",
    volume="42",
    issue="7",
    pages="1-10",
    doi="10.1000/j.jo.2020.01.001",
)

print(format_apa(ref))
print(format_apa7(ref))
print(format_ieee(ref))
print(format_mla(ref))
print(format_chicago(ref))
print(format_vancouver(ref))

print(reference_to_bibtex(ref))
```

Parse a formatted citation back to BibTeX:

```python
from transtex import citation_to_bibtex

ieee_text = 'J. Doe and J. Smith, "Deep Learning for Everything," Journal of Omniscience, vol. 42, no. 7, pp. 1–10, 2020, doi: 10.1000/j.jo.2020.01.001.'
bibtex = citation_to_bibtex("ieee", ieee_text)
print(bibtex)
```

## Running tests

```bash
uv run python -m unittest
```
