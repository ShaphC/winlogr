import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeSelect } from "@/components/theme";
import "@/app/landing.css";
import "@/app/auth.css";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="wl-home wl-auth-shell">
      <header className="nav wl-nav">
        <Link href="/" className="brand" aria-label="WinLog home">
          WinLog<span>●</span>
        </Link>
        <nav className="row" aria-label="Main navigation">
          <Link className="wl-how-link" href="/#how-it-works">
            How it works
          </Link>
          <Link href="/#pricing">Pricing</Link>
          <ThemeSelect />
          <Link href="/login">Log in</Link>
          <Link className="button" href="/signup">
            Get started
          </Link>
        </nav>
      </header>

      <main className="wl-auth-main">
        <div className="auth card wl-auth-card">{children}</div>
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
