
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[WARNING] Supabase URL or Key not set in .env — DB routes will fail");
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// Admin client with service role key — bypasses RLS for storage uploads
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl || "", supabaseServiceKey)
  : supabase; // fallback to anon client if not set

module.exports = { supabase, supabaseAdmin };
