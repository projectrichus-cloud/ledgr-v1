import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Supabase client for use in Client Components (anything with "use client").
 * Reads the public anon key — safe to expose in the browser because
 * Row Level Security (RLS) policies in Postgres control what it can access.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
