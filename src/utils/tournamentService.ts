import { v4 as uuidv4 } from 'uuid';
import { lightningService, LightningInvoice } from './lightningPayments';

export interface TournamentRoom {
  id: string;
  gameId: string;
  gameName: string;
  hostId: string;
  entryFee: number;
  minPlayers: number;
  maxPlayers: number;
  currentPlayers: Player[];
  status: 'waiting' | 'payment' | 'playing' | 'finished';
  createdAt: Date;
  expiresAt: Date;
  paymentInvoices: { [playerId: string]: LightningInvoice };
  prizePool: number;
}

export interface Player {
  id: string;
  username: string;
  walletAddress?: string;
  hasPaid: boolean;
  score?: number;
}

export interface GameResult {
  playerId: string;
  score: number;
  rank: number;
  payout: number;
}

class TournamentService {
  private static instance: TournamentService;
  private rooms: Map<string, TournamentRoom> = new Map();
  private roomTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  public static getInstance(): TournamentService {
    if (!TournamentService.instance) {
      TournamentService.instance = new TournamentService();
    }
    return TournamentService.instance;
  }

  createRoom(gameId: string, gameName: string, hostId: string, entryFee: number, minPlayers: number, maxPlayers: number): TournamentRoom {
    const roomId = uuidv4();
    const room: TournamentRoom = {
      id: roomId,
      gameId,
      gameName,
      hostId,
      entryFee,
      minPlayers,
      maxPlayers,
      currentPlayers: [],
      status: 'waiting',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      paymentInvoices: {},
      prizePool: 0
    };

    this.rooms.set(roomId, room);
    this.startRoomTimer(roomId);
    
    return room;
  }

  joinRoom(roomId: string, player: Player): { success: boolean; room?: TournamentRoom; error?: string } {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.status !== 'waiting') {
      return { success: false, error: 'Room is not accepting players' };
    }

    if (room.currentPlayers.length >= room.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }

    if (room.currentPlayers.find(p => p.id === player.id)) {
      return { success: false, error: 'Player already in room' };
    }

    room.currentPlayers.push({ ...player, hasPaid: false });
    
    // Check if minimum players reached
    if (room.currentPlayers.length >= room.minPlayers) {
      this.initiatePaymentPhase(roomId);
    }

    return { success: true, room };
  }

  private async initiatePaymentPhase(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = 'payment';
    
    // Create invoices for all players
    for (const player of room.currentPlayers) {
      try {
        const invoice = await lightningService.createInvoice(
          room.entryFee,
          `Entry fee for ${room.gameName} tournament`,
          5 // 5 minutes to pay
        );
        room.paymentInvoices[player.id] = invoice;
      } catch (error) {
        console.error(`Failed to create invoice for player ${player.id}:`, error);
      }
    }

    // Start payment monitoring
    this.monitorPayments(roomId);
  }

  private async monitorPayments(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const checkInterval = setInterval(async () => {
      let allPaid = true;
      let totalPaid = 0;

      for (const player of room.currentPlayers) {
        if (!player.hasPaid) {
          const invoice = room.paymentInvoices[player.id];
          if (invoice) {
            const status = await lightningService.checkPaymentStatus(invoice.paymentHash);
            if (status.paid) {
              player.hasPaid = true;
              totalPaid += room.entryFee;
            } else {
              allPaid = false;
            }
          } else {
            allPaid = false;
          }
        } else {
          totalPaid += room.entryFee;
        }
      }

      room.prizePool = totalPaid;

      if (allPaid) {
        clearInterval(checkInterval);
        this.startGame(roomId);
      }

      // Check for payment timeout (5 minutes)
      const paymentDeadline = new Date(Date.now() - 5 * 60 * 1000);
      if (room.createdAt < paymentDeadline) {
        clearInterval(checkInterval);
        this.handlePaymentTimeout(roomId);
      }
    }, 2000); // Check every 2 seconds
  }

  private startGame(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = 'playing';
    console.log(`Game started for room ${roomId} with ${room.currentPlayers.length} players`);
    
    // Game will handle score submission
    // After game ends, call this.finishGame(roomId, results)
  }

  private handlePaymentTimeout(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    // Remove players who didn't pay and refund those who did
    const paidPlayers = room.currentPlayers.filter(p => p.hasPaid);
    const unpaidPlayers = room.currentPlayers.filter(p => !p.hasPaid);

    if (paidPlayers.length >= room.minPlayers) {
      // Continue with paid players only
      room.currentPlayers = paidPlayers;
      this.startGame(roomId);
    } else {
      // Cancel tournament and refund all payments
      this.cancelRoom(roomId, 'Insufficient players after payment timeout');
    }
  }

  async finishGame(roomId: string, results: GameResult[]) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = 'finished';

    // Calculate payouts
    const totalPool = room.prizePool;
    const winnerPayout = Math.floor(totalPool * 0.75);
    const creatorFee = Math.floor(totalPool * 0.10);
    const platformFee = Math.floor(totalPool * 0.15);

    // Sort results by rank
    results.sort((a, b) => a.rank - b.rank);
    
    // Pay winner
    if (results.length > 0) {
      const winner = room.currentPlayers.find(p => p.id === results[0].playerId);
      if (winner && winner.walletAddress) {
        await this.sendPayout(winner.walletAddress, winnerPayout, `Tournament win: ${room.gameName}`);
      }
    }

    // Pay creator fee (implement creator lookup)
    // await this.sendCreatorFee(room.gameId, creatorFee);

    // Platform fee goes to holonite@speed.app
    await this.sendPayout('holonite@speed.app', platformFee, `Platform fee: ${room.gameName}`);

    console.log(`Tournament ${roomId} finished. Winner payout: ${winnerPayout}, Creator: ${creatorFee}, Platform: ${platformFee}`);
  }

  private async sendPayout(address: string, amount: number, description: string) {
    try {
      // Create invoice request to recipient
      // This would typically involve LNURL-pay or direct Lightning address payment
      console.log(`Sending ${amount} sats to ${address}: ${description}`);
      
      // TODO: Implement actual Lightning payment
      // For now, just log the payout
    } catch (error) {
      console.error(`Failed to send payout to ${address}:`, error);
    }
  }

  private startRoomTimer(roomId: string) {
    const timer = setTimeout(() => {
      this.cancelRoom(roomId, 'Room expired');
    }, 10 * 60 * 1000); // 10 minutes

    this.roomTimers.set(roomId, timer);
  }

  private cancelRoom(roomId: string, reason: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    // Refund any payments made
    for (const player of room.currentPlayers) {
      if (player.hasPaid && player.walletAddress) {
        this.sendPayout(player.walletAddress, room.entryFee, `Refund: ${reason}`);
      }
    }

    // Clean up
    const timer = this.roomTimers.get(roomId);
    if (timer) {
      clearTimeout(timer);
      this.roomTimers.delete(roomId);
    }

    this.rooms.delete(roomId);
    console.log(`Room ${roomId} cancelled: ${reason}`);
  }

  getRoom(roomId: string): TournamentRoom | undefined {
    return this.rooms.get(roomId);
  }

  getActiveRooms(): TournamentRoom[] {
    return Array.from(this.rooms.values()).filter(room => 
      room.status === 'waiting' || room.status === 'payment'
    );
  }

  leaveRoom(roomId: string, playerId: string): { success: boolean; error?: string } {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    const playerIndex = room.currentPlayers.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      return { success: false, error: 'Player not in room' };
    }

    const player = room.currentPlayers[playerIndex];
    
    if (room.status === 'playing') {
      // Player loses by leaving during game
      return { success: false, error: 'Cannot leave during active game' };
    }

    if (player.hasPaid && player.walletAddress) {
      // Refund the player
      this.sendPayout(player.walletAddress, room.entryFee, 'Refund: Left tournament');
    }

    room.currentPlayers.splice(playerIndex, 1);

    // If room becomes empty, cancel it
    if (room.currentPlayers.length === 0) {
      this.cancelRoom(roomId, 'All players left');
    }

    return { success: true };
  }
}

export const tournamentService = TournamentService.getInstance();