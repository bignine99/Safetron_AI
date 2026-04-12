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
    // Use deep exploration by default (depth=2)
    // For simple 1-hop, pass depth=1
    const graph = depth >= 2
      ? getDeepSubGraph(nodeId, depth, maxAccidents)
      : getSubGraph(nodeId, maxAccidents);
    return NextResponse.json(graph);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
