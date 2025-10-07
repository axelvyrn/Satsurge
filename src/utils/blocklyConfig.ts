import * as Blockly from 'blockly/core';
import 'blockly/blocks';
// @ts-ignore - Blockly types for locales can be loose
import * as En from 'blockly/msg/en';
import { javascriptGenerator } from 'blockly/javascript';

// Set Blockly locale
(Blockly as any).setLocale(En as any);

const initializeCustomBlocks = (generator: any) => {
  Blockly.Blocks['game_start'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("when game starts");
      this.appendStatementInput("DO")
          .setCheck(null);
      this.setColour(120);
      this.setTooltip("Runs when the game begins");
      this.setHelpUrl("");
    }
  };

  generator.forBlock['game_start'] = function(block: any, generator: any) {
    const statements_do = generator.statementToCode(block, 'DO');
    return `scene.userCreate = async function(scene) {\n${statements_do}};\n`;
  };

  Blockly.Blocks['player_input'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("when")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE")
          .appendField("is")
          .appendField(new Blockly.FieldDropdown([
            ["clicked", "click"],
            ["key pressed", "keydown"],
            ["touch", "touch"],
            ["space pressed", "space"],
            ["arrow key pressed", "arrow"]
          ]), "INPUT_TYPE");
      this.appendStatementInput("DO")
          .setCheck(null);
      this.setColour(120);
      this.setTooltip("Handles player input on a specific sprite");
    }
  };

  generator.forBlock['player_input'] = function(block: any, generator: any) {
    const sprite = block.getFieldValue('SPRITE');
    const dropdown_input_type = block.getFieldValue('INPUT_TYPE');
    const statements_do = generator.statementToCode(block, 'DO');

    let eventCode = '';
    switch(dropdown_input_type) {
      case 'click':
        eventCode = `this.time.delayedCall(10, () => { if(this.${sprite}) { this.input.setTopOnly(true); this.${sprite}.setInteractive({ useHandCursor: true }); this.${sprite}.on('pointerdown', async () => { if(this.isGameOver) return;\n${statements_do}}); } }, [], this);`;
        break;
      case 'keydown':
        eventCode = `this.time.delayedCall(10, () => { if(!this._allKeysListener) { this._allKeysListener = true; this.input.keyboard.on('keydown', async (ev: KeyboardEvent) => { if(this.isGameOver) return; ${statements_do} }); } }, [], this);`;
        break;
      case 'space':
        eventCode = `this.time.delayedCall(10, () => { if(!this._spaceListener) { this._spaceListener = true; this.input.keyboard.on('keydown-SPACE', async () => { if(this.isGameOver) return;\n${statements_do}}); } }, [], this);`;
        break;
      case 'arrow':
        eventCode = `this.time.delayedCall(10, () => { if(!this._arrowListeners) { this._arrowListeners = true; this.input.keyboard.on('keydown-UP', async () => { if(this.isGameOver) return;\n${statements_do}}); this.input.keyboard.on('keydown-DOWN', async () => { if(this.isGameOver) return;\n${statements_do}}); this.input.keyboard.on('keydown-LEFT', async () => { if(this.isGameOver) return;\n${statements_do}}); this.input.keyboard.on('keydown-RIGHT', async () => { if(this.isGameOver) return;\n${statements_do}}); } }, [], this);`;
        break;
      default:
        eventCode = `this.time.delayedCall(10, () => { if(!this._pointerListener) { this._pointerListener = true; this.input.on('pointerdown', async () => { if(this.isGameOver) return;\n${statements_do}}); } }, [], this);`;
    }

    return eventCode + '\n';
  };

  Blockly.Blocks['game_update'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("every frame");
      this.appendStatementInput("DO")
          .setCheck(null);
      this.setColour(120);
      this.setTooltip("Runs every frame");
    }
  };

  generator.forBlock['game_update'] = function(block: any, generator: any) {
    const statements_do = generator.statementToCode(block, 'DO');
    return `scene.userUpdate = async function(scene) {\n${statements_do}};\n`;
  };

  Blockly.Blocks['create_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("create sprite")
          .appendField(new Blockly.FieldTextInput("player"), "NAME");
      this.appendValueInput("X")
          .setCheck("Number")
          .appendField("at x:");
      this.appendValueInput("Y")
          .setCheck("Number")
          .appendField("y:");
      this.appendDummyInput()
          .appendField("color:")
          .appendField(new Blockly.FieldDropdown([
            ["orange", "0xff6600"],
            ["red", "0xff0000"],
            ["blue", "0x0066ff"],
            ["green", "0x00ff00"],
            ["yellow", "0xffff00"],
            ["purple", "0x9900ff"]
          ]), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Creates a sprite at specified position");
    }
  };

  generator.forBlock['create_sprite'] = function(block: any, generator: any) {
    const text_name = block.getFieldValue('NAME');
    const value_x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '100';
    const value_y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '100';
    const color = block.getFieldValue('COLOR');
    return `this.${text_name} = this.add.rectangle(${value_x}, ${value_y}, 50, 50, ${color}); this.${text_name}.setInteractive(); this.physics.add.existing(this.${text_name}); if(this.${text_name}.body) { this.${text_name}.body.setAllowGravity(false); this.${text_name}.body.setImmovable(true); }\n`;
  };

  Blockly.Blocks['create_circle'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("create circle")
          .appendField(new Blockly.FieldTextInput("ball"), "NAME");
      this.appendValueInput("X")
          .setCheck("Number")
          .appendField("at x:");
      this.appendValueInput("Y")
          .setCheck("Number")
          .appendField("y:");
      this.appendValueInput("RADIUS")
          .setCheck("Number")
          .appendField("radius:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Creates a circle sprite");
    }
  };

  generator.forBlock['create_circle'] = function(block: any, generator: any) {
    const text_name = block.getFieldValue('NAME');
    const value_x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '100';
    const value_y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '100';
    const value_radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '25';
    return `this.${text_name} = this.add.circle(${value_x}, ${value_y}, ${value_radius}, 0x00ff00); this.physics.add.existing(this.${text_name}); if(this.${text_name}.body) { this.${text_name}.body.setAllowGravity(false); this.${text_name}.body.setImmovable(true); }\n`;
  };

  Blockly.Blocks['create_text'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("create text")
          .appendField(new Blockly.FieldTextInput("Hello"), "TEXT");
      this.appendValueInput("X")
          .setCheck("Number")
          .appendField("at x:");
      this.appendValueInput("Y")
          .setCheck("Number")
          .appendField("y:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Creates text on screen");
    }
  };

  generator.forBlock['create_text'] = function(block: any, generator: any) {
    const text = block.getFieldValue('TEXT');
    const value_x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '100';
    const value_y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '100';
    return `scene.add.text(${value_x}, ${value_y}, '${text}', { fontSize: '32px', fill: '#000' });\n`;
  };

  Blockly.Blocks['move_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("move")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE");
      this.appendValueInput("X")
          .setCheck("Number")
          .appendField("by x:");
      this.appendValueInput("Y")
          .setCheck("Number")
          .appendField("y:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Moves a sprite by specified amount");
    }
  };

  generator.forBlock['move_sprite'] = function(block: any, generator: any) {
    const text_sprite = block.getFieldValue('SPRITE');
    const value_x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '10';
    const value_y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    return `if(this.${text_sprite}) { this.${text_sprite}.x += ${value_x}; this.${text_sprite}.y += ${value_y}; if(this.${text_sprite}.body) { this.${text_sprite}.body.updateFromGameObject(); } }\n`;
  };

  Blockly.Blocks['set_sprite_position'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE");
      this.appendValueInput("X")
          .setCheck("Number")
          .appendField("position to x:");
      this.appendValueInput("Y")
          .setCheck("Number")
          .appendField("y:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Sets sprite to exact position");
    }
  };

  generator.forBlock['set_sprite_position'] = function(block: any, generator: any) {
    const text_sprite = block.getFieldValue('SPRITE');
    const value_x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '100';
    const value_y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '100';
    return `if(scene.${text_sprite}) { scene.${text_sprite}.x = ${value_x}; scene.${text_sprite}.y = ${value_y}; }\n`;
  };

  Blockly.Blocks['hide_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("hide")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Hides a sprite");
    }
  };

  generator.forBlock['hide_sprite'] = function(block: any, generator: any) {
    const text_sprite = block.getFieldValue('SPRITE');
    return `if(scene.${text_sprite}) { scene.${text_sprite}.visible = false; }\n`;
  };

  Blockly.Blocks['show_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("show")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Shows a sprite");
    }
  };

  generator.forBlock['show_sprite'] = function(block: any, generator: any) {
    const text_sprite = block.getFieldValue('SPRITE');
    return `if(scene.${text_sprite}) { scene.${text_sprite}.visible = true; }\n`;
  };

  Blockly.Blocks['set_background_color'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set background color to")
          .appendField(new Blockly.FieldDropdown([
            ["black", "0x000000"],
            ["white", "0xffffff"],
            ["blue", "0x87ceeb"],
            ["green", "0x90ee90"],
            ["red", "0xffcccb"],
            ["yellow", "0xffffe0"]
          ]), "COLOR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("Sets the background color");
    }
  };

  generator.forBlock['set_background_color'] = function(block: any, generator: any) {
    const color = block.getFieldValue('COLOR');
    return `scene.cameras.main.setBackgroundColor(${color});\n`;
  };

  Blockly.Blocks['add_points'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("add")
          .appendField(new Blockly.FieldNumber(10), "POINTS")
          .appendField("points");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Adds points to player score");
    }
  };

  generator.forBlock['add_points'] = function(block: any, generator: any) {
    const number_points = block.getFieldValue('POINTS');
    return `scene.score += ${number_points}; if(scene.scoreText) scene.scoreText.setText('Score: ' + scene.score);\n`;
  };

  Blockly.Blocks['subtract_points'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("subtract")
          .appendField(new Blockly.FieldNumber(5), "POINTS")
          .appendField("points");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Subtracts points from player score");
    }
  };

  generator.forBlock['subtract_points'] = function(block: any, generator: any) {
    const number_points = block.getFieldValue('POINTS');
    return `scene.score -= ${number_points}; if(scene.scoreText) scene.scoreText.setText('Score: ' + scene.score);\n`;
  };

  Blockly.Blocks['set_score'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set score to")
          .appendField(new Blockly.FieldNumber(0), "SCORE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Sets score to specific value");
    }
  };

  generator.forBlock['set_score'] = function(block: any, generator: any) {
    const number_score = block.getFieldValue('SCORE');
    return `scene.score = ${number_score}; if(scene.scoreText) scene.scoreText.setText('Score: ' + scene.score);\n`;
  };

  Blockly.Blocks['show_score'] = {
    init: function() {
      this.appendValueInput("X")
          .setCheck("Number")
          .appendField("show score at x:");
      this.appendValueInput("Y")
          .setCheck("Number")
          .appendField("y:");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip("Displays the score on screen");
    }
  };

  generator.forBlock['show_score'] = function(block: any, generator: any) {
    const value_x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '10';
    const value_y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '10';
    return `this.scoreText = this.add.text(${value_x}, ${value_y}, 'Score: 0', { fontSize: '24px', fill: '#000' });\n`;
  };

  // Score compare (Boolean)
  Blockly.Blocks['score_compare'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("score")
          .appendField(new Blockly.FieldDropdown([
            ["=", "EQ"],
            ["≠", "NEQ"],
            ["<", "LT"],
            ["≤", "LTE"],
            [">", "GT"],
            ["≥", "GTE"]
          ]), "OP")
          .appendField(new Blockly.FieldNumber(0), "VALUE");
      this.setOutput(true, "Boolean");
      this.setColour(160);
      this.setTooltip("Compares current score to a value");
    }
  };

  generator.forBlock['score_compare'] = function(block: any, generator: any) {
    const op = block.getFieldValue('OP');
    const value = Number(block.getFieldValue('VALUE')) || 0;
    let expr = 'false';
    switch(op) {
      case 'EQ': expr = `this.score === ${value}`; break;
      case 'NEQ': expr = `this.score !== ${value}`; break;
      case 'LT': expr = `this.score < ${value}`; break;
      case 'LTE': expr = `this.score <= ${value}`; break;
      case 'GT': expr = `this.score > ${value}`; break;
      case 'GTE': expr = `this.score >= ${value}`; break;
    }
    return [ `(${expr})`, generator.ORDER_LOGICAL_AND ];
  };

  Blockly.Blocks['end_game'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("end game");
      this.setPreviousStatement(true, null);
      this.setColour(160);
      this.setTooltip("Ends the game and submits score");
    }
  };

  generator.forBlock['end_game'] = function(block: any, generator: any) {
    return `this.endGame();\n`;
  };

  Blockly.Blocks['wait_seconds'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("wait")
          .appendField(new Blockly.FieldNumber(1), "SECONDS")
          .appendField("seconds");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("Waits for specified seconds");
    }
  };

  generator.forBlock['wait_seconds'] = function(block: any, generator: any) {
    const number_seconds = block.getFieldValue('SECONDS');
    return `await new Promise(resolve => this.time.delayedCall(${number_seconds * 1000}, resolve, [], this));\n`;
  };

  Blockly.Blocks['repeat_forever'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("repeat forever");
      this.appendStatementInput("DO")
          .setCheck(null);
      this.setColour(290);
      this.setTooltip("Repeats the enclosed blocks forever");
    }
  };

  generator.forBlock['repeat_forever'] = function(block: any, generator: any) {
    const statements_do = generator.statementToCode(block, 'DO');
    return `this.time.addEvent({ delay: 100, callback: async () => { if(this.isGameOver) return;\n${statements_do}}, loop: true });\n`;
  };

  Blockly.Blocks['touching_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("touching")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE1")
          .appendField("and")
          .appendField(new Blockly.FieldTextInput("enemy"), "SPRITE2");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Checks if two sprites are touching");
    }
  };

  generator.forBlock['touching_sprite'] = function(block: any, generator: any) {
    const sprite1 = block.getFieldValue('SPRITE1');
    const sprite2 = block.getFieldValue('SPRITE2');
    return [`(scene.${sprite1} && scene.${sprite2} && Phaser.Geom.Rectangle.Overlaps(scene.${sprite1}.getBounds(), scene.${sprite2}.getBounds()))`, generator.ORDER_LOGICAL_AND];
  };

  Blockly.Blocks['sprite_touching_edge'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("sprite")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE")
          .appendField("touching edge");
      this.setOutput(true, "Boolean");
      this.setColour(290);
      this.setTooltip("Checks if sprite is touching screen edge");
    }
  };

  generator.forBlock['sprite_touching_edge'] = function(block: any, generator: any) {
    const sprite = block.getFieldValue('SPRITE');
    return [`(scene.${sprite} && (scene.${sprite}.x <= 0 || scene.${sprite}.x >= 800 || scene.${sprite}.y <= 0 || scene.${sprite}.y >= 600))`, generator.ORDER_LOGICAL_AND];
  };

  Blockly.Blocks['create_variable'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("set")
          .appendField(new Blockly.FieldTextInput("myVariable"), "VAR")
          .appendField("to")
          .appendField(new Blockly.FieldNumber(0), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip("Creates or sets a variable");
    }
  };

  generator.forBlock['create_variable'] = function(block: any, generator: any) {
    const varName = block.getFieldValue('VAR');
    const value = block.getFieldValue('VALUE');
    return `scene.${varName} = ${value};\n`;
  };

  Blockly.Blocks['change_variable'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("change")
          .appendField(new Blockly.FieldTextInput("myVariable"), "VAR")
          .appendField("by")
          .appendField(new Blockly.FieldNumber(1), "VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip("Changes a variable by specified amount");
    }
  };

  generator.forBlock['change_variable'] = function(block: any, generator: any) {
    const varName = block.getFieldValue('VAR');
    const value = block.getFieldValue('VALUE');
    return `scene.${varName} += ${value};\n`;
  };

  Blockly.Blocks['play_sound'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("play sound")
          .appendField(new Blockly.FieldDropdown([
            ["beep", "beep"],
            ["pop", "pop"],
            ["coin", "coin"],
            ["jump", "jump"]
          ]), "SOUND");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(200);
      this.setTooltip("Plays a sound effect");
    }
  };

  generator.forBlock['play_sound'] = function(block: any, generator: any) {
    const sound = block.getFieldValue('SOUND');
    return `console.log('Playing sound: ${sound}');\n`;
  };
};

initializeCustomBlocks(javascriptGenerator);

export const createToolbox = () => {
  return {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "name": "Game Events",
        "colour": "120",
        "contents": [
          {
            "kind": "block",
            "type": "game_start"
          },
          {
            "kind": "block",
            "type": "game_update"
          },
          {
            "kind": "block",
            "type": "player_input"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Sprites",
        "colour": "230",
        "contents": [
          {
            "kind": "block",
            "type": "create_sprite"
          },
          {
            "kind": "block",
            "type": "create_circle"
          },
          {
            "kind": "block",
            "type": "create_text"
          },
          {
            "kind": "block",
            "type": "move_sprite"
          },
          {
            "kind": "block",
            "type": "set_sprite_position"
          },
          {
            "kind": "block",
            "type": "hide_sprite"
          },
          {
            "kind": "block",
            "type": "show_sprite"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Background",
        "colour": "290",
        "contents": [
          {
            "kind": "block",
            "type": "set_background_color"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Scoring",
        "colour": "160",
        "contents": [
          {
            "kind": "block",
            "type": "show_score"
          },
          {
            "kind": "block",
            "type": "score_compare"
          },
          {
            "kind": "block",
            "type": "add_points"
          },
          {
            "kind": "block",
            "type": "subtract_points"
          },
          {
            "kind": "block",
            "type": "set_score"
          },
          {
            "kind": "block",
            "type": "end_game"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Logic",
        "colour": "290",
        "contents": [
          {
            "kind": "block",
            "type": "wait_seconds"
          },
          {
            "kind": "block",
            "type": "repeat_forever"
          },
          {
            "kind": "sep"
          },
          {
            "kind": "block",
            "type": "controls_if"
          },
          {
            "kind": "block",
            "type": "controls_repeat_ext"
          },
          {
            "kind": "block",
            "type": "logic_compare"
          },
          {
            "kind": "block",
            "type": "logic_operation"
          },
          {
            "kind": "block",
            "type": "logic_negate"
          },
          {
            "kind": "block",
            "type": "logic_boolean"
          },
          {
            "kind": "block",
            "type": "touching_sprite"
          },
          {
            "kind": "block",
            "type": "sprite_touching_edge"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Collision",
        "colour": "290",
        "contents": [
          {
            "kind": "block",
            "type": "touching_sprite"
          },
          {
            "kind": "block",
            "type": "sprite_touching_edge"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Math",
        "colour": "230",
        "contents": [
          {
            "kind": "block",
            "type": "math_number"
          },
          {
            "kind": "block",
            "type": "math_arithmetic"
          },
          {
            "kind": "block",
            "type": "math_random_int"
          },
          {
            "kind": "block",
            "type": "math_random_float"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Variables",
        "colour": "330",
        "contents": [
          {
            "kind": "block",
            "type": "create_variable"
          },
          {
            "kind": "block",
            "type": "change_variable"
          },
          {
            "kind": "sep"
          },
          {
            "kind": "block",
            "type": "variables_get"
          },
          {
            "kind": "block",
            "type": "variables_set"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Sound",
        "colour": "200",
        "contents": [
          {
            "kind": "block",
            "type": "play_sound"
          }
        ]
      }
    ]
  };
};
