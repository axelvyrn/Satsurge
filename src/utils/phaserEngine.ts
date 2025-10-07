import * as Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  public score: number = 0;
  public scoreText: any;
  public gameCode: string = '';
  public submitScore: (score: number) => void;
  public userCreate: ((scene: GameScene) => void) | null = null;
  public userUpdate: ((scene: GameScene) => void) | null = null;
  public isGameOver: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
    this.submitScore = (score: number) => {
      console.log('Final Score:', score);
      // Send score to server for validation
      this.sendScoreToServer(score);
    };
  }

  init(data: { gameCode: string }) {
    this.gameCode = data.gameCode || '';
  }

  preload() {
    // Load default assets
    this.load.image('background', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjk3MzE2Ii8+PC9zdmc+');
  }

  create() {
    // Initialize game scene
    this.add.image(400, 300, 'background').setAlpha(0.1);
    
    // Score display
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#000'
    });

    // Initialize score
    this.score = 0;
    this.isGameOver = false;

    // Enable input
    this.input.setDefaultCursor('pointer');

    // Execute user-generated code
    try {
      const gameFunction = new Function('scene', this.gameCode);
      gameFunction.call(this, this);
      
      // Execute user's create logic if defined
      if (this.userCreate) {
        this.userCreate(this);
      }
    } catch (error) {
      console.error('Game code execution error:', error);
    }
  }

  update() {
    // Game update loop
    if (!this.isGameOver && this.userUpdate) {
      this.userUpdate(this);
    }
  }

  public endGame() {
    this.physics.pause();
    this.submitScore(this.score);
  }

  private sendScoreToServer(score: number) {
    // TODO: Implement server-side score validation
    fetch('/api/submit-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        gameId: 'current-game-id',
        timestamp: Date.now()
      })
    }).catch(console.error);
  }

  public endGame(): void {
    if (this.isGameOver) return;
    this.isGameOver = true;

    try {
      // Disable input
      this.input.enabled = false;
      this.input.keyboard?.removeAllListeners();
      this.input.removeAllListeners();

      // Stop timers and tweens
      this.time.removeAllEvents();
      this.tweens.killAll();

      // Pause physics
      if (this.physics && this.physics.world) {
        this.physics.world.pause();
      }

      // Pause the scene (prevents further updates)
      this.scene.pause();

      // Submit score
      if (this.submitScore) {
        this.submitScore(this.score);
      }
    } catch (e) {
      console.error('Error ending game:', e);
    }
  }
}

export const createPhaserGame = (containerId: string, gameCode: string) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    parent: containerId,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 600
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    },
    scene: []
  };

  const game = new Phaser.Game(config);
  game.scene.add('GameScene', GameScene);
  game.scene.start('GameScene', { gameCode });
  
  return game;
};