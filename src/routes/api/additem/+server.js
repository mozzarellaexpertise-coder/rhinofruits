import { json } from '@sveltejs/kit';
import { Pool } from 'pg'; // Import Pool directly
import { NEON_DATABASE_URL } from '$env/static/private'; // 👈 Use $env for server secrets

// Declare the pool once. In serverless, this instance may persist between calls 
// (hot start), saving time and resources.
const pool = new Pool({
 connectionString: NEON_DATABASE_URL // 👈 Use the imported $env variable
});

// This function handles POST requests to the /api/additem endpoint
export async function POST({ request }) {
 // 1. Parse the request body
 const { name, photo_url } = await request.json();

 // 2. Validate the data
 if (!name || !photo_url) {
  // Use the SvelteKit json helper with the status code
  return json({ error: 'Fruit name and photo URL are required.' }, { status: 400 }); 
 }

 try {
  // 3. Execute the database query
  const res = await pool.query(
   'INSERT INTO fruits (name, photo_url) VALUES ($1, $2) RETURNING *',
   [name, photo_url]
  );
    
  // 4. Return the newly created fruit item
  return json(res.rows[0], { status: 201 }); // 201 status code for 'Created'
    
 } catch (err) {
  // 5. Handle any errors during insertion
  console.error("Database insertion failed:", err);
  return json({ 
        error: "Failed to add fruit to database.",
        details: err.message 
    }, { status: 500 });
 }
  // Note: No pool.end() call here, allowing the pool to persist for subsequent requests.
}