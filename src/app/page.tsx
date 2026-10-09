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
            <span className="eyebrow">SEE WHAT YOU’RE CAPABLE OF</span>
            <h1>
              You’ve done more
              <br />
              than you <em>give yourself credit for.</em>
            </h1>
            <p className="lead">
              The problem you solved. The thing you finished. The person you
              helped. Capture your accomplishments and see what they reveal
              about the strengths you’ve already put into practice.
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
            Your accomplishments tell a story.
            <span> Give yourself a chance to see it.</span>
          </div>
        </section>

        <section id="how-it-works" className="wl-container wl-section">
          <div className="wl-section-heading">
            <span className="eyebrow">
              FROM EVERYDAY WINS TO SELF-RECOGNITION
            </span>
            <h2>
              Remember what you’ve done.
              <br />
              Recognize what you can do.
            </h2>
            <p className="lead">
              A few honest notes can help you see strengths you might otherwise
              overlook.
            </p>
          </div>

          <div className="wl-steps">
            <article>
              <span className="wl-step-number">01 / CAPTURE</span>
              <h3>Start with something you did.</h3>
              <p>
                Write down something you finished, figured out, learned, or
                helped someone with. Small accomplishments count. A quick note
                is enough.
              </p>
              <div className="wl-note">
                “Figured out a problem I’d been stuck on.”
              </div>
            </article>

            <article>
              <span className="wl-step-number">02 / REMEMBER</span>
              <h3>See your progress over time.</h3>
              <p>
                Revisit your accomplishments in a dated timeline. Reflection
                prompts help you remember the moments that get lost between one
                day and the next.
              </p>
              <div className="wl-note">
                Challenges you worked through.
                <br />
                Things you learned.
                <br />
                Moments you made a difference.
              </div>
            </article>

            <article>
              <span className="wl-step-number">03 / SEE YOUR IMPACT</span>
              <h3>Put your capabilities into words.</h3>
              <p>
                Generate a profile that brings your accomplishments together in
                a summary and key contributions. Explore what your examples
                demonstrate, then refine the wording to make it your own.
              </p>
              <div className="wl-note">
                “I’ve done this.”
                <br />
                “I have something to build on.”
              </div>
            </article>
          </div>
        </section>

        <section className="wl-purpose">
          <div className="wl-container wl-purpose-grid">
            <div>
              <span className="eyebrow">
                CONFIDENCE WITH SOMETHING BEHIND IT
              </span>
              <h2>
                See your strengths
                <br />
                in your own examples.
              </h2>
            </div>
            <div>
              <p className="lead">
                It can be hard to describe what you’re capable of when your
                accomplishments feel scattered or ordinary. Your Impact brings
                them together so you can recognize what you’ve demonstrated and
                find words for it.
              </p>
              <ul className="wl-use-list">
                <li>
                  <strong>Give yourself credit</strong>
                  <span>
                    Remember accomplishments you might have brushed aside or
                    forgotten.
                  </span>
                </li>
                <li>
                  <strong>Recognize your capabilities</strong>
                  <span>
                    Connect your strengths to specific things you’ve done.
                  </span>
                </li>
                <li>
                  <strong>Find words for your experience</strong>
                  <span>
                    Use your profile as a starting point for a resume, review,
                    or interview.
                  </span>
                </li>
                <li>
                  <strong>Carry your progress forward</strong>
                  <span>
                    Revisit real examples when you’re considering a new
                    challenge or opportunity.
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
              Your wins and profiles are private to your account. You choose
              what to record and when to generate a profile. There’s no public
              feed or leaderboard—just a place to recognize your own
              accomplishments.
            </p>
          </div>
        </section>

        <section id="pricing" className="wl-container wl-section wl-pricing">
          <div className="wl-section-heading">
            <span className="eyebrow">START WITH WHAT YOU’VE ALREADY DONE</span>
            <h2>A little space for your accomplishments.</h2>
            <p className="lead">
              Start during beta. Pro is planned for more profile generations as
              your collection grows.
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
                Capture your accomplishments and begin recognizing what they say
                about your capabilities.
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
                Pro<span>Pricing to be announced</span>
              </p>
              <p className="wl-price-description">
                More room to revisit your accomplishments and update the picture
                of what you bring.
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
          <div className="wl-section-heading">
            <h2>Commonly asked questions</h2>
            <p className="lead">A few things you might be wondering.</p>
          </div>

          <details>
            <summary>What counts as an accomplishment?</summary>
            <p>
              Something you finished, figured out, learned, improved, or helped
              someone with. It doesn’t have to be an award or a major milestone.
              Everyday progress counts too.
            </p>
          </details>

          <details>
            <summary>Does it have to be related to my job?</summary>
            <p>
              No. You can record accomplishments from a personal project,
              studying, volunteering, or everyday life. The current generated
              profile uses a professional summary format, so choose entries that
              fit the profile you want to create.
            </p>
          </details>

          <details>
            <summary>Do I need to write something every day?</summary>
            <p>
              No. Add a win when you want to remember it, or use the reflection
              prompts to look back on your week. Your record grows at your pace.
            </p>
          </details>

          <details>
            <summary>What does Your Impact generate?</summary>
            <p>
              An accomplishment profile with a summary and key outcomes or
              contributions based on your selected wins. It helps put what
              you’ve demonstrated into words. You can read it, view the
              supporting notes, edit the wording, and copy it.
            </p>
          </details>

          <details>
            <summary>Will it write my resume or performance review?</summary>
            <p>
              The current version creates an accomplishment profile. You can
              adapt its wording for a resume, review, or interview. Dedicated
              document formats are not available yet.
            </p>
          </details>

          <details>
            <summary>Do I have to use AI?</summary>
            <p>
              No. You can capture accomplishments and use the timeline without
              generating a profile. If you choose to generate one, the selected
              wins are sent to OpenAI. Review the wording before using it
              elsewhere.
            </p>
          </details>

          <details>
            <summary>What happens when I use all five generations?</summary>
            <p>
              You can continue recording wins and viewing, editing, and copying
              your saved profiles. Creating another AI profile requires
              additional generation allowance. Pro subscriptions have not
              launched yet.
            </p>
          </details>
        </section>

        <section className="wl-container wl-final">
          <span className="eyebrow">
            GIVE YOURSELF SOMETHING TO LOOK BACK ON
          </span>
          <h2>
            What’s one thing
            <br />
            you’re glad you did?
          </h2>
          <Link className="button" href="/signup">
            Save your first win <span aria-hidden="true">↗</span>
          </Link>
          <p className="muted">
            Start there. You may have more to recognize than you think.
          </p>
        </section>
      </main>

      <footer className="wl-container wl-footer">
        <Link className="brand" href="/">
          WinLog<span>●</span>
        </Link>
        <span className="muted">
          Remember your accomplishments. Recognize your capabilities.
        </span>
        <Link href="/login">Log in</Link>
      </footer>
    </div>
  );
}
