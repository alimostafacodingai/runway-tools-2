import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC_SUPABASE_URL so it is always available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL env var is not set");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is not set");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
