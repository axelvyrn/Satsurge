import { supabase, Game, GameStat } from './supabase';

export const gameService = {
  async createGame(gameData: Partial<Game>): Promise<Game | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('games')
      .insert({
        ...gameData,
        creator_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      throw error;
    }

    return data;
  },

  async updateGame(gameId: string, updates: Partial<Game>): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', gameId)
      .select()
      .single();

    if (error) {
      console.error('Error updating game:', error);
      throw error;
    }

    return data;
  },

  async getGame(gameId: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching game:', error);
      throw error;
    }

    return data;
  },

  async getMyGames(): Promise<Game[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('creator_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching games:', error);
      throw error;
    }

    return data || [];
  },

  async getPublishedGames(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_published', true)
      .order('play_count', { ascending: false });

    if (error) {
      console.error('Error fetching published games:', error);
      throw error;
    }

    return data || [];
  },

  async publishGame(gameId: string, publishFee: number = 100): Promise<void> {
    const { error } = await supabase
      .from('games')
      .update({ is_published: true })
      .eq('id', gameId);

    if (error) {
      console.error('Error publishing game:', error);
      throw error;
    }
  },

  async deleteGame(gameId: string): Promise<void> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', gameId);

    if (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  },

  async saveGameStats(gameId: string, score: number, durationMs?: number, tournamentId?: string): Promise<GameStat | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('game_stats')
      .insert({
        game_id: gameId,
        player_id: user.id,
        score,
        duration_ms: durationMs,
        tournament_id: tournamentId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving game stats:', error);
      throw error;
    }

    await supabase
      .from('games')
      .update({ play_count: supabase.raw('play_count + 1') })
      .eq('id', gameId);

    return data;
  },

  async getGameStats(gameId: string): Promise<GameStat[]> {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .eq('game_id', gameId)
      .order('score', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching game stats:', error);
      throw error;
    }

    return data || [];
  },

  async getPlayerStats(playerId: string): Promise<GameStat[]> {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*, games(*)')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }

    return data || [];
  },
};
