# PROPHETS - Divine Strategy Game

Prophets is a mystical strategy card game where players interpret visions, balance the forces of Chaos and Faith, and ascend to divine Enlightenment.

## Overview

In Prophets, you play as a visionary guiding the fate of realms. Every turn, you draw Visions (cards) representing the elements (Fire, Water, Earth, Air, Light, and Void). By carefully combining these elements, you can trigger powerful Chains to accumulate Enlightenment while balancing the destructive forces of Chaos and the necessity of Faith.

The game heavily integrates Web3 mechanics on the Base network, featuring:
- ERC-8021 Transaction Attribution
- ERC-8004 Trustless Agents support 
- On-chain Leaderboards & Score Submission via SIWE (Sign-In With Ethereum)

## Tech Stack

- **Frontend**: Next.js 14 (App Router) *(Configurable for Vite too)*, React, TypeScript, Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Viem (Base Mainnet / Base Sepolia)
- **Agent Protocols**: Model Context Protocol (MCP), ERC-8004 / ERC-8021

## URLs
- **App URL:** https://prophets-plum.vercel.app/
- **Agent Card URL:** https://prophets-plum.vercel.app/.well-known/agent-card.json
- **MCP Endpoint:** https://prophets-plum.vercel.app/api/mcp
- **Agent API Endpoint:** https://prophets-plum.vercel.app/api/agent

## Agent Registration Info

**Agent Name:** Prophets Plum Orchestrator
**Version:** 1.0.0
**Type:** https://eips.ethereum.org/EIPS/eip-8004#registration-v1
**Description:** Prophets Plum platformunda çalışan ERC-8004 uyumlu AI Agent. Prophecy mechanics, plum ecosystem management, content generation ve multi-task automation yapan akıllı orchestrator.

### Capabilities & Skills
- prophecy-mechanics
- ecosystem-management
- content-generation
- multi-task-automation
- daily-operations
- mcp-command-execution

## MCP Connection Guide

To connect to the Model Context Protocol (MCP) server, ensure you are making HTTP POST requests to the `/api/mcp` endpoint.

```json
// Example POST /api/mcp
{
  "method": "tools/list",
  "params": {}
}
```

The server supports the following tools:
- get_race_status
- start_race
- get_leaderboard
- optimize_speed
- get_track_info

## Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

