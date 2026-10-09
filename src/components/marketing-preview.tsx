"use client";

import { useEffect, useState } from "react";

const examples = [
  {
    label: "Fixed",
    day: "MONDAY",
    text: "Resolved a recurring login issue caused by refresh tokens not updating.",
  },
  {
    label: "Helped",
    day: "WEDNESDAY",
    text: "Walked a teammate through their first production deployment.",
  },
  {
    label: "Improved",
    day: "FRIDAY",
    text: "Simplified the steps for preparing the weekly customer report.",
  },
];

export function MarketingPreview() {
  const [active, setActive] = useState<"timeline" | "impact">("timeline");
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
      setActive((current) => (current === "timeline" ? "impact" : "timeline"));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion, active]);

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
          className={`wl-preview wl-stack-card ${active === "timeline" ? "is-front" : "is-back"}`}
          aria-label="Example wins timeline"
          aria-hidden={active !== "timeline"}
        >
          <div className="wl-preview-top">
            <span className="brand">
              WinLog<span>●</span>
            </span>
            <span className="wl-chip">Example timeline</span>
          </div>
          <div className="wl-preview-body">
            <span className="eyebrow">A FEW MOMENTS FROM YOUR WEEK</span>
            <h2>Small wins add up.</h2>
            {examples.map((item) => (
              <div className="wl-example" key={item.label}>
                <span className="wl-example-dot" aria-hidden="true" />
                <div>
                  <span className="wl-example-meta">
                    {item.day} · {item.label}
                  </span>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
            <div className="wl-preview-note">
              <span aria-hidden="true">✓</span>A record you can come back to.
            </div>
          </div>
        </article>

        <article
          className={`wl-preview wl-stack-card ${active === "impact" ? "is-front" : "is-back"}`}
          aria-label="Example accomplishment profile"
          aria-hidden={active !== "impact"}
        >
          <div className="wl-preview-top">
            <span className="brand">
              WinLog<span>●</span>
            </span>
            <span className="wl-chip">Example impact</span>
          </div>
          <div className="wl-preview-body wl-impact-example">
            <span className="eyebrow">YOUR IMPACT</span>
            <h2>
              Practical problem solving.
              <br />
              Support that moves work forward.
            </h2>
            <section className="wl-impact-summary">
              <h3>Professional summary</h3>
              <p>
                You bring practical problem-solving skills to technical
                challenges and support to the people working alongside you. Your
                contributions span resolving a recurring login issue, guiding a
                teammate through deployment, and simplifying weekly reporting.
              </p>
            </section>
            <section className="wl-impact-outcomes">
              <h3>Key outcomes & contributions</h3>
              <div>
                <span aria-hidden="true">01</span>
                <p>
                  <strong>Resolved a recurring login issue</strong>
                  Corrected refresh-token updates behind repeated login
                  problems.
                </p>
              </div>
              <div>
                <span aria-hidden="true">02</span>
                <p>
                  <strong>Supported a first deployment</strong>
                  Guided a teammate through their first production deployment.
                </p>
              </div>
              <div>
                <span aria-hidden="true">03</span>
                <p>
                  <strong>Simplified weekly reporting</strong>
                  Made the customer-report preparation steps easier to follow.
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>

      <div
        className="wl-preview-switcher"
        aria-label="Example preview controls"
      >
        <button
          type="button"
          aria-pressed={active === "timeline"}
          onClick={() => setActive("timeline")}
        >
          Timeline
        </button>
        <button
          type="button"
          aria-pressed={active === "impact"}
          onClick={() => setActive("impact")}
        >
          Your Impact
        </button>
        {!reducedMotion && (
          <button
            type="button"
            className="wl-preview-pause"
            aria-label={
              paused
                ? "Resume automatic switching"
                : "Pause automatic switching"
            }
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}
