import { json } from '@sveltejs/kit';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL
});

export async function POST({ request }) {
  const { name, photo_url } = await request.json();

  if (!name || !photo_url) return json({ error: 'Missing data' }, { status: 400 });

  try {
    const res = await pool.query(
      'INSERT INTO fruits (name, photo_url) VALUES ($1, $2) RETURNING *',
      [name, photo_url]
    );
    return json(res.rows[0]);
  } catch (err) {
    console.error(err);
    return json({ error: err.message }, { status: 500 });
  }
}