# TransTex

Bidirectional citation conversion library for BibTeX and common styles (APA 6th/7th, IEEE, MLA 9th, Chicago author-date, Vancouver). Available in Python (uv) and TypeScript/Node.

## Features

- Parse BibTeX entries to structured references
- Format references to APA 6th/7th, IEEE, MLA 9th, Chicago (author-date), Vancouver
- Parse formatted citations back to references and serialize to BibTeX
- Examples and tests included for both Python and TypeScript

## Packages

- `python/` — Python package (`uv run ...`)
- `typescript/` — TypeScript/Node package (`yarn ...`)

## Quick start (Python)

```bash
cd python
uv run python examples/format_from_bibtex.py      # BibTeX -> multiple styles
uv run python examples/citation_to_bibtex.py      # APA/IEEE citation -> BibTeX
uv run python -m unittest                          # tests
```

## Quick start (TypeScript)

```bash
cd typescript
yarn install
yarn build
yarn test
yarn example:format        # BibTeX -> styles
yarn example:citations     # APA/IEEE citation -> BibTeX
```