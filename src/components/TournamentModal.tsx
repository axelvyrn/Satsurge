import { useRef, useState } from 'react';
import { X, Users, Clock, Zap, Trophy, QrCode } from 'lucide-react';
import { tournamentService } from '../utils/tournamentService';
import { lightningService } from '../utils/lightningPayments';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dbTournamentService } from '../utils/dbTournamentService';

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

interface TournamentModalProps {
  tournament: Tournament;
  onClose: () => void;
}

export default function TournamentModal({ tournament, onClose }: TournamentModalProps) {
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [devBypass] = useState(true);
  const [paymentInvoice, setPaymentInvoice] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'pending' | 'paid' | 'failed'>('waiting');
  const { user } = useAuth();
  const phaserRef = useRef<HTMLDivElement>(null);

  const winnerAmount = Math.floor(tournament.pool * 0.75);
  const creatorFee = Math.floor(tournament.pool * 0.10);
  const platformFee = Math.floor(tournament.pool * 0.15);

  const handleJoinTournament = async () => {
    if (!user) return;

    // Register join in DB (dev: free)
    try {
      await dbTournamentService.joinTournament(tournament.id);
    } catch (e) {
      console.error('Failed to join tournament in DB:', e);
    }

    const isSinglePlayer = tournament.maxPlayers <= 1;
    const minPlayers = isSinglePlayer ? 1 : 2;

    if (devBypass || tournament.entryFee === 0) {
      // Create a transient room and navigate to it
      const room = tournamentService.createRoom(
        tournament.gameId,
        tournament.game,
        user.id,
        tournament.entryFee,
        minPlayers,
        tournament.maxPlayers
      );
      navigate(`/room/${room.id}`, { state: { tournamentId: tournament.id, gameId: tournament.gameId } });
      onClose();
      return;
    }

    // Otherwise show payment flow (kept for future real payments)
    const room = tournamentService.createRoom(
      tournament.gameId,
      tournament.game,
      user.id,
      tournament.entryFee,
      minPlayers,
      tournament.maxPlayers
    );

    const joinResult = tournamentService.joinRoom(room.id, {
      id: user.id,
      username: user.username,
      walletAddress: user.walletAddress,
      hasPaid: false
    });

    if (joinResult.success && joinResult.room) {
      // no-op; room navigation occurs via route
      if (joinResult.room.status === 'payment') {
        const invoice = joinResult.room.paymentInvoices[user.id];
        if (invoice) {
          setPaymentInvoice(invoice.paymentRequest);
          setShowPayment(true);
          setPaymentStatus('pending');
          monitorPayment(invoice.paymentHash);
        }
      }
    }
  };

  const monitorPayment = async (paymentHash: string) => {
    const checkPayment = async () => {
      const status = await lightningService.checkPaymentStatus(paymentHash);
      if (status.paid) {
        setPaymentStatus('paid');
        // Game will start automatically when all players pay
      } else if (status.error) {
        setPaymentStatus('failed');
      }
    };

    // Check every 2 seconds
    const interval = setInterval(checkPayment, 2000);
    
    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      if (paymentStatus === 'pending') {
        setPaymentStatus('failed');
      }
    }, 5 * 60 * 1000);
  };

  const handleWebLNPayment = async () => {
    if (!paymentInvoice) return;
    
    const result = await lightningService.payWithWebLN(paymentInvoice);
    if (result.success) {
      setPaymentStatus('paid');
    } else {
      alert(result.error || 'Payment failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{tournament.game}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {!showPayment ? (
          <div className="p-6 space-y-6">
            {/* Tournament Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{tournament.players}/{tournament.maxPlayers}</div>
                <div className="text-sm text-gray-600">Players</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{tournament.timeLeft}</div>
                <div className="text-sm text-gray-600">Time Left</div>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-6 text-white text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{tournament.pool} sats</div>
              <div className="text-orange-100">Total Prize Pool</div>
            </div>

            {/* Prize Distribution */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Prize Distribution</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Winner (75%)</span>
                  <span className="font-semibold text-green-600">{winnerAmount} sats</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Creator (10%)</span>
                  <span className="font-semibold text-blue-600">{creatorFee} sats</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">Platform (15%)</span>
                  <span className="font-semibold text-orange-600">{platformFee} sats</span>
                </div>
              </div>
            </div>

            {/* Entry Fee */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="font-medium text-gray-900">Entry Fee</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{tournament.entryFee} sats</span>
              </div>
            </div>

            {/* Dev Fee Bypass Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">Dev mode: Entry fee waived for now.</p>
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoinTournament}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              {devBypass || tournament.entryFee === 0 ? 'Join & Play (Free)' : 'Join Tournament'}
            </button>

            {/* Inline Game Surface (appears after join in dev mode) */}
            <div className="mt-4">
              <div id="player-phaser" ref={phaserRef} className="w-full h-72 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Game will load here after joining</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Payment Header */}
            <div className="text-center">
              <QrCode className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pay Entry Fee</h3>
              <p className="text-gray-600">
                {paymentStatus === 'pending' ? 'Waiting for payment...' :
                 paymentStatus === 'paid' ? 'Payment confirmed! Waiting for game to start...' :
                 paymentStatus === 'failed' ? 'Payment failed or expired' :
                 'Scan QR code or pay Lightning invoice'}
              </p>
            </div>

            {/* QR Code Placeholder */}
            {paymentInvoice && (
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Lightning Invoice QR</p>
                    <p className="text-xs text-gray-400 mt-1">{tournament.entryFee} sats</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lightning Invoice */}
            {paymentInvoice && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lightning Invoice
                </label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                  <code className="text-xs text-gray-600 break-all">
                    {paymentInvoice}
                  </code>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(paymentInvoice)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Copy Invoice
                  </button>
                  <button 
                    onClick={handleWebLNPayment}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Pay with WebLN
                  </button>
                </div>
              </div>
            )}

            {/* Timer */}
            {paymentStatus === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-800">Payment expires in:</span>
                  <span className="font-semibold text-yellow-900">4:30</span>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {paymentStatus === 'paid' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✓ Payment confirmed!</p>
                <p className="text-sm text-green-700 mt-1">Waiting for other players to pay...</p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">✗ Payment failed or expired</p>
                <p className="text-sm text-red-700 mt-1">Please try joining another tournament.</p>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => setShowPayment(false)}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}