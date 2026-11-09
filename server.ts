import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

// Mock tools for MCP
const TOOLS = [
  {
    name: 'get_race_status',
    description: 'Get the current status of a race',
    inputSchema: { type: 'object', properties: { raceId: { type: 'string' } } }
  },
  {
    name: 'start_race',
    description: 'Start a new race',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_leaderboard',
    description: 'Get the current leaderboard',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'optimize_speed',
    description: 'Optimize properties for speed',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_track_info',
    description: 'Get information about a track',
    inputSchema: { type: 'object', properties: { trackId: { type: 'string' } } }
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes (Mirroring App Router for the AI Studio Preview environment) ---

  // MCP Route
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Prophets Plum Orchestrator MCP",
      network: "Base Mainnet (Denim - 200ms canonical blocks)",
      chainId: 8453,
      status: "active",
      description: "Active MCP server for Prophets Plum Orchestrator Agent on Base Mainnet Denim",
      capabilities: ["prophecy-mechanics", "ecosystem-management", "content-generation", "base-denim-200ms-settlement"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const method = body.method;
      const params = body.params;
      const requestId = body.id;
      const isJsonRpc = body.jsonrpc === "2.0";

      let result: any = null;

      if (method === 'initialize') {
        result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            prompts: {},
            resources: {},
            tools: {}
          },
          serverInfo: {
            name: "Prophets Plum Orchestrator",
            version: "1.0.0"
          }
        };
      } else if (method === 'tools/list') {
        result = { tools: TOOLS };
      } else if (method === 'tools/call') {
        result = { 
          content: [
            { type: 'text', text: `Executed tool: ${params?.name || 'unknown'}` }
          ],
          isError: false
        };
      } else if (method === 'prompts/list') {
        result = { prompts: [] };
      } else if (method === 'resources/list') {
        result = { resources: [] };
      } else if (method === 'notifications/initialized') {
        result = { status: "success" };
      } else {
        result = { status: "success", message: "MCP command received", payload: body };
      }

      const responsePayload = isJsonRpc ? {
        jsonrpc: "2.0",
        id: requestId,
        result: result
      } : result;

      res.json(responsePayload);
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // Agent Route
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Prophets Plum Orchestrator",
      status: "active",
      network: "Base Mainnet (Denim)",
      chainId: 8453,
      blockTime: "200ms",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Prophets Plum",
      version: "1.0.0"
    });
  });

  app.post("/api/agent", (req, res) => {
    try {
      const body = req.body;
      res.json({
        status: "success",
        message: "Agent status updated/received",
        agent: "Prophets Plum Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid agent request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
