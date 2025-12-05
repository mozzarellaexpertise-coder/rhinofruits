import { Pool } from 'pg';
// For server-side secrets in SvelteKit, use $env/static/private
import { NEON_DATABASE_URL } from '$env/static/private'; 

// This function handles GET requests to the /api/items endpoint
export async function GET() {
 // Create pool inside handler. We use the imported private variable.
 const pool = new Pool({
  connectionString: NEON_DATABASE_URL 
 });

 let client; // Declare client outside try block

 try {
  // 1. Attempt to connect
  client = await pool.connect();
    
  // 2. Query the database
  const result = await client.query('SELECT * FROM fruits ORDER BY id ASC');

  // 3. Return the data
  return new Response(JSON.stringify(result.rows), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
    });
 } catch (err) {
  // If connection or query fails
  console.error("Database operation failed:", err);
  return new Response(JSON.stringify({ 
        error: "Failed to fetch fruits from DB.", 
        details: err.message 
    }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
 } finally {
  // 4. IMPORTANT: Release the client back to the pool
  if (client) {
   client.release();
  }
    
    // We REMOVE the pool.end() call so the pool can be reused by the next request.
 }
}