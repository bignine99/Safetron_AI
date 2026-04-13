import json
import os
import pymysql
from dotenv import load_dotenv

# Load ENV from .env.local
load_dotenv('dashboard/.env.local')

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DATABASE")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))

JSONL_PATH = os.path.join('.raw_data', 'knowledge_graph_ontology.jsonl')
DASHBOARD_JSON_PATH = os.path.join('.raw_data', 'dashboard_data.json')

def main():
    print(f"Connecting to MySQL ({MYSQL_HOST})...")
    conn = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        port=MYSQL_PORT,
        charset='utf8mb4'
    )
    cursor = conn.cursor()
    
    # Create tables
    print("Dropping old tables if they exist...")
    cursor.execute("DROP TABLE IF EXISTS edges;")
    cursor.execute("DROP TABLE IF EXISTS nodes;")
    
    print("Creating tables `nodes` and `edges`...")
    cursor.execute("""
        CREATE TABLE nodes (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(512),
            label VARCHAR(100),
            metadata JSON
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)
    
    cursor.execute("""
        CREATE TABLE edges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            source VARCHAR(255),
            target VARCHAR(255),
            type VARCHAR(100),
            FOREIGN KEY (source) REFERENCES nodes(id) ON DELETE CASCADE,
            FOREIGN KEY (target) REFERENCES nodes(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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

    print("Processing ontology JSONL for Nodes & Edges...")
    count = 0
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
            
            count += 1
            if count % 10000 == 0:
                print(f"Parsed {count} JSONL lines to memory...")

    # Batch insert
    print(f"Inserting {len(nodes)} nodes into MySQL...")
    node_data_list = [(id, val[0], val[1], val[2]) for id, val in nodes.items()]
    
    # Inserting nodes in batches of 5000 to prevent 'max_allowed_packet' error
    batch_size = 5000
    for i in range(0, len(node_data_list), batch_size):
        batch = node_data_list[i:i+batch_size]
        cursor.executemany("INSERT INTO nodes (id, name, label, metadata) VALUES (%s, %s, %s, %s)", batch)
        conn.commit()
        print(f"Inserted nodes up to {min(i+batch_size, len(node_data_list))}")

    print(f"Inserting {len(edges)} edges into MySQL...")
    for i in range(0, len(edges), batch_size):
        batch = edges[i:i+batch_size]
        cursor.executemany("INSERT INTO edges (source, target, type) VALUES (%s, %s, %s)", batch)
        conn.commit()
        print(f"Inserted edges up to {min(i+batch_size, len(edges))}")
    
    conn.close()
    print("Graph ingestion completely transferred to MySQL!")

if __name__ == "__main__":
    main()
