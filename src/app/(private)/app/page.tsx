import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { getWins } from "@/lib/wins";
import { impactSchema, type Profile } from "@/lib/impact-schema";
import { ImpactProfile } from "@/components/impact-profile";
import { StarterProfile } from "@/components/starter-profile";
import { AddWinButton } from "@/components/add-win-modal";
export default async function Page() {
  const wins = await getWins();
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  const [saved, settings, limits, usage] = await Promise.all([
    db
      .from("win_profiles")
      .select(
        "id,content,source_win_ids,period_start,period_end,display_name,role_label,created_at,updated_at",
      )
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20),
    db
      .from("win_user_settings")
      .select("display_name,role_label,onboarding_dismissed")
      .eq("user_id", user!.id)
      .maybeSingle(),
    db
      .from("win_ai_limits")
      .select("generation_limit")
      .eq("user_id", user!.id)
      .maybeSingle(),
    db
      .from("win_ai_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .in("status", ["pending", "succeeded", "uncertain"]),
  ]);
  if (saved.error || settings.error || limits.error || usage.error) {
    throw new Error(
      "Apply migration 002_win_impact.sql to enable Your Impact.",
    );
  }
  const profiles = (saved.data ?? []).filter(
    (profile) => impactSchema.safeParse(profile.content).success,
  ) as Profile[];
  const allowance = Math.max(
    0,
    (limits.data?.generation_limit ?? 5) - (usage.count ?? 0),
  );
  return (
    <div className="impact-page">
      <div className="impact-page-heading">
        <div>
          <span className="eyebrow">YOUR WORK, IN PERSPECTIVE</span>
          <h1>Look at what you bring.</h1>
          <p className="muted">
            A clear picture of your contributions, grounded in what you’ve done.
          </p>
        </div>
        <div className="row">
          <Link className="secondary-button" href="/app/records">
            Timeline
          </Link>
          <AddWinButton />
        </div>
      </div>
      {!profiles.length && (
        <StarterProfile
          name={settings.data?.display_name || ""}
          role={settings.data?.role_label || ""}
          initialOpen={!settings.data?.onboarding_dismissed && !wins.length}
        />
      )}
      <ImpactProfile profiles={profiles} wins={wins} allowance={allowance} />
    </div>
  );
}
