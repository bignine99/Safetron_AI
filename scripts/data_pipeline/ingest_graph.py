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
            
            # 1. Agent nodes (직책명)
            for agent in ont.get("직책명", []) if isinstance(ont.get("직책명", []), list) else []:
                if not agent: continue
                agent_id = f"AGENT_{agent}"
                add_node(agent_id, agent, "Agent")
                add_edge(acc_id, agent_id, "INVOLVED_AGENT")
                
            # 2. Location nodes (사고공간)
            for loc in ont.get("사고공간", []) if isinstance(ont.get("사고공간", []), list) else []:
                if not loc: continue
                loc_id = f"LOC_{loc}"
                add_node(loc_id, loc, "Location")
                add_edge(acc_id, loc_id, "OCCURRED_AT")
                
            # 3. Component nodes (사고기인물)
            for obj in ont.get("사고기인물", []) if isinstance(ont.get("사고기인물", []), list) else []:
                if not obj: continue
                obj_id = f"COMP_{obj}"
                add_node(obj_id, obj, "Component")
                add_edge(acc_id, obj_id, "INVOLVES_COMPONENT")
                
            # 4. Tool nodes (도구)
            for tool in ont.get("도구", []) if isinstance(ont.get("도구", []), list) else []:
                if not tool: continue
                tool_id = f"TOOL_{tool}"
                add_node(tool_id, tool, "Tool")
                add_edge(acc_id, tool_id, "USED_TOOL")

            # 5. Equipment nodes (장비)
            for eq in ont.get("장비", []) if isinstance(ont.get("장비", []), list) else []:
                if not eq: continue
                eq_id = f"EQ_{eq}"
                add_node(eq_id, eq, "Equipment")
                add_edge(acc_id, eq_id, "USED_EQUIPMENT")

            # 6. Task nodes (작업)
            for task in ont.get("작업", []) if isinstance(ont.get("작업", []), list) else []:
                if not task: continue
                task_id = f"TASK_{task}"
                add_node(task_id, task, "Task")
                add_edge(acc_id, task_id, "DURING_TASK")

            # 7. Cause nodes (사고원인)
            for cause in ont.get("사고원인", []) if isinstance(ont.get("사고원인", []), list) else []:
                if not cause: continue
                cause_id = f"CAUSE_{cause}"
                add_node(cause_id, cause, "Cause")
                add_edge(acc_id, cause_id, "CAUSED_BY")

            # 8. BodyPart nodes (신체부위)
            for body in ont.get("신체부위", []) if isinstance(ont.get("신체부위", []), list) else []:
                if not body: continue
                body_id = f"BODY_{body}"
                add_node(body_id, body, "BodyPart")
                add_edge(acc_id, body_id, "INJURED_BODY_PART")
                
            # 9. Result nodes / AccidentType (의학적유형 or KOSHA)
            # Use KOSHA type as primary AccidentType
            accident_type = meta.get("사고유형_KOSHA")
            if accident_type:
                res_id = f"TYPE_{accident_type}"
                add_node(res_id, accident_type, "AccidentType")
                add_edge(acc_id, res_id, "RESULTED_IN")

            # Parse 의학적유형 if available into Result nodes
            results = ont.get("사고결과", {})
            if isinstance(results, dict):
                med_types = results.get("의학적유형", [])
                if isinstance(med_types, list):
                    for med in med_types:
                        if not med: continue
                        med_id = f"MED_{med}"
                        add_node(med_id, med, "Result")
                        add_edge(acc_id, med_id, "MEDICAL_RESULT")

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
