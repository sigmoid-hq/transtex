# TransTex (Python)

Reference conversion helpers for BibTeX, APA 6th, and IEEE formats.

## Features

- Parse BibTeX entries into structured `Reference` objects.
- Serialize references back to clean BibTeX.
- Format references using simplified APA 6th and IEEE styles.
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
