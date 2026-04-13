import json
import os
import time
from tqdm import tqdm
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

# Load ENV from .env.local
load_dotenv('dashboard/.env.local')
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in dashboard/.env.local")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)

JSONL_PATH = os.path.join('.raw_data', 'knowledge_graph_ontology.jsonl')
DASHBOARD_JSON_PATH = os.path.join('.raw_data', 'dashboard_data.json')
CHROMA_DB_PATH = os.path.join('dashboard', 'src', 'data', 'chroma_db')

print("Loading dashboard data for companies...")
with open(DASHBOARD_JSON_PATH, 'r', encoding='utf-8') as f:
    dash_data = json.load(f)

accident_to_company = {item['고유코드']: item['시공회사명'] for item in dash_data}

# Initialize ChromaDB client
print("Initializing ChromaDB...")
if not os.path.exists(os.path.dirname(CHROMA_DB_PATH)):
    os.makedirs(os.path.dirname(CHROMA_DB_PATH), exist_ok=True)
client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = client.get_or_create_collection(name="accidents_hybrid")

# Get existing IDs to skip them
existing_data = collection.get(include=[])
existing_ids = set(existing_data['ids']) if existing_data['ids'] else set()
print(f"Found {len(existing_ids)} existing records in ChromaDB. These will be skipped.")

print("Reading JSONL records...")
records = []
with open(JSONL_PATH, 'r', encoding='utf-8-sig') as f:
    for line in f:
        item = json.loads(line)
        acc_id = item['고유코드']
        
        # Skip if already embedded
        if acc_id in existing_ids:
            continue
            
        ont = item['ontology']
        
        company = accident_to_company.get(acc_id, "알 수 없는 회사")
        loc_str = ", ".join(ont.get("어디서", []))
        agent_str = ", ".join(ont.get("누가", []))
        obj_str = ", ".join(ont.get("무엇때문에", []))
        cause = ont.get("사고원인", "")
        res_type = ont.get("사고결과", {}).get("유형", "")
        
        # Build semantic sentence for embedding
        text_content = f"시공사: {company}\n사고 장소: {loc_str}\n사고 유형: {res_type}\n관계자: {agent_str}\n기인물: {obj_str}\n사고 원인: {cause}"
        
        records.append({
            "id": acc_id,
            "text": text_content,
            "metadata": {
                "company": company,
                "type": res_type
            }
        })

print(f"Remaining records to embed: {len(records)}")

if len(records) == 0:
    print("All records embedded!")
    exit(0)

BATCH_SIZE = 50 

# Using tqdm for progress bar
for i in tqdm(range(0, len(records), BATCH_SIZE)):
    batch = records[i:i+BATCH_SIZE]
    
    batch_texts = [r["text"] for r in batch]
    batch_ids = [r["id"] for r in batch]
    batch_metas = [r["metadata"] for r in batch]
    
    try:
        results = genai.embed_content(
            model="models/text-embedding-004",
            content=batch_texts,
            task_type="retrieval_document"
        )
        batch_embeddings = results['embedding']
        
        collection.add(
            ids=batch_ids,
            embeddings=batch_embeddings,
            documents=batch_texts,
            metadatas=batch_metas
        )
        time.sleep(0.5) # Sleep to avoid rate limits
    except Exception as e:
        print(f"Error at batch {i}: {e}")
        time.sleep(3)
        try:
            results = genai.embed_content(
                model="models/text-embedding-004",
                content=batch_texts,
                task_type="retrieval_document"
            )
            batch_embeddings = results['embedding']
            collection.add(
                ids=batch_ids,
                embeddings=batch_embeddings,
                documents=batch_texts,
                metadatas=batch_metas
            )
        except Exception as e2:
            print(f"Failed again at batch {i}: {e2}")

print("ChromaDB Embedding & Storing Complete!")
