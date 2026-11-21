#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('donations.db')
cursor = conn.cursor()
cursor.execute('SELECT id, email, role FROM usuarios')
for row in cursor.fetchall():
    print(f'ID: {row[0]}, Email: {row[1]}, Role: {row[2]}')
conn.close()