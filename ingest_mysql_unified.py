import json
import os
import pymysql
from dotenv import load_dotenv

# Load ENV from .env.local
load_dotenv('dashboard/.env.local')

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER", "safetron")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DATABASE", "safety_graph")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))

JSONL_PATH = os.path.join('.raw_data', 'knowledge_graph_ontology.jsonl')

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

    print("Processing unified JSONL for Nodes & Edges...")
    count = 0
    if not os.path.exists(JSONL_PATH):
        print(f"Error: {JSONL_PATH} not found. Please run the AI extraction script first.")
        return

    with open(JSONL_PATH, 'r', encoding='utf-8-sig') as f:
        for line in f:
            if not line.strip(): continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue
                
            acc_id = item['고유코드']
            meta = item.get('meta', {})
            ont = item.get('ontology', {})
            raw_t = item.get('raw_text', {})
            
            # 1. Company Node
            co_name = meta.get("시공회사명")
            if co_name:
                co_id = f"CO_{co_name}"
                add_node(co_id, co_name, "Company", {
                    "신용등급": meta.get("신용등급", ""),
                    "산업재해율": float(meta.get("산업재해율", 0)),
                    "안전관리비_투자비율": float(meta.get("안전관리비_투자비율", 0)),
                    "보험료_등급": meta.get("보험료_등급", ""),
                    "분류": meta.get("공사_분류", "")
                })
            else:
                co_id = None
                
            # 2. Accident Node
            add_node(acc_id, f"Accident {acc_id}", "Accident", {
                "raw_narrative": raw_t.get("사고경위", ""),
                "detail_cause": raw_t.get("구체적사고원인", ""),
                "damage": raw_t.get("피해내용", ""),
                "meta_kosha": meta.get("사고유형_KOSHA", ""),
                "meta_process": meta.get("작업프로세스", ""),
                "severity": ont.get("사고결과", {}).get("심각도", ""),
                "deaths": ont.get("사고결과", {}).get("사망", 0),
                "injuries": ont.get("사고결과", {}).get("부상", 0)
            })
            
            # Accident -> Company Edge
            if co_id:
                add_edge(acc_id, co_id, "MANAGED_BY")
            
            # 3. 9-Class Entities Extraction
            def process_class(ontology_key, node_prefix, label, edge_type):
                items = ont.get(ontology_key, [])
                if isinstance(items, str): items = [items]
                for x in items:
                    if not x or len(x.strip()) == 0: continue
                    nid = f"{node_prefix}_{x.strip()}"
                    add_node(nid, x.strip(), label)
                    add_edge(acc_id, nid, edge_type)

            process_class("직책명", "JOB", "JobTitle", "INVOLVED_JOB")
            process_class("도구", "TOOL", "Tool", "USED_TOOL")
            process_class("장비", "EQ", "Equipment", "USED_EQUIPMENT")
            process_class("작업", "ACT", "Activity", "DURING_ACTIVITY")
            process_class("사고공간", "LOC", "Location", "OCCURRED_AT")
            process_class("사고기인물", "OBJ", "CausalObject", "CAUSED_BY_OBJECT")
            process_class("사고원인", "CU", "Cause", "CAUSED_BY_REASON")
            process_class("신체부위", "BODY", "BodyPart", "INJURED_BODY_PART")
            
            # Outcomes are within a nested dictionary
            out_types = ont.get("사고결과", {}).get("의학적유형", [])
            for x in out_types:
                if not x or len(x.strip()) == 0: continue
                nid = f"OUT_{x.strip()}"
                add_node(nid, x.strip(), "OutcomeType")
                add_edge(acc_id, nid, "RESULTED_IN")

            count += 1
            if count % 5000 == 0:
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
    print("Graph ingestion completely transferred to MySQL (Unified 9-Class + Meta)!")

if __name__ == "__main__":
    main()
