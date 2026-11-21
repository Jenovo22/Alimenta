import urllib.request
import json

# Test users endpoint
try:
    with urllib.request.urlopen('http://localhost:8000/api/users/') as response:
        data = response.read().decode()
        users = json.loads(data)
        for u in users:
            print(f"ID: {u['id']}, Email: {u['email']}, Role: {u['role']}")
except Exception as e:
    print('Users error:', e)