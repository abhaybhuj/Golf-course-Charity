-- ====================================================================
-- DIGITAL HEROES - SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Assignment ID: abhaybhuj.assignment.golfncharity
-- Compliant with PRD §01 - §16 Specifications
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. CHARITIES DIRECTORY TABLE (§08)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.charities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  category TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image TEXT,
  website_url TEXT,
  total_raised NUMERIC DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. USER PROFILES & SUBSCRIPTION (§03, §04, §10)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'subscriber' CHECK (role IN ('visitor', 'subscriber', 'admin')),
  avatar_url TEXT,
  home_club TEXT,
  handicap NUMERIC DEFAULT 14.0,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'lapsed', 'cancelled')),
  subscription_plan TEXT DEFAULT 'monthly' CHECK (subscription_plan IN ('monthly', 'yearly')),
  subscription_amount NUMERIC DEFAULT 29,
  renewal_date DATE,
  charity_id TEXT REFERENCES public.charities(id),
  charity_percentage NUMERIC DEFAULT 20 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  total_donated NUMERIC DEFAULT 0,
  draws_entered_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. GOLF SCORES WITH STRICT CONSTRAINTS (§05)
-- - 1 to 45 Stableford points
-- - Unique score per date per user (no duplicates)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.golf_scores (
  id TEXT PRIMARY KEY DEFAULT ('sc-' || uuid_generate_v4()),
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points >= 1 AND points <= 45),
  score_date DATE NOT NULL,
  course_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_score_date UNIQUE (user_id, score_date)
);

CREATE INDEX IF NOT EXISTS idx_golf_scores_user_date ON public.golf_scores(user_id, score_date DESC);

-- --------------------------------------------------------------------
-- 4. ROLLING 5 SCORES POSTGRES TRIGGER (§05)
-- Strictly keeps only the latest 5 scores per user by date.
-- When a 6th score is inserted, the oldest score is automatically deleted.
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prune_rolling_five_scores()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.golf_scores
  WHERE id IN (
    SELECT id
    FROM public.golf_scores
    WHERE user_id = NEW.user_id
    ORDER BY score_date DESC, created_at DESC
    OFFSET 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prune_rolling_scores ON public.golf_scores;
CREATE TRIGGER trg_prune_rolling_scores
AFTER INSERT ON public.golf_scores
FOR EACH ROW
EXECUTE FUNCTION public.prune_rolling_five_scores();

-- --------------------------------------------------------------------
-- 5. DRAWS & HISTORICAL RECORDS (§06, §07)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.draws (
  id TEXT PRIMARY KEY,
  draw_month TEXT NOT NULL,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  winning_numbers INTEGER[] NOT NULL,
  draw_logic TEXT NOT NULL CHECK (draw_logic IN ('random', 'algorithmic')),
  total_pool NUMERIC NOT NULL,
  rollover_in NUMERIC DEFAULT 0,
  rollover_out NUMERIC DEFAULT 0,
  tier5_amount NUMERIC NOT NULL,
  tier4_amount NUMERIC NOT NULL,
  tier3_amount NUMERIC NOT NULL,
  tier5_winners_count INTEGER DEFAULT 0,
  tier4_winners_count INTEGER DEFAULT 0,
  tier3_winners_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'simulated', 'published'))
);

-- --------------------------------------------------------------------
-- 6. WINNERS & VERIFICATION TABLE (§09)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.winnings (
  id TEXT PRIMARY KEY DEFAULT ('win-' || uuid_generate_v4()),
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  draw_id TEXT REFERENCES public.draws(id),
  draw_month TEXT NOT NULL,
  match_tier TEXT NOT NULL CHECK (match_tier IN ('5-match', '4-match', '3-match')),
  matched_numbers INTEGER[] NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'approved', 'rejected', 'paid')),
  proof_screenshot_url TEXT,
  uploaded_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  review_notes TEXT,
  transaction_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. DIRECT CHARITY DONATIONS (§08)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donations (
  id TEXT PRIMARY KEY DEFAULT ('don-' || uuid_generate_v4()),
  user_id TEXT REFERENCES public.profiles(id),
  donor_name TEXT NOT NULL,
  charity_id TEXT NOT NULL REFERENCES public.charities(id),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  donation_date DATE DEFAULT CURRENT_DATE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Charities & Draws are publicly readable
CREATE POLICY "Public charities are readable by all" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Public draws are readable by all" ON public.draws FOR SELECT USING (true);

-- User scores readable by all (draw verification), inserted/updated only by owner
CREATE POLICY "Golf scores readable" ON public.golf_scores FOR SELECT USING (true);
CREATE POLICY "Golf scores insertable by user" ON public.golf_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Golf scores deletable by user" ON public.golf_scores FOR DELETE USING (true);

-- Profiles readable and updatable
CREATE POLICY "Profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles updatable" ON public.profiles FOR UPDATE USING (true);

-- --------------------------------------------------------------------
-- 9. INITIAL SEED DATA (Charity Partners)
-- --------------------------------------------------------------------
INSERT INTO public.charities (id, name, tagline, category, description, logo_url, cover_image, website_url, total_raised, is_featured)
VALUES 
  ('ch-heart', 'Heart & Stroke Foundation', 'Pioneering cardiovascular research and recovery programs across our sporting communities.', 'Health & Medical', 'Leading non-profit funding breakthrough medical research and community care for cardiac rehabilitation.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80', 'https://digitalheroes.co.in', 14200, true),
  ('ch-youth', 'Junior Links Academy', 'Providing equipment, coaching, and mentorship to underprivileged youth.', 'Youth & Sport', 'Ensuring the traditions, focus, and mentorship of golf are accessible to all children regardless of socioeconomic background.', 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80', 'https://digitalheroes.co.in', 9800, true),
  ('ch-vets', 'Fairways for Heroes', 'Physical and psychological rehabilitation through adaptive golf programs for military veterans.', 'Veterans & First Responders', 'Using golf as therapeutic community recreation for returning wounded service members and first responders.', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80', 'https://digitalheroes.co.in', 18450, true),
  ('ch-mental', 'Mindful Fairways Initiative', 'Mental health awareness, mindfulness workshops, and peer support networks.', 'Mental Health', 'Championing mental wellness initiatives, destigmatizing therapy, and offering nature-based recovery.', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80', 'https://digitalheroes.co.in', 7600, false),
  ('ch-nature', 'Green Links Conservation', 'Preserving natural wetlands, bird sanctuaries, and eco-friendly golf environments.', 'Environment & Community', 'Partnering with coastal and regional clubs to eliminate pesticide runoff, restore native flora, and protect wildlife.', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80', 'https://digitalheroes.co.in', 11300, false)
ON CONFLICT (id) DO NOTHING;
