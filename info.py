import sqlite3
import glob
import os
import pandas as pd

print("=== SQLite Database Info ===")
try:
    conn = sqlite3.connect('safety_graph.db')
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cur.fetchall()
    
    total_nodes = 0
    for t in tables:
        table_name = t[0]
        count = conn.execute(f"SELECT count(*) FROM {table_name}").fetchone()[0]
        print(f"Table {table_name}: {count} rows")
        
        # If it has nodes or similar, let's keep track
except Exception as e:
    print("SQLite Error:", e)

print("\n=== Finding CSVs ===")
csvs = []
for root, _, files in os.walk('.'):
    for f in files:
        if ('06' in f or '07' in f) and f.endswith('.csv'):
            csvs.append(os.path.join(root, f))
            
for c in csvs:
    try:
        df = pd.read_csv(c)
        print(f"{c}")
        print(f"  Rows: {len(df):,}")
        print(f"  Columns: {len(df.columns):,}")
        print(f"  Cells (Data points): {df.size:,}")
    except Exception as e:
        print(f"Error reading {c}: {e}")
