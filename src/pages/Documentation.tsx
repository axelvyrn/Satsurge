import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Code, Gamepad2, Book } from 'lucide-react';

export default function Documentation() {
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
          <Book className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Game Creator <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Documentation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to create engaging skill-based games using our visual editor powered by Blockly and Phaser.js
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="h-8 w-8 text-orange-500 mr-3" />
            Quick Start Guide
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose a Template</h3>
                <p className="text-gray-700">Start with one of our pre-built game templates or create from scratch using our visual editor.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Design Your Game</h3>
                <p className="text-gray-700">Use drag-and-drop blocks to define game mechanics, scoring, and player interactions.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Test & Preview</h3>
                <p className="text-gray-700">Use the built-in preview to test your game mechanics and ensure balanced gameplay.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Publish & Earn</h3>
                <p className="text-gray-700">Pay the 100 sats publishing fee and start earning 10% of all tournament entry fees.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Block Categories */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="h-8 w-8 text-orange-500 mr-3" />
            Block Categories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Game Events</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <code>when game starts</code> - Runs when the game begins</li>
                <li>• <code>when clicked/key pressed/touch</code> - Handles player input</li>
                <li>• <code>collision detection</code> - Detects object interactions</li>
                <li>• <code>timer events</code> - Triggers after delays</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Game Objects</h3>
              <ul className="space-y-2 text-green-800">
                <li>• <code>create sprite</code> - Add visual game objects</li>
                <li>• <code>move sprite</code> - Animate sprite movement</li>
                <li>• <code>create text</code> - Display scores, timers</li>
                <li>• <code>play sound</code> - Add audio feedback</li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Game Logic</h3>
              <ul className="space-y-2 text-purple-800">
                <li>• <code>if/then</code> - Conditional game flow</li>
                <li>• <code>repeat</code> - Loop game actions</li>
                <li>• <code>wait seconds</code> - Add timing delays</li>
                <li>• <code>random</code> - Generate unpredictability</li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-yellow-900 mb-3">Scoring</h3>
              <ul className="space-y-2 text-yellow-800">
                <li>• <code>add points</code> - Increase player score</li>
                <li>• <code>subtract points</code> - Penalty system</li>
                <li>• <code>set score</code> - Direct score control</li>
                <li>• <code>end game</code> - Finish and submit score</li>
              </ul>
            </div>
          </div>
          
          {/* Code Examples */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Example: Simple Clicking Game</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`1. Drag "when game starts" block
2. Inside it, add "create sprite" named "target" at x:400, y:300
3. Add "when clicked" block
4. Inside it, add "add points" with value 10
5. Add "wait seconds" with value 30
6. Add "end game" block

This creates a 30-second clicking game where players earn 10 points per click!`}
              </pre>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Features</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Variables & Math</h3>
              <p className="text-gray-700 mb-3">Use variables to store game state and math blocks for calculations:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Create variables for health, lives, or power-ups</li>
                <li>Use math operations for scoring multipliers</li>
                <li>Compare values for win/lose conditions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Loops & Conditions</h3>
              <p className="text-gray-700 mb-3">Control game flow with logic blocks:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><code>if/then</code> blocks for conditional actions</li>
                <li><code>repeat</code> blocks for animations or spawning</li>
                <li>Combine conditions with <code>and/or</code> logic</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sprite Management</h3>
              <p className="text-gray-700 mb-3">Create dynamic, interactive game objects:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Position sprites with x/y coordinates</li>
                <li>Move sprites smoothly with velocity</li>
                <li>Detect when sprites overlap or collide</li>
                <li>Change sprite appearance based on game state</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Game Design Principles */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Gamepad2 className="h-8 w-8 text-orange-500 mr-3" />
            Game Design Principles
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Skill-Based Gameplay</h3>
              <p className="text-gray-700 mb-3">
                Ensure your game rewards player skill, not luck. Focus on:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Reaction time and precision</li>
                <li>Pattern recognition and memory</li>
                <li>Strategic thinking and planning</li>
                <li>Hand-eye coordination</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Fair Competition</h3>
              <p className="text-gray-700 mb-3">
                Design games that give all players an equal chance:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Consistent difficulty across sessions</li>
                <li>Clear scoring criteria</li>
                <li>No hidden advantages or disadvantages</li>
                <li>Balanced risk vs. reward mechanics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Engaging Experience</h3>
              <p className="text-gray-700 mb-3">
                Keep players engaged with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Quick, 1-3 minute gameplay sessions</li>
                <li>Immediate feedback and scoring</li>
                <li>Progressive difficulty or complexity</li>
                <li>Clear win/loss conditions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Anti-Cheat Guidelines */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-red-900 mb-6">Anti-Cheat Guidelines</h2>
          
          <div className="space-y-4 text-red-800">
            <p className="font-semibold">⚠️ Important: All games are subject to server-side validation</p>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Do:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Design games with measurable skill components</li>
                <li>Use consistent timing and difficulty</li>
                <li>Implement clear scoring rules</li>
                <li>Test thoroughly for balance</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Don't:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Create games that can be easily automated</li>
                <li>Hide scoring logic from players</li>
                <li>Design games with unpredictable elements as primary mechanics</li>
                <li>Make games that favor specific input methods</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Creator Revenue Model</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-100">Publishing Fee</h3>
              <div className="text-3xl font-bold mb-2">100 sats</div>
              <p className="text-orange-100">One-time fee per game to cover hosting and validation costs</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-100">Revenue Share</h3>
              <div className="text-3xl font-bold mb-2">10%</div>
              <p className="text-orange-100">Of all tournament entry fees from players using your games</p>
            </div>
          </div>

          <div className="mt-8 bg-white/20 rounded-xl p-6">
            <h4 className="font-semibold mb-2 text-orange-100">Example Earnings:</h4>
            <p className="text-orange-100">
              If 100 players each pay 50 sats to play your game, you earn 500 sats (10% of 5,000 total entry fees)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}