// API route for individual deck operations
import { NextRequest, NextResponse } from 'next/server';
import { deleteDeck, getDeck } from '@/lib/storage';

// GET - Get single deck
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deck = await getDeck(id);

    if (!deck) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ deck });
  } catch (error) {
    console.error('Error getting deck:', error);
    return NextResponse.json(
      { error: 'Failed to get deck' },
      { status: 500 }
    );
  }
}

// DELETE - Delete deck
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDeck(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deck:', error);
    return NextResponse.json(
      { error: 'Failed to delete deck' },
      { status: 500 }
    );
  }
}
