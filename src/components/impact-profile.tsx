"use client";
import {
  useActionState,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
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
import "@/app/paper.css";
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
function Paper({ profile }: { profile: Profile }) {
  return (
    <article className="impact-paper" aria-label="Your accomplishment profile">
      <header className="paper-header">
        <span className="paper-period">
          {profile.period_start} — {profile.period_end}
        </span>
        {profile.display_name && (
          <h2 className="paper-name">{profile.display_name}</h2>
        )}
        {profile.role_label && (
          <p className="paper-role">{profile.role_label}</p>
        )}
        <h2 className="paper-headline">{profile.content.headline}</h2>
      </header>
      <section className="paper-summary">
        <h3>Professional summary</h3>
        <p>{profile.content.summary}</p>
      </section>
      <section className="paper-outcomes">
        <h3>Key outcomes & contributions</h3>
        {profile.content.outcomes.map((outcome, index) => (
          <div className="paper-outcome" key={index}>
            <span className="paper-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h4>{outcome.title}</h4>
              <p>{outcome.description}</p>
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}
export function ImpactProfile({
  profiles,
  wins,
  allowance,
  starter,
}: {
  profiles: Profile[];
  wins: WinRecord[];
  allowance: number;
  starter?: ReactNode;
}) {
  const router = useRouter();
  const reader = useRef<HTMLDialogElement>(null);
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
  const profile = profiles.find((item) => item.id === selected) || profiles[0];
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
      setCopyStatus("Select the document text to copy it manually.");
    }
  }
  function expand() {
    reader.current?.showModal();
  }
  return (
    <div className="paper-workspace">
      <aside className="paper-sidebar" aria-label="Profile controls">
        <div className="paper-intro">
          <span className="eyebrow">YOUR IMPACT</span>
          <h1>
            Your work.
            <br />
            Worth seeing.
          </h1>
          <p className="muted">
            A clear picture of what you bring, built from the work you’ve done.
          </p>
        </div>
        <div className="paper-quick-actions">
          <AddWinButton />
          <Link href="/app/records">View timeline →</Link>
        </div>
        {starter}
        <details className="paper-settings" open={!profile}>
          <summary>
            {profile ? "Create an updated profile" : "Create your profile"}
          </summary>
          <form action={action} className="stack">
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
            <div className="paper-date-fields">
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
            </div>
            <button disabled={pending || !wins.length || allowance <= 0}>
              {pending ? "Building your profile…" : "Generate my profile"}
            </button>
            <p className="muted">
              {allowance} beta {allowance === 1 ? "generation" : "generations"}{" "}
              remaining. Selected wins are sent to OpenAI.
            </p>
          </form>
        </details>
        {pending && (
          <p role="status" className="muted">
            Taking a moment to put your contributions into perspective…
          </p>
        )}
        {state.error && (
          <p className="error" role="alert">
            {state.error}
          </p>
        )}
        {profile && (
          <>
            <label className="paper-version-label">
              Saved profiles
              <select
                value={profile.id}
                onChange={(event) => setSelected(event.target.value)}
              >
                {profiles.map((item, index) => (
                  <option key={item.id} value={item.id}>
                    {index === 0 ? "Latest · " : ""}
                    {item.period_start} → {item.period_end}
                  </option>
                ))}
              </select>
            </label>
            <div className="paper-document-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={expand}
              >
                Expand document ↗
              </button>
              <button type="button" className="secondary-button" onClick={copy}>
                Copy profile
              </button>
            </div>
            <p className="muted" role="status">
              {copyStatus}
            </p>
            <details className="paper-evidence">
              <summary>View supporting wins</summary>
              <p className="muted">
                These are the current source notes. They may have changed since
                generation.
              </p>
              <h3>Summary</h3>
              <Sources ids={profile.content.summary_source_ids} wins={wins} />
              {profile.content.outcomes.map((outcome, index) => (
                <div key={index}>
                  <h3>{outcome.title}</h3>
                  <Sources ids={outcome.source_ids} wins={wins} />
                </div>
              ))}
            </details>
            <ProfileEditor
              key={profile.id + profile.updated_at}
              profile={profile}
            />
            <details className="paper-manage">
              <summary>Manage this profile</summary>
              <p className="muted">
                Deleting a profile keeps your original wins.
              </p>
              <RemoveProfile key={profile.id} id={profile.id} />
            </details>
            <p className="paper-review-note">
              Your profile is a saved reflection. Review the wording before
              sharing it.
            </p>
          </>
        )}
      </aside>
      <section className="paper-stage" aria-label="Document preview">
        {profile ? (
          <>
            <div className="paper-stage-label">
              <span>Your accomplishment profile</span>
              <button type="button" className="text-button" onClick={expand}>
                Expand ↗
              </button>
            </div>
            <div className="paper-preview">
              <div className="paper-preview-sheet">
                <Paper profile={profile} />
              </div>
              <button
                type="button"
                className="paper-preview-open"
                onClick={expand}
                aria-label="Expand your accomplishment profile"
              >
                <span>Click to read ↗</span>
              </button>
            </div>
            <p className="paper-stage-hint">
              Click the paper to open the full document.
            </p>
          </>
        ) : (
          <div className="impact-paper paper-placeholder">
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>
              {wins.length
                ? "You’ve already done the work."
                : "Start with one real win."}
            </h2>
            <p>
              {wins.length
                ? "Generate your profile to see your contributions brought together in one place."
                : "Add something you fixed, finished, learned, or helped with. Your profile will grow from your own experience."}
            </p>
            <div className="paper-example">
              <span className="eyebrow">ILLUSTRATIVE EXAMPLE</span>
              <h3>Practical problem solving and client support</h3>
              <p>
                Your work shows hands-on troubleshooting and support for clients
                navigating technical setup.
              </p>
              <h4>Restored internet connectivity</h4>
              <p>Resolved a client’s connectivity issue.</p>
            </div>
          </div>
        )}
      </section>
      {profile && (
        <dialog
          ref={reader}
          className="paper-reader"
          aria-label="Expanded accomplishment profile"
        >
          <div className="paper-reader-toolbar">
            <span>YOUR IMPACT</span>
            <button type="button" className="secondary-button" onClick={copy}>
              Copy
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => reader.current?.close()}
              autoFocus
            >
              Close ✕
            </button>
          </div>
          <Paper profile={profile} />
        </dialog>
      )}
    </div>
  );
}
