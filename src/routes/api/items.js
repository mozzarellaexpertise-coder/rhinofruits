import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL
});

export async function GET() {
  const res = await pool.query('SELECT id, name FROM fruits ORDER BY id ASC');
  return new Response(JSON.stringify(res.rows));
}