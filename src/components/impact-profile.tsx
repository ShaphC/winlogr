"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
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

type Panel = "update" | "sources" | "edit" | "manage";

function ranges(kind: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month =
    kind === "year"
      ? 1
      : kind === "quarter"
        ? Math.floor(now.getMonth() / 3) * 3 + 1
        : now.getMonth() + 1;
  return {
    start: `${year}-${String(month).padStart(2, "0")}-01`,
    end: `${year}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
  };
}

function SupportingWins({
  profile,
  wins,
}: {
  profile: Profile;
  wins: WinRecord[];
}) {
  const ids = new Set([
    ...profile.content.summary_source_ids,
    ...profile.content.outcomes.flatMap((outcome) => outcome.source_ids),
  ]);

  const sources = wins
    .filter((win) => ids.has(win.id))
    .sort(
      (a, b) =>
        b.event_date.localeCompare(a.event_date) ||
        b.created_at.localeCompare(a.created_at),
    );

  const dates = [...new Set(sources.map((win) => win.event_date))];

  return (
    <div>
      <p className="muted">
        These notes support your saved profile. They may have changed since it
        was generated.
      </p>

      <ol className="wins-timeline">
        {dates.map((date) => (
          <li className="timeline-item" key={date}>
            <span className="timeline-dot" aria-hidden="true" />

            <div className="timeline-record">
              <h3 className="timeline-date">
                <time dateTime={date}>{formatWinDate(date)}</time>
              </h3>

              {sources
                .filter((win) => win.event_date === date)
                .map((win) => {
                  const supports = [
                    ...(profile.content.summary_source_ids.includes(win.id)
                      ? ["Professional summary"]
                      : []),
                    ...profile.content.outcomes
                      .filter((outcome) => outcome.source_ids.includes(win.id))
                      .map((outcome) => outcome.title),
                  ];

                  return (
                    <article className="dated-win" key={win.id}>
                      <p className="timeline-text">{win.original_text}</p>
                      <p className="supporting-win-context">
                        Supports: {supports.join(" · ")}
                      </p>
                    </article>
                  );
                })}
            </div>
          </li>
        ))}
      </ol>

      {sources.length < ids.size && (
        <p className="muted">
          Some supporting wins were deleted or are outside the most recent 500
          entries.
        </p>
      )}
    </div>
  );
}

function ProfileEditor({
  profile,
  onSaved,
  onCancel,
  onPending,
}: {
  profile: Profile;
  onSaved: () => void;
  onCancel: () => void;
  onPending: (pending: boolean) => void;
}) {
  const [state, action, pending] = useActionState(saveProfile, {});

  useEffect(() => {
    onPending(pending);
  }, [pending, onPending]);

  useEffect(() => {
    if (state.message && !state.error) onSaved();
  }, [state.message, state.error, onSaved]);

  return (
    <form action={action} className="stack">
      <input name="id" type="hidden" value={profile.id} />
      <p className="muted">
        Make the wording your own while keeping it true to your work.
      </p>
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
        <input name="role" defaultValue={profile.role_label} maxLength={120} />
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
        Professional summary
        <textarea
          name="summary"
          defaultValue={profile.content.summary}
          maxLength={1800}
          rows={6}
          required
        />
      </label>
      {profile.content.outcomes.map((outcome, index) => (
        <fieldset className="profile-outcome-fields stack" key={index}>
          <legend>Outcome {index + 1}</legend>
          <label>
            Title
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
              rows={4}
              required
            />
          </label>
        </fieldset>
      ))}
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <div className="profile-modal-actions">
        <button disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function RemoveProfile({
  id,
  onPending,
}: {
  id: string;
  onPending: (pending: boolean) => void;
}) {
  const [state, action, pending] = useActionState(deleteProfile, {});
  useEffect(() => {
    onPending(pending);
  }, [pending, onPending]);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Delete this saved profile? Your original wins will stay.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button className="secondary-button danger" disabled={pending}>
        {pending ? "Deleting…" : "Delete this version"}
      </button>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
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
  const modal = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(generateImpact, {});
  const [selected, setSelected] = useState(profiles[0]?.id || "");
  const [panel, setPanel] = useState<Panel | null>(null);
  const [kind, setKind] = useState("month");
  const [period, setPeriod] = useState({ start: "", end: "" });
  const [copyStatus, setCopyStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const busy = pending || saving || deleting;
  const profile = profiles.find((item) => item.id === selected) || profiles[0];

  useEffect(() => setPeriod(ranges("month")), []);
  useEffect(() => {
    if (state.profile) {
      setSelected(state.profile.id);
      modal.current?.close();
      setPanel(null);
      router.refresh();
    }
  }, [state.profile, router]);

  useEffect(() => {
    if (panel && !modal.current?.open) modal.current?.showModal();
  }, [panel]);

  useEffect(() => {
    if (!profile && panel && panel !== "update") {
      modal.current?.close();
      setPanel(null);
    }
  }, [profile, panel]);

  function closeModal() {
    if (busy) return;
    modal.current?.close();
    setPanel(null);
  }

  function saved() {
    modal.current?.close();
    setPanel(null);
    router.refresh();
  }

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

  const titles = {
    update: profile ? "Update your profile" : "Create your profile",
    sources: "Supporting wins",
    edit: "Edit your profile",
    manage: "Manage your profile",
  };

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
        <div className="profile-action-list">
          <button
            type="button"
            className="profile-action"
            onClick={() => setPanel("update")}
          >
            <span>
              <strong>{profile ? "Update profile" : "Create profile"}</strong>
              <small>Bring your recent contributions together</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            className="profile-action"
            disabled={!profile}
            onClick={() => setPanel("sources")}
          >
            <span>
              <strong>Supporting wins</strong>
              <small>See the work behind your profile</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            className="profile-action"
            disabled={!profile}
            onClick={() => setPanel("edit")}
          >
            <span>
              <strong>Edit profile</strong>
              <small>Make the wording your own</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            className="profile-action"
            disabled={!profile}
            onClick={() => setPanel("manage")}
          >
            <span>
              <strong>Manage profile</strong>
              <small>Browse and manage saved versions</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className="paper-review-note">
          Your profile is a saved reflection. Review the wording before sharing
          it.
        </p>
      </aside>

      <section className="paper-stage" aria-label="Document preview">
        {profile ? (
          <>
            <div className="paper-stage-label">
              <span>Your accomplishment profile</span>
              <button
                type="button"
                className="text-button"
                onClick={() => reader.current?.showModal()}
              >
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
                onClick={() => reader.current?.showModal()}
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
                ? "Create your profile to see your contributions brought together in one place."
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

      <dialog
        ref={modal}
        className="profile-modal"
        aria-labelledby="profile-modal-title"
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        onClose={() => setPanel(null)}
      >
        <header className="profile-modal-header">
          <h2 id="profile-modal-title">{panel ? titles[panel] : "Profile"}</h2>
          <button
            type="button"
            className="secondary-button"
            disabled={busy}
            onClick={closeModal}
            autoFocus
          >
            Close ✕
          </button>
        </header>
        <div className="profile-modal-body">
          {panel === "update" && (
            <form action={action} className="stack">
              <p className="muted">
                Choose a period. We’ll create a new saved version from the wins
                you entered.
              </p>
              <label>
                Period
                <select
                  value={kind}
                  disabled={pending}
                  onChange={(event) => {
                    setKind(event.target.value);
                    if (event.target.value !== "custom")
                      setPeriod(ranges(event.target.value));
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
                    readOnly={pending}
                    required
                    onChange={(event) => {
                      setKind("custom");
                      setPeriod({ ...period, start: event.target.value });
                    }}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    name="end"
                    value={period.end}
                    readOnly={pending}
                    required
                    onChange={(event) => {
                      setKind("custom");
                      setPeriod({ ...period, end: event.target.value });
                    }}
                  />
                </label>
              </div>
              {!wins.length && (
                <p className="muted">Add a win before creating your profile.</p>
              )}
              <button disabled={pending || !wins.length || allowance <= 0}>
                {pending
                  ? "Building your profile…"
                  : profile
                    ? "Generate updated profile"
                    : "Generate my profile"}
              </button>
              <p className="muted">
                {allowance} beta{" "}
                {allowance === 1 ? "generation" : "generations"} remaining.
                Selected wins are sent to OpenAI.
              </p>
              {pending && (
                <p role="status">
                  Putting your contributions into perspective…
                </p>
              )}
              {state.error && (
                <p className="error" role="alert">
                  {state.error}
                </p>
              )}
            </form>
          )}
          {panel === "sources" && profile && (
            <SupportingWins profile={profile} wins={wins} />
          )}
          {panel === "edit" && profile && (
            <ProfileEditor
              key={profile.id + profile.updated_at}
              profile={profile}
              onSaved={saved}
              onCancel={closeModal}
              onPending={setSaving}
            />
          )}
          {panel === "manage" && profile && (
            <div className="stack">
              <p className="muted">
                Switch between saved versions to change the document shown on
                your screen.
              </p>
              <label>
                Saved versions
                <select
                  value={profile.id}
                  disabled={deleting}
                  onChange={(event) => setSelected(event.target.value)}
                >
                  {profiles.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {index === 0 ? "Latest · " : ""}
                      {item.period_start} → {item.period_end}
                      {" · "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </label>
              <div className="profile-version-info">
                <strong>{profile.content.headline}</strong>
                <p>
                  {profile.period_start} — {profile.period_end}
                </p>
                <small>
                  Saved {new Date(profile.created_at).toLocaleString()}
                </small>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={copy}
                disabled={deleting}
              >
                Copy this version
              </button>
              <p className="muted" role="status">
                {copyStatus}
              </p>
              <section className="profile-delete-section">
                <h3>Delete version</h3>
                <p className="muted">
                  This removes only the selected profile. Your original wins
                  stay.
                </p>
                <RemoveProfile
                  key={profile.id}
                  id={profile.id}
                  onPending={setDeleting}
                />
              </section>
            </div>
          )}
        </div>
      </dialog>

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
          <p className="muted" role="status">
            {copyStatus}
          </p>
          <Paper profile={profile} />
        </dialog>
      )}
    </div>
  );
}
