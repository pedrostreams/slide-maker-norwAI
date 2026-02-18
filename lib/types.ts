// Core data structures for the slide maker application

export interface Deck {
  id: string;
  title: string;
  slides: Slide[];
  config: ThemeConfig;
  comments: Comment[];
  metadata: DeckMetadata;
}

export interface DeckMetadata {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  slideCount: number;
}

export interface Slide {
  index: number;
  html: string;
}

export interface Comment {
  id: string;
  slideIndex: number;
  selector: string;
  position: { x: number; y: number };
  text: string;
  author: string;
  createdAt: string;
  resolved: boolean;
}

export interface ThemeConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  logo: {
    path: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: 'small' | 'medium' | 'large';
  };
}

export interface ShareToken {
  token: string;
  deckId: string;
  createdAt: string;
}

// API request/response types
export interface GenerateRequest {
  prompt: string;
  deckId?: string;
  mode: 'create' | 'modify';
  currentHtml?: string;
  slideIndex?: number;
  config?: ThemeConfig;
}

export interface GenerateResponse {
  success: boolean;
  slides?: string[];
  slideCount?: number;
  error?: string;
}

export interface ExportRequest {
  deckId: string;
}

// Default theme configuration
export const defaultThemeConfig: ThemeConfig = {
  theme: {
    primaryColor: '#1E40AF',
    secondaryColor: '#3B82F6',
    accentColor: '#60A5FA',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  logo: {
    path: '',
    position: 'top-right',
    size: 'small',
  },
};
