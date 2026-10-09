import "./landing.css";
import Link from "next/link";
import { ThemeSelect } from "@/components/theme";
const examples = [
  {
    label: "Fixed",
    text: "Resolved a recurring login issue caused by refresh tokens not updating.",
  },
  {
    label: "Helped",
    text: "Walked a teammate through their first production deployment.",
  },
  {
    label: "Improved",
    text: "Simplified the steps for preparing the weekly customer report.",
  },
];
export default function Home() {
  return (
    <div className="wl-home">
      <header className="nav wl-nav">
        <Link href="/" className="brand" aria-label="WinLog home">
          WinLog<span>●</span>
        </Link>
        <nav className="row" aria-label="Main navigation">
          <a className="wl-how-link" href="#how-it-works">
            How it works
          </a>
          <ThemeSelect />
          <Link href="/login">Log in</Link>
          <Link className="button" href="/signup">
            Get started
          </Link>
        </nav>
      </header>
      <main id="main-content">
        <section className="wl-hero wl-container">
          <div className="wl-hero-copy">
            <span className="eyebrow">YOUR WORK IS WORTH REMEMBERING</span>
            <h1>
              You did more
              <br />
              than you <em>remember.</em>
            </h1>
            <p className="lead">
              The bug you fixed. The teammate you helped. The process you made
              better. Keep your work wins in one private place, while they’re
              still fresh.
            </p>
            <div className="row wl-hero-actions">
              <Link className="button" href="/signup">
                Start your WinLog <span aria-hidden="true">↗</span>
              </Link>
              <a href="#how-it-works">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="muted">
              No credit card required. Just something worth remembering.
            </p>
          </div>
          <div
            className="wl-preview"
            aria-label="Illustrative WinLog career record"
          >
            <div className="wl-preview-top">
              <span className="brand">
                WinLog<span>●</span>
              </span>
              <span className="wl-chip">Example record</span>
            </div>
            <div className="wl-preview-body">
              <span className="eyebrow">A FEW MOMENTS FROM YOUR WEEK</span>
              <h2>Small wins add up.</h2>
              {examples.map((item, index) => (
                <div className="wl-example" key={item.label}>
                  <span className="wl-example-dot" aria-hidden="true" />
                  <div>
                    <span className="wl-example-meta">
                      {["MONDAY", "WEDNESDAY", "FRIDAY"][index]} · {item.label}
                    </span>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
              <div className="wl-preview-note">
                <span aria-hidden="true">✓</span> A record you can come back to.
              </div>
            </div>
          </div>
        </section>
        <section className="wl-strip">
          <div className="wl-container">
            For the work that gets done <span>— and then gets forgotten.</span>
          </div>
        </section>
        <section id="how-it-works" className="wl-container wl-section">
          <div className="wl-section-heading">
            <span className="eyebrow">A SIMPLE HABIT, A USEFUL RECORD</span>
            <h2>
              Write what happened.
              <br />
              That’s a good enough start.
            </h2>
            <p className="lead">
              You don’t need a polished success story to save a win.
            </p>
          </div>
          <div className="wl-steps">
            <article>
              <span className="wl-step-number">01 / CAPTURE</span>
              <h3>Get it out of your head.</h3>
              <p>
                Write a quick note about what you fixed, finished, learned, or
                helped with. Save it in seconds.
              </p>
              <div className="wl-note">
                “Finally figured out why the reports were slow.”
              </div>
            </article>
            <article>
              <span className="wl-step-number">02 / REFLECT</span>
              <h3>Catch the moments you missed.</h3>
              <p>
                Take a few minutes to look back on your week. Simple prompts
                help you remember the work between the big milestones.
              </p>
              <div className="wl-note">
                What did you finish?
                <br />
                Who did you help?
                <br />
                What did you learn?
              </div>
            </article>
            <article>
              <span className="wl-step-number">03 / REMEMBER</span>
              <h3>Keep the evidence close.</h3>
              <p>
                Come back to your dated record when it’s time to explain your
                contribution, update your resume, or prepare for a review.
              </p>
              <div className="wl-note">
                Less reconstructing your year.
                <br />
                More remembering what mattered.
              </div>
            </article>
          </div>
        </section>
        <section className="wl-purpose">
          <div className="wl-container wl-purpose-grid">
            <div>
              <span className="eyebrow">FOR YOUR NEXT CAREER CONVERSATION</span>
              <h2>
                Performance reviews
                <br />
                shouldn’t be a memory test.
              </h2>
            </div>
            <div>
              <p className="lead">
                Six months from now, the details will be harder to find. Start
                keeping them today.
              </p>
              <ul className="wl-use-list">
                <li>
                  <strong>Performance reviews</strong>
                  <span>Remember your contributions across the year.</span>
                </li>
                <li>
                  <strong>Resume updates</strong>
                  <span>Find concrete examples of the work you’ve done.</span>
                </li>
                <li>
                  <strong>Promotion conversations</strong>
                  <span>
                    Bring a record of responsibility, initiative, and growth.
                  </span>
                </li>
                <li>
                  <strong>Interview preparation</strong>
                  <span>Revisit real situations you can talk about.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="wl-container wl-section wl-privacy">
          <span className="wl-privacy-icon" aria-hidden="true">
            ↳
          </span>
          <div>
            <span className="eyebrow">PRIVATE BY DEFAULT</span>
            <h2>Your record. Your account.</h2>
            <p>
              Saved wins are private to your account. WinLog doesn’t connect to
              your employer’s GitHub, Jira, Slack, or email. You choose what to
              write down.
            </p>
          </div>
        </section>
        <section className="wl-container wl-faq">
          <h2>A few things you might be wondering.</h2>
          <details>
            <summary>What counts as a win?</summary>
            <p>
              A difficult fix, a finished task, helping someone, positive
              feedback, learning something useful, or making a process easier.
              Everyday contributions count too.
            </p>
          </details>
          <details>
            <summary>Do I have to log something every day?</summary>
            <p>
              No. Capture a moment when it happens, or use the weekly reflection
              page to catch up. Missing a week doesn’t erase your progress.
            </p>
          </details>
          <details>
            <summary>Does WinLog generate career documents with AI?</summary>
            <p>
              Yes. You can generate a private accomplishment profile with a
              professional summary, key outcomes, and links to your source wins.
              Generation is optional and limited during beta. Selected wins are
              sent to OpenAI. Automated reminder emails are not active yet.
            </p>
          </details>
        </section>
        <section className="wl-container wl-final">
          <span className="eyebrow">YOUR CAREER HAS RECEIPTS</span>
          <h2>
            Start with one thing
            <br />
            you did this week.
          </h2>
          <Link className="button" href="/signup">
            Save your first win <span aria-hidden="true">↗</span>
          </Link>
          <p className="muted">
            It doesn’t have to sound impressive. It just has to be yours.
          </p>
        </section>
      </main>
      <footer className="wl-container wl-footer">
        <Link className="brand" href="/">
          WinLog<span>●</span>
        </Link>
        <span className="muted">
          A little note today. Evidence for tomorrow.
        </span>
        <Link href="/login">Log in</Link>
      </footer>
    </div>
  );
}
