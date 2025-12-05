import { Client } from "pg";

export async function handler(event, context) {
  const client = new Client({ connectionString: process.env.NEON_DATABASE_URL });
  await client.connect();

  const res = await client.query("SELECT id, name FROM fruits ORDER BY id");
  await client.end();

  return {
    statusCode: 200,
    body: JSON.stringify(res.rows),
  };
}