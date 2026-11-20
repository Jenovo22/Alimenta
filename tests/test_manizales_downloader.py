import importlib.util
import json
import unittest
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from unittest.mock import patch


SCRIPT = Path(__file__).parents[1] / "Bases de datos" / "download_manizales_data.py"
spec = importlib.util.spec_from_file_location("manizales_downloader", SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def row(key, municipality="17001"):
    return {field: (municipality if field == "cod_mpio" else f"{field}-{key}") for field in module.FIELDS}


class Response:
    status = 200

    def __init__(self, payload):
        self.payload = json.dumps(payload).encode()

    def read(self):
        return self.payload


class DownloaderTests(unittest.TestCase):
    def test_query_filter_and_pagination(self):
        calls = []
        pages = [[row("a")], [row("b")], []]

        def transport(url, timeout):
            query = parse_qs(urlparse(url).query)
            calls.append((query, timeout))
            return Response(pages[len(calls) - 1])

        records = module.fetch_records(page_size=1, timeout=7, transport=transport)
        self.assertEqual([record["llave"] for record in records], ["llave-a", "llave-b"])
        self.assertEqual([call[0]["$offset"] for call in calls], [["0"], ["1"], ["2"]])
        self.assertEqual(calls[0][0]["$where"], ["cod_mpio='17001'"])
        self.assertEqual(calls[0][0]["$select"], [",".join(module.FIELDS)])
        self.assertTrue(all(timeout == 7 for _, timeout in calls))

    def test_validation_rejects_wrong_municipality_and_missing_field(self):
        with self.assertRaises(module.DownloadError):
            module.validate_records([row("x", municipality="99999")])
        incomplete = row("x")
        del incomplete["hog027"]
        with self.assertRaises(module.DownloadError):
            module.validate_records([incomplete])

    def test_transient_failure_is_retried_with_bounded_attempts(self):
        calls = []

        def transport(url, timeout):
            calls.append(url)
            if len(calls) < 3:
                return type("Failure", (), {"status": 503, "read": lambda self: b""})()
            return Response([])

        with patch.object(module.time, "sleep") as sleep:
            self.assertEqual(module.fetch_records(retries=3, transport=transport), [])
        self.assertEqual(len(calls), 3)
        self.assertEqual(sleep.call_count, 2)

    def test_non_transient_failure_is_not_retried(self):
        calls = []

        def transport(url, timeout):
            calls.append(url)
            return type("Failure", (), {"status": 400, "read": lambda self: b""})()

        with self.assertRaises(module.DownloadError):
            module.fetch_records(retries=3, transport=transport)
        self.assertEqual(len(calls), 1)


if __name__ == "__main__":
    unittest.main()
