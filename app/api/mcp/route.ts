import { NextResponse } from 'next/server';

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

export async function GET() {
  return NextResponse.json(
    {
      protocol: "MCP",
      version: "1.0.0",
      name: "Prophets Plum Orchestrator MCP",
      status: "active",
      description: "Active MCP server for Prophets Plum Orchestrator Agent",
      capabilities: ["prophecy-mechanics", "ecosystem-management", "content-generation"],
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params } = body;

    let result = null;

    if (method === 'initialize') {
      result = {
        name: "Prophets Plum Orchestrator",
        version: "1.0.0",
        capabilities: { tools: {}, prompts: {}, resources: {} }
      };
    } else if (method === 'tools/list') {
      result = { tools: TOOLS };
    } else if (method === 'tools/call') {
      result = { status: 'success', message: `Executed tool: ${params?.name}` };
    } else if (method === 'prompts/list') {
      result = { prompts: [] };
    } else if (method === 'resources/list') {
      result = { resources: [] };
    } else {
      result = { status: "success", message: "MCP command received", payload: body };
    }

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
