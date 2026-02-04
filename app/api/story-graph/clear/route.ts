/**
 * POST /api/story-graph/clear
 * 
 * Clears all graph data from Neo4j
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearGraph } from '@/lib/agents/story-knowledge-graph';

export async function POST(request: NextRequest) {
  try {
    await clearGraph();

    return NextResponse.json({
      success: true,
      message: 'Graph data cleared successfully'
    });
  } catch (error) {
    console.error('Clear graph error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clear graph',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
