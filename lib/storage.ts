// Supabase storage operations for slide decks
import { createClient } from '@supabase/supabase-js';
import type {
  Deck,
  DeckMetadata,
  Comment,
  ThemeConfig,
  ShareToken,
  Slide,
} from './types';
import { defaultThemeConfig } from './types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Create a new deck
export async function createDeck(title: string): Promise<string> {
  // Get global settings for initial config
  const globalSettings = await getGlobalSettings();

  // Insert deck
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .insert({ title, slide_count: 0 })
    .select()
    .single();

  if (deckError || !deck) {
    throw new Error('Failed to create deck');
  }

  // Insert config
  await supabase
    .from('deck_configs')
    .insert({
      deck_id: deck.id,
      config: globalSettings,
    });

  return deck.id;
}

// Get deck metadata
export async function getDeckMetadata(deckId: string): Promise<DeckMetadata | null> {
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('id', deckId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    slideCount: data.slide_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Get full deck with all data
export async function getDeck(deckId: string): Promise<Deck | null> {
  const [metadata, configData, slidesData, commentsData] = await Promise.all([
    getDeckMetadata(deckId),
    supabase.from('deck_configs').select('config').eq('deck_id', deckId).single(),
    supabase.from('slides').select('*').eq('deck_id', deckId).order('slide_index'),
    supabase.from('comments').select('*').eq('deck_id', deckId).order('created_at'),
  ]);

  if (!metadata) return null;

  const slides: Slide[] = slidesData.data?.map(s => ({
    index: s.slide_index,
    html: s.html,
  })) || [];

  const comments: Comment[] = commentsData.data?.map(c => ({
    id: c.id,
    slideIndex: c.slide_index,
    selector: c.selector,
    position: { x: c.position_x, y: c.position_y },
    text: c.text,
    author: c.author,
    resolved: c.resolved,
    createdAt: c.created_at,
  })) || [];

  const config = configData.data?.config || defaultThemeConfig;

  return {
    id: metadata.id,
    title: metadata.title,
    slides,
    config,
    comments,
    metadata,
  };
}

// Get deck config
export async function getConfig(deckId: string): Promise<ThemeConfig | null> {
  const { data, error } = await supabase
    .from('deck_configs')
    .select('config')
    .eq('deck_id', deckId)
    .single();

  if (error || !data) return null;

  return data.config;
}

// Update deck config
export async function updateConfig(deckId: string, config: ThemeConfig): Promise<void> {
  await supabase
    .from('deck_configs')
    .update({ config })
    .eq('deck_id', deckId);

  await updateDeckTimestamp(deckId);
}

// Update a single slide
export async function updateSlide(
  deckId: string,
  slideIndex: number,
  html: string
): Promise<void> {
  await supabase
    .from('slides')
    .upsert({
      deck_id: deckId,
      slide_index: slideIndex,
      html,
    }, {
      onConflict: 'deck_id,slide_index'
    });

  await updateDeckTimestamp(deckId);
}

// Save multiple slides (used during generation)
export async function saveSlides(deckId: string, slideHtmls: string[]): Promise<void> {
  // Delete existing slides
  await supabase.from('slides').delete().eq('deck_id', deckId);

  // Insert new slides
  const slides = slideHtmls.map((html, index) => ({
    deck_id: deckId,
    slide_index: index,
    html,
  }));

  await supabase.from('slides').insert(slides);

  // Update metadata
  await supabase
    .from('decks')
    .update({
      slide_count: slideHtmls.length,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deckId);
}

// Get slides for a deck
export async function getSlides(deckId: string): Promise<Slide[]> {
  const { data } = await supabase
    .from('slides')
    .select('*')
    .eq('deck_id', deckId)
    .order('slide_index');

  return data?.map(s => ({
    index: s.slide_index,
    html: s.html,
  })) || [];
}

// Comment management
export async function saveComment(deckId: string, comment: Comment): Promise<void> {
  await supabase.from('comments').insert({
    id: comment.id,
    deck_id: deckId,
    slide_index: comment.slideIndex,
    selector: comment.selector,
    position_x: comment.position.x,
    position_y: comment.position.y,
    text: comment.text,
    author: comment.author,
    resolved: comment.resolved,
    created_at: comment.createdAt,
  });

  await updateDeckTimestamp(deckId);
}

export async function updateComment(
  deckId: string,
  commentId: string,
  updates: Partial<Comment>
): Promise<void> {
  const updateData: any = {};

  if (updates.resolved !== undefined) updateData.resolved = updates.resolved;
  if (updates.text !== undefined) updateData.text = updates.text;

  await supabase
    .from('comments')
    .update(updateData)
    .eq('id', commentId);

  await updateDeckTimestamp(deckId);
}

export async function getComments(deckId: string): Promise<Comment[]> {
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at');

  return data?.map(c => ({
    id: c.id,
    slideIndex: c.slide_index,
    selector: c.selector,
    position: { x: c.position_x, y: c.position_y },
    text: c.text,
    author: c.author,
    resolved: c.resolved,
    createdAt: c.created_at,
  })) || [];
}

// List all decks
export async function listDecks(): Promise<DeckMetadata[]> {
  const { data } = await supabase
    .from('decks')
    .select('*')
    .order('updated_at', { ascending: false });

  if (!data) return [];

  return data.map(d => ({
    id: d.id,
    title: d.title,
    slideCount: d.slide_count,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }));
}

// List decks with first slide preview
export async function listDecksWithPreviews(): Promise<
  Array<DeckMetadata & { firstSlideHtml?: string; config?: ThemeConfig }>
> {
  const decks = await listDecks();

  return Promise.all(
    decks.map(async (deck) => {
      const [slidesData, configData] = await Promise.all([
        supabase
          .from('slides')
          .select('html')
          .eq('deck_id', deck.id)
          .eq('slide_index', 0)
          .single(),
        supabase
          .from('deck_configs')
          .select('config')
          .eq('deck_id', deck.id)
          .single(),
      ]);

      return {
        ...deck,
        firstSlideHtml: slidesData.data?.html,
        config: configData.data?.config,
      };
    })
  );
}

// Delete a deck
export async function deleteDeck(deckId: string): Promise<void> {
  // Cascade delete will handle slides, comments, config, and share tokens
  await supabase.from('decks').delete().eq('id', deckId);
}

// Duplicate a deck
export async function duplicateDeck(deckId: string): Promise<string> {
  const sourceDeck = await getDeck(deckId);
  if (!sourceDeck) throw new Error('Deck not found');

  // Create new deck
  const { data: newDeck, error } = await supabase
    .from('decks')
    .insert({
      title: `${sourceDeck.title} (Copy)`,
      slide_count: sourceDeck.metadata.slideCount,
    })
    .select()
    .single();

  if (error || !newDeck) throw new Error('Failed to duplicate deck');

  // Copy config
  await supabase.from('deck_configs').insert({
    deck_id: newDeck.id,
    config: sourceDeck.config,
  });

  // Copy slides
  const slides = sourceDeck.slides.map(s => ({
    deck_id: newDeck.id,
    slide_index: s.index,
    html: s.html,
  }));

  if (slides.length > 0) {
    await supabase.from('slides').insert(slides);
  }

  return newDeck.id;
}

// Rename a deck
export async function renameDeck(deckId: string, newTitle: string): Promise<void> {
  await supabase
    .from('decks')
    .update({
      title: newTitle,
      updated_at: new Date().toISOString(),
    })
    .eq('id', deckId);
}

// Helper: Update deck timestamp
async function updateDeckTimestamp(deckId: string): Promise<void> {
  await supabase
    .from('decks')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', deckId);
}

// Share token management
export async function createShareToken(deckId: string): Promise<ShareToken> {
  const { data, error } = await supabase
    .from('share_tokens')
    .insert({ deck_id: deckId })
    .select()
    .single();

  if (error || !data) throw new Error('Failed to create share token');

  return {
    token: data.token,
    deckId: data.deck_id,
    createdAt: data.created_at,
  };
}

// Get deck ID from share token
export async function getDeckByToken(token: string): Promise<string | null> {
  const { data } = await supabase
    .from('share_tokens')
    .select('deck_id')
    .eq('token', token)
    .single();

  return data?.deck_id || null;
}

// Global settings management
export async function getGlobalSettings(): Promise<ThemeConfig> {
  const { data } = await supabase
    .from('global_settings')
    .select('settings')
    .eq('id', 1)
    .single();

  return data?.settings || defaultThemeConfig;
}

export async function saveGlobalSettings(settings: ThemeConfig): Promise<void> {
  await supabase
    .from('global_settings')
    .upsert({
      id: 1,
      settings,
      updated_at: new Date().toISOString(),
    });
}
