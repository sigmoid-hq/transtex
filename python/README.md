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

## Running tests

```bash
uv run python -m unittest
```
