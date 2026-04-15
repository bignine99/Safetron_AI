import Database from 'better-sqlite3';
import path from 'path';

// Setup SQLite Database connection
const dbPath = path.join(process.cwd(), 'src', 'data', 'safety_graph.db');
const db = new Database(dbPath, { readonly: true });

// Provide a mock Promise-based pool interface for backward compatibility with route.ts
export const pool = {
  query: async (sql: string, params: any[] = []) => {
    try {
      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      return [rows];
    } catch (e: any) {
      console.error('Mock pool query error:', e);
      throw e;
    }
  }
};

export interface Node {
  id: string;
  name: string;
  label: string;
  metadata: string;
}

export interface Edge {
  source: string;
  target: string;
  type: string;
}

export async function searchEntities(query: string, limit = 20) {
  const stmt = db.prepare(`SELECT * FROM nodes WHERE name LIKE ? OR id LIKE ? LIMIT ?`);
  return stmt.all(`%${query}%`, `%${query}%`, limit) as Node[];
}

export async function getNeighbors(nodeId: string) {
  const stmt = db.prepare(`
    SELECT n.*, e.type as relation_type, e.source, e.target
    FROM nodes n
    JOIN edges e ON (e.source = n.id OR e.target = n.id)
    WHERE (e.source = ? OR e.target = ?)
    AND n.id != ?
    LIMIT 100
  `);
  return stmt.all(nodeId, nodeId, nodeId);
}

/**
 * 1-hop subgraph: direct neighbors of a node.
 * maxEdges controls how many edges to fetch (default 150).
 */
export async function getSubGraph(nodeId: string, maxEdges = 150) {
    const countStmt = db.prepare(`SELECT COUNT(*) as cnt FROM edges WHERE source = ? OR target = ?`);
    const countResult = countStmt.all(nodeId, nodeId) as any[];
    const totalEdges = countResult[0].cnt;
    
    let edges: Edge[];
    if (totalEdges > maxEdges) {
        const stmt = db.prepare(`
            SELECT * FROM edges 
            WHERE source = ? OR target = ? 
            ORDER BY RANDOM() 
            LIMIT ?
        `);
        edges = stmt.all(nodeId, nodeId, maxEdges) as Edge[];
    } else {
        const stmt = db.prepare(`SELECT * FROM edges WHERE source = ? OR target = ?`);
        edges = stmt.all(nodeId, nodeId) as Edge[];
    }
    
    let visitedNodes = new Set<string>([nodeId]);
    edges.forEach(e => {
        visitedNodes.add(e.source);
        visitedNodes.add(e.target);
    });
    
    const nodeList = Array.from(visitedNodes);
    let nodesArr: Node[] = [];
    if (nodeList.length > 0) {
        const placeholders = nodeList.map(() => '?').join(',');
        const stmt = db.prepare(`SELECT * FROM nodes WHERE id IN (${placeholders})`);
        nodesArr = stmt.all(...nodeList) as Node[];
    }
    
    return { nodes: nodesArr, edges, totalEdges };
}

/**
 * 2-hop deep exploration.
 */
export async function getDeepSubGraph(
    nodeId: string,
    depth: number = 2,
    maxAccidents: number = 30
) {
    // ── Hop 1: Get accident nodes linked to this center node ──
    const stmt1 = db.prepare(`
        SELECT * FROM edges 
        WHERE source = ? OR target = ?
        ORDER BY RANDOM()
        LIMIT ?
    `);
    const hop1Edges = stmt1.all(nodeId, nodeId, maxAccidents) as Edge[];
    
    const allEdges: Edge[] = [...hop1Edges];
    const visitedNodes = new Set<string>([nodeId]);
    const accidentNodes = new Set<string>();
    
    hop1Edges.forEach(e => {
        visitedNodes.add(e.source);
        visitedNodes.add(e.target);
        const other = e.source === nodeId ? e.target : e.source;
        accidentNodes.add(other);
    });
    
    // ── Hop 2: For each accident, get its related entities ──
    if (depth >= 2 && accidentNodes.size > 0) {
        const accList = Array.from(accidentNodes);
        const accPlaceholders = accList.map(() => '?').join(',');
        
        const stmt2 = db.prepare(`
            SELECT * FROM edges 
            WHERE source IN (${accPlaceholders})
            AND target != ?
        `);
        const hop2Edges = stmt2.all(...accList, nodeId) as Edge[];
        
        hop2Edges.forEach(e => {
            allEdges.push(e);
            visitedNodes.add(e.source);
            visitedNodes.add(e.target);
        });
    }
    
    // ── Fetch all node records ──
    const nodeList = Array.from(visitedNodes);
    let nodesArr: Node[] = [];
    if (nodeList.length > 0) {
        const nodePlaceholders = nodeList.map(() => '?').join(',');
        const stmt3 = db.prepare(`SELECT * FROM nodes WHERE id IN (${nodePlaceholders})`);
        nodesArr = stmt3.all(...nodeList) as Node[];
    }
    
    // ── Aggregate stats for the summary ──
    const labelCounts: Record<string, number> = {};
    nodesArr.forEach(n => {
        labelCounts[n.label] = (labelCounts[n.label] || 0) + 1;
    });
    
    return {
        nodes: nodesArr,
        edges: allEdges,
        totalEdges: allEdges.length,
        stats: {
            labelCounts,
            depth,
            accidentCount: accidentNodes.size,
        }
    };
}

export async function getGraphStats() {
    const nodeCnt = db.prepare('SELECT COUNT(*) as cnt FROM nodes').get() as any;
    const edgeCnt = db.prepare('SELECT COUNT(*) as cnt FROM edges').get() as any;
    const labelDist = db.prepare('SELECT label, COUNT(*) as cnt FROM nodes GROUP BY label ORDER BY cnt DESC').all() as any[];
    
    return { 
        nodeCount: nodeCnt.cnt, 
        edgeCount: edgeCnt.cnt, 
        labelDist: labelDist 
    };
}
