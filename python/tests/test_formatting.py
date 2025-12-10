import unittest

from transtex import Reference, format_apa, format_ieee


class FormattingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.reference = Reference(
            entry_type="article",
            cite_key="doe2020deep",
            title="Deep Learning for Everything",
            authors=["John Doe", "Jane Smith"],
            journal="Journal of Omniscience",
            year="2020",
            volume="42",
            issue="7",
            pages="1-10",
            doi="10.1000/j.jo.2020.01.001",
        )

    def test_format_apa(self) -> None:
        formatted = format_apa(self.reference)
        expected = (
            "Doe, J., & Smith, J. (2020). Deep Learning for Everything. "
            "Journal of Omniscience, 42(7), 1-10. https://doi.org/10.1000/j.jo.2020.01.001"
        )
        self.assertEqual(formatted, expected)

    def test_format_ieee(self) -> None:
        formatted = format_ieee(self.reference)
        expected = (
            'J. Doe and J. Smith, "Deep Learning for Everything," Journal of Omniscience, '
            "vol. 42, no. 7, pp. 1-10, 2020, doi: 10.1000/j.jo.2020.01.001."
        )
        self.assertEqual(formatted, expected)


if __name__ == "__main__":
    unittest.main()
