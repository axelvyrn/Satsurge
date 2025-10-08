import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Zap,
  Trophy,
  Users,
  Gamepad2,
  ArrowRight,
  Shield,
  Clock,
  Bitcoin,
  Drill
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/satsurge.png';
import backgroundVideo from '../assets/background.mp4';

interface LightningBolt {
  id: number;
  x: number;
  y: number;
  segments: { x1: number; y1: number; x2: number; y2: number }[];
}

export default function HomePage() {
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([]);

  const generateLightningBolt = (startX: number, startY: number): { x1: number; y1: number; x2: number; y2: number }[] => {
    const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
    let currentX = startX;
    let currentY = startY;
    const targetY = window.innerHeight;
    const segmentCount = Math.floor(Math.random() * 8) + 8;

    for (let i = 0; i < segmentCount; i++) {
      const nextX = currentX + (Math.random() - 0.5) * 100;
      const nextY = currentY + (targetY - currentY) / (segmentCount - i) + Math.random() * 50;

      segments.push({
        x1: currentX,
        y1: currentY,
        x2: nextX,
        y2: nextY
      });

      if (Math.random() > 0.7 && i < segmentCount - 2) {
        const branchX = currentX + (Math.random() - 0.5) * 150;
        const branchY = currentY + Math.random() * 100 + 50;
        segments.push({
          x1: currentX,
          y1: currentY,
          x2: branchX,
          y2: branchY
        });
      }

      currentX = nextX;
      currentY = nextY;
    }

    return segments;
  };

  const triggerLightning = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const bolt: LightningBolt = {
      id: Date.now() + Math.random(),
      x,
      y,
      segments: generateLightningBolt(x, y)
    };

    setLightningBolts(prev => [...prev, bolt]);

    setTimeout(() => {
      setLightningBolts(prev => prev.filter(b => b.id !== bolt.id));
    }, 500);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatePresence>
        {lightningBolts.map(bolt => (
          <motion.svg
            key={bolt.id}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ width: '100%', height: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.4, 1] }}
          >
            <defs>
              <filter id={`glow-${bolt.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {bolt.segments.map((segment, idx) => (
              <motion.line
                key={idx}
                x1={segment.x1}
                y1={segment.y1}
                x2={segment.x2}
                y2={segment.y2}
                stroke="#FFD700"
                strokeWidth={Math.random() * 2 + 2}
                strokeLinecap="round"
                filter={`url(#glow-${bolt.id})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: [0, 1, 0.8, 0],
                  stroke: ['#FFD700', '#FFFF00', '#FFD700', '#FFA500']
                }}
                transition={{
                  duration: 0.15,
                  delay: idx * 0.02,
                  times: [0, 0.3, 0.7, 1]
                }}
              />
            ))}
          </motion.svg>
        ))}
      </AnimatePresence>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
              src={logo} 
              alt="Satsurge Logo" 
              className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Satsurge
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link to="/about" className="text-gray-700 hover:text-orange-500 transition-colors">
                About
              </Link>
              <Link to="/docs" className="text-gray-700 hover:text-orange-500 transition-colors">
                Documentation
              </Link>
              <Link to="/help" className="text-gray-700 hover:text-orange-500 transition-colors">
                Help
              </Link>
            </div>

            <Link
              to="/auth"
              onMouseEnter={triggerLightning}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Lightning-Fast
              <span className="block bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Skill Gaming
              </span>
            </motion.h1>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center px-4 py-2 mb-8 mx-auto 
             bg-blue-100 rounded-lg text-xl font-semibold text-blue-800"
            >
              Under Development <Drill className="h-8 w-8 mb-1 ml-2" />
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Enter micro-tournaments with Lightning payments. Create games, compete for sats, 
              and experience instant payouts in the world's most electrifying gaming platform.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/auth"
                onMouseEnter={triggerLightning}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Start Playing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                to="/about"
                onMouseEnter={triggerLightning}
                className="border-2 border-orange-300 text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto"
            >
              <div className="text-center">
                <div className="flex flex-col items-center text-3xl font-bold text-orange-500">
                  <Bitcoin className="h-8 w-8 mb-1" />
                  1M+
                </div>
                <div className="text-sm text-gray-600">Sats Awarded</div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center text-3xl font-bold text-orange-500">
                  <Trophy className="h-8 w-8 mb-1" />
                  500+
                </div>
                <div className="text-sm text-gray-600">Games Created</div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center text-3xl font-bold text-orange-500">
                <Users className="h-8 w-8 mb-1" />
                10K+
              </div>
                <div className="text-sm text-gray-600">Players</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 text-white bg-black/40 rounded-2xl p-8">
            <h2 className="text-4xl font-bold mb-4">We are still in development!</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Please be patient as we work to bring you the best experience possible!
            </p>
            <br />
            <p className="text-xl max-w-2xl mx-auto">
              We are working on a lot of features to make Satsurge as fun and engaging as possible.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-white px-8 py-4 font-semibold">
              Till then, you can check out the site to see what we are working on!
            </div>
            <a
              href="/docs"
              className="ml-4 bg-white text-orange-500 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-orange-500"
            >
              Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Satsurge?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of competitive gaming with Lightning Network integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Instant Payouts",
                description: "Winners receive sats instantly via Lightning Network"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Anti-Cheat",
                description: "Server-side scoring and replay verification"
              },
              {
                icon: <Gamepad2 className="h-8 w-8" />,
                title: "Creator Tools",
                description: "Build games with visual editor and earn revenue"
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Quick Games",
                description: "1-3 minute skill-based micro-tournaments"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-orange-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start earning sats through skill gaming
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Join Tournament",
                description: "Pay entry fee via Lightning invoice and join a skill-based game"
              },
              {
                step: "2", 
                title: "Play & Compete",
                description: "Compete in 1-3 minute skill games against other players"
              },
              {
                step: "3",
                title: "Win Sats",
                description: "Winners split the prize pool with instant Lightning payouts"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Surge?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of players earning sats through skill-based gaming
            </p>
            <Link
              to="/auth"
              onMouseEnter={triggerLightning}
              className="bg-white text-orange-500 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              Get Started Now <Zap className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                src={logo} 
                alt="Satsurge Logo" 
                className="h-6 w-6 object-contain"
                />
                <span className="text-xl font-bold">Satsurge</span>
              </div>
              <p className="text-gray-400">
                Lightning-powered skill gaming platform
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-orange-400">About</Link></li>
                <li><Link to="/docs" className="hover:text-orange-400">Documentation</Link></li>
                <li><a href="#" className="hover:text-orange-400">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400">Discord</a></li>
                <li><a href="#" className="hover:text-orange-400">Twitter</a></li>
                <li><a href="https://github.com/axelvyrn/Satsurge" className="hover:text-orange-400">GitHub</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-orange-400">Help Center</Link></li>
                <li><a href="https://keybase.io/istealkids" className="hover:text-orange-400">Contact</a></li>
                <li><Link to="/status" className="hover:text-orange-400">Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Satsurge. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Bitcoin className="h-5 w-5 text-orange-500 bitcoin-spin" />
              <span className="text-sm text-gray-400">Powered by Lightning Network</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
