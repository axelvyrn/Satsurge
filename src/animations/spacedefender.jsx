import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function SpaceDefender({ isOpen, onClose }) {
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);
  const gameLoopRef = useRef();

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const closeGame = () => {
    setGameState('playing');
    setScore(0);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    const player = {
      x: canvas.width / 2 - 15,
      y: canvas.height - 80,
      width: 30,
      height: 30,
      speed: 5,
      lives: 3,
    };

    const bullets = [];
    const enemies = [];
    const particles = [];

    let currentScore = 0;
    let enemySpawnTimer = 0;
    let gameRunning = true;

    const keys = {};

    const handleKeyDown = (e) => {
      keys[e.key] = true;
      if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) {
        e.preventDefault();
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 10,
        });
      }
    };

    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const createExplosion = (x, y) => {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 60,
        });
      }
    };

    const checkCollision = (a, b) => {
      return a.x < b.x + b.width &&
             a.x + a.width > b.x &&
             a.y < b.y + b.height &&
             a.y + a.height > b.y;
    };

    const gameLoop = () => {
      if (!ctx || !gameRunning) return;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#1a1a2e';
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 197.3) % canvas.height;
        ctx.fillRect(x, y, 2, 2);
      }

      if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(0, player.x - player.speed);
      if (keys['ArrowRight'] || keys['d']) player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      if (keys['ArrowUp'] || keys['w']) player.y = Math.max(0, player.y - player.speed);
      if (keys['ArrowDown'] || keys['s']) player.y = Math.min(canvas.height - player.height, player.y + player.speed);

      ctx.fillStyle = '#00ff88';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(player.x + 5, player.y + 5, 20, 20);
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(player.x + 10, player.y + 10, 10, 10);

      bullets.forEach((bullet, index) => {
        bullet.y -= 8;
        if (bullet.y < 0) {
          bullets.splice(index, 1);
        }
      });

      bullets.forEach(bullet => {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      enemySpawnTimer++;
      if (enemySpawnTimer > 60) {
        enemies.push({
          x: Math.random() * (canvas.width - 40),
          y: -40,
          width: 40,
          height: 40,
        });
        enemySpawnTimer = 0;
      }

      enemies.forEach((enemy, index) => {
        enemy.y += 3;
        if (enemy.y > canvas.height) {
          enemies.splice(index, 1);
        }
      });

      enemies.forEach((enemy, enemyIndex) => {
        bullets.forEach((bullet, bulletIndex) => {
          if (checkCollision(bullet, enemy)) {
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            enemies.splice(enemyIndex, 1);
            bullets.splice(bulletIndex, 1);
            currentScore += 10;
            setScore(currentScore);
          }
        });
      });

      enemies.forEach(enemy => {
        ctx.fillStyle = '#ff0066';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.fillStyle = '#ff3388';
        ctx.fillRect(enemy.x + 5, enemy.y + 5, 30, 30);
        ctx.fillStyle = '#ff0066';
        ctx.fillRect(enemy.x + 10, enemy.y + 10, 20, 20);
      });

      enemies.forEach((enemy, index) => {
        if (checkCollision(player, enemy)) {
          createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
          enemies.splice(index, 1);
          player.lives--;
          if (player.lives <= 0) {
            gameRunning = false;
            setGameState('lost');
          }
        }
      });

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });

      particles.forEach(particle => {
        const alpha = particle.life / 60;
        ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, ${alpha})`;
        ctx.fillRect(particle.x, particle.y, 3, 3);
      });

      if (currentScore >= 200) {
        gameRunning = false;
        setGameState('won');
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '20px monospace';
      ctx.fillText(`Score: ${currentScore}`, 10, 30);
      ctx.fillText(`Lives: ${player.lives}`, 10, 60);

      if (gameRunning) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <div className="relative bg-slate-900 rounded-lg p-4 sm:p-6 max-w-4xl w-full my-4 max-h-[95vh] overflow-y-auto">
        <button
          onClick={closeGame}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-red-500 transition-colors z-10 bg-slate-800 rounded-full p-2"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            SPACE DEFENDER
          </h2>
          <p className="text-cyan-300 text-xs sm:text-sm font-mono mb-2">
            Arrow Keys / WASD to move • SPACE to shoot
          </p>
          {gameState === 'playing' && (
            <p className="text-yellow-400 text-xs">
              Reach 200 points to win!
            </p>
          )}
        </div>

        <div className="flex justify-center mb-3 sm:mb-4">
          <canvas
            ref={canvasRef}
            className="border-2 sm:border-4 border-purple-500 rounded-lg shadow-lg shadow-purple-500/50 w-full"
            style={{ maxWidth: '800px', maxHeight: '600px' }}
          />
        </div>

        {gameState === 'won' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg"
          >
            <div className="text-center p-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
              <h3 className="text-4xl font-bold text-white mb-4">VICTORY!</h3>
              <p className="text-2xl text-white mb-2">Final Score: {score}</p>
              <p className="text-green-200 mb-6">You defended space successfully!</p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-green-100 transition-colors mr-2"
              >
                Play Again
              </button>
              <button
                onClick={closeGame}
                className="px-6 py-3 bg-green-800 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'lost' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg"
          >
            <div className="text-center p-8 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg">
              <h3 className="text-4xl font-bold text-white mb-4">GAME OVER</h3>
              <p className="text-2xl text-white mb-2">Final Score: {score}</p>
              <p className="text-red-200 mb-6">The invasion was too strong...</p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors mr-2"
              >
                Try Again
              </button>
              <button
                onClick={closeGame}
                className="px-6 py-3 bg-red-800 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}