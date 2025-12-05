import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL
});

export async function POST({ request }) {
  const { name } = await request.json();
  if (!name) return new Response(JSON.stringify({ error: 'Name required' }), { status: 400 });
  await pool.query('INSERT INTO fruits(name) VALUES($1)', [name]);
  return new Response(JSON.stringify({ success: true }));
}