// Gemini AI integration for slide generation and modification
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { ThemeConfig } from './types';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Schema for structured output - ensures valid JSON
const slidesSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    slides: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        description: "Complete HTML string for a single slide section"
      },
      description: "Array of HTML slide strings"
    }
  },
  required: ["slides"]
};

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: slidesSchema
  }
});

/**
 * Generate HTML slides from a user prompt
 */
export async function generateSlides(
  prompt: string,
  config: ThemeConfig,
  slideCount?: number
): Promise<string[]> {
  const systemPrompt = buildSlideGenerationPrompt(prompt, config, slideCount);

  try {
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    // Parse the JSON response
    const slides = parseSlideResponse(response);
    return slides;
  } catch (error) {
    console.error('Error generating slides:', error);
    throw new Error('Failed to generate slides');
  }
}

/**
 * Modify an existing slide based on user prompt
 */
export async function modifySlide(
  currentHtml: string,
  prompt: string,
  config: ThemeConfig
): Promise<string> {
  const systemPrompt = buildSlideModificationPrompt(currentHtml, prompt, config);

  try {
    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();

    // Clean up the response (remove markdown code blocks if present)
    return cleanHtmlResponse(response);
  } catch (error) {
    console.error('Error modifying slide:', error);
    throw new Error('Failed to modify slide');
  }
}

/**
 * Build the prompt for slide generation
 */
function buildSlideGenerationPrompt(
  userPrompt: string,
  config: ThemeConfig,
  slideCount?: number
): string {
  const { theme, logo } = config;

  return `You are an expert slide designer for management consulting presentations. Generate professional HTML slides based on the user's request.

THEME CONFIGURATION:
- Primary Color: ${theme.primaryColor}
- Secondary Color: ${theme.secondaryColor}
- Accent Color: ${theme.accentColor}
- Background Color: ${theme.backgroundColor}
- Text Color: ${theme.textColor}
- Font Family: ${theme.fontFamily}
${logo.path ? `- Logo: ${logo.path} (${logo.position}, ${logo.size})` : ''}

USER REQUEST:
${userPrompt}

REQUIREMENTS:
1. Each slide is a <section> element with class "slide" and data-slide attribute
2. Use inline styles within each section for all styling
3. Follow 16:9 aspect ratio - each section should be: width: 100%; height: 100%; position: relative; display: flex; flex-direction: column; justify-content: center; align-items: center;
4. Professional, clean design suitable for consulting presentations
5. Use the theme colors consistently throughout
${logo.path ? '6. Include the logo on each slide at the specified position as an <img> tag with absolute positioning' : ''}
6. Use clear visual hierarchy: large titles, subtitles, body text with appropriate sizing
7. Support common slide types: title slides, content slides with bullet points, comparison layouts, timelines, data visualizations
8. Add appropriate padding and margins (at least 60px padding on all sides)
9. Center content vertically and horizontally when appropriate
10. Use modern, clean typography with appropriate font sizes (titles: 48-72px, body: 24-32px)

OUTPUT:
Generate ${slideCount || '3-8'} slides. Each slide should be a complete HTML string with proper <section> tags.

${slideCount ? `Generate exactly ${slideCount} slides.` : 'Generate an appropriate number of slides (3-8) based on the content.'}`;
}

/**
 * Build the prompt for slide modification
 */
function buildSlideModificationPrompt(
  currentHtml: string,
  userPrompt: string,
  config: ThemeConfig
): string {
  const { theme, logo } = config;

  return `You are modifying an existing slide. Make the requested change while preserving the overall design and theme.

CURRENT SLIDE HTML:
${currentHtml}

THEME CONFIGURATION:
- Primary Color: ${theme.primaryColor}
- Secondary Color: ${theme.secondaryColor}
- Accent Color: ${theme.accentColor}
- Background Color: ${theme.backgroundColor}
- Text Color: ${theme.textColor}
- Font Family: ${theme.fontFamily}
${logo.path ? `- Logo: ${logo.path} (${logo.position}, ${logo.size})` : ''}

MODIFICATION REQUEST:
${userPrompt}

REQUIREMENTS:
1. Preserve the overall structure unless the change explicitly requires otherwise
2. Maintain theme colors and branding
3. Keep the same aspect ratio (16:9) and layout principles
4. Only modify what the user requested
5. Keep the <section class="slide" data-slide="..."> wrapper
6. Use inline styles for all styling

OUTPUT:
Return ONLY the modified HTML as a single <section> element, with no explanations or markdown code blocks.`;
}

/**
 * Parse the slide response from Gemini
 * Handles structured output format: { slides: [...] }
 */
function parseSlideResponse(response: string): string[] {
  console.log(`Response length: ${response.length} characters`);

  try {
    // Parse the JSON response (structured output guarantees valid JSON)
    const parsed = JSON.parse(response);

    // Structured output format: { slides: [...] }
    if (parsed.slides && Array.isArray(parsed.slides)) {
      const validSlides = parsed.slides.filter(
        (slide: any) => typeof slide === 'string' && slide.includes('<section')
      );

      if (validSlides.length > 0) {
        console.log(`Successfully parsed ${validSlides.length} slides from structured output`);
        return validSlides;
      }
    }

    // Fallback: check if it's a plain array (legacy format)
    if (Array.isArray(parsed)) {
      const validSlides = parsed.filter(
        (slide: any) => typeof slide === 'string' && slide.includes('<section')
      );

      if (validSlides.length > 0) {
        console.log(`Successfully parsed ${validSlides.length} slides from array format`);
        return validSlides;
      }
    }

    throw new Error('No valid slides found in response');
  } catch (error) {
    console.error('Failed to parse slide response:', error);
    console.error('Response preview:', response.substring(0, 500));
    console.error('Response end:', response.substring(response.length - 200));

    throw new Error('Failed to parse slides from response. The AI may have generated invalid output.');
  }
}

/**
 * Clean HTML response by removing markdown code blocks
 */
function cleanHtmlResponse(response: string): string {
  let cleaned = response.trim();

  // Remove markdown code blocks
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.replace(/```html\n?/g, '').replace(/```\n?$/g, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```\n?/g, '').replace(/```\n?$/g, '');
  }

  return cleaned.trim();
}

/**
 * Validate that the Gemini API key is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
