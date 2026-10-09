"use client";
import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  generateImpact,
  saveProfile,
  deleteProfile,
} from "@/app/impact-actions";
import type { Profile } from "@/lib/impact-schema";
import type { WinRecord } from "@/lib/wins";
import { formatWinDate } from "@/lib/win-date";
import { AddWinButton } from "@/components/add-win-modal";
function ranges(kind: string) {
  const now = new Date();
  const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const month =
    kind === "year"
      ? 1
      : kind === "quarter"
        ? Math.floor(now.getMonth() / 3) * 3 + 1
        : now.getMonth() + 1;
  return {
    start: `${now.getFullYear()}-${String(month).padStart(2, "0")}-01`,
    end,
  };
}
function Sources({ ids, wins }: { ids: string[]; wins: WinRecord[] }) {
  const selected = wins.filter((win) => ids.includes(win.id));
  return (
    <details className="impact-sources">
      <summary>
        Based on {ids.length} {ids.length === 1 ? "win" : "wins"}
      </summary>
      {selected.map((win) => (
        <div key={win.id}>
          <time dateTime={win.event_date}>{formatWinDate(win.event_date)}</time>
          <p>{win.original_text}</p>
        </div>
      ))}
      {selected.length < ids.length && (
        <p className="muted">
          Some sources were deleted or are outside the most recent 500 wins.
        </p>
      )}
    </details>
  );
}
function ProfileEditor({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(saveProfile, {});
  return (
    <details className="profile-editor">
      <summary>Edit this profile</summary>
      <form action={action} className="stack">
        <input name="id" type="hidden" value={profile.id} />
        <label>
          Name
          <input
            name="name"
            defaultValue={profile.display_name}
            maxLength={100}
          />
        </label>
        <label>
          Role
          <input
            name="role"
            defaultValue={profile.role_label}
            maxLength={120}
          />
        </label>
        <label>
          Headline
          <input
            name="headline"
            defaultValue={profile.content.headline}
            maxLength={150}
            required
          />
        </label>
        <label>
          Summary
          <textarea
            name="summary"
            defaultValue={profile.content.summary}
            maxLength={1800}
            rows={5}
            required
          />
        </label>
        {profile.content.outcomes.map((outcome, index) => (
          <div className="stack" key={index}>
            <label>
              Outcome {index + 1}
              <input
                name={`title_${index}`}
                defaultValue={outcome.title}
                maxLength={150}
                required
              />
            </label>
            <label>
              Description
              <textarea
                name={`description_${index}`}
                defaultValue={outcome.description}
                maxLength={700}
                rows={3}
                required
              />
            </label>
          </div>
        ))}
        <button disabled={pending}>
          {pending ? "Saving…" : "Save my wording"}
        </button>
        <p role="status" className={state.error ? "error" : "success"}>
          {state.error || state.message}
        </p>
      </form>
    </details>
  );
}
function RemoveProfile({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteProfile, {});
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm("Delete this saved profile? Your wins will stay.")
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button className="text-button danger" disabled={pending}>
        Delete profile
      </button>
      <p role="status">{state.error}</p>
    </form>
  );
}
export function ImpactProfile({
  profiles,
  wins,
  allowance,
}: {
  profiles: Profile[];
  wins: WinRecord[];
  allowance: number;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(generateImpact, {});
  const [selected, setSelected] = useState(profiles[0]?.id || "");
  const [kind, setKind] = useState("month");
  const [period, setPeriod] = useState({ start: "", end: "" });
  const [copyStatus, setCopyStatus] = useState("");
  useEffect(() => setPeriod(ranges("month")), []);
  useEffect(() => {
    if (state.profile) {
      setSelected(state.profile.id);
      router.refresh();
    }
  }, [state.profile, router]);
  const list = profiles;
  const profile = list.find((item) => item.id === selected) || list[0];
  async function copy() {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(
        [
          profile.display_name,
          profile.role_label,
          profile.content.headline,
          `${profile.period_start} — ${profile.period_end}`,
          profile.content.summary,
          "KEY OUTCOMES",
          ...profile.content.outcomes.map(
            (outcome) => `${outcome.title}\n${outcome.description}`,
          ),
        ]
          .filter(Boolean)
          .join("\n\n"),
      );
      setCopyStatus("Profile copied.");
    } catch {
      setCopyStatus(
        "Copy is unavailable. You can select the document text and copy it manually.",
      );
    }
  }
  return (
    <>
      <section className="impact-toolbar card">
        <form action={action} className="impact-generate-form">
          <label>
            Period
            <select
              value={kind}
              onChange={(event) => {
                setKind(event.target.value);
                if (event.target.value !== "custom") {
                  setPeriod(ranges(event.target.value));
                }
              }}
            >
              <option value="month">This month</option>
              <option value="quarter">This quarter</option>
              <option value="year">This year</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <label>
            From
            <input
              type="date"
              name="start"
              value={period.start}
              onChange={(event) => {
                setKind("custom");
                setPeriod({ ...period, start: event.target.value });
              }}
              required
            />
          </label>
          <label>
            To
            <input
              type="date"
              name="end"
              value={period.end}
              onChange={(event) => {
                setKind("custom");
                setPeriod({ ...period, end: event.target.value });
              }}
              required
            />
          </label>
          <button disabled={pending || !wins.length || allowance <= 0}>
            {pending ? "Building your profile…" : "Generate my profile"}
          </button>
        </form>
        <p className="muted">
          {allowance} beta {allowance === 1 ? "generation" : "generations"}{" "}
          remaining. Only generate when you want an update. Selected wins are
          sent to OpenAI.
        </p>
        {state.error && (
          <p className="error" role="alert">
            {state.error}
          </p>
        )}
      </section>
      {list.length > 0 && (
        <div className="profile-controls">
          <label>
            Saved versions
            <select
              value={profile?.id || ""}
              onChange={(event) => setSelected(event.target.value)}
            >
              {list.map((item, index) => (
                <option key={item.id} value={item.id}>
                  {index === 0 ? "Latest · " : ""}
                  {item.period_start} → {item.period_end} ·{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={copy}>
            Copy profile
          </button>
        </div>
      )}
      <p className="muted" role="status">
        {copyStatus}
      </p>
      {profile ? (
        <>
          <article
            className="impact-document"
            aria-label="Your accomplishment profile"
          >
            <header className="impact-document-header">
              <span className="eyebrow">
                YOUR IMPACT · {profile.period_start} — {profile.period_end}
              </span>
              {profile.display_name && (
                <h2 className="profile-name">{profile.display_name}</h2>
              )}
              {profile.role_label && (
                <p className="profile-role">{profile.role_label}</p>
              )}
              <h2 className="profile-headline">{profile.content.headline}</h2>
            </header>
            <section className="profile-summary">
              <h3>Professional summary</h3>
              <p>{profile.content.summary}</p>
              <Sources ids={profile.content.summary_source_ids} wins={wins} />
            </section>
            <section className="profile-outcomes">
              <h3>Key outcomes & contributions</h3>
              {profile.content.outcomes.map((outcome, index) => (
                <div className="profile-outcome" key={index}>
                  <span className="outcome-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4>{outcome.title}</h4>
                    <p>{outcome.description}</p>
                    <Sources ids={outcome.source_ids} wins={wins} />
                  </div>
                </div>
              ))}
            </section>
            <footer className="profile-footnote">
              A saved reflection based on your entries. Review the wording
              before using it elsewhere. Source notes may have changed since
              generation.
            </footer>
          </article>
          <ProfileEditor
            key={profile.id + profile.updated_at}
            profile={profile}
          />
          <RemoveProfile key={profile.id} id={profile.id} />
        </>
      ) : (
        <section className="impact-empty card">
          <span className="eyebrow">YOUR WORK HAS A STORY</span>
          <h2>
            {wins.length
              ? "Your accomplishments are ready to become a profile."
              : "Start with something you got done."}
          </h2>
          <p className="lead">
            {wins.length
              ? "Choose a period above to see your contributions in a clear summary, backed by your own wins."
              : "One real contribution is enough to begin. Add a quick win or use the optional starter prompts."}
          </p>
          <div className="row">
            <AddWinButton label="Add my first win" />
            <Link href="/app/records">Open timeline →</Link>
          </div>
          <div className="impact-example">
            <span className="eyebrow">
              ILLUSTRATIVE EXAMPLE · NOT YOUR PROFILE
            </span>
            <h3>Practical problem solving and support for your team</h3>
            <p>
              During this period, you resolved a recurring access issue and
              helped a teammate complete a deployment.
            </p>
            <strong>Restored account access</strong>
            <p>
              Identified and corrected a refresh-token issue affecting login.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
