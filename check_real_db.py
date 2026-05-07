import sqlite3

db_path = r'C:\Users\cho\Desktop\Temp\05_1_code\260410_safety_dashboard\dashboard\src\data\safety_graph.db'
try:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM nodes")
    print(f"Nodes: {cur.fetchone()[0]:,}")
    cur.execute("SELECT count(*) FROM edges")
    print(f"Edges: {cur.fetchone()[0]:,}")
except Exception as e:
    print(f"DB Error: {e}")
