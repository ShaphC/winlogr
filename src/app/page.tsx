import "./landing.css";
import Link from "next/link";
import { ThemeSelect } from "@/components/theme";
import { MarketingPreview } from "@/components/marketing-preview";

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
          <a href="#pricing">Pricing</a>
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
            <span className="eyebrow">YOUR WORK. WORTH SEEING.</span>
            <h1>
              See what your
              <br />
              work <em>adds up to.</em>
            </h1>
            <p className="lead">
              You solve problems, help people, and get things done. Save those
              moments in WinLog, then turn them into a clear picture of the
              contributions you bring.
            </p>
            <div className="row wl-hero-actions">
              <Link className="button" href="/signup">
                Start with a win <span aria-hidden="true">↗</span>
              </Link>
              <a href="#how-it-works">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="muted">Free during beta. No credit card required.</p>
          </div>
          <MarketingPreview />
        </section>

        <section className="wl-strip">
          <div className="wl-container">
            Small moments of progress.
            <span> A clearer picture of your impact.</span>
          </div>
        </section>

        <section id="how-it-works" className="wl-container wl-section">
          <div className="wl-section-heading">
            <span className="eyebrow">FROM A QUICK NOTE TO YOUR IMPACT</span>
            <h2>
              Capture the work.
              <br />
              See the contribution.
            </h2>
            <p className="lead">
              Start with what happened. You can find the right words later.
            </p>
          </div>

          <div className="wl-steps">
            <article>
              <span className="wl-step-number">01 / CAPTURE</span>
              <h3>A quick note is enough.</h3>
              <p>
                Write what you fixed, finished, learned, or helped with. No
                special format. No need to make it sound impressive.
              </p>
              <div className="wl-note">
                “Helped a client get their internet working again.”
              </div>
            </article>

            <article>
              <span className="wl-step-number">02 / REMEMBER</span>
              <h3>Your progress, in one place.</h3>
              <p>
                Browse your wins in a dated timeline. When you need a little
                help remembering, use the reflection prompts to revisit your
                week.
              </p>
              <div className="wl-note">
                Problems you solved.
                <br />
                People you helped.
                <br />
                Work you moved forward.
              </div>
            </article>

            <article>
              <span className="wl-step-number">03 / SEE YOUR IMPACT</span>
              <h3>Recognize what you bring.</h3>
              <p>
                Generate an accomplishment profile with a professional summary
                and key contributions drawn from your wins. Read it, refine it,
                and keep a saved version.
              </p>
              <div className="wl-note">
                Your experience.
                <br />
                Put into words you can build on.
              </div>
            </article>
          </div>
        </section>

        <section className="wl-purpose">
          <div className="wl-container wl-purpose-grid">
            <div>
              <span className="eyebrow">
                A PROFILE BUILT FROM YOUR OWN WORK
              </span>
              <h2>
                More confidence.
                <br />
                Real examples behind it.
              </h2>
            </div>
            <div>
              <p className="lead">
                When someone asks what you’ve contributed, you don’t have to
                start with a blank page. Your Impact gives you a starting point
                grounded in the work you’ve recorded.
              </p>
              <ul className="wl-use-list">
                <li>
                  <strong>Recognize your progress</strong>
                  <span>
                    See contributions that are easy to overlook in a busy week.
                  </span>
                </li>
                <li>
                  <strong>Prepare for a performance review</strong>
                  <span>Bring specific examples into the conversation.</span>
                </li>
                <li>
                  <strong>Find material for your resume</strong>
                  <span>
                    Use your outcomes as a starting point for stronger bullets.
                  </span>
                </li>
                <li>
                  <strong>Prepare for an interview</strong>
                  <span>Revisit real situations and the part you played.</span>
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
            <span className="eyebrow">YOUR NOTES. YOUR CHOICE.</span>
            <h2>A personal space for your progress.</h2>
            <p>
              Your wins and profiles are private to your account. WinLog doesn’t
              connect to your employer’s GitHub, Jira, Slack, or email. You
              choose what to record and when to generate a profile.
            </p>
          </div>
        </section>

        <section id="pricing" className="wl-container wl-section wl-pricing">
          <div className="wl-section-heading">
            <span className="eyebrow">START WITH WHAT YOU’VE DONE</span>
            <h2>A little space for your wins.</h2>
            <p className="lead">
              Start during beta. Get more room to build your Impact with Pro.
            </p>
          </div>

          <div className="wl-pricing-grid">
            <article className="wl-price-card">
              <div className="wl-price-heading">
                <h3>WinLog Beta</h3>
                <span className="wl-chip">Available now</span>
              </div>
              <p className="wl-price">
                Free<span>during beta</span>
              </p>
              <p className="wl-price-description">
                Start capturing your wins and see what your work adds up to.
              </p>
              <ul className="wl-price-features">
                <li>Quick win capture and dated timeline</li>
                <li>Weekly reflection prompts</li>
                <li>5 AI profile generations during beta</li>
                <li>View the wins supporting your profile</li>
                <li>Edit, copy, and browse saved profiles</li>
                <li>Light, dark, and system themes</li>
              </ul>
              <Link className="button" href="/signup">
                Get started free <span aria-hidden="true">↗</span>
              </Link>
              <p className="wl-price-note">
                No credit card required. The beta generation allowance does not
                reset monthly.
              </p>
            </article>

            <article className="wl-price-card wl-price-pro">
              <div className="wl-price-heading">
                <h3>WinLog Pro</h3>
                <span className="wl-chip">Coming soon</span>
              </div>
              <p className="wl-price wl-price-pending">
                Paid plan<span>Pricing to be announced</span>
              </p>
              <p className="wl-price-description">
                For keeping your Impact up to date as your work grows.
              </p>
              <ul className="wl-price-features">
                <li>Everything included in the beta</li>
                <li>More AI profile generations planned</li>
                <li>Generation allowance to be announced</li>
              </ul>
              <div className="wl-price-availability">
                Pro subscriptions are coming soon
              </div>
              <p className="wl-price-note">
                Pro is not available to purchase yet. Final pricing and plan
                limits will be published before launch.
              </p>
            </article>
          </div>
        </section>

        <section className="wl-container wl-faq">
          <h2>A few things you might be wondering.</h2>

          <details>
            <summary>What counts as a win?</summary>
            <p>
              Something you fixed, finished, learned, improved, or helped
              someone with. It doesn’t need to be a big milestone. Everyday
              contributions belong here too.
            </p>
          </details>

          <details>
            <summary>Do I need to write something every day?</summary>
            <p>
              No. Add a win when it happens, or look back on your week using the
              reflection prompts. Your record grows at your pace.
            </p>
          </details>

          <details>
            <summary>What does Your Impact generate?</summary>
            <p>
              An accomplishment profile with a professional summary and key
              outcomes or contributions based on your selected wins. You can
              open the document, view its supporting notes, edit the wording,
              and copy it.
            </p>
          </details>

          <details>
            <summary>Will it write my resume or performance review?</summary>
            <p>
              The current version creates an accomplishment profile. It gives
              you material to adapt for a resume, review, or interview.
              Dedicated document formats are not available yet.
            </p>
          </details>

          <details>
            <summary>Do I have to use AI?</summary>
            <p>
              No. You can keep your wins and use the timeline without generating
              a profile. If you choose to generate one, the selected wins are
              sent to OpenAI. Review the wording before using it elsewhere.
            </p>
          </details>

          <details>
            <summary>What happens when I use all five generations?</summary>
            <p>
              You can continue recording wins and viewing, editing, and copying
              your saved profiles. Creating another AI profile requires
              additional generation allowance. Paid plans have not launched yet.
            </p>
          </details>
        </section>

        <section className="wl-container wl-final">
          <span className="eyebrow">YOU HAVE SOMETHING TO BUILD ON</span>
          <h2>
            Start with one thing
            <br />
            you got done.
          </h2>
          <Link className="button" href="/signup">
            Save your first win <span aria-hidden="true">↗</span>
          </Link>
          <p className="muted">
            A quick note today. A clearer picture of your work over time.
          </p>
        </section>
      </main>

      <footer className="wl-container wl-footer">
        <Link className="brand" href="/">
          WinLog<span>●</span>
        </Link>
        <span className="muted">Your work. Worth seeing.</span>
        <Link href="/login">Log in</Link>
      </footer>
    </div>
  );
}
