// Cloudflare D1 integration for pledge storage
interface Pledge {
  id: string;
  name: string;
  craneCount: number;
  timestamp: number;
}

interface CloudflareEnvD1 {
  DB: D1Database;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  all<T = any>(): Promise<D1Result<T>>;
  run(): Promise<D1RunResult>;
}

interface D1Result<T = any> {
  results: T[];
  success: boolean;
  meta: any;
}

interface D1RunResult {
  success: boolean;
  meta: any;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

export class PledgeDatabase {
  constructor(private db: D1Database) {}

  async getPledges(): Promise<Pledge[]> {
    const result = await this.db
      .prepare('SELECT * FROM pledges ORDER BY crane_count DESC, timestamp DESC')
      .all<{
        id: string;
        name: string;
        crane_count: number;
        timestamp: number;
      }>();

    return result.results.map(row => ({
      id: row.id,
      name: row.name,
      craneCount: row.crane_count,
      timestamp: row.timestamp
    }));
  }

  async addPledge(pledge: Pledge): Promise<void> {
    await this.db
      .prepare('INSERT INTO pledges (id, name, crane_count, timestamp) VALUES (?, ?, ?, ?)')
      .bind(pledge.id, pledge.name, pledge.craneCount, pledge.timestamp)
      .run();
  }

  async getTotalReceived(): Promise<number> {
    const result = await this.db
      .prepare('SELECT value FROM settings WHERE key = ?')
      .bind('total-received')
      .first<{ value: string }>();
    
    return result ? parseInt(result.value) : 0;
  }

  async updateTotalReceived(count: number): Promise<void> {
    await this.db
      .prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?')
      .bind(count.toString(), 'total-received')
      .run();
  }

  async getLeaderboard(limit: number = 10): Promise<Pledge[]> {
    const result = await this.db
      .prepare('SELECT * FROM pledges ORDER BY crane_count DESC LIMIT ?')
      .bind(limit)
      .all<{
        id: string;
        name: string;
        crane_count: number;
        timestamp: number;
      }>();

    return result.results.map(row => ({
      id: row.id,
      name: row.name,
      craneCount: row.crane_count,
      timestamp: row.timestamp
    }));
  }
}

// Example Cloudflare Function using D1
export async function handlePledgeRequestD1(request: Request, env: CloudflareEnvD1) {
  const db = new PledgeDatabase(env.DB);
  
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    if (action === 'leaderboard') {
      const leaderboard = await db.getLeaderboard();
      return Response.json({ leaderboard });
    }
    
    const pledges = await db.getPledges();
    const totalReceived = await db.getTotalReceived();
    
    return Response.json({
      pledges,
      totalReceived,
      stats: {
        totalPledged: pledges.reduce((sum, p) => sum + p.craneCount, 0),
        totalPledgers: pledges.length
      }
    });
  }
  
  if (request.method === 'POST') {
    const pledge = await request.json() as Pledge;
    await db.addPledge(pledge);
    
    return Response.json({ success: true });
  }
  
  return new Response('Method not allowed', { status: 405 });
}