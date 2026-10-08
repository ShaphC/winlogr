"use client";
import { useEffect, useState, type ReactNode } from "react";
type Position = "left" | "right" | "below";
const storageKey = "winlog:wins-position";
export function WinsWorkspace({ capture, records }: { capture: ReactNode; records: ReactNode }) {
  const [position, setPosition] = useState<Position>("below");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "left" || saved === "right" || saved === "below") setPosition(saved);
    } catch { /* Layout still works when browser storage is unavailable. */ }
    setReady(true);
  }, []);
  function choose(value: Position) {
    setPosition(value);
    try { localStorage.setItem(storageKey, value); } catch { /* Keep the current selection in memory. */ }
  }
  return (
    <>
      <fieldset className="wins-layout-picker" disabled={!ready}>
        <legend>Show my wins</legend>
        <div className="wins-layout-options">
          {(["left", "right", "below"] as const).map(value => (
            <label key={value}>
              <input type="radio" name="wins-position" value={value}
                checked={position === value} onChange={() => choose(value)} />
              <span>{value[0].toUpperCase() + value.slice(1)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={`wins-workspace wins-position-${position}`}>
        <section className="wins-capture-panel card" aria-label="Add a win">{capture}</section>
        <section className="wins-records-panel card" aria-labelledby="wins-list-title">{records}</section>
      </div>
    </>
  );
}
