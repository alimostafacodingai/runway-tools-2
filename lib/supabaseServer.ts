import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extra safety so build errors are clear
if (!supabaseUrl) {
  throw new Error("SUPABASE_URL env var is not set");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is not set");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
