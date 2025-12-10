"""Format a BibTeX entry into multiple citation styles."""
from transtex import (
    format_apa,
    format_apa7,
    format_chicago,
    format_ieee,
    format_mla,
    format_vancouver,
    parse_bibtex_entry,
)


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
    print("APA 6th:")
    print(format_apa(reference))
    print()
    print("APA 7th:")
    print(format_apa7(reference))
    print()
    print("IEEE:")
    print(format_ieee(reference))
    print()
    print("MLA 9th:")
    print(format_mla(reference))
    print()
    print("Chicago (Author-Date):")
    print(format_chicago(reference))
    print()
    print("Vancouver:")
    print(format_vancouver(reference))


if __name__ == "__main__":
    main()
