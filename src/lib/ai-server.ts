import "server-only";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
export function aiServices() {
  const key = process.env.OPENAI_API_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !url || !serviceKey) {
    throw new Error(
      "Generation is not configured. Add server-side OpenAI and Supabase service keys.",
    );
  }
  return {
    ai: new OpenAI({
      apiKey: key,
      maxRetries: 0,
      timeout: 75000,
    }),
    admin: createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }),
  };
}
