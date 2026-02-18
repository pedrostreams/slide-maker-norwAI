// API route for generating and modifying slides using Gemini AI
import { NextRequest, NextResponse } from 'next/server';
import { generateSlides, modifySlide, isGeminiConfigured } from '@/lib/gemini';
import { saveSlides, updateSlide, getConfig, getGlobalSettings } from '@/lib/storage';
import type { GenerateRequest, GenerateResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body: GenerateRequest = await request.json();
    const { prompt, deckId, mode, currentHtml, slideIndex, config } = body;

    // Validate request
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get theme config (from request, deck, or global settings)
    let themeConfig = config || (await getGlobalSettings());
    if (deckId && !config) {
      const deckConfig = await getConfig(deckId);
      if (deckConfig) themeConfig = deckConfig;
    }

    if (mode === 'modify') {
      // Modify existing slide
      if (!deckId || slideIndex === undefined || !currentHtml) {
        return NextResponse.json(
          { success: false, error: 'deckId, slideIndex, and currentHtml required for modify mode' },
          { status: 400 }
        );
      }

      const modifiedHtml = await modifySlide(currentHtml, prompt, themeConfig);
      await updateSlide(deckId, slideIndex, modifiedHtml);

      return NextResponse.json({
        success: true,
        slides: [modifiedHtml],
        slideCount: 1,
      } as GenerateResponse);
    } else {
      // Generate new slides
      if (!deckId) {
        return NextResponse.json(
          { success: false, error: 'deckId required for create mode' },
          { status: 400 }
        );
      }

      const slides = await generateSlides(prompt, themeConfig);
      await saveSlides(deckId, slides);

      return NextResponse.json({
        success: true,
        slides,
        slideCount: slides.length,
      } as GenerateResponse);
    }
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate slides',
      } as GenerateResponse,
      { status: 500 }
    );
  }
}
