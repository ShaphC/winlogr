import "./landing.css";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme";
import { MarketingPreview } from "@/components/marketing-preview";
import { createClient } from "@/lib/supabase";
import { signout } from "@/app/actions";

const steps = [
  {
    number: "01",
    title: "Save what happened.",
    description:
      "A problem solved. A project finished. Someone helped. Write a quick note in your own words while the details are fresh.",
    example:
      "“Fixed the account issue and checked that the client could sign in again.”",
  },
  {
    number: "02",
    title: "Find the right examples.",
    description:
      "Search your accomplishments or choose a date range. Read the details, edit your notes, and select what matters for your next conversation.",
    example:
      "Your last month. A particular project. The examples you want to bring.",
  },
  {
    number: "03",
    title: "Prepare your Highlights.",
    description:
      "Preview your selection as a document. Choose a title and whether to include dates, then copy the text into an email or document.",
    example: "A selection you’ve reviewed, ready to use in your own words.",
  },
];

const uses = [
  {
    title: "Before a one-on-one",
    description:
      "Bring recent accomplishments into the conversation without starting from memory.",
  },
  {
    title: "When review season arrives",
    description:
      "Find the examples that explain your contribution across the period.",
  },
  {
    title: "For your next opportunity",
    description:
      "Gather material to adapt for a resume, interview, or career change.",
  },
  {
    title: "When you need perspective",
    description:
      "Look back at the problems you solved and the progress you’ve made.",
  },
];

const questions = [
  {
    question: "What counts as an accomplishment?",
    answer:
      "Something you finished, solved, improved, learned, or helped someone with. Small contributions count too. You can also record positive feedback you want to remember.",
  },
  {
    question: "Is this only for developers and IT professionals?",
    answer:
      "No. The examples include technical work, but you can record accomplishments from other professions, studying, volunteering, and personal projects.",
  },
  {
    question: "Do I need to write something every day?",
    answer:
      "No. Add a note when something is worth remembering, or catch up later using the date it happened. Your collection grows at your pace.",
  },
  {
    question: "What will my manager see?",
    answer:
      "Only the text you choose to give them. Highlights lets you preview selected accomplishments and copy the text into an email or another document. Your private collection is not sent automatically.",
  },
  {
    question: "Does it write my review or resume for me?",
    answer:
      "The current version brings your selected notes into a document using your saved wording. You can use those examples to prepare a review or resume. AI rewriting and dedicated document formats are not available in this experience yet.",
  },
  {
    question: "Can I share a link or download a PDF?",
    answer:
      "Not yet. You can preview and copy your Highlights text. Public sharing links and PDF downloads are not currently available.",
  },
  {
    question: "Will my information follow me across devices?",
    answer:
      "Your saved accomplishments belong to your account. Highlights selections and document preferences are currently remembered in your browser, so those need to be chosen again on another device.",
  },
];

function NavigationItems({ signedIn }: { signedIn: boolean }) {
  return (
    <>
      <a href="#how-it-works">How it works</a>
      <a href="#pricing">Pricing</a>
      <ThemeToggle />
      {signedIn ? (
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
    </>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const destination = user ? "/app" : "/signup";
  const primaryLabel = user ? "Open your accomplishments" : "Start your record";

  return (
    <div className="wl-home">
      <header className="nav wl-nav">
        <Link href="/" className="brand" aria-label="WinLog home">
          WinLog<span>●</span>
        </Link>

        <nav className="wl-desktop-nav" aria-label="Main navigation">
          <NavigationItems signedIn={Boolean(user)} />
        </nav>

        <details className="wl-mobile-menu">
          <summary aria-label="Open or close navigation">
            <svg
              className="wl-menu-open-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className="wl-menu-close-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </summary>

          <nav className="wl-mobile-drawer" aria-label="Mobile navigation">
            <span className="eyebrow">EXPLORE WINLOG</span>
            <NavigationItems signedIn={Boolean(user)} />
          </nav>
        </details>
      </header>

      <main id="main-content">
        <section className="wl-hero wl-container">
          <div className="wl-hero-copy">
            <span className="eyebrow">KEEP YOUR EXAMPLES CLOSE</span>
            <h1>
              “What have you
              <br />
              <em>accomplished?”</em>
            </h1>
            <p className="wl-answer">
              Have an answer you don’t have to reconstruct.
            </p>
            <p className="lead">
              Keep a private record of what you solved, finished, learned, and
              helped with. Turn selected examples into Highlights for your next
              one-on-one, review, or opportunity.
            </p>

            <div className="row wl-hero-actions">
              <Link className="button" href={destination}>
                {primaryLabel} <span aria-hidden="true">↗</span>
              </Link>
              <a href="#how-it-works">
                See the process <span aria-hidden="true">↓</span>
              </a>
            </div>

            <p className="wl-beta-note">
              Free during beta · No credit card required
            </p>
          </div>

          <MarketingPreview />
        </section>

        <section className="wl-strip">
          <div className="wl-container">
            The fix. The explanation. The extra effort.
            <span> Keep the contributions that are easy to forget.</span>
          </div>
        </section>

        <section id="how-it-works" className="wl-container wl-section">
          <div className="wl-section-heading">
            <span className="eyebrow">A NOTE NOW. AN EXAMPLE LATER.</span>
            <h2>
              You don’t need to write
              <br />
              your review today.
            </h2>
            <p className="lead">
              Just keep something your future self can use.
            </p>
          </div>

          <div className="wl-steps">
            {steps.map((step) => (
              <article key={step.number}>
                <span className="wl-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="wl-note">{step.example}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="wl-recipient-section">
          <div className="wl-container wl-recipient-grid">
            <div className="wl-recipient-copy">
              <span className="eyebrow">
                HELP SOMEONE SEE YOUR CONTRIBUTION
              </span>
              <h2>
                Give your manager
                <br />
                something specific.
              </h2>
              <p className="lead">
                Choose the examples you want to discuss. A short selection can
                help explain what you accomplished and give the conversation a
                useful starting point.
              </p>
              <p className="muted">
                Your Highlights use your notes. You decide what belongs in the
                document and where to use it.
              </p>
              <a href="#pricing" className="wl-inline-link">
                Start keeping your examples <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="wl-recipient-example">
              <span className="wl-example-caption">
                Illustrative Highlights document
              </span>
              <article className="wl-recipient-paper">
                <header>
                  <span>Alex Morgan</span>
                  <h3>October one-on-one</h3>
                </header>
                <ol>
                  <li>
                    Resolved a refresh-related login issue and added a
                    regression test.
                  </li>
                  <li>
                    Restored a client’s internet access and confirmed websites
                    loaded afterward.
                  </li>
                  <li>
                    Helped a teammate troubleshoot a deployment and documented
                    the environment setup.
                  </li>
                </ol>
              </article>
              <p className="wl-example-caption">
                Selected entries. Optional dates. Reviewed before use.
              </p>
            </div>
          </div>
        </section>

        <section className="wl-container wl-section">
          <div className="wl-section-heading wl-centered-heading">
            <span className="eyebrow">READY FOR THE MOMENTS THAT MATTER</span>
            <h2>A record with somewhere to go.</h2>
          </div>
          <div className="wl-conversation-grid">
            {uses.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wl-container wl-control-section">
          <div>
            <span className="eyebrow">PRIVATE UNTIL YOU CHOOSE OTHERWISE</span>
            <h2>Your collection stays yours.</h2>
            <p>
              Saving an accomplishment doesn’t publish it. Preparing Highlights
              doesn’t send it. You select the entries, review the document, and
              decide where to paste the copied text.
            </p>
          </div>
        </section>

        <section id="pricing" className="wl-container wl-section wl-pricing">
          <div className="wl-section-heading">
            <span className="eyebrow">
              TRY IT WITH YOUR OWN ACCOMPLISHMENTS
            </span>
            <h2>Start free during beta.</h2>
            <p className="lead">
              Keep your examples and see whether Highlights helps you prepare
              for your next conversation.
            </p>
          </div>

          <div className="wl-single-plan">
            <article className="wl-price-card">
              <div className="wl-price-heading">
                <h3>WinLog Beta</h3>
                <span className="wl-chip">Available now</span>
              </div>
              <p className="wl-price">
                Free<span>during beta</span>
              </p>
              <ul className="wl-price-features">
                <li>Save and edit accomplishments</li>
                <li>Browse in Tiles or List view</li>
                <li>Find entries with search and date filters</li>
                <li>Select entries for Highlights</li>
                <li>Preview a document with optional name, role, and dates</li>
                <li>Copy your selected accomplishments</li>
              </ul>
              <Link className="button" href={destination}>
                {user ? "Continue to the app" : "Get started free"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              <p className="wl-price-note">
                No credit card required. Future paid plans have not been
                finalized.
              </p>
            </article>
          </div>
        </section>

        <section className="wl-container wl-faq">
          <div className="wl-section-heading">
            <h2>Commonly asked questions</h2>
            <p className="lead">A few details before you start.</p>
          </div>
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </section>

        <section className="wl-container wl-final">
          <span className="eyebrow">START SMALL</span>
          <h2>
            Save one thing
            <br />
            you’re glad you did.
          </h2>
          <p className="lead">
            You don’t have to make it sound impressive. Just give yourself
            something to remember.
          </p>
          <Link className="button" href={destination}>
            {primaryLabel} <span aria-hidden="true">↗</span>
          </Link>
          <p className="muted">Free during beta. No credit card required.</p>
        </section>
      </main>

      <footer className="wl-container wl-footer">
        <Link className="brand" href="/">
          WinLog<span>●</span>
        </Link>
        <span className="muted">
          Your accomplishments. Your examples. Ready when you need them.
        </span>
        <Link href={user ? "/app" : "/login"}>
          {user ? "Continue" : "Log in"}
        </Link>
      </footer>
    </div>
  );
}
