import { Client } from "pg";

export async function handler(event, context) {
  const client = new Client({ connectionString: process.env.NEON_DATABASE_URL });
  await client.connect();

  const { name } = JSON.parse(event.body);
  await client.query("INSERT INTO fruits(name) VALUES($1)", [name]);
  await client.end();

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
}