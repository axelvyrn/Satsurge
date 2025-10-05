import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, Save, Settings, Eye, Zap } from 'lucide-react';
import * as Blockly from 'blockly/core';
import { Xml } from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { createToolbox } from '../utils/blocklyConfig';
import { createPhaserGame } from '../utils/phaserEngine';
import { gameService } from '../utils/gameService';
import { Game } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function GameEditor() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameData, setGameData] = useState<Game | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const blocklyRef = useRef<HTMLDivElement>(null);
  const phaserRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [phaserGame, setPhaserGame] = useState<Phaser.Game | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadGame();
  }, [gameId, user]);

  const loadGame = async () => {
    try {
      setLoadError(null);

      if (gameId === 'from-scratch') {
        setGameData({
          id: '',
          creator_id: user!.id,
          name: 'New Game',
          template_type: 'from-scratch',
          difficulty: 'medium',
          suggested_entry_fee: 100,
          is_published: false,
          play_count: 0,
          creator_earnings: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Game);
      } else if (gameId?.startsWith('new-')) {
        const templateType = gameId.replace('new-', '');
        setGameData({
          id: '',
          creator_id: user!.id,
          name: getTemplateName(templateType),
          template_type: templateType,
          blockly_xml: getTemplateBlocks(templateType),
          difficulty: 'medium',
          suggested_entry_fee: 100,
          is_published: false,
          play_count: 0,
          creator_earnings: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Game);
      } else if (gameId) {
        const game = await gameService.getGame(gameId);
        if (game) {
          setGameData(game);
        } else {
          setLoadError('Game not found');
        }
      }
    } catch (error) {
      console.error('Error loading game:', error);
      setLoadError('Failed to load game');
    }
  };

  useEffect(() => {
    if (gameData && blocklyRef.current && !workspaceRef.current) {
      initializeBlockly();
    }
  }, [gameData]);

  useEffect(() => {
    return () => {
      if (workspaceRef.current) {
        try {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
        } catch (e) {
          console.error('Error disposing workspace:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (phaserGame) {
        phaserGame.destroy(true);
      }
    };
  }, [phaserGame]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden - preserving workspace state');
      } else {
        console.log('Page visible - workspace preserved');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const getTemplateName = (id: string) => {
    const templates: { [key: string]: string } = {
      'precision-tap': 'Precision Tap Master',
      'mario-dash': 'Platform Runner',
      'memory-match': 'Memory Lightning',
      'lightning-rush': 'Lightning Rush',
      'color-chaos': 'Color Chaos',
      'lucky-streaks': 'Lucky Streaks',
      'from-scratch': 'New Game'
    };
    return templates[id] || 'Unknown Game';
  };

  const getTemplateBlocks = (id: string) => {
    const templates: { [key: string]: string } = {
      'precision-tap': `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="game_start" x="20" y="20">
          <statement name="DO">
            <block type="create_sprite">
              <field name="NAME">target</field>
              <field name="X">400</field>
              <field name="Y">300</field>
              <next>
                <block type="player_input">
                  <field name="INPUT_TYPE">click</field>
                  <statement name="DO">
                    <block type="add_points">
                      <field name="POINTS">10</field>
                    </block>
                  </statement>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>`,
      'lucky-streaks': `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="game_start" x="20" y="20">
          <statement name="DO">
            <block type="create_sprite">
              <field name="NAME">coin</field>
              <field name="X">400</field>
              <field name="Y">300</field>
              <next>
                <block type="player_input">
                  <field name="INPUT_TYPE">click</field>
                  <statement name="DO">
                    <block type="controls_if">
                      <value name="IF0">
                        <block type="logic_compare">
                          <field name="OP">LT</field>
                          <value name="A">
                            <block type="math_random_int">
                              <value name="FROM">
                                <block type="math_number">
                                  <field name="NUM">1</field>
                                </block>
                              </value>
                              <value name="TO">
                                <block type="math_number">
                                  <field name="NUM">100</field>
                                </block>
                              </value>
                            </block>
                          </value>
                          <value name="B">
                            <block type="math_number">
                              <field name="NUM">95</field>
                            </block>
                          </value>
                        </block>
                      </value>
                      <statement name="DO0">
                        <block type="add_points">
                          <field name="POINTS">100</field>
                        </block>
                      </statement>
                      <next>
                        <block type="wait_seconds">
                          <field name="SECONDS">30</field>
                          <next>
                            <block type="end_game"></block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </statement>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>`
    };
    return templates[id] || '';
  };
  const initializeBlockly = () => {
    if (blocklyRef.current && !blocklyRef.current.hasChildNodes() && !workspaceRef.current) {
      // Create workspace
      const newWorkspace = Blockly.inject(blocklyRef.current, {
        toolbox: createToolbox(),
        collapse: true,
        comments: true,
        disable: true,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: 'start',
        css: true,
        media: 'https://unpkg.com/blockly/media/',
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        }
      });

      workspaceRef.current = newWorkspace;

      if (gameData?.blockly_xml) {
        try {
          const xml = Xml.textToDom(gameData.blockly_xml);
          Xml.domToWorkspace(xml, newWorkspace);
        } catch (error) {
          console.error('Error loading blocks:', error);
        }
      }

      // Listen for changes
      newWorkspace.addChangeListener(() => {
        const code = javascriptGenerator.workspaceToCode(newWorkspace);
        setGeneratedCode(code);
      });
    }
  };

  const runGame = () => {
    if (phaserRef.current) {
      // Clear previous game
      if (phaserGame) {
        phaserGame.destroy(true);
      }
      
      // Clear container
      phaserRef.current.innerHTML = '';
      
      // Create new game with generated code
      const game = createPhaserGame('phaser-container', generatedCode);
      setPhaserGame(game);
    }
  };

  const handleSave = async () => {
    if (!workspaceRef.current || !gameData) return;

    try {
      setIsSaving(true);
      const xml = Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Xml.domToText(xml);
      const freshCode = javascriptGenerator.workspaceToCode(workspaceRef.current);

      const gameUpdates = {
        name: gameData.name,
        description: gameData.description,
        blockly_xml: xmlText,
        generated_code: freshCode,
        difficulty: gameData.difficulty,
        suggested_entry_fee: gameData.suggested_entry_fee,
        template_type: gameData.template_type,
      };

      if (gameData.id) {
        const updated = await gameService.updateGame(gameData.id, gameUpdates);
        if (updated) {
          setGameData(updated);
          setGeneratedCode(freshCode);
          alert('Game saved successfully!');
        }
      } else {
        const created = await gameService.createGame(gameUpdates);
        if (created) {
          setGameData(created);
          setGeneratedCode(freshCode);
          navigate(`/editor/${created.id}`, { replace: true });
          alert('Game created successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Failed to save game. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!gameData || !gameData.id) {
      alert('Please save your game before publishing');
      return;
    }

    if (!generatedCode.trim()) {
      alert('Please create your game logic before publishing');
      return;
    }

    try {
      setIsPublishing(true);
      await handleSave();
      await gameService.publishGame(gameData.id, 100);
      alert('Game published successfully! (100 sats will be charged via Lightning)');
      await loadGame();
    } catch (error) {
      console.error('Error publishing game:', error);
      alert('Failed to publish game. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/creator"
                className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {gameData?.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {gameId === 'from-scratch' ? 'Custom Game' : 'Template'} Editor
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isPublishing || !gameData?.id}
                className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isPublishing ? 'Publishing...' : gameData?.is_published ? 'Published' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {loadError && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{loadError}</p>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Blockly Editor Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Visual Editor</h2>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <div ref={blocklyRef} className="h-full p-4"></div>
          </div>

          {/* Phaser Preview Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Game Preview</h2>
              <button
                onClick={runGame}
                className="flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
              >
                <Play className="h-4 w-4 mr-1" />
                Run
              </button>
            </div>
            <div className="h-full p-4">
              <div id="phaser-container" ref={phaserRef} className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <Play className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p>Click "Run" to preview your game</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Settings Panel */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Settings</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Name
              </label>
              <input
                type="text"
                value={gameData?.name || ''}
                onChange={(e) => setGameData(gameData ? { ...gameData, name: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={gameData?.difficulty || 'medium'}
                onChange={(e) => setGameData(gameData ? { ...gameData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggested Entry Fee (sats)
              </label>
              <input
                type="number"
                value={gameData?.suggested_entry_fee || 100}
                onChange={(e) => setGameData(gameData ? { ...gameData, suggested_entry_fee: parseInt(e.target.value) || 100 } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game Description
            </label>
            <textarea
              rows={3}
              value={gameData?.description || ''}
              onChange={(e) => setGameData(gameData ? { ...gameData, description: e.target.value } : null)}
              placeholder="Describe your game for players..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Creator Fee Notice */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">Creator Fee</h4>
              <p className="text-sm text-orange-700">
                Publishing this game will cost 100 sats. You'll earn 10% of all entry fees from players who compete in tournaments using your game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}