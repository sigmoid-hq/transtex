"""Convert between citation styles and BibTeX."""
from transtex import citation_to_bibtex, convert_citation


APA_CITATION = (
    "Doe, J., & Smith, J. (2020). Deep learning for everything. "
    "Journal of Omniscience, 42(7), 1–10. https://doi.org/10.1000/j.jo.2020.01.001"
)


def main() -> None:
    ieee_text = convert_citation("apa", "ieee", APA_CITATION)
    print("APA -> IEEE")
    print(ieee_text)
    print()

    chicago_text = convert_citation("apa", "chicago", APA_CITATION)
    print("APA -> Chicago")
    print(chicago_text)
    print()

    mla_text = convert_citation("apa", "mla", APA_CITATION)
    print("APA -> MLA")
    print(mla_text)
    print()

    bibtex_text = citation_to_bibtex("apa", APA_CITATION)
    print("APA -> BibTeX")
    print(bibtex_text)
    print()

    ieee_to_apa = convert_citation("ieee", "apa", ieee_text)
    print("IEEE -> APA")
    print(ieee_to_apa)


if __name__ == "__main__":
    main()
