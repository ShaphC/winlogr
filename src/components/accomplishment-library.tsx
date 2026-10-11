"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AddWinButton } from "@/components/add-win-modal";
import { WinForm, DeleteForm } from "@/components/forms";
import type { WinRecord } from "@/lib/wins";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function AccomplishmentLibrary({
  wins,
  userId,
}: {
  wins: WinRecord[];
  userId: string;
}) {
  const [search, setSearch] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [columns, setColumns] = useState(5);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [includeDates, setIncludeDates] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("Accomplishments");
  const [copyStatus, setCopyStatus] = useState("");

  const entryDialog = useRef<HTMLDialogElement>(null);
  const reviewDialog = useRef<HTMLDialogElement>(null);
  const preferencesKey = `winlog:library-view:${userId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(preferencesKey);
      if (!stored) return;

      const preferences = JSON.parse(stored);
      setColumns(5);
      if (preferences.view === "grid" || preferences.view === "list") {
        setView(preferences.view);
      }
    } catch {}
  }, [preferencesKey]);

  function savePreferences(nextColumns: number, nextView: "grid" | "list") {
    setColumns(nextColumns);
    setView(nextView);

    try {
      localStorage.setItem(
        preferencesKey,
        JSON.stringify({ columns: nextColumns, view: nextView }),
      );
    } catch {}
  }

  useEffect(() => {
    const existingIds = new Set(wins.map((win) => win.id));
    setSelected((current) => current.filter((id) => existingIds.has(id)));

    if (activeId && !existingIds.has(activeId)) {
      entryDialog.current?.close();
      setActiveId(null);
    }
  }, [wins, activeId]);

  const invalidRange = Boolean(start && end && start > end);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return wins.filter((win) => {
      const matchesSearch =
        !query ||
        `${win.original_text} ${win.polished_text ?? ""}`
          .toLowerCase()
          .includes(query);

      return (
        matchesSearch &&
        (!start || win.event_date >= start) &&
        (!end || win.event_date <= end)
      );
    });
  }, [wins, search, start, end]);

  const activeWin = wins.find((win) => win.id === activeId);
  const selectedWins = wins.filter((win) => selected.includes(win.id));

  const documentText = [
    documentTitle.trim(),
    ...selectedWins.map((win) =>
      [includeDates ? formatDate(win.event_date) : "", win.original_text]
        .filter(Boolean)
        .join("\n"),
    ),
  ]
    .filter(Boolean)
    .join("\n\n");

  function toggleSelection(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setCopyStatus("");
  }

  function openEntry(id: string) {
    setActiveId(id);
    setEditing(false);
    entryDialog.current?.showModal();
  }

  function clearFilters() {
    setSearch("");
    setStart("");
    setEnd("");
  }

  function cancelSelection() {
    setSelecting(false);
    setSelected([]);
    setCopyStatus("");
  }

  async function copyDocument() {
    try {
      await navigator.clipboard.writeText(documentText);
      setCopyStatus("Copied. Ready to paste into an email or document.");
    } catch {
      setCopyStatus(
        "Automatic copying was unavailable. Select and copy the preview text.",
      );
    }
  }

  return (
    <div className="ac-library">
      <header className="ac-page-heading">
        <div>
          <span className="eyebrow">YOUR PROGRESS, IN ONE PLACE</span>
          <h1>Your accomplishments</h1>
          <p className="muted">
            A record of what you’ve done, ready when you need it.
          </p>
        </div>

        <div className="ac-heading-actions">
          <button
            type="button"
            className="ac-secondary"
            onClick={() => {
              if (selecting) cancelSelection();
              else setSelecting(true);
            }}
            disabled={!wins.length}
          >
            {selecting ? "Cancel selection" : "Prepare to share"}
          </button>
          <AddWinButton label="Add accomplishment" />
        </div>
      </header>

      <section className="ac-toolbar" aria-label="Search and filters">
        <label className="ac-search">
          <span className="sr-only">Search accomplishments</span>
          <input
            type="search"
            placeholder="Search accomplishments…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <details className="ac-filter-menu">
          <summary>Dates{start || end ? " · Active" : ""}</summary>
          <div className="ac-filter-panel">
            <label>
              From
              <input
                type="date"
                value={start}
                onChange={(event) => setStart(event.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
              />
            </label>
            {invalidRange && (
              <p className="error" role="alert">
                Choose an end date on or after the start date.
              </p>
            )}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setStart("");
                setEnd("");
              }}
            >
              Clear dates
            </button>
          </div>
        </details>

        <label className="ac-view-control">
          <span className="sr-only">Display layout</span>
          <select
            value={view}
            onChange={(event) => {
              savePreferences(5, event.target.value as "grid" | "list");
            }}
          >
            <option value="grid">Tiles</option>
            <option value="list">List</option>
          </select>
        </label>
      </section>

      <div className="ac-results-line">
        <span role="status">
          {filtered.length}{" "}
          {filtered.length === 1 ? "accomplishment" : "accomplishments"}
          {search || start || end ? ` of ${wins.length}` : ""}
        </span>
        {selecting && <span>Select the entries you want to include.</span>}
      </div>

      {!wins.length ? (
        <section className="ac-empty">
          <h2>Start with something you’re glad you got done.</h2>
          <p>
            A problem solved, something learned, or someone helped. A quick note
            is enough.
          </p>
          <AddWinButton label="Add your first accomplishment" />
        </section>
      ) : !filtered.length ? (
        <section className="ac-empty">
          <h2>No accomplishments match these filters.</h2>
          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </section>
      ) : (
        <div
          className={`ac-entries ${view === "list" ? "is-list" : ""}`}
          style={{ "--ac-columns": columns } as CSSProperties}
        >
          {filtered.map((win) => {
            const checked = selected.includes(win.id);

            return (
              <article
                key={win.id}
                className={`ac-card ${checked && selecting ? "is-selected" : ""}`}
              >
                {selecting && (
                  <label className="ac-card-checkbox">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelection(win.id)}
                      aria-label={`Select accomplishment from ${formatDate(win.event_date)}: ${win.original_text.slice(0, 80)}`}
                    />
                    <span className="sr-only">Include in shared document</span>
                  </label>
                )}

                <button
                  type="button"
                  className="ac-card-open"
                  onClick={() => openEntry(win.id)}
                  aria-label={`Open accomplishment: ${win.original_text.slice(0, 100)}`}
                >
                  <span className="ac-card-excerpt">{win.original_text}</span>
                  <time dateTime={win.event_date}>
                    {formatDate(win.event_date)}
                  </time>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {selecting && (
        <div className="ac-selection-bar">
          <span>{selectedWins.length} selected</span>
          <button
            type="button"
            className="text-button"
            onClick={() =>
              setSelected((current) => [
                ...new Set([...current, ...filtered.map((win) => win.id)]),
              ])
            }
            disabled={!filtered.length}
          >
            Select visible
          </button>
          <button
            type="button"
            disabled={!selectedWins.length}
            onClick={() => {
              setCopyStatus("");
              reviewDialog.current?.showModal();
            }}
          >
            Review selection
          </button>
        </div>
      )}

      <dialog
        ref={entryDialog}
        className="ac-dialog"
        onClose={() => setEditing(false)}
      >
        <div className="ac-dialog-heading">
          <h2>{editing ? "Edit accomplishment" : "Your accomplishment"}</h2>
          <button
            type="button"
            className="text-button"
            onClick={() => entryDialog.current?.close()}
            aria-label="Close accomplishment"
          >
            Close ✕
          </button>
        </div>

        {activeWin && (
          <div className="ac-dialog-body">
            {editing ? (
              <WinForm key={activeWin.id} win={activeWin} />
            ) : (
              <>
                <time className="muted" dateTime={activeWin.event_date}>
                  {formatDate(activeWin.event_date)}
                </time>
                <p className="ac-full-note">{activeWin.original_text}</p>
                {activeWin.polished_text && (
                  <section className="ac-existing-polish">
                    <h3>Previously polished wording</h3>
                    <p className="ac-full-note">{activeWin.polished_text}</p>
                  </section>
                )}
              </>
            )}

            <div className="ac-entry-actions">
              <button
                type="button"
                className="ac-secondary"
                onClick={() => setEditing((current) => !current)}
              >
                {editing ? "View accomplishment" : "Edit"}
              </button>
              <DeleteForm id={activeWin.id} />
            </div>
          </div>
        )}
      </dialog>

      <dialog ref={reviewDialog} className="ac-dialog ac-review-dialog">
        <div className="ac-dialog-heading">
          <h2>Review before sharing</h2>
          <button
            type="button"
            className="text-button"
            onClick={() => reviewDialog.current?.close()}
            aria-label="Close sharing preview"
          >
            Close ✕
          </button>
        </div>

        <div className="ac-dialog-body">
          <p className="muted">
            Review your selected notes before copying them. Nothing is published
            or sent automatically.
          </p>

          <label className="ac-document-title">
            Document title
            <input
              value={documentTitle}
              onChange={(event) => {
                setDocumentTitle(event.target.value);
                setCopyStatus("");
              }}
              maxLength={120}
            />
          </label>

          <label className="ac-inline-checkbox">
            <input
              type="checkbox"
              checked={includeDates}
              onChange={(event) => {
                setIncludeDates(event.target.checked);
                setCopyStatus("");
              }}
            />
            Include dates
          </label>

          <article className="ac-document-preview">
            <h2>{documentTitle.trim() || "Accomplishments"}</h2>
            {selectedWins.map((win) => (
              <section key={win.id}>
                {includeDates && (
                  <time dateTime={win.event_date}>
                    {formatDate(win.event_date)}
                  </time>
                )}
                <p>{win.original_text}</p>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => toggleSelection(win.id)}
                >
                  Remove from selection
                </button>
              </section>
            ))}
          </article>

          <button
            type="button"
            disabled={!selectedWins.length}
            onClick={copyDocument}
          >
            Copy document
          </button>
          <p className="muted" role="status">
            {copyStatus}
          </p>
        </div>
      </dialog>
    </div>
  );
}
