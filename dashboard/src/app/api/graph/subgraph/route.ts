import { NextResponse } from 'next/server';
import { getSubGraph, getDeepSubGraph } from '@/lib/graph';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nodeId = searchParams.get('id');
  const depth = parseInt(searchParams.get('depth') || '2');
  const maxAccidents = parseInt(searchParams.get('max') || '30');
  
  if (!nodeId) {
    return NextResponse.json({ error: 'Missing node id' }, { status: 400 });
  }
  
  try {
    console.log(`[GET /api/graph/subgraph] id=${nodeId}, depth=${depth}`);
    const graph = depth >= 2
      ? await getDeepSubGraph(nodeId, depth, maxAccidents)
      : await getSubGraph(nodeId, maxAccidents);
    return NextResponse.json(graph);
  } catch (error: any) {
    console.error("[Subgraph API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
