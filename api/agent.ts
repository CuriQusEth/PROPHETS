export const config = {
  runtime: 'edge',
};

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
      name: "Prophets Plum Orchestrator",
      status: "active",
      network: "Base Mainnet (Denim)",
      chainId: 8453,
      blockTime: "200ms",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Prophets Plum",
      version: "1.0.0"
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
      return new Response(JSON.stringify({
        status: "success",
        message: "Agent status updated/received",
        agent: "Prophets Plum Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid agent request" }), {
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
