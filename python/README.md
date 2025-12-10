# TransTex (Python)

Reference conversion helpers for BibTeX plus APA 6th, IEEE, MLA 9th, Chicago (author-date), and Vancouver styles.

## Features

- Parse BibTeX entries into structured `Reference` objects.
- Serialize references back to clean BibTeX.
- Format references using simplified APA 6th, IEEE, MLA 9th, Chicago (author-date), and Vancouver styles that follow `CITATION_RULE.md`.
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
uv run python examples/convert.py
```

## Running tests

```bash
uv run python -m unittest
```
