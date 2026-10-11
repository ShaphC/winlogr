import "./accomplishments.css";
import { createClient } from "@/lib/supabase";
import { getWins } from "@/lib/wins";
import { redirect } from "next/navigation";
import { AccomplishmentLibrary } from "@/components/accomplishment-library";

export default async function Page() {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) redirect("/login");

  const wins = await getWins();

  return <AccomplishmentLibrary wins={wins} userId={user.id} />;
}
