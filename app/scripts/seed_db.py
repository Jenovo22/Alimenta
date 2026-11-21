#!/usr/bin/env python3
"""Script to seed the donations database with synthetic data."""

import sys
import os

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database.seed import seed_database


if __name__ == "__main__":
    db_path = "sqlite:///./donations.db"
    if len(sys.argv) > 1:
        db_path = sys.argv[1]
    
    print(f"Seeding database at: {db_path}")
    success = seed_database(db_path)
    sys.exit(0 if success else 1)