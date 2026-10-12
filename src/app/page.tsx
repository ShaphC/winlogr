import "./landing.css";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme";
import { MarketingPreview } from "@/components/marketing-preview";
import { createClient } from "@/lib/supabase";
import { signout } from "@/app/actions";

const examples = [
  {
    date: "OCTOBER 8",
    text: "Resolved a login issue and added a regression test.",
  },
  {
    date: "OCTOBER 7",
    text: "Restored a client’s internet access and verified connectivity.",
  },
  {
    date: "OCTOBER 6",
    text: "Helped a teammate troubleshoot their first deployment.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const destination = user ? "/app" : "/signup";

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

          <ThemeToggle />

          {user ? (
            <>
              <Link className="button" href="/app">
                Continue
              </Link>
              <form action={signout} className="wl-nav-logout">
                <button type="submit" className="ac-signout-button">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link className="button" href="/signup">
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main id="main-content">
        <section className="wl-hero wl-container">
          <div className="wl-hero-copy">
            <span className="eyebrow">
              YOUR ACCOMPLISHMENTS. READY WHEN YOU NEED THEM.
            </span>
            <h1>
              Remember it.
              <br />
              <em>Show what you did.</em>
            </h1>
            <p className="lead">
              Save the problems you solved, things you learned, and people you
              helped. Find your examples when it’s time for a one-on-one,
              performance review, or your next opportunity.
            </p>

            <div className="row wl-hero-actions">
              <Link className="button" href={destination}>
                {user
                  ? "Open your accomplishments"
                  : "Save your first accomplishment"}{" "}
                <span aria-hidden="true">↗</span>
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
            A quick note today.
            <span> An example you won’t have to reconstruct later.</span>
          </div>
        </section>

        <section id="how-it-works" className="wl-container wl-section">
          <div className="wl-section-heading">
            <span className="eyebrow">SAVE · FIND · PREPARE</span>
            <h2>
              Keep the accomplishments.
              <br />
              Choose the highlights.
            </h2>
            <p className="lead">
              Start with your own words. Decide what to show when you need it.
            </p>
          </div>

          <div className="wl-steps">
            <article>
              <span className="wl-step-number">01 / SAVE</span>
              <h3>A quick note is enough.</h3>
              <p>
                Record something you finished, figured out, learned, or helped
                someone with. You don’t need a polished story to remember what
                happened.
              </p>
              <div className="wl-note">
                “Fixed the account issue and confirmed the client could sign in
                again.”
              </div>
            </article>

            <article>
              <span className="wl-step-number">02 / FIND</span>
              <h3>Come back to your examples.</h3>
              <p>
                Browse your collection in Tiles or List view. Search your notes,
                filter by date, and open an entry to read or edit the full
                details.
              </p>
              <div className="wl-note">
                The fix you made.
                <br />
                The support you gave.
                <br />
                The progress you forgot.
              </div>
            </article>

            <article>
              <span className="wl-step-number">03 / PREPARE</span>
              <h3>Choose what you want to show.</h3>
              <p>
                Select accomplishments and preview them as a Highlights
                document. Add a title, choose whether to include dates, and copy
                the text when you’re ready.
              </p>
              <div className="wl-note">
                Your examples.
                <br />
                Your selection.
                <br />
                Reviewed before you use them.
              </div>
            </article>
          </div>
        </section>

        <section className="wl-purpose">
          <div className="wl-container wl-purpose-grid">
            <div>
              <span className="eyebrow">MAKE YOUR CONTRIBUTIONS VISIBLE</span>
              <h2>
                Have the examples.
                <br />
                Explain your contribution.
              </h2>
            </div>

            <div>
              <p className="lead">
                Help your manager understand what you’ve accomplished. Give
                yourself useful material for a review, a job search, or a
                conversation about what comes next.
              </p>

              <ul className="wl-use-list">
                <li>
                  <strong>Prepare for a one-on-one</strong>
                  <span>
                    Bring selected examples of recent progress into the
                    conversation.
                  </span>
                </li>
                <li>
                  <strong>Support a review or promotion discussion</strong>
                  <span>
                    Recall your contributions and the details that explain why
                    they mattered.
                  </span>
                </li>
                <li>
                  <strong>Find material for a resume or interview</strong>
                  <span>
                    Revisit real situations and choose examples relevant to your
                    next opportunity.
                  </span>
                </li>
                <li>
                  <strong>Recognize your own progress</strong>
                  <span>
                    Keep learning, personal projects, and everyday
                    accomplishments in view.
                  </span>
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
              Your saved accomplishments are private to your account. You choose
              which entries to include in Highlights. Nothing is published or
              sent automatically—you review the document and decide where to use
              the copied text.
            </p>
          </div>
        </section>

        <section id="pricing" className="wl-container wl-section wl-pricing">
          <div className="wl-section-heading">
            <span className="eyebrow">START WITH ONE ACCOMPLISHMENT</span>
            <h2>Build a record worth keeping.</h2>
            <p className="lead">
              Try the current experience free during beta. Future paid plans are
              still being defined.
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
                Capture your accomplishments and prepare a selection for your
                next conversation.
              </p>

              <ul className="wl-price-features">
                <li>Quick accomplishment capture</li>
                <li>Tiles and List views</li>
                <li>Search and date filters</li>
                <li>Read and edit your saved entries</li>
                <li>Selected-accomplishment Highlights preview</li>
                <li>Optional document name, role, and dates</li>
                <li>Copy your Highlights text</li>
                <li>Light, dark, and system appearance</li>
              </ul>

              <Link className="button" href={destination}>
                {user ? "Continue to the app" : "Get started free"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              <p className="wl-price-note">
                No credit card required. Highlights selections and document
                preferences are currently remembered on this device.
              </p>
            </article>

            <article className="wl-price-card wl-price-pro">
              <div className="wl-price-heading">
                <h3>WinLog Pro</h3>
                <span className="wl-chip">In development</span>
              </div>

              <p className="wl-price wl-price-pending">
                Pro<span>Pricing to be announced</span>
              </p>
              <p className="wl-price-description">
                We’re exploring additional ways to prepare and use your
                accomplishments.
              </p>

              <ul className="wl-price-features">
                <li>Paid features are being evaluated</li>
                <li>Pricing and limits are not finalized</li>
                <li>Details will be published before purchase is available</li>
              </ul>

              <div className="wl-price-availability">
                Not available to purchase yet
              </div>
              <p className="wl-price-note">
                The current beta does not offer paid subscriptions.
              </p>
            </article>
          </div>
        </section>

        <section className="wl-container wl-faq">
          <div className="wl-section-heading">
            <h2>Commonly asked questions</h2>
            <p className="lead">A few things you might be wondering.</p>
          </div>

          <details>
            <summary>What counts as an accomplishment?</summary>
            <p>
              Something you finished, figured out, improved, learned, or helped
              someone with. It can be a small contribution, a project milestone,
              or positive feedback you want to remember.
            </p>
          </details>

          <details>
            <summary>Is this only for developers and IT professionals?</summary>
            <p>
              No. You can record accomplishments from other professions,
              studying, volunteering, or personal projects. Choose the examples
              that matter to you.
            </p>
          </details>

          <details>
            <summary>Do I need to record something every day?</summary>
            <p>
              No. Save an accomplishment when you want to remember it. You can
              also add earlier accomplishments using their dates.
            </p>
          </details>

          <details>
            <summary>What are Highlights?</summary>
            <p>
              Highlights is a document preview containing accomplishments you
              select from your collection. You can add a title, optionally
              include your name, role, and dates, then copy the text for use
              elsewhere.
            </p>
          </details>

          <details>
            <summary>Can I send someone a public sharing link?</summary>
            <p>
              Not yet. The current version lets you preview and copy your
              Highlights into an email or another document. Nothing is published
              or sent automatically.
            </p>
          </details>

          <details>
            <summary>
              Does it write or rewrite my accomplishments with AI?
            </summary>
            <p>
              The current Highlights experience uses your saved wording. AI
              summary generation is hidden, and professional rewriting is not
              available in this experience yet.
            </p>
          </details>

          <details>
            <summary>Will my Highlights selection sync across devices?</summary>
            <p>
              Saved accomplishments belong to your account. The current
              Highlights selection and document settings are stored in your
              browser, so you’ll need to select them again on another device.
            </p>
          </details>
        </section>

        <section className="wl-container wl-final">
          <span className="eyebrow">GIVE YOUR FUTURE SELF AN EXAMPLE</span>
          <h2>
            What’s one thing
            <br />
            worth remembering?
          </h2>
          <Link className="button" href={destination}>
            {user ? "Add an accomplishment" : "Save your first accomplishment"}{" "}
            <span aria-hidden="true">↗</span>
          </Link>
          <p className="muted">
            Start with what happened. Keep the details while they’re fresh.
          </p>
        </section>
      </main>

      <footer className="wl-container wl-footer">
        <Link className="brand" href="/">
          WinLog<span>●</span>
        </Link>
        <span className="muted">
          Remember your accomplishments. Have your examples ready.
        </span>
        <Link href={user ? "/app" : "/login"}>
          {user ? "Continue" : "Log in"}
        </Link>
      </footer>
    </div>
  );
}
