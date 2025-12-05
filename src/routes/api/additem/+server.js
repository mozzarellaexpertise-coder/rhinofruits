import { Pool } from 'pg';

export async function POST({ request }) {
  const { name, photo_url } = await request.json();

  if (!name || !photo_url) {
    return new Response(JSON.stringify({ error: "Name and photo_url required" }), { status: 400 });
  }

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
    await client.query(
      'INSERT INTO fruits(name, photo_url) VALUES($1, $2)',
      [name, photo_url]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}