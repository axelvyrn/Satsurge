import React, { useState, useEffect } from 'react';
import { Plus, Gamepad2, BarChart3, Settings, Wallet, CreditCard as Edit3, Eye, Trash2, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GameTemplateModal from '../components/GameTemplateModal';
import { gameService } from '../utils/gameService';
import { Game as DbGame } from '../utils/supabase';

interface GameDisplay {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  plays: number;
  revenue: number;
  rating: number;
  status: 'published' | 'draft';
}

export default function CreatorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('games');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [creatorStats, setCreatorStats] = useState({
    totalRevenue: 0,
    totalPlays: 0,
    gamesPublished: 0
  });

  const [userGames, setUserGames] = useState<GameDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserGames();
  }, [user]);

  const loadUserGames = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const games = await gameService.getMyGames();

      let totalRevenue = 0;
      let totalPlays = 0;

      const displayGames: GameDisplay[] = games.map((game: DbGame) => {
        const revenue = game.creator_earnings;
        const plays = game.play_count;

        totalRevenue += revenue;
        totalPlays += plays;

        return {
          id: game.id,
          name: game.name,
          description: game.description || 'No description',
          thumbnail: '/api/placeholder/300/200',
          plays,
          revenue,
          rating: 4.5,
          status: game.is_published ? 'published' as const : 'draft' as const
        };
      });

      setUserGames(displayGames);
      setCreatorStats({
        totalRevenue,
        totalPlays,
        gamesPublished: displayGames.filter(g => g.status === 'published').length
      });
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'games', label: 'My Games', icon: Gamepad2 },
    { id: 'create', label: 'Create Game', icon: Plus },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'wallet', label: 'Wallet Settings', icon: Wallet },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Creator Analytics</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-100">Total Revenue</span>
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold">{creatorStats.totalRevenue.toLocaleString()} sats</div>
                <div className="text-sm text-orange-100 mt-2">+15% this month</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Plays</span>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{creatorStats.totalPlays.toLocaleString()}</div>
                <div className="text-sm text-green-600 mt-2">+8% this week</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Games Published</span>
                  <Gamepad2 className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{creatorStats.gamesPublished}</div>
                <div className="text-sm text-gray-500 mt-2">All time</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Game</h3>
              <div className="space-y-4">
                {userGames.slice(0, 5).map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{game.name}</h4>
                        <p className="text-sm text-gray-600">{game.plays} plays</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{game.revenue} sats</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'games':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Games</h2>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Game
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading games...</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGames.map((game) => (
                <div 
                  key={game.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center">
                    <Gamepad2 className="h-16 w-16 text-orange-600" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{game.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        game.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {game.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {game.plays} plays
                      </span>
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 mr-1" />
                        {game.revenue} sats
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/editor/${game.id}`)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors flex items-center justify-center">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Create Game Card */}
              <div 
                onClick={() => setShowTemplateModal(true)}
                className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-300 transition-colors cursor-pointer flex items-center justify-center min-h-[300px] group"
              >
                <div className="text-center">
                  <Plus className="h-16 w-16 text-gray-400 group-hover:text-orange-500 transition-colors mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 group-hover:text-orange-600 transition-colors">
                    Create New Game
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Start from template or build from scratch
                  </p>
                </div>
              </div>
            </div>
            )}
          </div>
        );

      case 'create':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Game</h2>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <Plus className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Starting Point</h3>
              <p className="text-gray-600 mb-6">Select a template to get started quickly, or build from scratch</p>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Browse Templates
              </button>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell players about yourself..."
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
                  <input
                    type="text"
                    placeholder="creator@wallet.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is where your creator revenue will be sent
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Revenue Share</h4>
                  <p className="text-sm text-orange-700">
                    You earn 10% of all entry fees from your games. The more engaging your games, the more you earn!
                  </p>
                </div>

                <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                  Update Wallet
                </button>
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
        userType="creator"
      />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Creator Studio
            </h1>
            <p className="text-gray-600">Build amazing games and earn revenue from every play</p>
          </div>

          {renderContent()}
        </div>
      </div>

      {showTemplateModal && (
        <GameTemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSelect={(template) => {
            setShowTemplateModal(false);
            navigate(`/editor/new-${template.id}`);
          }}
        />
      )}
    </div>
  );
}