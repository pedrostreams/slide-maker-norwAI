-- Slide Maker Database Schema for Supabase

-- Decks table (metadata)
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slide_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slides table
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  slide_index INTEGER NOT NULL,
  html TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(deck_id, slide_index)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  slide_index INTEGER NOT NULL,
  selector TEXT NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  text TEXT NOT NULL,
  author TEXT DEFAULT 'Reviewer',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deck configs table (theme/branding)
CREATE TABLE deck_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL UNIQUE REFERENCES decks(id) ON DELETE CASCADE,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Share tokens table
CREATE TABLE share_tokens (
  token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global settings table (single row)
CREATE TABLE global_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensures only one row
  settings JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_slides_deck_id ON slides(deck_id);
CREATE INDEX idx_comments_deck_id ON comments(deck_id);
CREATE INDEX idx_share_tokens_deck_id ON share_tokens(deck_id);

-- Enable Row Level Security (RLS)
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth for now)
CREATE POLICY "Enable all access for decks" ON decks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for slides" ON slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for comments" ON comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for deck_configs" ON deck_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for share_tokens" ON share_tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for global_settings" ON global_settings FOR ALL USING (true) WITH CHECK (true);
