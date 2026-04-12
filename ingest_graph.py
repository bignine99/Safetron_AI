import json
import sqlite3
import os

JSONL_PATH = os.path.join('.raw_data', 'knowledge_graph_ontology.jsonl')
DASHBOARD_JSON_PATH = os.path.join('.raw_data', 'dashboard_data.json')
DB_PATH = os.path.join('dashboard', 'src', 'data', 'safety_graph.db')

def main():
    if not os.path.exists(os.path.dirname(DB_PATH)):
        os.makedirs(os.path.dirname(DB_PATH))
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("DROP TABLE IF EXISTS nodes")
    cursor.execute("DROP TABLE IF EXISTS edges")
    
    cursor.execute("""
        CREATE TABLE nodes (
            id TEXT PRIMARY KEY,
            name TEXT,
            label TEXT,
            metadata TEXT
        )
    """)
    
    cursor.execute("""
        CREATE TABLE edges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT,
            target TEXT,
            type TEXT
        )
    """)
    
    nodes = {}
    edges = []
    
    def add_node(id, name, label, meta={}):
        if id not in nodes:
            nodes[id] = (name, label, json.dumps(meta, ensure_ascii=False))
            
    def add_edge(source, target, type):
        edges.append((source, target, type))

    print("Loading dashboard data for companies...")
    with open(DASHBOARD_JSON_PATH, 'r', encoding='utf-8') as f:
        dash_data = json.load(f)
    
    accident_to_company = {item['고유코드']: item['시공회사명'] for item in dash_data}
    companies = set(item['시공회사명'] for item in dash_data)
    
    for co in companies:
        add_node(f"CO_{co}", co, "Company")

    print("Processing ontology JSONL...")
    with open(JSONL_PATH, 'r', encoding='utf-8-sig') as f:
        for line in f:
            item = json.loads(line)
            acc_id = item['고유코드']
            ont = item['ontology']
            
            # Add Accident Node
            add_node(acc_id, f"Accident {acc_id}", "Accident", {
                "cause": ont.get("사고원인", ""),
                "action": ont.get("사고발생후조치", ""),
                "prevention": ont.get("재발방지대책", "")
            })
            
            # Link to Company
            co_name = accident_to_company.get(acc_id)
            if co_name:
                add_edge(acc_id, f"CO_{co_name}", "MANAGED_BY")
            
            # Agent nodes
            for agent in ont.get("누가", []):
                agent_id = f"AGENT_{agent}"
                add_node(agent_id, agent, "Agent")
                add_edge(acc_id, agent_id, "INVOLVED_AGENT")
                
            # Location nodes
            for loc in ont.get("어디서", []):
                loc_id = f"LOC_{loc}"
                add_node(loc_id, loc, "Location")
                add_edge(acc_id, loc_id, "OCCURRED_AT")
                
            # Object nodes
            for obj in ont.get("무엇때문에", []):
                obj_id = f"OBJ_{obj}"
                add_node(obj_id, obj, "Component")
                add_edge(acc_id, obj_id, "INVOLVES_OBJECT")
                
            # Result nodes
            res = ont.get("사고결과", {}).get("유형")
            if res:
                res_id = f"TYPE_{res}"
                add_node(res_id, res, "AccidentType")
                add_edge(acc_id, res_id, "RESULTED_IN")

    # Batch insert
    print(f"Inserting {len(nodes)} nodes and {len(edges)} edges into SQLite...")
    cursor.executemany("INSERT INTO nodes (id, name, label, metadata) VALUES (?, ?, ?, ?)", 
                       [(id, val[0], val[1], val[2]) for id, val in nodes.items()])
    cursor.executemany("INSERT INTO edges (source, target, type) VALUES (?, ?, ?)", edges)
    
    conn.commit()
    conn.close()
    print("Graph ingestion complete.")

if __name__ == "__main__":
    main()
