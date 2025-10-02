import { supabase, Tournament, TournamentParticipant } from './supabase';

export const dbTournamentService = {
  async createTournament(gameId: string, data: Partial<Tournament>): Promise<Tournament | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: tournament, error } = await supabase
      .from('tournaments')
      .insert({
        game_id: gameId,
        creator_id: user.id,
        ...data,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }

    return tournament;
  },

  async getActiveTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, games(name)')
      .in('status', ['open', 'active'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }

    return data || [];
  },

  async getTournament(id: string): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, games(name), profiles(username)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching tournament:', error);
      throw error;
    }

    return data;
  },

  async joinTournament(tournamentId: string): Promise<TournamentParticipant | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: participant, error } = await supabase
      .from('tournament_participants')
      .insert({
        tournament_id: tournamentId,
        player_id: user.id,
        entry_paid: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error joining tournament:', error);
      throw error;
    }

    await supabase.rpc('increment_tournament_participants', {
      tournament_id: tournamentId,
    });

    return participant;
  },

  async getMyTournaments(): Promise<Tournament[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('tournament_participants')
      .select('tournaments(*, games(name))')
      .eq('player_id', user.id)
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('Error fetching my tournaments:', error);
      throw error;
    }

    return data?.map((item: any) => item.tournaments) || [];
  },

  async submitScore(tournamentId: string, score: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('tournament_participants')
      .update({
        best_score: score,
      })
      .eq('tournament_id', tournamentId)
      .eq('player_id', user.id);

    if (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  },

  async getTournamentParticipants(tournamentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*, profiles(username, avatar_url)')
      .eq('tournament_id', tournamentId)
      .order('best_score', { ascending: false });

    if (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }

    return data || [];
  },

  async getMyStats(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: stats, error } = await supabase
      .from('game_stats')
      .select('*, games(name)')
      .eq('player_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }

    return stats;
  },
};
