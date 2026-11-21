#!/usr/bin/env python3
"""Debug script to diagnose FastAPI issues with the actual app."""

import traceback
import sys

# Test importing the app
try:
    from app.main import app
    from fastapi.testclient import TestClient
    
    print("App imported successfully")
    print(f"App title: {app.title}")
    
    client = TestClient(app)
    
    print("\nTesting /health...")
    try:
        response = client.get("/health")
        print(f"  Status: {response.status_code}")
        if response.status_code != 200:
            print(f"  Error body: {response.text}")
        else:
            print(f"  Body: {response.json()}")
    except Exception as e:
        print(f"  Exception: {e}")
        traceback.print_exc()
    
    print("\nTesting /users/...")
    try:
        response = client.get("/users/")
        print(f"  Status: {response.status_code}")
        if response.status_code != 200:
            print(f"  Error body: {response.text[:500]}")
        else:
            print(f"  Body: {response.json()}")
    except Exception as e:
        print(f"  Exception: {e}")
        traceback.print_exc()
    
    print("\nTesting /needs/...")
    try:
        response = client.get("/needs/")
        print(f"  Status: {response.status_code}")
        if response.status_code != 200:
            print(f"  Error body: {response.text[:500]}")
        else:
            print(f"  Body: {response.json()}")
    except Exception as e:
        print(f"  Exception: {e}")
        traceback.print_exc()

except Exception as e:
    print(f"Failed to import app: {e}")
    traceback.print_exc()