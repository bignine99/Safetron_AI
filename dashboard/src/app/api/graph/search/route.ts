import { NextResponse } from 'next/server';
import { searchEntities } from '@/lib/graph';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json({ nodes: [] });
  }
  
  try {
    const nodes = searchEntities(q);
    return NextResponse.json({ nodes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
