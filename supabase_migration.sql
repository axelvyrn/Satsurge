/*
  # SatSurge Gaming Platform Schema

  ## Overview
  This migration creates the database schema for the SatSurge gaming platform,
  a Lightning Network-powered competitive gaming platform with Blockly-based game creation.

  ## New Tables

  ### 1. `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique, required)
  - `user_type` (text, enum: 'player' or 'creator')
  - `wallet_address` (text, optional Lightning wallet address)
  - `avatar_url` (text, optional profile picture)
  - `total_earnings` (bigint, sats earned)
  - `games_created` (integer, count of games created)
  - `games_played` (integer, count of games played)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `games`
  Game definitions created by creators
  - `id` (uuid, primary key)
  - `creator_id` (uuid, references profiles)
  - `name` (text, required)
  - `description` (text)
  - `template_type` (text, game template used)
  - `blockly_xml` (text, Blockly workspace XML)
  - `generated_code` (text, compiled JavaScript code)
  - `difficulty` (text, enum: 'easy', 'medium', 'hard')
  - `suggested_entry_fee` (bigint, suggested sats)
  - `is_published` (boolean)
  - `play_count` (integer, total plays)
  - `creator_earnings` (bigint, total earned by creator)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `game_stats`
  Player statistics and high scores for each game
  - `id` (uuid, primary key)
  - `game_id` (uuid, references games)
  - `player_id` (uuid, references profiles)
  - `score` (integer, game score)
  - `duration_ms` (integer, time played)
  - `tournament_id` (uuid, optional, references tournaments)
  - `created_at` (timestamptz)

  ### 4. `tournaments`
  Tournament/competition instances
  - `id` (uuid, primary key)
  - `game_id` (uuid, references games)
  - `creator_id` (uuid, references profiles)
  - `name` (text, required)
  - `entry_fee` (bigint, sats required)
  - `prize_pool` (bigint, total sats in pool)
  - `max_participants` (integer)
  - `current_participants` (integer)
  - `status` (text, enum: 'open', 'active', 'completed', 'cancelled')
  - `start_time` (timestamptz)
  - `end_time` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `tournament_participants`
  Players participating in tournaments
  - `id` (uuid, primary key)
  - `tournament_id` (uuid, references tournaments)
  - `player_id` (uuid, references profiles)
  - `entry_paid` (boolean)
  - `best_score` (integer)
  - `final_rank` (integer, optional)
  - `prize_won` (bigint, sats won)
  - `joined_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can read their own profiles and update specific fields
  - Creators can manage their own games
  - Anyone can read published games
  - Players can view their own stats
  - Tournament participants can view tournament details
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('player', 'creator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tournament_status AS ENUM ('open', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  user_type user_type NOT NULL DEFAULT 'player',
  wallet_address text,
  avatar_url text,
  total_earnings bigint DEFAULT 0,
  games_created integer DEFAULT 0,
  games_played integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  template_type text,
  blockly_xml text,
  generated_code text,
  difficulty difficulty_level DEFAULT 'medium',
  suggested_entry_fee bigint DEFAULT 100,
  is_published boolean DEFAULT false,
  play_count integer DEFAULT 0,
  creator_earnings bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published games"
  ON games FOR SELECT
  TO authenticated
  USING (is_published = true OR creator_id = auth.uid());

CREATE POLICY "Creators can insert own games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update own games"
  ON games FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can delete own games"
  ON games FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- Create game_stats table
CREATE TABLE IF NOT EXISTS game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  duration_ms integer,
  tournament_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view own stats"
  ON game_stats FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Players can insert own stats"
  ON game_stats FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Game creators can view game stats"
  ON game_stats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_stats.game_id
      AND games.creator_id = auth.uid()
    )
  );

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  entry_fee bigint NOT NULL DEFAULT 100,
  prize_pool bigint DEFAULT 0,
  max_participants integer DEFAULT 100,
  current_participants integer DEFAULT 0,
  status tournament_status DEFAULT 'open',
  start_time timestamptz,
  end_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tournaments"
  ON tournaments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can create tournaments"
  ON tournaments FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update own tournaments"
  ON tournaments FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Create tournament_participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_paid boolean DEFAULT false,
  best_score integer DEFAULT 0,
  final_rank integer,
  prize_won bigint DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(tournament_id, player_id)
);

ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view tournament participants"
  ON tournament_participants FOR SELECT
  TO authenticated
  USING (
    player_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM tournaments
      WHERE tournaments.id = tournament_participants.tournament_id
    )
  );

CREATE POLICY "Players can join tournaments"
  ON tournament_participants FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Players can update own participation"
  ON tournament_participants FOR UPDATE
  TO authenticated
  USING (player_id = auth.uid())
  WITH CHECK (player_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_creator ON games(creator_id);
CREATE INDEX IF NOT EXISTS idx_games_published ON games(is_published);
CREATE INDEX IF NOT EXISTS idx_game_stats_game ON game_stats(game_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_player ON game_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_game ON tournaments(game_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_player ON tournament_participants(player_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_games_updated_at ON games;
  CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_tournaments_updated_at ON tournaments;
  CREATE TRIGGER update_tournaments_updated_at
    BEFORE UPDATE ON tournaments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;
