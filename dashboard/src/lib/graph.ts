import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/safety_graph.db');

export function getDb() {
  return new Database(DB_PATH);
}

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

export function searchEntities(query: string, limit = 20) {
  const db = getDb();
  const results = db.prepare(`
    SELECT * FROM nodes 
    WHERE name LIKE ? OR id LIKE ? 
    LIMIT ?
  `).all(`%${query}%`, `%${query}%`, limit) as Node[];
  db.close();
  return results;
}

export function getNeighbors(nodeId: string) {
  const db = getDb();
  const neighbors = db.prepare(`
    SELECT n.*, e.type as relation_type, e.source, e.target
    FROM nodes n
    JOIN edges e ON (e.source = n.id OR e.target = n.id)
    WHERE (e.source = ? OR e.target = ?)
    AND n.id != ?
    LIMIT 100
  `).all(nodeId, nodeId, nodeId);
  db.close();
  return neighbors;
}

/**
 * 1-hop subgraph: direct neighbors of a node.
 * maxEdges controls how many edges to fetch (default 150).
 */
export function getSubGraph(nodeId: string, maxEdges = 150) {
    const db = getDb();
    
    const countResult = db.prepare(
        `SELECT COUNT(*) as cnt FROM edges WHERE source = ? OR target = ?`
    ).get(nodeId, nodeId) as any;
    
    const totalEdges = countResult.cnt;
    
    let edges: Edge[];
    if (totalEdges > maxEdges) {
        edges = db.prepare(`
            SELECT * FROM edges 
            WHERE source = ? OR target = ? 
            ORDER BY RANDOM() 
            LIMIT ?
        `).all(nodeId, nodeId, maxEdges) as Edge[];
    } else {
        edges = db.prepare(
            `SELECT * FROM edges WHERE source = ? OR target = ?`
        ).all(nodeId, nodeId) as Edge[];
    }
    
    let visitedNodes = new Set([nodeId]);
    edges.forEach(e => {
        visitedNodes.add(e.source);
        visitedNodes.add(e.target);
    });
    
    const placeholders = Array.from(visitedNodes).map(() => '?').join(',');
    const nodes = db.prepare(
        `SELECT * FROM nodes WHERE id IN (${placeholders})`
    ).all(...Array.from(visitedNodes)) as Node[];
    
    db.close();
    return { nodes, edges, totalEdges };
}

/**
 * 2-hop deep exploration: starts from a center node,
 * fetches direct neighbors, then fetches THEIR non-Accident neighbors
 * to reveal Companies, Agents, Locations, Components linked through accidents.
 *
 * This produces a rich multi-layer graph showing:
 *   AccidentType → Accidents → [Companies, Agents, Locations, Components]
 *
 * @param depth - 1 for standard, 2 for deep exploration
 * @param maxAccidents - max accident nodes to include per hop
 */
export function getDeepSubGraph(
    nodeId: string,
    depth: number = 2,
    maxAccidents: number = 30
) {
    const db = getDb();
    
    // ── Hop 1: Get accident nodes linked to this center node ──
    const hop1Edges = db.prepare(`
        SELECT * FROM edges 
        WHERE source = ? OR target = ?
        ORDER BY RANDOM()
        LIMIT ?
    `).all(nodeId, nodeId, maxAccidents) as Edge[];
    
    const allEdges: Edge[] = [...hop1Edges];
    const visitedNodes = new Set<string>([nodeId]);
    const accidentNodes = new Set<string>();
    
    hop1Edges.forEach(e => {
        visitedNodes.add(e.source);
        visitedNodes.add(e.target);
        // Identify which side is the accident
        const other = e.source === nodeId ? e.target : e.source;
        accidentNodes.add(other);
    });
    
    // ── Hop 2: For each accident, get its related entities ──
    if (depth >= 2 && accidentNodes.size > 0) {
        const accList = Array.from(accidentNodes);
        const accPlaceholders = accList.map(() => '?').join(',');
        
        const hop2Edges = db.prepare(`
            SELECT * FROM edges 
            WHERE source IN (${accPlaceholders})
            AND target != ?
        `).all(...accList, nodeId) as Edge[];
        
        hop2Edges.forEach(e => {
            allEdges.push(e);
            visitedNodes.add(e.source);
            visitedNodes.add(e.target);
        });
    }
    
    // ── Fetch all node records ──
    const nodeList = Array.from(visitedNodes);
    const nodePlaceholders = nodeList.map(() => '?').join(',');
    const nodes = db.prepare(
        `SELECT * FROM nodes WHERE id IN (${nodePlaceholders})`
    ).all(...nodeList) as Node[];
    
    // ── Aggregate stats for the summary ──
    const labelCounts: Record<string, number> = {};
    nodes.forEach(n => {
        labelCounts[n.label] = (labelCounts[n.label] || 0) + 1;
    });
    
    db.close();
    return {
        nodes,
        edges: allEdges,
        totalEdges: allEdges.length,
        stats: {
            labelCounts,
            depth,
            accidentCount: accidentNodes.size,
        }
    };
}

export function getGraphStats() {
    const db = getDb();
    const nodeCount = (db.prepare('SELECT COUNT(*) as cnt FROM nodes').get() as any).cnt;
    const edgeCount = (db.prepare('SELECT COUNT(*) as cnt FROM edges').get() as any).cnt;
    const labelDist = db.prepare('SELECT label, COUNT(*) as cnt FROM nodes GROUP BY label ORDER BY cnt DESC').all();
    db.close();
    return { nodeCount, edgeCount, labelDist };
}
