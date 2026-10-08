import Link from "next/link";
import { getWins } from "@/lib/wins";
import { WinForm } from "@/components/forms";
import { WinsTimeline } from "@/components/wins-timeline";
import { WinsWorkspace } from "@/components/wins-workspace";
export default async function Page() {
  const wins = await getWins();
  return (
    <div className="wins-page">
      <div className="heading">
        <span className="eyebrow">MAKE YOUR WORK COUNT</span>
        <h1>
          A little note today.
          <br />
          Evidence for tomorrow.
        </h1>
        <p className="muted">
          Small fixes, big milestones, and everything in between.
        </p>
      </div>
      <WinsWorkspace
        capture={
          <>
            <WinForm />
            <Link className="wins-reflect-link" href="/app/reflect">
              Catch up on your week →
            </Link>
          </>
        }
        records={
          <>
            <div className="timeline-heading">
              <h2 id="wins-list-title">Your wins</h2>
              <Link href="/app/records">View records →</Link>
            </div>
            <WinsTimeline wins={wins} />
          </>
        }
      />
    </div>
  );
}
