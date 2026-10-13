"use client";

import { useEffect, useState } from "react";

const accomplishments = [
  {
    date: "Oct 8, 2026",
    text: "Resolved a login issue and added a regression test.",
  },
  {
    date: "Oct 7, 2026",
    text: "Restored a client’s internet access and verified connectivity.",
  },
  {
    date: "Oct 6, 2026",
    text: "Helped a teammate troubleshoot their first deployment.",
  },
  {
    date: "Oct 5, 2026",
    text: "Documented the account setup process for new team members.",
  },
  {
    date: "Oct 4, 2026",
    text: "Completed a course module on network troubleshooting.",
  },
];

export function MarketingPreview() {
  const [active, setActive] = useState<"tiles" | "highlights">("highlights");
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActive((current) => (current === "tiles" ? "highlights" : "tiles"));
    }, 5000);

    return () => window.clearInterval(timer);
  }, [active, paused, hovered, focused, reducedMotion]);

  return (
    <div
      className="wl-preview-demo"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      <div className="wl-preview-stack">
        <article
          className={`wl-preview wl-stack-card ${
            active === "tiles" ? "is-front" : "is-back"
          }`}
          aria-hidden={active !== "tiles"}
          aria-label="Illustrative accomplishment library"
        >
          <div className="wl-preview-top">
            <span className="brand">
              WinLog<span>●</span>
            </span>
            <span className="wl-chip">Example collection</span>
          </div>

          <div className="wl-preview-body wl-tiles-example">
            <span className="eyebrow">YOUR ACCOMPLISHMENTS</span>
            <h2>A few things worth keeping.</h2>

            <div className="wl-demo-toolbar">
              <span className="wl-demo-search">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
                Search accomplishments
              </span>
              <span className="wl-demo-filter">Tiles</span>
            </div>

            <p className="wl-demo-month">October 2026</p>

            <div className="wl-demo-tiles">
              {accomplishments.map((item, index) => (
                <div
                  className={`wl-demo-tile ${index < 3 ? "is-selected" : ""}`}
                  key={item.text}
                >
                  <span className="wl-demo-check" aria-hidden="true">
                    {index < 3 ? "✓" : ""}
                  </span>
                  <p>{item.text}</p>
                  <span className="wl-demo-date">{item.date}</span>
                </div>
              ))}
            </div>

            <div className="wl-preview-note">
              <span aria-hidden="true">✓</span>
              Three selected for Highlights
            </div>
          </div>
        </article>

        <article
          className={`wl-preview wl-stack-card ${
            active === "highlights" ? "is-front" : "is-back"
          }`}
          aria-hidden={active !== "highlights"}
          aria-label="Illustrative highlights document preview"
        >
          <div className="wl-preview-top">
            <span className="brand">
              WinLog<span>●</span>
            </span>
            <span className="wl-chip">Example Highlights</span>
          </div>

          <div className="wl-preview-body wl-highlights-example">
            <span className="eyebrow">REVIEW BEFORE SHARING</span>
            <h2>Your examples, brought together.</h2>

            <div className="wl-demo-paper">
              <header>
                <span className="wl-demo-person">Alex Morgan</span>
                <h3>October one-on-one</h3>
              </header>

              {accomplishments.slice(0, 3).map((item, index) => (
                <div className="wl-demo-outcome" key={item.text}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <div className="wl-preview-note">
              <span aria-hidden="true">✓</span>
              Review your selection. Copy when ready.
            </div>
          </div>
        </article>
      </div>

      <div className="wl-preview-switcher" aria-label="Choose example">
        <button
          type="button"
          aria-pressed={active === "tiles"}
          onClick={() => setActive("tiles")}
        >
          Accomplishments
        </button>
        <button
          type="button"
          aria-pressed={active === "highlights"}
          onClick={() => setActive("highlights")}
        >
          Highlights
        </button>

        {!reducedMotion && (
          <button
            type="button"
            className="wl-preview-pause"
            onClick={() => setPaused((current) => !current)}
            aria-label={
              paused ? "Play example animation" : "Pause example animation"
            }
          >
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
