import { NextRequest, NextResponse } from 'next/server';
import { saveGlobalSettings } from '@/lib/storage';
import type { ThemeConfig } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const settings: ThemeConfig = await request.json();
    await saveGlobalSettings(settings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving global settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
