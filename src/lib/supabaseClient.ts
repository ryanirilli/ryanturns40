import { createClient } from "@supabase/supabase-js";

// Ensure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// set in your local .env file and in Vercel project environment variables.
// These keys are safe to expose on the client—only the anon/public key
// should be used here.

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
