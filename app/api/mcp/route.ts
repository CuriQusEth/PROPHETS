import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Prophets Plum MCP Endpoint",
    status: "active",
    description: "Active MCP server for Prophets Plum Orchestrator Agent",
    capabilities: ["prophecy-mechanics", "ecosystem-management", "content-generation"],
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "MCP command received",
      agent: "Prophets Plum Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400 });
  }
}
