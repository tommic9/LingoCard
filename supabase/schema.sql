-- LingoCards Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable Row Level Security on all tables
-- This ensures users can only access their own data

-- ============================================
-- DECKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS decks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_built_in BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_decks_updated_at ON decks(updated_at);

-- Enable RLS
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for decks
CREATE POLICY "Users can view their own decks"
  ON decks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decks"
  ON decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks"
  ON decks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks"
  ON decks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CARDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  example TEXT,
  ease_factor REAL DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_next_review ON cards(next_review_date);
CREATE INDEX IF NOT EXISTS idx_cards_updated_at ON cards(updated_at);

-- Enable RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cards
CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REVIEW_LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS review_logs (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT CHECK (rating IN (0, 1, 2, 3, 4, 5)),
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_review_logs_card_id ON review_logs(card_id);
CREATE INDEX IF NOT EXISTS idx_review_logs_user_id ON review_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_review_logs_reviewed_at ON review_logs(reviewed_at);

-- Enable RLS
ALTER TABLE review_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review_logs
CREATE POLICY "Users can view their own review logs"
  ON review_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own review logs"
  ON review_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- NOTES
-- ============================================

-- All tables use RLS (Row Level Security) to ensure users can only access their own data
-- Foreign keys with CASCADE delete ensure data consistency
-- Indexes are optimized for common queries (user_id, updated_at, next_review_date)
-- Triggers automatically update updated_at timestamps
