export const config = {
  runtime: 'edge',
};

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

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      protocol: "MCP",
      version: "1.0.0",
      name: "Prophets Plum Orchestrator MCP",
      network: "Base Mainnet (Denim - 200ms canonical blocks)",
      chainId: 8453,
      status: "active",
      description: "Active MCP server for Prophets Plum Orchestrator Agent on Base Mainnet Denim",
      capabilities: ["prophecy-mechanics", "ecosystem-management", "content-generation", "base-denim-200ms-settlement"],
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
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

      return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid MCP request" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  }

  return new Response("Not Found", { status: 404 });
}
