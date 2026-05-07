import sqlite3
import json

conn = sqlite3.connect('dashboard/src/data/safety_graph.db')
c = conn.cursor()

cats = [r[0] for r in c.execute("SELECT DISTINCT name FROM nodes WHERE label='Category'").fetchall()]
procs = [r[0] for r in c.execute("SELECT DISTINCT name FROM nodes WHERE label='Process'").fetchall()]

print(json.dumps({'cats': cats, 'procs': procs}, ensure_ascii=False, indent=2))
