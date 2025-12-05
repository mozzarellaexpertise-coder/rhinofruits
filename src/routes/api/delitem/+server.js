import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL
});

export async function POST({ request }) {
  const { id } = await request.json();
  if (!id) return new Response(JSON.stringify({ error: 'ID required' }), { status: 400 });
  await pool.query('DELETE FROM fruits WHERE id = $1', [id]);
  return new Response(JSON.stringify({ success: true }));
}