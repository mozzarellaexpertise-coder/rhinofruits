import { Pool } from 'pg';

export async function GET() {
  // Create pool inside handler to avoid cold start issues
  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL
  });

  const client = await pool.connect().catch(err => {
    console.error("DB connection failed:", err);
    return null;
  });

  if (!client) {
    return new Response(JSON.stringify({ error: "Cannot connect to DB" }), { status: 500 });
  }

  try {
    const result = await client.query('SELECT * FROM fruits ORDER BY id ASC');
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}