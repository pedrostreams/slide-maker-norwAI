// API route for deck management
import { NextRequest, NextResponse } from 'next/server';
import { createDeck, listDecks } from '@/lib/storage';

// GET - List all decks
export async function GET() {
  try {
    const decks = await listDecks();
    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Error listing decks:', error);
    return NextResponse.json(
      { error: 'Failed to list decks' },
      { status: 500 }
    );
  }
}

// POST - Create new deck
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const deckId = await createDeck(title.trim());

    return NextResponse.json({ deckId, success: true });
  } catch (error) {
    console.error('Error creating deck:', error);
    return NextResponse.json(
      { error: 'Failed to create deck' },
      { status: 500 }
    );
  }
}
