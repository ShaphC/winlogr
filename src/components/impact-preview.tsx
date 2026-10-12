"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WinRecord } from "@/lib/wins";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

/* Reuse this document component for the recipient page when sharing is added. */
export function ImpactDocument({
  title,
  wins,
  includeDates,
}: {
  title: string;
  wins: WinRecord[];
  includeDates: boolean;
}) {
  return (
    <article className="ac-impact-document">
      <h2>{title.trim() || "Accomplishments"}</h2>
      {wins.map((win) => (
        <section key={win.id}>
          {includeDates && (
            <time dateTime={win.event_date}>{formatDate(win.event_date)}</time>
          )}
          <p>{win.original_text}</p>
        </section>
      ))}
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
  const [title, setTitle] = useState("Accomplishments");
  const [includeDates, setIncludeDates] = useState(false);
  const [status, setStatus] = useState("");
  const reader = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`winlog:impact-selection:${userId}`);
      const parsed = stored ? JSON.parse(stored) : [];
      setIds(
        Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string")
          : [],
      );
    } catch {
      setIds([]);
    }
    setReady(true);
  }, [userId]);

  const selected = wins.filter((win) => ids.includes(win.id));

  async function copyDocument() {
    const text = [
      title.trim() || "Accomplishments",
      ...selected.map((win) =>
        [includeDates ? formatDate(win.event_date) : "", win.original_text]
          .filter(Boolean)
          .join("\n"),
      ),
    ].join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setStatus("Document copied.");
    } catch {
      setStatus("Open the full document to select and copy the text.");
    }
  }

  if (!ready) {
    return <p role="status">Loading your preview…</p>;
  }

  if (!selected.length) {
    return (
      <section className="ac-empty">
        <h1>Your Impact</h1>
        <p>Choose accomplishments from your library to prepare a document.</p>
        <Link className="button" href="/app">
          Choose accomplishments
        </Link>
      </section>
    );
  }

  const document = (
    <ImpactDocument title={title} wins={selected} includeDates={includeDates} />
  );

  return (
    <div className="ac-impact-layout">
      <div className="ac-impact-stage">
        <div className="ac-impact-preview">{document}</div>
        <button
          type="button"
          className="ac-impact-expand"
          onClick={() => reader.current?.showModal()}
        >
          Open full document
        </button>
      </div>

      <section className="ac-impact-controls">
        <span className="eyebrow">REVIEW BEFORE SHARING</span>
        <h1>Your Impact</h1>
        <p className="muted">
          Your selected accomplishments, presented as a document.
        </p>

        <label className="ac-document-title">
          Document title
          <input
            value={title}
            maxLength={120}
            onChange={(event) => {
              setTitle(event.target.value);
              setStatus("");
            }}
          />
        </label>

        <label className="ac-inline-checkbox">
          <input
            type="checkbox"
            checked={includeDates}
            onChange={(event) => {
              setIncludeDates(event.target.checked);
              setStatus("");
            }}
          />
          Include dates
        </label>

        <div className="ac-impact-actions">
          <button type="button" onClick={copyDocument}>
            Copy document
          </button>
          <Link href="/app">Change selection</Link>
        </div>

        <p className="muted" role="status">
          {status}
        </p>
        <p className="muted">Nothing is published or sent automatically.</p>
      </section>

      <dialog ref={reader} className="ac-dialog ac-review-dialog">
        <div className="ac-dialog-heading">
          <h2>Document preview</h2>
          <button
            type="button"
            className="text-button"
            onClick={() => reader.current?.close()}
          >
            Close ✕
          </button>
        </div>
        <div className="ac-dialog-body">{document}</div>
      </dialog>
    </div>
  );
}
