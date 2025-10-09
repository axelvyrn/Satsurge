import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Share2, Users, Clock } from 'lucide-react';
import { tournamentService, TournamentRoom } from '../utils/tournamentService';
import { gameService } from '../utils/gameService';
import { createPhaserGame } from '../utils/phaserEngine';
import { dbTournamentService } from '../utils/dbTournamentService';
import { useAuth } from '../contexts/AuthContext';

export default function RoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<TournamentRoom | null>(null);
  const [, setSubmitting] = useState(false);
  const phaserRef = useRef<HTMLDivElement>(null);
  const [phaserGame, setPhaserGame] = useState<Phaser.Game | null>(null);

  const state = (location.state || {}) as { tournamentId?: string; gameId?: string };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Try to recover room from service
    if (roomId) {
      // In-memory service; if not found, create a minimal placeholder
      // For dev we create a placeholder so the page renders
      let r = (tournamentService as any).rooms?.get?.(roomId) || null;
      if (!r && state.gameId) {
        r = tournamentService.createRoom(state.gameId, 'Game', user.id, 0, 1, 16);
        r.id = roomId as string;
      }
      setRoom(r || null);
    }
  }, [roomId, state.gameId, user]);

  useEffect(() => {
    const loadAndRun = async () => {
      if (!state.gameId || !phaserRef.current) return;
      const game = await gameService.getGame(state.gameId);
      const code = game?.generated_code || '';
      if (phaserGame) phaserGame.destroy(true);
      phaserRef.current.innerHTML = '';
      const g = createPhaserGame('room-phaser', code, async (score: number) => {
        await handleSubmitScore(score);
        if (roomId && user) {
          tournamentService.markPlayerPlayed(roomId, user.id, score);
        }
      });
      setPhaserGame(g);
    };
    loadAndRun();
    // cleanup
    return () => {
      if (phaserGame) phaserGame.destroy(true);
    };
  }, [state.gameId]);

  const handleSubmitScore = async (score: number) => {
    if (!state.tournamentId) return;
    try {
      setSubmitting(true);
      await dbTournamentService.submitScore(state.tournamentId, score);
      alert('Score submitted!');
    } catch (e) {
      console.error('Submit score failed:', e);
      alert('Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  const shareRoom = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Room link copied to clipboard');
    } catch {
      // fallback
      prompt('Copy this room link:', url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tournament Room</h2>
              <button
                onClick={shareRoom}
                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                title={window.location.href}
              >
                <Share2 className="h-4 w-4 mr-1" /> satsurge.to/r/{roomId}
              </button>
            </div>
            <div className="h-[600px] p-4">
              <div id="room-phaser" ref={phaserRef} className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Loading game...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Players & Controls (no scores visible) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Players</h3>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="space-y-2 text-sm">
              {(room?.currentPlayers || []).map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-800">{p.username}</span>
                  <span className="text-gray-500 text-xs">{p.hasPaid ? 'paid' : 'free'}</span>
                </div>
              ))}
              {(!room || room.currentPlayers.length === 0) && (
                <div className="text-gray-500">Waiting for players...</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Room Controls</h3>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (!room || !user) return;
                  const res = tournamentService.resignRoom(room.id, user.id);
                  if (!res.success) {
                    alert(res.error || 'Could not resign');
                  } else {
                    alert('Room closed');
                    navigate('/player');
                  }
                }}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Resign & Close Room (Host)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


