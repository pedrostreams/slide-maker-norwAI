// Local filesystem storage operations for slide decks
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type {
  Deck,
  DeckMetadata,
  Comment,
  ThemeConfig,
  ShareToken,
  Slide,
} from './types';
import { defaultThemeConfig } from './types';

const SLIDES_DIR = path.join(process.cwd(), 'slides');
const SHARES_FILE = path.join(process.cwd(), 'shares.json');
const GLOBAL_SETTINGS_FILE = path.join(process.cwd(), 'global-settings.json');

// Ensure slides directory exists
async function ensureSlidesDir() {
  try {
    await fs.access(SLIDES_DIR);
  } catch {
    await fs.mkdir(SLIDES_DIR, { recursive: true });
  }
}

// Get path to deck directory
function getDeckPath(deckId: string): string {
  return path.join(SLIDES_DIR, deckId);
}

// Create a new deck
export async function createDeck(title: string): Promise<string> {
  await ensureSlidesDir();

  const deckId = uuidv4();
  const deckPath = getDeckPath(deckId);

  // Create deck directory and assets subdirectory
  await fs.mkdir(deckPath, { recursive: true });
  await fs.mkdir(path.join(deckPath, 'assets'), { recursive: true });

  // Create metadata
  const metadata: DeckMetadata = {
    id: deckId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slideCount: 0,
  };

  await fs.writeFile(
    path.join(deckPath, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  // Create config from global settings
  const globalSettings = await getGlobalSettings();
  await fs.writeFile(
    path.join(deckPath, 'config.json'),
    JSON.stringify(globalSettings, null, 2)
  );

  // Create empty comments file
  await fs.writeFile(
    path.join(deckPath, 'comments.json'),
    JSON.stringify({ comments: [] }, null, 2)
  );

  // Create empty index.html
  await fs.writeFile(
    path.join(deckPath, 'index.html'),
    '<!DOCTYPE html><html><head><title>' + title + '</title></head><body></body></html>'
  );

  return deckId;
}

// Get deck metadata
export async function getDeckMetadata(deckId: string): Promise<DeckMetadata | null> {
  try {
    const metadataPath = path.join(getDeckPath(deckId), 'metadata.json');
    const content = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Get full deck with all data
export async function getDeck(deckId: string): Promise<Deck | null> {
  try {
    const deckPath = getDeckPath(deckId);

    // Read metadata
    const metadata = await getDeckMetadata(deckId);
    if (!metadata) return null;

    // Read config
    const configContent = await fs.readFile(
      path.join(deckPath, 'config.json'),
      'utf-8'
    );
    const config: ThemeConfig = JSON.parse(configContent);

    // Read comments
    const commentsContent = await fs.readFile(
      path.join(deckPath, 'comments.json'),
      'utf-8'
    );
    const { comments } = JSON.parse(commentsContent);

    // Read all slide files
    const files = await fs.readdir(deckPath);
    const slideFiles = files
      .filter(f => f.startsWith('slide-') && f.endsWith('.html'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/slide-(\d+)\.html/)?.[1] || '0');
        const numB = parseInt(b.match(/slide-(\d+)\.html/)?.[1] || '0');
        return numA - numB;
      });

    const slides: Slide[] = await Promise.all(
      slideFiles.map(async (file, index) => {
        const html = await fs.readFile(path.join(deckPath, file), 'utf-8');
        return { index, html };
      })
    );

    return {
      id: deckId,
      title: metadata.title,
      slides,
      config,
      comments,
      metadata,
    };
  } catch (error) {
    console.error('Error reading deck:', error);
    return null;
  }
}

// Update a single slide
export async function updateSlide(
  deckId: string,
  slideIndex: number,
  html: string
): Promise<void> {
  const deckPath = getDeckPath(deckId);
  const slideFile = path.join(deckPath, `slide-${slideIndex}.html`);

  await fs.writeFile(slideFile, html);

  // Update metadata timestamp
  await updateDeckTimestamp(deckId);
}

// Save multiple slides (used during generation)
export async function saveSlides(
  deckId: string,
  slides: string[]
): Promise<void> {
  const deckPath = getDeckPath(deckId);

  // Write each slide to a separate file
  await Promise.all(
    slides.map((html, index) =>
      fs.writeFile(path.join(deckPath, `slide-${index}.html`), html)
    )
  );

  // Update metadata
  const metadata = await getDeckMetadata(deckId);
  if (metadata) {
    metadata.slideCount = slides.length;
    metadata.updatedAt = new Date().toISOString();
    await fs.writeFile(
      path.join(deckPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }
}

// Save a comment
export async function saveComment(
  deckId: string,
  comment: Comment
): Promise<void> {
  const deckPath = getDeckPath(deckId);
  const commentsPath = path.join(deckPath, 'comments.json');

  const content = await fs.readFile(commentsPath, 'utf-8');
  const data = JSON.parse(content);

  data.comments.push(comment);

  await fs.writeFile(commentsPath, JSON.stringify(data, null, 2));
  await updateDeckTimestamp(deckId);
}

// Get all comments for a deck
export async function getComments(deckId: string): Promise<Comment[]> {
  try {
    const deckPath = getDeckPath(deckId);
    const commentsPath = path.join(deckPath, 'comments.json');
    const content = await fs.readFile(commentsPath, 'utf-8');
    const { comments } = JSON.parse(content);
    return comments;
  } catch {
    return [];
  }
}

// Update a comment
export async function updateComment(
  deckId: string,
  commentId: string,
  updates: Partial<Comment>
): Promise<void> {
  const deckPath = getDeckPath(deckId);
  const commentsPath = path.join(deckPath, 'comments.json');

  const content = await fs.readFile(commentsPath, 'utf-8');
  const data = JSON.parse(content);

  const commentIndex = data.comments.findIndex((c: Comment) => c.id === commentId);
  if (commentIndex >= 0) {
    data.comments[commentIndex] = { ...data.comments[commentIndex], ...updates };
    await fs.writeFile(commentsPath, JSON.stringify(data, null, 2));
    await updateDeckTimestamp(deckId);
  }
}

// Update theme config
export async function updateConfig(
  deckId: string,
  config: ThemeConfig
): Promise<void> {
  const deckPath = getDeckPath(deckId);
  await fs.writeFile(
    path.join(deckPath, 'config.json'),
    JSON.stringify(config, null, 2)
  );
  await updateDeckTimestamp(deckId);
}

// Get theme config
export async function getConfig(deckId: string): Promise<ThemeConfig | null> {
  try {
    const deckPath = getDeckPath(deckId);
    const content = await fs.readFile(path.join(deckPath, 'config.json'), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// List all decks
export async function listDecks(): Promise<DeckMetadata[]> {
  await ensureSlidesDir();

  try {
    const entries = await fs.readdir(SLIDES_DIR, { withFileTypes: true });
    const deckDirs = entries.filter(e => e.isDirectory());

    const decks = await Promise.all(
      deckDirs.map(async (dir) => {
        const metadata = await getDeckMetadata(dir.name);
        return metadata;
      })
    );

    return decks
      .filter((m): m is DeckMetadata => m !== null)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
}

// List decks with first slide preview
export async function listDecksWithPreviews(): Promise<Array<DeckMetadata & { firstSlideHtml?: string; config?: ThemeConfig }>> {
  const decks = await listDecks();

  return Promise.all(
    decks.map(async (deck) => {
      try {
        // Try to read first slide
        const firstSlideFile = path.join(getDeckPath(deck.id), 'slide-0.html');
        const firstSlideHtml = await fs.readFile(firstSlideFile, 'utf-8');

        // Also get config for proper rendering
        const config = await getConfig(deck.id);

        return {
          ...deck,
          firstSlideHtml,
          config: config || undefined,
        };
      } catch {
        // Deck has no slides yet
        return {
          ...deck,
          firstSlideHtml: undefined,
          config: undefined,
        };
      }
    })
  );
}

// Delete a deck
export async function deleteDeck(deckId: string): Promise<void> {
  const deckPath = getDeckPath(deckId);
  await fs.rm(deckPath, { recursive: true, force: true });
}

// Duplicate a deck
export async function duplicateDeck(deckId: string): Promise<string> {
  const sourceDeck = await getDeck(deckId);
  if (!sourceDeck) throw new Error('Deck not found');

  const newDeckId = await createDeck(`${sourceDeck.title} (Copy)`);
  const newDeckPath = getDeckPath(newDeckId);
  const sourceDeckPath = getDeckPath(deckId);

  // Copy all files
  const files = await fs.readdir(sourceDeckPath);
  await Promise.all(
    files.map(async (file) => {
      if (file === 'metadata.json') return; // Skip metadata, already created
      const sourcePath = path.join(sourceDeckPath, file);
      const destPath = path.join(newDeckPath, file);
      const stat = await fs.stat(sourcePath);
      if (stat.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        const subFiles = await fs.readdir(sourcePath);
        await Promise.all(
          subFiles.map(sf =>
            fs.copyFile(path.join(sourcePath, sf), path.join(destPath, sf))
          )
        );
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    })
  );

  // Update metadata with correct slide count
  const metadata = await getDeckMetadata(newDeckId);
  if (metadata) {
    metadata.slideCount = sourceDeck.slides.length;
    await fs.writeFile(
      path.join(newDeckPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }

  return newDeckId;
}

// Rename a deck
export async function renameDeck(deckId: string, newTitle: string): Promise<void> {
  const metadata = await getDeckMetadata(deckId);
  if (!metadata) throw new Error('Deck not found');

  metadata.title = newTitle;
  metadata.updatedAt = new Date().toISOString();

  await fs.writeFile(
    path.join(getDeckPath(deckId), 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
}

// Helper: Update deck timestamp
async function updateDeckTimestamp(deckId: string): Promise<void> {
  const metadata = await getDeckMetadata(deckId);
  if (metadata) {
    metadata.updatedAt = new Date().toISOString();
    await fs.writeFile(
      path.join(getDeckPath(deckId), 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }
}

// Share token management
export async function createShareToken(deckId: string): Promise<ShareToken> {
  const token = uuidv4();
  const shareToken: ShareToken = {
    token,
    deckId,
    createdAt: new Date().toISOString(),
  };

  // Read existing shares
  let shares: ShareToken[] = [];
  try {
    const content = await fs.readFile(SHARES_FILE, 'utf-8');
    shares = JSON.parse(content);
  } catch {
    // File doesn't exist yet
  }

  shares.push(shareToken);
  await fs.writeFile(SHARES_FILE, JSON.stringify(shares, null, 2));

  return shareToken;
}

// Get deck ID from share token
export async function getDeckByToken(token: string): Promise<string | null> {
  try {
    const content = await fs.readFile(SHARES_FILE, 'utf-8');
    const shares: ShareToken[] = JSON.parse(content);
    const share = shares.find(s => s.token === token);
    return share?.deckId || null;
  } catch {
    return null;
  }
}

// Global settings management
export async function getGlobalSettings(): Promise<ThemeConfig> {
  try {
    const content = await fs.readFile(GLOBAL_SETTINGS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    // File doesn't exist, return defaults
    return defaultThemeConfig;
  }
}

export async function saveGlobalSettings(settings: ThemeConfig): Promise<void> {
  await fs.writeFile(GLOBAL_SETTINGS_FILE, JSON.stringify(settings, null, 2));
}
