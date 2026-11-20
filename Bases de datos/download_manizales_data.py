#!/usr/bin/env python3
"""Download the authorized Manizales slice of Socrata dataset ab8a-uwf7.

This uses Socrata's public v2 resource endpoint.  The API v3 query URL supplied
for this dataset requires authentication in direct access, so it is not used.
"""

from __future__ import annotations

import argparse
import csv
import json
import time
from pathlib import Path
from typing import Any, Callable, Iterable, Mapping
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

DATASET_ID = "ab8a-uwf7"
BASE_URL = f"https://www.datos.gov.co/resource/{DATASET_ID}.json"
MUNICIPALITY = "17001"
FIELDS = ("cod_mpio", "zona", "llave", "corte", "hogar", "fex") + tuple(
    f"hog{i:03d}" for i in range(1, 28)
)
DEFAULT_PAGE_SIZE = 5000
DEFAULT_TIMEOUT = 30.0
DEFAULT_RETRIES = 3

Transport = Callable[..., Any]


class DownloadError(RuntimeError):
    """Raised when the remote response cannot be downloaded or validated."""


def _is_transient_status(status: int) -> bool:
    return status == 408 or status == 429 or 500 <= status <= 599


def _read_page(url: str, timeout: float, retries: int, transport: Transport) -> list[dict[str, Any]]:
    for attempt in range(retries):
        try:
            response = transport(url, timeout=timeout)
            status = getattr(response, "status", 200)
            if _is_transient_status(status):
                raise DownloadError(f"transient HTTP status {status}")
            if status < 200 or status >= 300:
                raise DownloadError(f"HTTP status {status}")
            payload = response.read()
            data = json.loads(payload.decode("utf-8") if isinstance(payload, bytes) else payload)
            if not isinstance(data, list) or not all(isinstance(row, dict) for row in data):
                raise DownloadError("Socrata response must be a JSON array of objects")
            return data
        except HTTPError as exc:
            if not _is_transient_status(exc.code):
                raise DownloadError(f"HTTP status {exc.code}") from exc
            last_error: Exception = exc
        except DownloadError as exc:
            if not str(exc).startswith("transient HTTP status"):
                raise
            last_error = exc
        except (URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
            last_error = exc
        if attempt + 1 < retries:
            time.sleep(2**attempt)
    raise DownloadError(f"request failed after {retries} attempts: {last_error}")


def validate_records(records: Iterable[Mapping[str, Any]]) -> list[dict[str, Any]]:
    """Validate and normalize records without changing their field set."""
    validated: list[dict[str, Any]] = []
    for index, record in enumerate(records):
        missing = [field for field in FIELDS if field not in record]
        if missing:
            raise DownloadError(f"record {index} is missing required fields: {', '.join(missing)}")
        if str(record["cod_mpio"]) != MUNICIPALITY:
            raise DownloadError(f"record {index} has cod_mpio {record['cod_mpio']!r}, expected {MUNICIPALITY}")
        validated.append({field: record[field] for field in FIELDS})
    return validated


def fetch_records(
    *, page_size: int = DEFAULT_PAGE_SIZE, timeout: float = DEFAULT_TIMEOUT,
    retries: int = DEFAULT_RETRIES, transport: Transport | None = None,
) -> list[dict[str, Any]]:
    """Fetch all pages for municipality 17001 using the public resource API."""
    if page_size < 1 or retries < 1:
        raise ValueError("page_size and retries must be positive")
    transport = transport or (lambda url, timeout: urlopen(Request(url), timeout=timeout))
    records: list[Mapping[str, Any]] = []
    offset = 0
    while True:
        query = urlencode({
            "$select": ",".join(FIELDS),
            "$where": f"cod_mpio='{MUNICIPALITY}'",
            "$limit": page_size,
            "$offset": offset,
        })
        page = _read_page(f"{BASE_URL}?{query}", timeout, retries, transport)
        records.extend(page)
        if len(page) < page_size:
            break
        offset += page_size
    # Sorting makes output stable even when the API's page order is not stable.
    return sorted(validate_records(records), key=lambda row: tuple(str(row[field]) for field in FIELDS))


def write_outputs(records: Iterable[Mapping[str, Any]], csv_path: Path, json_path: Path) -> None:
    """Write deterministic UTF-8 CSV and pretty-printed JSON outputs."""
    rows = validate_records(records)
    rows = sorted(rows, key=lambda row: tuple(str(row[field]) for field in FIELDS))
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    with csv_path.open("w", encoding="utf-8", newline="") as output:
        writer = csv.DictWriter(output, fieldnames=FIELDS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    json_path.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path, default=Path("Bases de datos/manizales_17001.csv"))
    parser.add_argument("--json", type=Path, default=Path("Bases de datos/manizales_17001.json"))
    parser.add_argument("--page-size", type=int, default=DEFAULT_PAGE_SIZE)
    parser.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT)
    parser.add_argument("--retries", type=int, default=DEFAULT_RETRIES)
    args = parser.parse_args()
    write_outputs(fetch_records(page_size=args.page_size, timeout=args.timeout, retries=args.retries), args.csv, args.json)
    print(f"Wrote {args.csv} and {args.json}")


if __name__ == "__main__":
    main()
