

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl =process.env.REACT_APP_SUPABASE_URL;
const supabaseKey =process.env.REACT_APP_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key not set in .env");
}
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase
