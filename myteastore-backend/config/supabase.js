
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[WARNING] Supabase URL or Key not set in .env — DB routes will fail");
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "");

module.exports = supabase;
