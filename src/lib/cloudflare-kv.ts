// Cloudflare KV integration for pledge storage

interface Pledge {
  id: string;
  name: string;
  craneCount: number;
  timestamp: number;
}

// Cloudflare KV types
interface KVNamespace {
  get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
}

export interface CloudflareEnv {
  PLEDGE_KV: KVNamespace;
}

export class PledgeStorage {
  constructor(private kv: KVNamespace) {}

  async getPledges(): Promise<Pledge[]> {
    const pledges = await this.kv.get('pledges', 'json');
    return pledges || [];
  }

  async addPledge(pledge: Pledge): Promise<void> {
    const pledges = await this.getPledges();
    pledges.push(pledge);
    await this.kv.put('pledges', JSON.stringify(pledges));
  }

  async getTotalReceived(): Promise<number> {
    const total = await this.kv.get('total-received', 'json');
    return total || 0;
  }

  async updateTotalReceived(count: number): Promise<void> {
    await this.kv.put('total-received', JSON.stringify(count));
  }
}

// For use in Cloudflare Functions
export async function handlePledgeRequest(request: Request, env: CloudflareEnv) {
  const storage = new PledgeStorage(env.PLEDGE_KV);
  
  if (request.method === 'GET') {
    const pledges = await storage.getPledges();
    const totalReceived = await storage.getTotalReceived();
    
    return new Response(JSON.stringify({
      pledges,
      totalReceived
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (request.method === 'POST') {
    const pledge = await request.json();
    await storage.addPledge(pledge);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
}