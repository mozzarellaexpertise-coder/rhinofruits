import { Client } from "pg";

export async function handler(event, context) {
  const client = new Client({ connectionString: process.env.NEON_DATABASE_URL });
  await client.connect();

  const { id } = JSON.parse(event.body);
  await client.query("DELETE FROM fruits WHERE id=$1", [id]);
  await client.end();

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
}
