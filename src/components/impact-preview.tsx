"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WinRecord } from "@/lib/wins";
import "@/app/paper.css";
import "@/app/(private)/app/highlights.css";
import { LoadingIndicator } from "@/components/spinner";

type DocumentOptions = {
  title: string;
  name: string;
  role: string;
  includeDates: boolean;
};

const defaultOptions: DocumentOptions = {
  title: "Selected accomplishments",
  name: "",
  role: "",
  includeDates: false,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

/* Use this same component for the recipient view when sharing is added. */
export function HighlightsDocument({
  wins,
  options,
}: {
  wins: WinRecord[];
  options: DocumentOptions;
}) {
  return (
    <article className="impact-paper highlights-document">
      <header className="paper-header">
        {options.name.trim() && (
          <h2 className="paper-name">{options.name.trim()}</h2>
        )}

        {options.role.trim() && (
          <p className="paper-role">{options.role.trim()}</p>
        )}

        <h2 className="paper-headline">
          {options.title.trim() || "Selected accomplishments"}
        </h2>
      </header>

      <section className="paper-outcomes">
        {wins.map((win, index) => (
          <div className="paper-outcome" key={win.id}>
            <span className="paper-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              {options.includeDates && (
                <time className="highlights-date" dateTime={win.event_date}>
                  {formatDate(win.event_date)}
                </time>
              )}
              <p className="highlights-entry">{win.original_text}</p>
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}

export function ImpactPreview({
  wins,
  userId,
}: {
  wins: WinRecord[];
  userId: string;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [options, setOptions] = useState<DocumentOptions>(defaultOptions);
  const [draft, setDraft] = useState<DocumentOptions>(defaultOptions);
  const [panel, setPanel] = useState<"settings" | "entries" | null>(null);
  const [status, setStatus] = useState("");

  const reader = useRef<HTMLDialogElement>(null);
  const modal = useRef<HTMLDialogElement>(null);

  const selectionKey = `winlog:impact-selection:${userId}`;
  const optionsKey = `winlog:highlights-options:${userId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(selectionKey);
      const parsed = stored ? JSON.parse(stored) : [];

      setIds(
        Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : [],
      );
    } catch {
      setIds([]);
    }

    try {
      const stored = localStorage.getItem(optionsKey);
      const parsed = stored ? JSON.parse(stored) : null;

      if (parsed && typeof parsed === "object") {
        setOptions({
          title:
            typeof parsed.title === "string"
              ? parsed.title.slice(0, 120)
              : defaultOptions.title,
          name:
            typeof parsed.name === "string" ? parsed.name.slice(0, 100) : "",
          role:
            typeof parsed.role === "string" ? parsed.role.slice(0, 120) : "",
          includeDates: parsed.includeDates === true,
        });
      }
    } catch {}

    setReady(true);
  }, [selectionKey, optionsKey]);

  useEffect(() => {
    if (panel && !modal.current?.open) {
      modal.current?.showModal();
    }
  }, [panel]);

  const selected = wins.filter((win) => ids.includes(win.id));
  const missingCount = new Set(ids).size - selected.length;
  const dates = [...new Set(selected.map((win) => win.event_date))];

  function openSettings() {
    setDraft({ ...options });
    setStatus("");
    setPanel("settings");
  }

  function closePanel() {
    modal.current?.close();
    setPanel(null);
  }

  function saveOptions() {
    setOptions({ ...draft });

    try {
      localStorage.setItem(optionsKey, JSON.stringify(draft));
      setStatus("Document settings saved on this device.");
    } catch {
      setStatus(
        "Document updated for this visit. Your browser couldn’t remember the settings.",
      );
    }

    closePanel();
  }

  function removeEntry(id: string) {
    const next = ids.filter((item) => item !== id);

    try {
      localStorage.setItem(selectionKey, JSON.stringify(next));
      setIds(next);
      setStatus("");
    } catch {
      setStatus("Your browser couldn’t save the updated selection.");
    }
  }

  async function copyDocument() {
    const text = [
      options.name.trim(),
      options.role.trim(),
      options.title.trim() || "Selected accomplishments",
      ...selected.map((win) =>
        [
          options.includeDates ? formatDate(win.event_date) : "",
          win.original_text,
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setStatus("Highlights copied.");
    } catch {
      setStatus("Open the full document to select and copy the text.");
    }
  }

  if (!ready) {
    return <LoadingIndicator label="Loading your highlights…" />;
  }

  return (
    <div className="paper-workspace highlights-workspace">
      <section className="paper-stage" aria-label="Highlights preview">
        <div className="paper-stage-label">
          <span>Document preview</span>
          {selected.length > 0 && (
            <button
              type="button"
              className="text-button"
              onClick={() => reader.current?.showModal()}
            >
              Expand ↗
            </button>
          )}
        </div>

        {selected.length ? (
          <>
            <div className="paper-preview">
              <div className="paper-preview-sheet" aria-hidden="true">
                <HighlightsDocument wins={selected} options={options} />
              </div>

              <button
                type="button"
                className="paper-preview-open"
                onClick={() => reader.current?.showModal()}
                aria-label="Open the full highlights document"
              >
                <span>Click to read ↗</span>
              </button>
            </div>

            <p className="paper-stage-hint">
              The paper shows the beginning. Open it to read all selected
              accomplishments.
            </p>
          </>
        ) : (
          <div className="impact-paper paper-placeholder">
            <span className="eyebrow">CHOOSE WHAT YOU WANT TO SHOW</span>
            <h2>Your accomplishments, brought together.</h2>
            <p>
              Select entries from your library to prepare your highlights.
              Review the document before using it elsewhere.
            </p>
            <Link className="button" href="/app">
              Choose accomplishments
            </Link>
          </div>
        )}
      </section>

      <aside className="paper-sidebar" aria-label="Highlights controls">
        <div className="paper-intro">
          <span className="eyebrow">YOUR HIGHLIGHTS</span>
          <h1>
            What you’ve done.
            <br />
            Ready to show.
          </h1>
          <p className="muted">
            Bring selected accomplishments together for your next conversation.
          </p>
        </div>

        <div className="paper-quick-actions">
          <Link href="/app">
            {selected.length ? "Change selection" : "Choose accomplishments"}
          </Link>
          <span className="muted">{selected.length} selected</span>
        </div>

        <div className="profile-action-list">
          <button
            type="button"
            className="profile-action"
            onClick={openSettings}
          >
            <span>
              <strong>Document settings</strong>
              <small>Choose a title, name, role, and date display</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>

          <button
            type="button"
            className="profile-action"
            disabled={!selected.length}
            onClick={() => {
              setStatus("");
              setPanel("entries");
            }}
          >
            <span>
              <strong>Selected entries</strong>
              <small>Review the notes included in your document</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>

          <button
            type="button"
            className="profile-action"
            disabled={!selected.length}
            onClick={() => reader.current?.showModal()}
          >
            <span>
              <strong>Read highlights</strong>
              <small>Open the complete document at full size</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>

          <button
            type="button"
            className="profile-action"
            disabled={!selected.length}
            onClick={copyDocument}
          >
            <span>
              <strong>Copy highlights</strong>
              <small>Use the reviewed text in an email or document</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>

        <p className="paper-review-note">
          Nothing is published or sent automatically. Your selection uses the
          current wording of your saved accomplishments.
        </p>

        {missingCount > 0 && (
          <p className="paper-review-note">
            {missingCount} selected{" "}
            {missingCount === 1 ? "entry is" : "entries are"} unavailable. They
            may have been deleted or fall outside the loaded records.
          </p>
        )}

        <p className="muted" role="status">
          {status}
        </p>
      </aside>

      <dialog
        ref={modal}
        className="profile-modal"
        aria-labelledby="highlights-panel-title"
        onClose={() => setPanel(null)}
      >
        <header className="profile-modal-header">
          <h2 id="highlights-panel-title">
            {panel === "settings" ? "Document settings" : "Selected entries"}
          </h2>
          <button
            type="button"
            className="secondary-button"
            onClick={closePanel}
          >
            Close ✕
          </button>
        </header>

        <div className="profile-modal-body">
          {panel === "settings" && (
            <form
              className="stack"
              onSubmit={(event) => {
                event.preventDefault();
                saveOptions();
              }}
            >
              <label>
                Document title
                <input
                  value={draft.title}
                  maxLength={120}
                  placeholder="For example: October one-on-one"
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                />
              </label>

              <label>
                Name — optional
                <input
                  value={draft.name}
                  maxLength={100}
                  autoComplete="name"
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>

              <label>
                Role — optional
                <input
                  value={draft.role}
                  maxLength={120}
                  placeholder="For example: Software Developer"
                  onChange={(event) =>
                    setDraft({ ...draft, role: event.target.value })
                  }
                />
              </label>

              <label className="highlights-checkbox">
                <input
                  type="checkbox"
                  checked={draft.includeDates}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      includeDates: event.target.checked,
                    })
                  }
                />
                Include accomplishment dates
              </label>

              <button type="submit">Apply settings</button>
            </form>
          )}

          {panel === "entries" && (
            <>
              <p className="muted">
                These original notes appear in your highlights. Removing an
                entry here keeps it in your accomplishment library.
              </p>

              <ol className="wins-timeline">
                {dates.map((date) => (
                  <li className="timeline-item" key={date}>
                    <span className="timeline-dot" aria-hidden="true" />
                    <div className="timeline-record">
                      <h3 className="timeline-date">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </h3>

                      {selected
                        .filter((win) => win.event_date === date)
                        .map((win) => (
                          <article className="dated-win" key={win.id}>
                            <p className="timeline-text">{win.original_text}</p>
                            <button
                              type="button"
                              className="text-button"
                              onClick={() => removeEntry(win.id)}
                            >
                              Remove from highlights
                            </button>
                          </article>
                        ))}
                    </div>
                  </li>
                ))}
              </ol>

              {!selected.length && (
                <p className="muted">No entries selected.</p>
              )}
              <p className="muted" role="status">
                {status}
              </p>
            </>
          )}
        </div>
      </dialog>

      <dialog
        ref={reader}
        className="paper-reader"
        aria-label="Full highlights document"
      >
        <div className="paper-reader-toolbar">
          <span>HIGHLIGHTS</span>
          <button
            type="button"
            className="secondary-button"
            onClick={copyDocument}
            disabled={!selected.length}
          >
            Copy
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => reader.current?.close()}
          >
            Close ✕
          </button>
        </div>

        <p className="muted" role="status">
          {status}
        </p>
        <HighlightsDocument wins={selected} options={options} />
      </dialog>
    </div>
  );
}
