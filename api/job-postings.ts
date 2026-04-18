import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );

  const { date } = req.query;

  let query = supabase
    .from("job_postings")
    .select("*")
    .order("scraped_at", { ascending: false });

  if (date && typeof date === "string") {
    query = query
      .gte("scraped_at", `${date}T00:00:00`)
      .lte("scraped_at", `${date}T23:59:59.999`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
