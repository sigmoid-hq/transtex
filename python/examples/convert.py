"""Simple example that showcases BibTeX parsing and formatting."""
from transtex import format_apa, format_ieee, parse_bibtex_entry


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
    print("IEEE:")
    print(format_ieee(reference))


if __name__ == "__main__":
    main()
