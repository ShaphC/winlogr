import Link from "next/link";
import { getWins } from "@/lib/wins";
import { WinsTimeline } from "@/components/wins-timeline";
import { AddWinButton } from "@/components/add-win-modal";
export default async function RecordsPage() {
  const wins = await getWins();
  return (
    <div className="records-page">
      <div className="impact-page-heading">
        <div>
          <span className="eyebrow">YOUR CAREER RECORD</span>
          <h1>Your timeline.</h1>
          <p className="muted">Real contributions. One day at a time.</p>
        </div>
        <AddWinButton />
      </div>
      <Link href="/app">View Your Impact →</Link>
      <section
        className="card records-card"
        aria-label="Your accomplishment record"
      >
        <WinsTimeline wins={wins} />
      </section>
    </div>
  );
}
