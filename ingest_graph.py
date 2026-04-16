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
            
            # Support both structure formats depending on parsing result
            ont = item.get('ontology', {})
            meta = item.get('meta', {})
            
            if not isinstance(ont, dict):
                ont = {}
            
            # Ensure string types for lists returned as dicts or list in causes
            cause_val = ont.get("사고원인", [])
            cause_str = ", ".join(cause_val) if isinstance(cause_val, list) else str(cause_val)
            
            # Add Accident Node
            add_node(acc_id, f"Accident {acc_id}", "Accident", {
                "cause": cause_str,
                "action": "",
                "prevention": ""
            })
            
            # Link to Company
            co_name = accident_to_company.get(acc_id)
            if co_name:
                add_edge(acc_id, f"CO_{co_name}", "MANAGED_BY")
            
            # Agent nodes
            agents = ont.get("직책명", [])
            if isinstance(agents, list):
                for agent in agents:
                    if not agent: continue
                    agent_id = f"AGENT_{agent}"
                    add_node(agent_id, agent, "Agent")
                    add_edge(acc_id, agent_id, "INVOLVED_AGENT")
                
            # Location nodes
            spaces = ont.get("사고공간", [])
            if isinstance(spaces, list):
                for loc in spaces:
                    if not loc: continue
                    loc_id = f"LOC_{loc}"
                    add_node(loc_id, loc, "Location")
                    add_edge(acc_id, loc_id, "OCCURRED_AT")
                
            # Object nodes (Component)
            components = []
            if isinstance(ont.get("사고기인물", []), list): components.extend(ont.get("사고기인물", []))
            if isinstance(ont.get("도구", []), list): components.extend(ont.get("도구", []))
            if isinstance(ont.get("장비", []), list): components.extend(ont.get("장비", []))
            for obj in components:
                if not obj: continue
                obj_id = f"OBJ_{obj}"
                add_node(obj_id, obj, "Component")
                add_edge(acc_id, obj_id, "INVOLVES_OBJECT")
                
            # Result nodes / AccidentType
            accident_type = meta.get("사고유형_KOSHA")
            if accident_type:
                res_id = f"TYPE_{accident_type}"
                add_node(res_id, accident_type, "AccidentType")
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
