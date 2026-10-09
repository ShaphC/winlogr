import { WinForm, DeleteForm } from "@/components/forms";
import { formatWinDate } from "@/lib/win-date";
import type { WinRecord } from "@/lib/wins";
export function WinsTimeline({ wins }: { wins: WinRecord[] }) {
  if (!wins.length) {
    return (
      <div className="timeline-empty">
        <h3>Your first win belongs here.</h3>
        <p className="muted">
          Think of something you fixed, finished, learned, or helped with.
        </p>
      </div>
    );
  }
  const groups = new Map<string, WinRecord[]>();
  for (const win of wins) {
    groups.set(win.event_date, [...(groups.get(win.event_date) ?? []), win]);
  }
  return (
    <>
      <ol
        className="wins-timeline"
        aria-label="Accomplishments by date, newest first"
      >
        {[...groups].map(([date, entries]) => (
          <li className="timeline-item" key={date}>
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-record">
              <h2 className="timeline-date">
                <time dateTime={date}>{formatWinDate(date)}</time>
              </h2>
              {entries.map((win) => (
                <article className="dated-win" key={win.id}>
                  <p className="timeline-text">
                    {win.polished_text || win.original_text}
                  </p>
                  <div className="timeline-actions">
                    <details>
                      <summary>Edit</summary>
                      <WinForm win={win} />
                    </details>
                    <DeleteForm id={win.id} />
                  </div>
                </article>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {wins.length === 500 && (
        <p className="muted">Showing your most recent 500 wins.</p>
      )}
    </>
  );
}
