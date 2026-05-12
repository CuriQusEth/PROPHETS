# Prophets - Divine Strategy Game

Prophets is a mystical strategy card game where players interpret visions, balance the forces of Chaos and Faith, and ascend to divine Enlightenment.

## Overview

In Prophets, you play as a visionary guiding the fate of realms. Every turn, you draw Visions (cards) representing the elements (Fire, Water, Earth, Air, Light, and Void). By carefully combining these elements, you can trigger powerful Chains (e.g., Fire + War, Light + Growth) to accumulate Enlightenment while balancing the destructive forces of Chaos and the necessity of Faith.

The game heavily integrates Web3 mechanics on the Base network, featuring:
- ERC-8021 Transaction Attribution
- ERC-8004 Trustless Agents support 
- On-chain Leaderboards & Score Submission via SIWE (Sign-In With Ethereum)

## Core Mechanics

- **Faith & Chaos Management**: Manage your resources carefully. Reach 0 Faith, or 100 Chaos, and you will be consumed by the void.
- **Vision Combos**: Play elemental cards sequentially to trigger divine bonuses.
- **On-Chain High Scores**: Log your ascension securely using SIWE-like score submissions.
- **Agent Integration**: Powered by the "Prophets Plum Orchestrator" agent supporting MCP protocols for automation and ecosystem management.

## Tech Stack

- **Frontend**: React + Vite, TypeScript, Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Viem (Base Mainnet / Base Sepolia)
- **Agent & Protocols**: Model Context Protocol (MCP), ERC-8004 / ERC-8021

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## AI Agent Details

See the `public/.well-known/agent-card.json` for details on the integrated Prophets Plum Orchestrator AI. This agent automates daily operations, interacts with the Plum ecosystem, and manages the orchestration of on-chain prophecy logic.

Endpoints provided for Agent tasks:
- `api/agent`
- `api/mcp`
