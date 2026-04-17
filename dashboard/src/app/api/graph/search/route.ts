import { NextResponse } from 'next/server';
import { searchEntities } from '@/lib/graph';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ nodes: [] });
  }
  
  try {
    console.log(`[GET /api/graph/search] q=${q}`);
    const nodes = await searchEntities(q);
    return NextResponse.json({ nodes });
  } catch (error: any) {
    console.error("[Search API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
