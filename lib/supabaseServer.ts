// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;              // ✅ change this
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // this is already fine

export const supabaseServer = createClient(url, serviceRoleKey);
