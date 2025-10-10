# Satsurge AI Coding Agent Instructions

This document provides instructions for AI coding agents to effectively contribute to the Satsurge codebase.
Don't fucking break the database with unnecessary rows and the game editor.

## 1. Overall Architecture

Satsurge is a web application for creating and playing games, with a focus on tournaments and Bitcoin Lightning Network payments.

- **Frontend**: A React single-page application built with Vite and written in TypeScript.
- **Styling**: Tailwind CSS is used for styling.
- **Backend (BaaS)**: Supabase handles the database (PostgreSQL), authentication, and storage.
- **Game Engine**: Phaser.js is used to render and run the games.
- **Visual Programming**: Blockly provides a no-code/low-code editor for game creation.

## 2. Key Files and Directories

- `src/App.tsx`: Main application component with routing.
- `src/pages/`: Top-level page components.
- `src/components/`: Reusable React components.
- `src/contexts/AuthContext.tsx`: Manages user authentication and session state. Use the `useAuth()` hook to access user data.
- `src/utils/supabase.ts`: Defines the TypeScript interfaces for the Supabase database tables (`Profile`, `Game`, `Tournament`, etc.). This is the source of truth for the data model.
- `src/utils/phaserEngine.ts`: Contains the `GameScene` class, which is the runtime environment for all games created on the platform.
- `src/utils/blocklyConfig.ts`: The core of the game creation logic. It defines the custom Blockly blocks available to creators and generates the JavaScript code that runs in the Phaser game scene.
- `src/utils/dbTournamentService.ts` & `src/utils/gameService.ts`: Services that encapsulate database interactions for tournaments and games.

## 3. Developer Workflow

- **Run the development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint the code**: `npm run lint`

## 4. Game Creation and Logic

The most complex part of the application is the game creation flow.

1.  **Visual Editor**: Creators use a Blockly-based visual editor in the `GameEditor` component (`src/components/GameEditor.tsx`) to build game logic.
2.  **Block Configuration**: The available blocks and their JavaScript code generation are defined in `src/utils/blocklyConfig.ts`. When you need to add new game mechanics or change existing ones, this is the file to edit.
3.  **Code Execution**: The Blockly editor generates JavaScript code from the blocks. This code is then executed by the `GameScene` in `src/utils/phaserEngine.ts`. The generated code interacts with the `scene` object to control game elements.

**Example Pattern: Adding a new Blockly block**

To add a new block, you need to:
1.  Define the block's appearance in `Blockly.Blocks`.
2.  Define the JavaScript code it generates in `javascriptGenerator.forBlock`.
3.  The generated code will typically call methods on the `scene` object provided by `phaserEngine.ts`.

```typescript
// In src/utils/blocklyConfig.ts

// 1. Define the block
Blockly.Blocks['my_new_block'] = {
  init: function() {
    // ... block definition ...
  }
};

// 2. Define the code generator
generator.forBlock['my_new_block'] = function(block: any, generator: any) {
  // ... logic to generate JavaScript code ...
  return `scene.myCustomFunction();`;
};
```

## 5. Backend and Database

- All interactions with the Supabase backend should go through the client in `src/utils/supabase.ts`.
- Use the service files in `src/utils` (e.g., `dbTournamentService.ts`) to interact with the database.
- The TypeScript interfaces in `src/utils/supabase.ts` should be kept in sync with the database schema.

## 6. Environment Variables

The application requires a `.env` file with the following variables for Supabase integration:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
