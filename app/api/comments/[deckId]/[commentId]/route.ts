// API route for updating a specific comment
import { NextRequest, NextResponse } from 'next/server';
import { updateComment } from '@/lib/storage';
import type { Comment } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string; commentId: string }> }
) {
  try {
    const { deckId, commentId } = await params;
    const updates: Partial<Comment> = await request.json();

    await updateComment(deckId, commentId, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}
