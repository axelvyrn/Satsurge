import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import bitcoin from '../assets/bitcoin.svg'
import { SpaceDefender } from '../animations/spacedefender'

export default function NotFoundPage() {
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setGameActive(true);
  };

  const closeGame = () => {
    setGameActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="text-9xl font-bold mb-4 relative"
            animate={{
              textShadow: [
                '0 0 20px #ff00ff, 0 0 40px #00ffff',
                '0 0 40px #00ffff, 0 0 80px #ff00ff',
                '0 0 20px #ff00ff, 0 0 40px #00ffff',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              404
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-cyan-300 mb-8 font-mono"
          >
            ERROR: Reality Not Found
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-gray-300 max-w-md mb-4">
              You've drifted into uncharted space. The page you're looking for doesn't exist in this dimension.
            </p>

            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </Link>

          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-gray-500 text-sm font-mono">
            // Something feels off about this page...
          </p>
        </motion.div>
      </div>

      {/* Drifting Bitcoin Logo */}
      <motion.div
        className="fixed z-20 cursor-pointer"
        onClick={startGame}
        animate={{
          x: [0, '20vw', '-10vw', '30vw', '-20vw', '40vw', '10vw', '50vw', '-30vw', '60vw', '0vw'],
          y: [0, '-10vh', '20vh', '-5vh', '30vh', '-15vh', '40vh', '5vh', '-25vh', '50vh', '0vh'],
          rotate: [0, 360, 720, 1080, 1440, 1800],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ scale: 1.2 }}
        style={{
          left: '5%',
          top: '10%',
        }}
      >
        <motion.div
          className="relative"
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Bitcoin Logo SVG */}
          <img
            src={bitcoin}
            alt="Bitcoin"
            width="40"
            height="40"
            className="text-orange-500 drop-shadow-lg"
          />
          
          {/* Subtle click prompt */}
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            animate={{
              opacity: [0, 1, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          >
            <span className="text-xs text-orange-300 font-mono bg-black/50 px-2 py-1 rounded">
              CLICK!?
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      <SpaceDefender isOpen={gameActive} onClose={closeGame} />
    </div>
  );
}
