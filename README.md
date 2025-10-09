# ⚡ Satsurge

> **A Bitcoin-powered arcade where creativity meets competition, and sats flow at the speed of play.**

---

## What is Satsurge?

Satsurge is a **web-based arcade** built for the Lightning era. It combines the simplicity of **visual game creation** with the thrill of **skill-based competition** and the instant monetization of Bitcoin.

* **Creators** design short games (30–120 seconds) using a drag-and-drop editor powered by a custom DSL.
* **Players** pay tiny entry fees in sats to compete.
* **Winners** receive payouts instantly via the Lightning Network.

The vision is to create the first **truly Bitcoin-native gaming platform**: free from ads, tokens, and middlemen. Just games, skill, and sats.

---

## Why Satsurge?

Most online games today are weighed down by ads, in-app purchases, and exploitative mechanics. Satsurge takes a different route:

* **Skill First**: Every win comes from ability, not luck.
* **Micro Stakes, Real Value**: Entry fees of just 50–500 sats create tension and reward without risk of addiction-driven losses.
* **Global, Borderless Play**: A creator in India, a developer in Brazil, and a player in Germany can connect instantly through Lightning.
* **Pure Bitcoin**: No new tokens, no custodians. Just sats, instantly sent and received.

---

## Features

### What Exists Today

*  **Block-Based Game Editor**: Scratch-like simplicity for defining logic, sprites, and interactions.
*  **Arcade Engine**: Built on Phaser.js for fast, polished 2D browser games.
*  **Lightning Payments**: Integrated with LNURL for instant sats transfers.

### What’s in Development

*  **Leaderboards & Tournaments**: Compete for pooled sats, rank globally.
*  **Creator Marketplace**: Share, discover, and monetize games.
*  **Robust DSL Runtime**: More expressive game logic and smoother integration with Phaser.
*  **Flexible Payment Modes**: Pay-to-play, win-to-earn, and pooled rewards.

---

## Tech Stack

* **Editor**: Blockly + custom DSL for game logic.
* **Game Engine**: Phaser.js for rendering and physics.
* **Frontend**: React + Tailwind for interface.
* **Payments**: Lightning Network (LNURL / Keysend).
* **Backend (planned)**: Node.js + Postgres for tournaments and leaderboards.

---

## 📜 Example DSL Game

```dsl
game "CatchTheSats" {
  player sprite "hero" at (100,200)
  enemy sprite "ghost" at randomPosition()

  when player collides enemy {
    endGame("You lost!")
  }

  when player score >= 100 {
    rewardPlayer(50 sats)
    endGame("Congrats! You earned sats!")
  }

  requirePayment(500 sats) {
    startGame()
  }
}
```

A few lines define sprites, collisions, win conditions, and even sats rewards. The DSL hides complexity, while compiling into real JavaScript that runs in the arcade.

---

## 🚀 Roadmap

* [ ] Expand DSL expressiveness.
* [ ] Build leaderboards and matchmaking.
* [ ] Launch a creator marketplace.
* [ ] Add support for pooled tournaments.
* [ ] Improve editor UX with templates and tutorials.

---

## 🤝 Contributing

Satsurge is experimental and evolving. Developers, designers, Lightning builders, and game makers are invited to contribute. Fork the repo, propose features, or help refine the DSL.

Together, we can define what **Bitcoin-native gaming** looks like.

---

## ⚡ License

MIT License © 2025 Satsurge
