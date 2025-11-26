import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Temporary hardcoded values for dev environment
const SUPABASE_URL = "https://elemiywbemevklssilhz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZW1peXdiZW1ldmtsc3NpbGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDk0NjIsImV4cCI6MjA3OTcyNTQ2Mn0.OYNcFKygWDgQ0ywg_lm7bCaLwNv_Nq5Yuppn0koMv_s";

export const supabase = createClientComponentClient({
  supabaseUrl: SUPABASE_URL,
  supabaseKey: SUPABASE_KEY,
});

