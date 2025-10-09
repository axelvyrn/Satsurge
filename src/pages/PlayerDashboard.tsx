import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Zap, 
  History, 
  Settings, 
  Wallet, 
  Users,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import TournamentModal from '../components/TournamentModal';
import { dbTournamentService } from '../utils/dbTournamentService';
// import { Tournament as DbTournament } from '../utils/supabase';

function WalletInput({ onSave, current }: { onSave: (u: any) => void; current: string }) {
  const [value, setValue] = React.useState(current);
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="your@wallet.com"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
      <button
        onClick={() => onSave({ walletAddress: value })}
        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
      >
        Save
      </button>
    </div>
  );
}

interface Tournament {
  id: string;
  gameId: string;
  game: string;
  entryFee: number;
  pool: number;
  players: number;
  maxPlayers: number;
  timeLeft: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function PlayerDashboard() {
  const { user, logout } = useAuth();
  const { updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('tournaments');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([]);
  const [completedMine, setCompletedMine] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tournaments, stats, myTournaments] = await Promise.all([
        dbTournamentService.getActiveTournaments(),
        dbTournamentService.getMyStats(),
        dbTournamentService.getMyTournaments(),
      ]);

      const displayTournaments = tournaments.map((t: any) => ({
        id: t.id,
        gameId: t.game_id,
        game: t.games?.name || 'Unknown Game',
        entryFee: t.entry_fee,
        pool: t.prize_pool,
        players: t.current_participants,
        maxPlayers: t.max_participants,
        timeLeft: t.end_time ? calculateTimeLeft(new Date(t.end_time)) : 'Open',
        difficulty: 'Medium' as const,
      }));

      setActiveTournaments(displayTournaments);
      setPlayerStats(stats || []);

      const myCompleted = (myTournaments || [])
        .filter((t: any) => t.status === 'completed')
        .map((t: any) => ({
          id: t.id,
          gameId: t.game_id,
          game: t.games?.name || 'Unknown Game',
          entryFee: t.entry_fee,
          pool: t.prize_pool,
          players: t.current_participants,
          maxPlayers: t.max_participants,
          timeLeft: 'Ended',
          difficulty: 'Medium' as const,
        }));
      setCompletedMine(myCompleted);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const sidebarItems = [
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'history', label: 'Game History', icon: History },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'wallet', label: 'Wallet Settings', icon: Wallet },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'tournaments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Active Tournaments</h2>
              <div className="text-sm text-gray-600">
                {activeTournaments.length} tournaments available
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading tournaments...</p>
              </div>
            ) : (
            <div className="grid gap-4">
              {activeTournaments.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Tournaments</h3>
                  <p className="text-gray-600">Check back soon for new tournaments to join!</p>
                </div>
              ) : (
                activeTournaments.map((tournament) => (
                <div 
                  key={tournament.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{tournament.game}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          {tournament.entryFee} sats
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {tournament.players}/{tournament.maxPlayers}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {tournament.timeLeft}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {tournament.pool} sats
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tournament.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        tournament.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tournament.difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(tournament.players / tournament.maxPlayers) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {tournament.maxPlayers - tournament.players} spots remaining
                    </span>
                    <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                      Join Tournament
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
            )}

            {/* Completed Tournaments I Played */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Your Ended Tournaments</h3>
                <div className="text-sm text-gray-600">{completedMine.length}</div>
              </div>
              {completedMine.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                  <p className="text-gray-600">No ended tournaments yet. Play some games!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {completedMine.map((t) => (
                    <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{t.game}</h4>
                          <p className="text-sm text-gray-600 mt-1">Feeling lucky? You might have won :)</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">{t.pool} sats</div>
                          <div className="text-xs text-gray-500">Total pool</div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Entry Fee: {t.entryFee} sats</span>
                        <button
                          onClick={() => alert('Dev: Claim flow mocked. LN settlement later.')}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          Pay/Claim
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Game History</h2>
            {playerStats.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No games played yet</h3>
                <p className="text-gray-600">Start competing in tournaments to see your history here.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="space-y-4">
                  {playerStats.map((stat: any) => (
                    <div key={stat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{stat.games?.name || 'Unknown Game'}</h4>
                        <p className="text-sm text-gray-600">{new Date(stat.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">{stat.score}</div>
                        <p className="text-sm text-gray-600">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-100">Total Earnings</span>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold">{user?.earnings || 0} sats</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Games Won</span>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">0</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Win Rate</span>
                  <Star className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">0%</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h3>
              <div className="text-center py-8">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No earnings yet. Start playing to track your progress!</p>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Wallet Settings</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lightning Address
                  </label>
                  <WalletInput onSave={updateProfile} current={user?.walletAddress || ''} />
                  <p className="text-sm text-gray-500 mt-1">
                    This is where your winnings will be sent
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
        userType="player"
      />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600">Ready to earn some sats?</p>
          </div>

          {renderContent()}
        </div>
      </div>

      {selectedTournament && (
        <TournamentModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
        />
      )}
    </div>
  );
}