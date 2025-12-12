# TransTex (TypeScript)

TypeScript/Node bindings for TransTex: BibTeX parsing/serialization and citation formatting for APA 6th/7th, IEEE, MLA 9th, Chicago (author-date), and Vancouver. Includes reverse parsing from citations back to BibTeX.

## Install

```bash
yarn add transtex
```

## Usage

Format a reference in multiple styles:

```ts
import {
    Reference,
    formatApa,
    formatApa7,
    formatIeee,
    formatMla,
    formatChicago,
    formatVancouver,
    referenceToBibtex,
} from "transtex";

const ref = new Reference({
    entryType: "article",
    citeKey: "doe2020deep",
    title: "Deep Learning for Everything",
    authors: ["John Doe", "Jane Smith"],
    journal: "Journal of Omniscience",
    year: "2020",
    volume: "42",
    issue: "7",
    pages: "1-10",
    doi: "10.1000/j.jo.2020.01.001",
});

console.log(formatApa(ref));
console.log(formatApa7(ref));
console.log(formatIeee(ref));
console.log(formatMla(ref));
console.log(formatChicago(ref));
console.log(formatVancouver(ref));

console.log(referenceToBibtex(ref));
```

Parse a citation back to BibTeX:

```ts
import { citationToBibtex, convertCitation } from "transtex";

const ieeeCitation =
    'J. Doe and J. Smith, "Deep Learning for Everything," Journal of Omniscience, vol. 42, no. 7, pp. 1–10, 2020, doi: 10.1000/j.jo.2020.01.001.';
const bibtex = citationToBibtex("ieee", ieeeCitation);
console.log(bibtex);

const apaCitation = convertCitation("ieee", "apa7", ieeeCitation);
console.log(apaCitation);
```

Book / conference / web examples (see `examples/bookAndWebExamples.ts`):

```ts
const bookRef = new Reference({
    entryType: "book",
    citeKey: "turing1950",
    title: "Computing Machinery and Intelligence",
    authors: ["Alan M. Turing"],
    publisher: "Oxford University Press",
    place: "Oxford, UK",
    year: "1950",
    edition: "2nd ed.",
    pages: "1-120",
    doi: "10.1000/book.1950.01",
});

const confRef = new Reference({
    entryType: "inproceedings",
    citeKey: "doe2023conf",
    title: "Neural Widgets for Everything",
    authors: ["John Doe", "Jane Smith"],
    eventTitle: "Proceedings of the 40th International Neural Conference",
    eventLocation: "Berlin, Germany",
    publisher: "Neural Press",
    year: "2023",
    pages: "101-110",
    doi: "10.1000/conf.2023.101",
});

console.log(formatApa(bookRef));
console.log(formatIeee(confRef));
```

## Scripts

- `yarn build` — compile to `dist/`
- `yarn test` — run vitest unit tests
- `yarn example:format` — format a sample BibTeX entry into all styles
- `yarn example:citations` — parse APA/IEEE citations back to BibTeX
- run other examples via `yarn ts-node examples/bookAndWebExamples.ts`
- convert between styles via `yarn ts-node examples/convertCitationStyles.ts`

## Files published

Only `dist/`, `README.md`, and `LICENSE` are shipped in the npm package.
