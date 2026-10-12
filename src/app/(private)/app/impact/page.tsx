import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { getWins } from "@/lib/wins";
import { ImpactPreview } from "@/components/impact-preview";

export default async function Page() {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) redirect("/login");

  const wins = await getWins();

  return <ImpactPreview wins={wins} userId={user.id} />;
}
