"""Examples for formatting books, chapters, and web sources across styles."""
from transtex import (
    Reference,
    format_apa,
    format_apa7,
    format_chicago,
    format_ieee,
    format_mla,
    format_vancouver,
)


def book_example() -> Reference:
    return Reference(
        entry_type="book",
        cite_key="turing1950computing",
        title="Computing Machinery and Intelligence",
        authors=["Alan M. Turing"],
        publisher="Oxford University Press",
        place="Oxford, UK",
        year="1950",
        edition="2nd ed.",
        pages="1-120",
        doi="10.1000/book.1950.01",
    )


def web_example() -> Reference:
    return Reference(
        entry_type="misc",
        cite_key="ada1843letter",
        title="Sketch of the Analytical Engine",
        authors=["Ada Lovelace"],
        year="1843",
        url="https://example.org/analytical-engine",
        accessed_date="2024-02-10",
    )


def main() -> None:
    refs = [("Book", book_example()), ("Web", web_example())]
    formatters = [
        ("APA 6th", format_apa),
        ("APA 7th", format_apa7),
        ("IEEE", format_ieee),
        ("MLA 9th", format_mla),
        ("Chicago (Author-Date)", format_chicago),
        ("Vancouver", format_vancouver),
    ]

    for label, ref in refs:
        print(f"== {label} ==")
        for name, fn in formatters:
            print(f"{name}:")
            print(fn(ref))
        print()


if __name__ == "__main__":
    main()
