import React from 'react';
import { X, Target, Zap, Brain, GamepadIcon, Sparkles, Code } from 'lucide-react';

interface GameTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Skill' | 'Memory' | 'Arcade' | 'Strategy';
}

interface GameTemplateModalProps {
  onClose: () => void;
  onSelect: (template: GameTemplate) => void;
}

const templates: GameTemplate[] = [
  {
    id: 'precision-tap',
    name: 'Precision Tap',
    description: 'Fast-paced clicking game that tests reaction time and accuracy',
    icon: <Target className="h-8 w-8" />,
    difficulty: 'Medium',
    category: 'Skill'
  },
  {
    id: 'mario-dash',
    name: 'Platform Runner',
    description: 'Side-scrolling platformer with obstacles and power-ups',
    icon: <GamepadIcon className="h-8 w-8" />,
    difficulty: 'Hard',
    category: 'Arcade'
  },
  {
    id: 'memory-match',
    name: 'Memory Lightning',
    description: 'Pattern memory game with increasing complexity',
    icon: <Brain className="h-8 w-8" />,
    difficulty: 'Easy',
    category: 'Memory'
  },
  {
    id: 'lightning-rush',
    name: 'Lightning Rush',
    description: 'High-speed reaction game with lightning bolts',
    icon: <Zap className="h-8 w-8" />,
    difficulty: 'Hard',
    category: 'Skill'
  },
  {
    id: 'color-chaos',
    name: 'Color Chaos',
    description: 'Match colors quickly before time runs out',
    icon: <Sparkles className="h-8 w-8" />,
    difficulty: 'Easy',
    category: 'Skill'
  },
  {
    id: 'lucky-streaks',
    name: 'Lucky Streaks',
    description: 'A seemingly skill-based game with hidden mechanics',
    icon: <Target className="h-8 w-8" />,
    difficulty: 'Medium',
    category: 'Strategy'
  },
  {
    id: 'from-scratch',
    name: 'Create from Scratch',
    description: 'Start with a blank canvas and build your own game',
    icon: <Code className="h-8 w-8" />,
    difficulty: 'Hard',
    category: 'Custom'
  }
];

export default function GameTemplateModal({ onClose, onSelect }: GameTemplateModalProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Game Template</h2>
            <p className="text-gray-600 mt-1">Start with a template or build from scratch</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelect(template)}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-orange-500 group-hover:text-orange-600 transition-colors">
                    {template.icon}
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {template.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {template.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                {template.id === 'from-scratch' && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-orange-800">
                      <strong>Advanced:</strong> Use Blockly + Phaser.js visual editor
                    </p>
                  </div>
                )}

                {template.id === 'lucky-streaks' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-purple-800">
                      <strong>Special:</strong> House-favorable mechanics included
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {template.id === 'from-scratch' ? 'Custom' : 'Template'}
                  </span>
                  <button className="text-orange-600 hover:text-orange-700 font-medium text-sm group-hover:underline">
                    Select →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Template Info */}
          <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Features</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-gray-900">Ready-to-Play:</strong>
                <p className="text-gray-600 mt-1">Templates come with complete game logic and assets</p>
              </div>
              <div>
                <strong className="text-gray-900">Customizable:</strong>
                <p className="text-gray-600 mt-1">Modify difficulty, visuals, and game mechanics</p>
              </div>
              <div>
                <strong className="text-gray-900">Revenue Share:</strong>
                <p className="text-gray-600 mt-1">Earn 10% of all entry fees from your published games</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}