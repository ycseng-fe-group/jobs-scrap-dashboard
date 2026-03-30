import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.SUPABASE_URL as string;
const key = import.meta.env.SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(url, key);
