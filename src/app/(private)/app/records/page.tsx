import Link from "next/link";
import { getWins } from "@/lib/wins";
import { WinsTimeline } from "@/components/wins-timeline";
export default async function RecordsPage() {
  const wins = await getWins();
  return (
    <div className="records-page">
      <div className="heading">
        <span className="eyebrow">YOUR CAREER RECORD</span>
        <h1>Look at what you’ve done.</h1>
        <p className="muted">A record of your contributions, one moment at a time.</p>
        <Link href="/app">Add a win →</Link>
      </div>
      <section className="card" aria-label="Your accomplishment record">
        <WinsTimeline wins={wins} />
      </section>
    </div>
  );
}
