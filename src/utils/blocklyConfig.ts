import * as Blockly from 'blockly';

// Custom blocks for game development
export const initializeCustomBlocks = () => {
  // Game Events Category
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

  Blockly.JavaScript['game_start'] = function(block) {
    const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
    return `this.create = function() {\n${statements_do}};\n`;
  };

  Blockly.Blocks['player_input'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("when")
          .appendField(new Blockly.FieldDropdown([
            ["clicked", "click"],
            ["key pressed", "keydown"],
            ["touch", "touch"]
          ]), "INPUT_TYPE");
      this.appendStatementInput("DO")
          .setCheck(null);
      this.setColour(120);
      this.setTooltip("Handles player input");
    }
  };

  Blockly.JavaScript['player_input'] = function(block) {
    const dropdown_input_type = block.getFieldValue('INPUT_TYPE');
    const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
    return `this.input.on('${dropdown_input_type}', function() {\n${statements_do}});\n`;
  };

  // Game Objects Category
  Blockly.Blocks['create_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("create sprite")
          .appendField(new Blockly.FieldTextInput("player"), "NAME")
          .appendField("at x:")
          .appendField(new Blockly.FieldNumber(100), "X")
          .appendField("y:")
          .appendField(new Blockly.FieldNumber(100), "Y");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Creates a sprite at specified position");
    }
  };

  Blockly.JavaScript['create_sprite'] = function(block) {
    const text_name = block.getFieldValue('NAME');
    const number_x = block.getFieldValue('X');
    const number_y = block.getFieldValue('Y');
    return `this.${text_name} = this.add.rectangle(${number_x}, ${number_y}, 50, 50, 0xff6600);\n`;
  };

  Blockly.Blocks['move_sprite'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("move")
          .appendField(new Blockly.FieldTextInput("player"), "SPRITE")
          .appendField("by x:")
          .appendField(new Blockly.FieldNumber(10), "X")
          .appendField("y:")
          .appendField(new Blockly.FieldNumber(0), "Y");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Moves a sprite by specified amount");
    }
  };

  Blockly.JavaScript['move_sprite'] = function(block) {
    const text_sprite = block.getFieldValue('SPRITE');
    const number_x = block.getFieldValue('X');
    const number_y = block.getFieldValue('Y');
    return `if(this.${text_sprite}) { this.${text_sprite}.x += ${number_x}; this.${text_sprite}.y += ${number_y}; }\n`;
  };

  // Scoring Category
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

  Blockly.JavaScript['add_points'] = function(block) {
    const number_points = block.getFieldValue('POINTS');
    return `this.score += ${number_points}; this.scoreText.setText('Score: ' + this.score);\n`;
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

  Blockly.JavaScript['end_game'] = function(block) {
    return `this.scene.pause(); this.submitScore(this.score);\n`;
  };

  // Logic Category
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

  Blockly.JavaScript['wait_seconds'] = function(block) {
    const number_seconds = block.getFieldValue('SECONDS');
    return `this.time.delayedCall(${number_seconds * 1000}, function() {\n}, [], this);\n`;
  };
};

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
            "type": "player_input"
          }
        ]
      },
      {
        "kind": "category",
        "name": "Game Objects",
        "colour": "230",
        "contents": [
          {
            "kind": "block",
            "type": "create_sprite"
          },
          {
            "kind": "block",
            "type": "move_sprite"
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
            "type": "add_points"
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
            "type": "math_number"
          },
          {
            "kind": "block",
            "type": "math_arithmetic"
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
      }
    ]
  };
};