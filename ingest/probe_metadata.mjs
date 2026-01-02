import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: path.join(process.cwd(), "ingest", ".env") });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE_URL =", url);
console.log("KEY length  =", (key || "").length);

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await supabase
  .from("knowledge_docs")
  .select("id,metadata")
  .limit(1);

console.log("ERROR =", error);
console.log("DATA  =", data);
