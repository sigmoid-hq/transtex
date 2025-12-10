"""Parse formatted citations back into BibTeX."""
from transtex import citation_to_bibtex, format_apa, format_ieee, parse_bibtex_entry


EXAMPLE = """@article{doe2020deep,
  author = {John Doe and Jane Smith},
  title = {Deep Learning for Everything},
  journal = {Journal of Omniscience},
  year = {2020},
  volume = {42},
  number = {7},
  pages = {1-10},
  doi = {10.1000/j.jo.2020.01.001},
  url = {https://example.com/article}
}"""


def main() -> None:
    reference = parse_bibtex_entry(EXAMPLE)
    apa_citation = format_apa(reference)
    ieee_citation = format_ieee(reference)

    print("Original APA 6th citation:")
    print(apa_citation)
    print("\nBibTeX from APA 6th:")
    print(citation_to_bibtex("apa", apa_citation))

    print("\nOriginal IEEE citation:")
    print(ieee_citation)
    print("\nBibTeX from IEEE:")
    print(citation_to_bibtex("ieee", ieee_citation))


if __name__ == "__main__":
    main()
