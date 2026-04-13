import mysql from 'mysql2/promise';

// Create a connection pool for MySQL (NCP DB)
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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
  const [rows] = await pool.query(
    `SELECT * FROM nodes 
    WHERE name LIKE ? OR id LIKE ? 
    LIMIT ?`,
    [`%${query}%`, `%${query}%`, limit]
  );
  return rows as Node[];
}

export async function getNeighbors(nodeId: string) {
  const [rows] = await pool.query(
    `SELECT n.*, e.type as relation_type, e.source, e.target
    FROM nodes n
    JOIN edges e ON (e.source = n.id OR e.target = n.id)
    WHERE (e.source = ? OR e.target = ?)
    AND n.id != ?
    LIMIT 100`,
    [nodeId, nodeId, nodeId]
  );
  return rows;
}

/**
 * 1-hop subgraph: direct neighbors of a node.
 * maxEdges controls how many edges to fetch (default 150).
 */
export async function getSubGraph(nodeId: string, maxEdges = 150) {
    const [countResult]: any = await pool.query(
        `SELECT COUNT(*) as cnt FROM edges WHERE source = ? OR target = ?`,
        [nodeId, nodeId]
    );
    
    const totalEdges = countResult[0].cnt;
    
    let edges: Edge[];
    if (totalEdges > maxEdges) {
        const [rows] = await pool.query(`
            SELECT * FROM edges 
            WHERE source = ? OR target = ? 
            ORDER BY RAND() 
            LIMIT ?
        `, [nodeId, nodeId, maxEdges]);
        edges = rows as Edge[];
    } else {
        const [rows] = await pool.query(
            `SELECT * FROM edges WHERE source = ? OR target = ?`,
            [nodeId, nodeId]
        );
        edges = rows as Edge[];
    }
    
    let visitedNodes = new Set<string>([nodeId]);
    edges.forEach(e => {
        visitedNodes.add(e.source);
        visitedNodes.add(e.target);
    });
    
    const nodeList = Array.from(visitedNodes);
    const placeholders = nodeList.map(() => '?').join(',');
    const [nodes] = await pool.query(
        `SELECT * FROM nodes WHERE id IN (${placeholders})`,
        nodeList
    );
    
    return { nodes: nodes as Node[], edges, totalEdges };
}

/**
 * 2-hop deep exploration: starts from a center node,
 * fetches direct neighbors, then fetches THEIR non-Accident neighbors
 * to reveal Companies, Agents, Locations, Components linked through accidents.
 */
export async function getDeepSubGraph(
    nodeId: string,
    depth: number = 2,
    maxAccidents: number = 30
) {
    // ── Hop 1: Get accident nodes linked to this center node ──
    const [hop1Rows] = await pool.query(`
        SELECT * FROM edges 
        WHERE source = ? OR target = ?
        ORDER BY RAND()
        LIMIT ?
    `, [nodeId, nodeId, maxAccidents]);
    
    const hop1Edges = hop1Rows as Edge[];
    
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
        
        const [hop2Rows] = await pool.query(`
            SELECT * FROM edges 
            WHERE source IN (${accPlaceholders})
            AND target != ?
        `, [...accList, nodeId]);
        
        const hop2Edges = hop2Rows as Edge[];
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
        const [nodes] = await pool.query(
            `SELECT * FROM nodes WHERE id IN (${nodePlaceholders})`,
            nodeList
        );
        nodesArr = nodes as Node[];
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
    const [nodeCntRows]: any = await pool.query('SELECT COUNT(*) as cnt FROM nodes');
    const [edgeCntRows]: any = await pool.query('SELECT COUNT(*) as cnt FROM edges');
    const [labelDistRows] = await pool.query('SELECT label, COUNT(*) as cnt FROM nodes GROUP BY label ORDER BY cnt DESC');
    
    return { 
        nodeCount: nodeCntRows[0].cnt, 
        edgeCount: edgeCntRows[0].cnt, 
        labelDist: labelDistRows 
    };
}
