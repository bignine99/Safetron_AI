import sqlite3

try:
    conn = sqlite3.connect('dashboard/src/data/safety_graph.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT name FROM nodes WHERE label='AccidentType'")
    types = [r[0] for r in cursor.fetchall()]
    print("ACCIDENT_TYPES:", types)
except Exception as e:
    print(f"Error: {e}")
