#!/usr/bin/env python3
"""Debug script to diagnose FastAPI issues."""

from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI(title="Test API")

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/test")
def test_endpoint():
    return {"message": "test"}

if __name__ == "__main__":
    # Test with test client
    client = TestClient(app)
    
    print("Testing /health...")
    response = client.get("/health")
    print(f"  Status: {response.status_code}")
    print(f"  Body: {response.json()}")
    
    print("\nTesting /test...")
    response = client.get("/test")
    print(f"  Status: {response.status_code}")
    print(f"  Body: {response.json()}")
    
    print("\nAll tests passed!")