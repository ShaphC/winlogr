import { WinForm, DeleteForm } from "@/components/forms";
import { formatWinDate } from "@/lib/win-date";
import type { WinRecord } from "@/lib/wins";
export function WinsTimeline({ wins }: { wins: WinRecord[] }) {
  if (!wins.length) return (
    <div className="timeline-empty">
      <h3>Your first win belongs here.</h3>
      <p className="muted">Think of something you fixed, finished, learned, or helped with.</p>
    </div>
  );
  return (
    <>
      <ol className="wins-timeline" aria-label="Accomplishments, newest first">
        {wins.map(win => (
          <li className="timeline-item" key={win.id}>
            <span className="timeline-dot" aria-hidden="true" />
            <article className="timeline-record">
              <time dateTime={win.event_date}>{formatWinDate(win.event_date)}</time>
              <p className="timeline-text">{win.polished_text || win.original_text}</p>
              <div className="timeline-actions">
                <details>
                  <summary>Edit</summary>
                  <WinForm win={win} />
                </details>
                <DeleteForm id={win.id} />
              </div>
            </article>
          </li>
        ))}
      </ol>
      {wins.length === 500 && (
        <p className="muted">Showing your most recent 500 wins.</p>
      )}
    </>
  );
}
