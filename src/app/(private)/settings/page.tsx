import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { SettingsForm } from "@/components/forms";
import { ThemeSelect } from "@/components/theme";
import "./settings.css";

export default async function Page() {
  const db = await createClient();
  const {
    data: { user },
    error: authError,
  } = await db.auth.getUser();

  if (authError || !user) redirect("/login");

  const { data, error } = await db
    .from("win_user_settings")
    .select("reminder_day,reminder_time,timezone")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error("Unable to load settings.");

  return (
    <div className="settings-page">
      <header className="settings-heading">
        <span className="eyebrow">MAKE IT YOURS</span>
        <h1>Settings</h1>
        <p className="muted">
          Choose your appearance and save your reminder preferences.
        </p>
      </header>

      <section className="settings-panel" aria-labelledby="appearance-heading">
        <div className="settings-panel-heading">
          <h2 id="appearance-heading">Appearance</h2>
          <p>Choose light, dark, or follow your device automatically.</p>
        </div>

        <div className="settings-appearance">
          <label>
            <span>Theme</span>
            <ThemeSelect />
          </label>
          <p className="muted">
            The navbar toggle switches between light and dark. Choose System
            here to follow your device again.
          </p>
        </div>
      </section>

      <section className="settings-panel" aria-labelledby="reminders-heading">
        <div className="settings-panel-heading">
          <div className="settings-title-row">
            <h2 id="reminders-heading">Reminder preferences</h2>
            <span className="settings-badge">Not active yet</span>
          </div>
          <p>
            Save a convenient day and time for revisiting your accomplishments.
            These preferences do not send reminders yet.
          </p>
        </div>

        <SettingsForm settings={data} />
      </section>
    </div>
  );
}
