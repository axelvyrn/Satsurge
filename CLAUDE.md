# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## High-Level Architecture

Satsurge is a web-based Bitcoin-powered arcade platform combining visual game creation with skill-based competition and Lightning Network payments. The application consists of:

- **Frontend**: React single-page application built with Vite and TypeScript
- **Backend**: Supabase (PostgreSQL database + authentication + storage)
- **Game Engine**: Phaser.js for rendering and running games
- **Visual Programming**: Blockly-based drag-and-drop editor for game creation
- **Payments**: Lightning Network integration (LNURL/Keysend)
- **Authentication**: User roles for players and creators with Supabase Auth

## Key Files and Directories

### Core Architecture
- `src/App.tsx`: Main application with routing and role-based access control (player/creator dashboards, game editor, rooms)
- `src/contexts/AuthContext.tsx`: Authentication state management with Supabase Auth
- `src/utils/supabase.ts`: TypeScript interfaces and Supabase client (source of truth for data models)

### Game Creation System
- `src/utils/blocklyConfig.ts`: Custom Blockly blocks defining game mechanics and JavaScript code generation
- `src/utils/phaserEngine.ts`: GameScene class - runtime environment for all games; executes Blockly-generated code
- `src/components/GameEditor.tsx`: Visual editor interface for creators to build games

### Backend Integration
- `src/utils/dbTournamentService.ts` & `src/utils/gameService.ts`: Database interaction services for tournaments and games
- `src/utils/lightningPayments.ts`: Lightning Network payment handling

### Data Models
- **Profile**: User profiles (id, username, user_type, wallet_address, earnings, stats)
- **Game**: Game definitions (creator, name, Blockly XML, generated code, difficulty, pricing)
- **GameStat**: Game play results (game_id, player_id, score, duration, tournament)
- **Tournament**: Competitive events (game, participants, entry fees, prize pools)
- **TournamentParticipant**: Tournament participation tracking (entry payment, scores, prizes)

## Game Creation Workflow

1. **Editor**: Creators use Blockly editor to assemble game logic visually
2. **Code Generation**: Blockly generates JavaScript from block configurations
3. **Runtime**: Phaser engine executes generated code with GameScene API
4. **Payment Integration**: Games require Lightning entry fees; winners receive payouts

Example block types: sprite manipulation, collision detection, scoring, input handling, timing controls.

## Environment Setup

Requires `.env` file with Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Important Notes from Project Documentation

The platform aims to be truly Bitcoin-native: skill-first gameplay, micro-entry fees (50-500 sats), borderless competition, instant payouts via Lightning. Future roadmap includes leaderboards, creator marketplaces, tournament support, and DSL expansions.

Development emphasizes not breaking database relationships and maintaining clean game editor functionality.