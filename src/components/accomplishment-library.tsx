"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("");
  const [previewError, setPreviewError] = useState("");

  const entryDialog = useRef<HTMLDialogElement>(null);
  const datesMenu = useRef<HTMLDetailsElement>(null);
  const preferencesKey = `winlog:library-view:${userId}`;

  useEffect(() => {
    setCurrentMonth(
      new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );

    try {
      const stored = localStorage.getItem(preferencesKey);
      if (!stored) return;

      const preferences = JSON.parse(stored);
      if (preferences.view === "grid" || preferences.view === "list") {
        setView(preferences.view);
      }
    } catch {}
  }, [preferencesKey]);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const menu = datesMenu.current;

      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      ) {
        menu.open = false;
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && datesMenu.current?.open) {
        datesMenu.current.open = false;
        datesMenu.current.querySelector("summary")?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const existingIds = new Set(wins.map((win) => win.id));
    setSelected((current) => current.filter((id) => existingIds.has(id)));

    if (activeId && !existingIds.has(activeId)) {
      entryDialog.current?.close();
      setActiveId(null);
    }
  }, [wins, activeId]);

  function saveView(nextView: "grid" | "list") {
    setView(nextView);

    try {
      localStorage.setItem(preferencesKey, JSON.stringify({ view: nextView }));
    } catch {}
  }

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

  const periodLabel =
    start && end
      ? `${formatDate(start)} – ${formatDate(end)}`
      : start
        ? `From ${formatDate(start)}`
        : end
          ? `Through ${formatDate(end)}`
          : currentMonth;

  const activeWin = wins.find((win) => win.id === activeId);
  const selectedWins = wins.filter((win) => selected.includes(win.id));

  function toggleSelection(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setPreviewError("");
  }

  function openImpactPreview() {
    if (!selectedWins.length) return;

    try {
      localStorage.setItem(
        `winlog:impact-selection:${userId}`,
        JSON.stringify(selectedWins.map((win) => win.id)),
      );
    } catch {
      setPreviewError(
        "Your browser couldn’t save the selection. Allow site storage and try again.",
      );
      return;
    }

    setPreviewError("");
    router.push("/app/impact");
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
    setPreviewError("");
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
          <AddWinButton label="Add" />
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
        </div>
      </header>

      <section className="ac-toolbar" aria-label="Search and filters">
        <label className="ac-search">
          <span className="sr-only">Search accomplishments</span>
          <svg
            className="ac-search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            type="search"
            placeholder="Search accomplishments…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <details ref={datesMenu} className="ac-filter-menu">
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

            <div className="ac-date-actions">
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
              <button
                type="button"
                disabled={invalidRange}
                onClick={() => {
                  if (datesMenu.current) {
                    datesMenu.current.open = false;
                    datesMenu.current.querySelector("summary")?.focus();
                  }
                }}
              >
                Done
              </button>
            </div>
          </div>
        </details>

        <label className="ac-view-control">
          <span className="sr-only">Display layout</span>
          <select
            value={view}
            onChange={(event) =>
              saveView(event.target.value as "grid" | "list")
            }
          >
            <option value="grid">Tiles</option>
            <option value="list">List</option>
          </select>
        </label>
      </section>

      <div className="ac-results-line">
        <div className="ac-period-info">
          <span className="ac-period-label">{periodLabel}</span>
          <span role="status">
            {filtered.length}{" "}
            {filtered.length === 1 ? "accomplishment" : "accomplishments"}
            {search || start || end ? ` of ${wins.length}` : " · All dates"}
          </span>
        </div>
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
        <div className={`ac-entries ${view === "list" ? "is-list" : ""}`}>
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
            onClick={() => {
              setSelected((current) => [
                ...new Set([...current, ...filtered.map((win) => win.id)]),
              ]);
              setPreviewError("");
            }}
            disabled={!filtered.length}
          >
            Select visible
          </button>
          <button
            type="button"
            disabled={!selectedWins.length}
            onClick={openImpactPreview}
          >
            Preview Impact
          </button>
          {previewError && (
            <span className="error" role="alert">
              {previewError}
            </span>
          )}
        </div>
      )}

      <dialog
        ref={entryDialog}
        className="ac-dialog"
        aria-labelledby="ac-entry-heading"
        onClose={() => setEditing(false)}
      >
        <div className="ac-dialog-heading">
          <h2 id="ac-entry-heading">
            {editing ? "Edit accomplishment" : "Your accomplishment"}
          </h2>
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
    </div>
  );
}
