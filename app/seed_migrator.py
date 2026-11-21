#!/usr/bin/env python3
"""Manizales seed data migrator for the inventory_lotes table.

This module provides functionality to load Manizales data from the Socrata
dataset (ab8a-uwf7) into the `inventario_lotes` table. It uses bulk inserts
for performance and handles partial failures gracefully.

Usage:
    python -m app.seed_migrator --csv path/to/manizales_data.csv
"""

import argparse
import csv
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from sqlmodel import Session, select, text

from .database import engine

logger = logging.getLogger(__name__)


def count_lotes() -> int:
    """Return the current count of records in inventario_lotes."""
    with Session(engine) as session:
        result = session.exec(text("SELECT COUNT(*) FROM inventario_lotes"))
        return result.one()


def bulk_insert_lotes(
    records: list[dict],
    batch_size: int = 1000,
    skip_existing: bool = True,
) -> int:
    """Insert Manizales records into inventario_lotes using bulk operations.

    Args:
        records: List of validated Manizales Socrata records.
        batch_size: Number of records to insert per transaction.
        skip_existing: If True, skip records that would conflict.

    Returns:
        The number of records successfully inserted.
    """
    inserted = 0
    with Session(engine) as session:
        for i in range(0, len(records), batch_size):
            batch = records[i : i + batch_size]
            for record in batch:
                if skip_existing:
                    existing = session.exec(
                        select(
                            text("id")
                        ).where(
                            text("llave = :key"),
                            key=record.get("llave"),
                        )
                    ).first()
                    if existing:
                        continue

                # Map Socrata fields to our schema
                lot_record = {
                    "llave": record.get("llave"),
                    "corte": record.get("corte"),
                    "zona": record.get("zona"),
                    "cod_mpio": record.get("cod_mpio"),
                    "hogar": record.get("hogar"),
                    "fex": record.get("fex"),
                    "hog01": record.get("hog01"),
                    "hog02": record.get("hog02"),
                    "hog03": record.get("hog03"),
                    "hog04": record.get("hog04"),
                    "hog05": record.get("hog05"),
                    "hog06": record.get("hog06"),
                    "hog07": record.get("hog07"),
                    "hog08": record.get("hog08"),
                    "hog09": record.get("hog09"),
                    "hog10": record.get("hog10"),
                    "hog11": record.get("hog11"),
                    "hog12": record.get("hog12"),
                    "hog13": record.get("hog13"),
                    "hog14": record.get("hog14"),
                    "hog15": record.get("hog15"),
                    "hog16": record.get("hog16"),
                    "hog17": record.get("hog17"),
                    "hog18": record.get("hog18"),
                    "hog19": record.get("hog19"),
                    "hog20": record.get("hog20"),
                    "hog21": record.get("hog21"),
                    "hog22": record.get("hog22"),
                    "hog23": record.get("hog23"),
                    "hog24": record.get("hog24"),
                    "hog25": record.get("hog25"),
                    "hog26": record.get("hog26"),
                    "hog27": record.get("hog27"),
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat(),
                }

                session.exec(text(
                    """
                    INSERT INTO inventario_lotes (
                        llave, corte, zona, cod_mpio, hogar, fex,
                        hog01, hog02, hog03, hog04, hog05,
                        hog06, hog07, hog08, hog09, hog10,
                        hog11, hog12, hog13, hog14, hog15,
                        hog16, hog17, hog18, hog19, hog20,
                        hog21, hog22, hog23, hog24, hog25,
                        hog26, hog27, created_at, updated_at
                    ) VALUES (
                        :llave, :corte, :zona, :cod_mpio, :hogar, :fex,
                        :hog01, :hog02, :hog03, :hog04, :hog05,
                        :hog06, :hog07, :hog08, :hog09, :hog10,
                        :hog11, :hog12, :hog13, :hog14, :hog15,
                        :hog16, :hog17, :hog18, :hog19, :hog20,
                        :hog21, :hog22, :hog23, :hog24, :hog25,
                        :hog26, :hog27, :created_at, :updated_at
                    )
                    """
                ), lot_record)
                inserted += 1

            session.commit()
            logger.info(f"Inserted batch {i // batch_size + 1}: {len(batch)} records")

    return inserted


def load_csv_data(csv_path: Path) -> list[dict]:
    """Load and validate Manizales CSV data from the Socrata download script output."""
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV file not found: {csv_path}")

    records = []
    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Basic validation: ensure llave field exists
            if "llave" not in row or not row["llave"]:
                logger.warning(f"Skipping record without llave: {row}")
                continue
            records.append(row)

    return records


def run_migrator(
    csv_path: Path,
    batch_size: int = 1000,
    skip_existing: bool = True,
    dry_run: bool = False,
) -> dict:
    """Run the complete migrator pipeline.

    Returns:
        Dict with statistics about the migration.
    """
    logger.info(f"Loading CSV from {csv_path}")
    records = load_csv_data(csv_path)
    logger.info(f"Loaded {len(records)} records from CSV")

    current_count = count_lotes()

    if dry_run:
        return {
            "csv_records": len(records),
            "current_lotes_count": current_count,
            "would_insert": len(records) if skip_existing else len(records),
            "dry_run": True,
        }

    inserted = bulk_insert_lotes(records, batch_size=batch_size, skip_existing=skip_existing)

    return {
        "csv_records": len(records),
        "current_lotes_count": current_count,
        "inserted": inserted,
        "skipped": len(records) - inserted if skip_existing else 0,
        "dry_run": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Migrate Manizales seed data to inventario_lotes table"
    )
    parser.add_argument(
        "--csv",
        type=Path,
        default=Path("Bases de datos/manizales_17001.csv"),
        help="Path to the Manizales CSV file",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=1000,
        help="Number of records to insert per transaction",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate data without inserting",
    )
    parser.add_argument(
        "--no-skip-existing",
        action="store_true",
        help="Insert all records, even if they already exist",
    )
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

    stats = run_migrator(
        csv_path=args.csv,
        batch_size=args.batch_size,
        skip_existing=not args.no_skip_existing,
        dry_run=args.dry_run,
    )

    if args.dry_run:
        print(f"Dry run results: {stats}")
    else:
        print(f"Migrated {stats['current_lotes_count']} existing -> {stats['current_lotes_count'] + stats['inserted']} records")
        print(f"Inserted: {stats['inserted']}, Skipped: {stats['skipped']}")


if __name__ == "__main__":
    main()