# TransTex

Bidirectional citation conversion library for BibTeX and common scholarly styles (APA 6th/7th, IEEE, MLA 9th, Chicago author-date, Vancouver). Implemented in both Python and TypeScript/Node with matching APIs and test coverage.

## What it does

- Parse BibTeX entries into normalized `Reference` objects.
- Format references to APA 6th/7th, IEEE, MLA 9th, Chicago (author-date), and Vancouver.
- Parse formatted citations back into `Reference`/BibTeX.
- Convert across styles: citation → `Reference` → another citation style.
- Examples and unit tests for both Python and TypeScript.

## Packages

- `python/` — Python package (run via `uv run ...`)
- `typescript/` — TypeScript/Node package (run via `yarn ...`)

## Quick start (Python)

```bash
cd python
uv run python examples/format_from_bibtex.py      # BibTeX -> multiple styles
uv run python examples/citation_to_bibtex.py      # APA/IEEE citation -> BibTeX
uv run python examples/convert_citation_styles.py # citation -> other styles
uv run python -m unittest                         # tests
```

## Quick start (TypeScript)

```bash
cd typescript
yarn install
yarn build
yarn test
yarn example:format            # BibTeX -> styles
yarn example:citations         # APA/IEEE citation -> BibTeX
yarn ts-node examples/convertCitationStyles.ts
yarn ts-node examples/bookAndWebExamples.ts
```

## Scope and rules

- Focused on academic and official sources (articles, books/chapters, reports, and common conference/web records).
- Output follows the requirements in `CITATION_RULE.md` (fonts/italics ignored by request).
- Both SDKs share field names and behaviors to keep Python/TypeScript output aligned.
