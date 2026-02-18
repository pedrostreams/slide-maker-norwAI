// API route for adding comments
import { NextRequest, NextResponse } from 'next/server';
import { saveComment } from '@/lib/storage';
import type { Comment } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { deckId } = await params;
    const comment: Comment = await request.json();

    await saveComment(deckId, comment);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving comment:', error);
    return NextResponse.json(
      { error: 'Failed to save comment' },
      { status: 500 }
    );
  }
}
