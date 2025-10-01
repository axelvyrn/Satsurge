import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  username: string;
  user_type: 'player' | 'creator';
  wallet_address?: string;
  avatar_url?: string;
  total_earnings: number;
  games_created: number;
  games_played: number;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  template_type?: string;
  blockly_xml?: string;
  generated_code?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  suggested_entry_fee: number;
  is_published: boolean;
  play_count: number;
  creator_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface GameStat {
  id: string;
  game_id: string;
  player_id: string;
  score: number;
  duration_ms?: number;
  tournament_id?: string;
  created_at: string;
}

export interface Tournament {
  id: string;
  game_id: string;
  creator_id: string;
  name: string;
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  status: 'open' | 'active' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  player_id: string;
  entry_paid: boolean;
  best_score: number;
  final_rank?: number;
  prize_won: number;
  joined_at: string;
}
