// Cloudflare Pages Function for handling pledges
// This file should be placed in functions/api/pledges.ts

interface Pledge {
  id: string;
  name: string;
  craneCount: number;
  timestamp: number;
}

// Cloudflare types
interface KVNamespace {
  get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Env {
  PLEDGE_KV: KVNamespace;
}

interface EventContext<Env = any, P extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> {
  request: Request;
  env: Env;
  params: Record<P, string>;
  data: Data;
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

type PagesFunction<Env = any, P extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> = (context: EventContext<Env, P, Data>) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    console.log('🔍 [FUNCTION] GET /api/pledges - Fetching data from KV');
    
    const pledges = await context.env.PLEDGE_KV.get('pledges', 'json') as Pledge[] || [];
    const totalReceived = await context.env.PLEDGE_KV.get('total-received', 'json') as number || 0;
    
    console.log('🔍 [FUNCTION] Retrieved pledges:', pledges.length, 'items');
    console.log('🔍 [FUNCTION] Total received:', totalReceived);
    
    const totalPledged = pledges.reduce((sum, pledge) => sum + pledge.craneCount, 0);
    
    const result = {
      pledges,
      totalReceived,
      totalPledged,
      stats: {
        totalPledgers: pledges.length,
        goalProgress: Math.min((totalPledged / 1000) * 100, 100),
        receivedProgress: Math.min((totalReceived / 1000) * 100, 100)
      }
    };
    
    console.log('✅ [FUNCTION] Returning data:', result);
    return Response.json(result);
  } catch (error) {
    console.error('Error fetching pledges:', error);
    return Response.json({ error: 'Failed to fetch pledges' }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    console.log('🔍 [FUNCTION] POST /api/pledges - Adding new pledge');
    
    const pledge = await context.request.json() as Pledge;
    console.log('🔍 [FUNCTION] Received pledge data:', pledge);
    
    // Validate pledge data
    if (!pledge.name || !pledge.craneCount || pledge.craneCount <= 0) {
      console.error('❌ [FUNCTION] Invalid pledge data:', pledge);
      return Response.json({ error: 'Invalid pledge data' }, { status: 400 });
    }
    
    // Add ID and timestamp if not provided
    if (!pledge.id) {
      pledge.id = Date.now().toString();
    }
    if (!pledge.timestamp) {
      pledge.timestamp = Date.now();
    }
    
    console.log('🔍 [FUNCTION] Processing pledge with ID:', pledge.id);
    
    // Get existing pledges
    const existingPledges = await context.env.PLEDGE_KV.get('pledges', 'json') as Pledge[] || [];
    console.log('🔍 [FUNCTION] Found', existingPledges.length, 'existing pledges');
    
    // Add new pledge
    existingPledges.push(pledge);
    
    // Save back to KV
    await context.env.PLEDGE_KV.put('pledges', JSON.stringify(existingPledges));
    console.log('✅ [FUNCTION] Saved', existingPledges.length, 'pledges to KV');
    
    const result = { 
      success: true, 
      pledge,
      totalPledges: existingPledges.length 
    };
    
    console.log('✅ [FUNCTION] Returning result:', result);
    return Response.json(result);
  } catch (error) {
    console.error('Error adding pledge:', error);
    return Response.json({ error: 'Failed to add pledge' }, { status: 500 });
  }
};

// Admin endpoint to update total received (only for authenticated admin)
export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const { totalReceived } = await context.request.json() as { totalReceived: number };
    
    if (typeof totalReceived !== 'number' || totalReceived < 0) {
      return Response.json({ error: 'Invalid total received count' }, { status: 400 });
    }
    
    // In a real app, you'd verify admin authentication here
    // For now, we'll just update the value
    await context.env.PLEDGE_KV.put('total-received', JSON.stringify(totalReceived));
    
    return Response.json({ 
      success: true, 
      totalReceived 
    });
  } catch (error) {
    console.error('Error updating total received:', error);
    return Response.json({ error: 'Failed to update total received' }, { status: 500 });
  }
};