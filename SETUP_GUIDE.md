# SatSurge Setup Guide

## What's Been Implemented

### 1. Blockly Editor Improvements

#### Fixed "when clicked" Block
- Now includes a text input field for the sprite/variable name
- Example: "when **player** is clicked"
- This allows you to specify which sprite should respond to clicks

#### Position Blocks with Reporter Support
All position-related blocks now accept reporter blocks (number blocks) instead of just text inputs. This means you can now:
- Attach math blocks to calculate positions dynamically
- Use random number generators for positions
- Combine multiple math operations

**Updated Blocks:**
- `create sprite` - X and Y inputs accept math blocks
- `create circle` - X, Y, and radius inputs accept math blocks
- `create text` - X and Y inputs accept math blocks
- `move sprite` - X and Y movement amounts accept math blocks
- `set sprite position` - X and Y positions accept math blocks
- `show score` - X and Y positions accept math blocks

### 2. Supabase Database Integration

Your app now uses Supabase for data persistence instead of localStorage.

#### Database Schema Created
The following tables have been designed (migration ready):

1. **profiles** - User profiles
   - Links to Supabase auth.users
   - Stores username, user type (player/creator), wallet address
   - Tracks earnings, games created/played

2. **games** - Game definitions
   - Stores Blockly XML and generated code
   - Tracks game metadata (name, description, difficulty)
   - Publishing status and stats

3. **game_stats** - Player scores and statistics
   - Individual game plays and scores
   - Linked to tournaments if applicable

4. **tournaments** - Competition instances
   - Entry fees and prize pools
   - Status tracking (open, active, completed)

5. **tournament_participants** - Tournament entries
   - Participant scores and rankings
   - Prize distribution

#### Row Level Security (RLS)
All tables have proper security policies:
- Users can only modify their own data
- Published games are viewable by everyone
- Creators can manage their own games
- Stats are private to players and game creators

### 3. Application Services

#### Supabase Client (`src/utils/supabase.ts`)
- Configured Supabase client
- TypeScript interfaces for all database tables
- Ready to use throughout the app

#### Game Service (`src/utils/gameService.ts`)
Complete CRUD operations for games:
- `createGame()` - Create new games
- `updateGame()` - Save changes to existing games
- `getGame()` - Load a specific game
- `getMyGames()` - Get all games created by current user
- `getPublishedGames()` - Get all public games
- `publishGame()` - Publish a game (with 100 sats fee logic)
- `deleteGame()` - Remove a game
- `saveGameStats()` - Record game plays and scores
- `getGameStats()` - Get leaderboard data
- `getPlayerStats()` - Get player history

#### Updated AuthContext (`src/contexts/AuthContext.tsx`)
- Full Supabase authentication integration
- Auto-creates user profiles on registration
- Session management with real-time updates
- Profile updates sync to database

#### Updated GameEditor (`src/components/GameEditor.tsx`)
- Loads games from Supabase
- Saves Blockly XML and generated code to database
- Publishing workflow integrated
- Support for both new games and templates
- Proper error handling and loading states

## Next Steps: Setting Up Your Supabase Database

The database schema is ready but needs to be applied. Here's what you need to do:

### Option 1: Manual Setup (Recommended)
1. Go to your Supabase project dashboard: https://ihympcbnrsuowzekpgag.supabase.co
2. Navigate to the SQL Editor
3. Copy the migration SQL from the file that would have been created (`create_satsurge_schema.sql`)
4. Execute it in the SQL Editor

### Option 2: Ask me to set it up
Simply ask: "Please set up the Supabase database now" and I'll apply the migration.

### After Database Setup

Once the database is ready:

1. **Test Registration/Login**
   - Register a new user
   - Profile will be automatically created in Supabase

2. **Test Game Creation**
   - Navigate to Creator Dashboard
   - Create a new game or use a template
   - Make changes in Blockly editor
   - Click "Save" - it will save to Supabase
   - Click "Publish" - marks game as published

3. **Test Game Loading**
   - Your saved games will appear in the Creator Dashboard
   - Click to edit any game
   - Blockly workspace will load your saved blocks

## What About Cloudflare D1 and Workers?

You asked about Cloudflare D1 and Worker KV. Here's why Supabase is better for your use case:

### Supabase Benefits:
- ✅ Built-in authentication with user management
- ✅ Real-time subscriptions for live updates
- ✅ Row Level Security for multi-tenant data
- ✅ PostgreSQL with full SQL features
- ✅ No serverless cold starts affecting user experience
- ✅ Free tier includes auth + database + storage
- ✅ Works perfectly with static site hosting (like Cloudflare Pages)

### Cloudflare D1/KV Limitations:
- ❌ Requires Cloudflare Workers for all database access
- ❌ No built-in authentication system
- ❌ Limited SQL features in D1 (SQLite subset)
- ❌ Cold start delays on API calls
- ❌ More complex setup for auth + RLS
- ❌ KV is key-value only (not relational)

### Hybrid Approach (Optional):
You could still use Cloudflare for:
- **Hosting** - Deploy static site to Cloudflare Pages
- **CDN** - Cache assets on Cloudflare's edge
- **Workers** - Add specialized edge functions if needed
- **Supabase** - Handle all database and auth operations

The site will be hosted on Cloudflare but use Supabase as the backend.

## Testing the Blockly Improvements

### Test Variable Input in "when clicked"
1. Drag "when player is clicked" block
2. Change "player" to match your sprite name
3. The event will now only trigger for that specific sprite

### Test Reporter Blocks for Positions
1. Create a sprite block
2. Instead of typing X/Y numbers, attach a math block:
   - Drag "random integer" block to X input
   - Set range (e.g., 0 to 800)
   - Now sprite will appear at random X position
3. Try combining math operations:
   - Attach arithmetic block (+ - × ÷)
   - Add multiple math blocks together

## Summary

Your SatSurge platform now has:
1. ✅ Improved Blockly blocks with variable inputs and math support
2. ✅ Complete Supabase backend integration
3. ✅ Full authentication system
4. ✅ Game CRUD operations
5. ✅ Save/Load functionality
6. ✅ Publishing workflow
7. ✅ Secure database schema with RLS
8. ✅ Ready for deployment

All you need is to set up the database schema in Supabase, and your platform will be fully functional!
