import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
export type WinRecord = {
  id: string;
  original_text: string;
  polished_text: string | null;
  event_date: string;
  created_at: string;
};
export async function getWins(): Promise<WinRecord[]> {
  const db = await createClient();
  const {
    data: { user },
    error: authError,
  } = await db.auth.getUser();
  if (authError || !user) redirect("/login");
  const { data, error } = await db
    .from("win_wins")
    .select("id,original_text,polished_text,event_date,created_at")
    .eq("user_id", user.id)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error("Unable to load your wins.");
  return data ?? [];
}
