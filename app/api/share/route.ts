// API route for creating share tokens
import { NextRequest, NextResponse } from 'next/server';
import { createShareToken } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { deckId } = await request.json();

    if (!deckId) {
      return NextResponse.json(
        { error: 'deckId is required' },
        { status: 400 }
      );
    }

    const shareToken = await createShareToken(deckId);

    return NextResponse.json({
      token: shareToken.token,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/share/${shareToken.token}`,
    });
  } catch (error) {
    console.error('Error creating share token:', error);
    return NextResponse.json(
      { error: 'Failed to create share token' },
      { status: 500 }
    );
  }
}
