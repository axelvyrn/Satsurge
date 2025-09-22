import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Users, 
  Trophy, 
  Gamepad2, 
  ArrowLeft,
  Bitcoin,
  Star,
  Target,
  Clock
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-orange-500" />
              <Zap className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Satsurge
              </span>
            </Link>
            
            <Link 
              to="/auth" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Satsurge</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The world's first Lightning Network-powered skill gaming platform where players compete in micro-tournaments for Bitcoin rewards.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            We're revolutionizing competitive gaming by combining skill-based gameplay with the speed and transparency of Bitcoin's Lightning Network. Our platform enables instant, global competitions where talent is rewarded immediately with real value.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Satsurge Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 text-orange-500 mr-2" />
                For Players
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pay small Lightning fees (50-500 sats) to enter tournaments
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Compete in 1-3 minute skill-based challenges
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Winners receive 75% of prize pool instantly via Lightning
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Gamepad2 className="h-6 w-6 text-orange-500 mr-2" />
                For Creators
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Use our visual game editor powered by Blockly + Phaser
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Publish games from templates or build from scratch
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Earn 10% of all entry fees from your games
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <div className="flex items-center mb-6">
            <Bitcoin className="h-8 w-8 text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Revenue Distribution</h2>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Example: 4-player tournament with 100 sats entry fee</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Pool (4 × 100 sats)</span>
                <span className="font-semibold">400 sats</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Winner receives (75%)</span>
                <span className="font-semibold text-green-600">300 sats</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Creator share (10%)</span>
                <span className="font-semibold text-blue-600">40 sats</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Platform fee (15%)</span>
                <span className="font-semibold text-orange-600">60 sats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-orange-500" />,
                title: "Anti-Cheat System",
                description: "Server-side scoring, replay verification, and bot detection ensure fair play"
              },
              {
                icon: <Zap className="h-8 w-8 text-orange-500" />,
                title: "Lightning Fast",
                description: "Instant payments and payouts using Bitcoin's Lightning Network"
              },
              {
                icon: <Trophy className="h-8 w-8 text-orange-500" />,
                title: "Competitive",
                description: "Leaderboards, tournaments, and skill-based matchmaking"
              },
              {
                icon: <Gamepad2 className="h-8 w-8 text-orange-500" />,
                title: "Creator Economy", 
                description: "Visual game editor and revenue sharing for content creators"
              },
              {
                icon: <Star className="h-8 w-8 text-orange-500" />,
                title: "Provably Fair",
                description: "Open-source RNG and transparent payout ledger"
              },
              {
                icon: <Clock className="h-8 w-8 text-orange-500" />,
                title: "Quick Games",
                description: "Micro-tournaments designed for 1-3 minute gameplay sessions"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Surge?</h2>
          <p className="text-xl mb-6 text-orange-100">
            Start earning sats through skill-based gaming today
          </p>
          <Link 
            to="/auth" 
            className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all inline-flex items-center"
          >
            Get Started <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}