import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { signout } from "@/app/actions";
import { ThemeToggle } from "@/components/theme";
import { WinModalProvider } from "@/components/add-win-modal";
import "./app/accomplishments.css";

export const dynamic = "force-dynamic";

function SettingsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 1.72l-.12.88a2 2 0 0 1-1.18 1.52l-.27.12a2 2 0 0 1-1.9-.18l-.7-.54a2 2 0 0 0-2.56.6l-.22.38a2 2 0 0 0 .56 2.62l.7.54a2 2 0 0 1 .72 1.76v.32a2 2 0 0 1-.72 1.76l-.7.54a2 2 0 0 0-.56 2.62l.22.38a2 2 0 0 0 2.56.6l.7-.54a2 2 0 0 1 1.9-.18l.27.12a2 2 0 0 1 1.18 1.52l.12.88a2 2 0 0 0 2 1.72h.44a2 2 0 0 0 2-1.72l.12-.88a2 2 0 0 1 1.18-1.52l.27-.12a2 2 0 0 1 1.9.18l.7.54a2 2 0 0 0 2.56-.6l.22-.38a2 2 0 0 0-.56-2.62l-.7-.54a2 2 0 0 1-.72-1.76v-.32a2 2 0 0 1 .72-1.76l.7-.54a2 2 0 0 0 .56-2.62l-.22-.38a2 2 0 0 0-2.56-.6l-.7.54a2 2 0 0 1-1.9.18l-.27-.12a2 2 0 0 1-1.18-1.52l-.12-.88a2 2 0 0 0-2-1.72Z" />
      <circle cx="12" cy="11.58" r="3" />
    </svg>
  );
}

function NavigationItems() {
  return (
    <>
      <Link href="/app">Accomplishments</Link>
      <Link href="/app/impact">Highlights</Link>
      <div className="ac-nav-controls">
        <ThemeToggle />
        <Link
          href="/settings"
          className="ac-icon-button"
          aria-label="Settings"
          title="Settings"
        >
          <SettingsIcon />
        </Link>
        <form action={signout}>
          <button type="submit" className="ac-signout-button">
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}

export default async function Private({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();

  if (error || !user) redirect("/login");

  return (
    <WinModalProvider userId={user.id}>
      <header className="nav accomplishment-nav">
        <Link className="brand" href="/app">
          WinLog<span>●</span>
        </Link>

        <nav className="ac-desktop-nav" aria-label="App navigation">
          <NavigationItems />
        </nav>

        <details className="ac-mobile-menu">
          <summary aria-label="Open navigation">☰</summary>
          <nav className="ac-mobile-drawer" aria-label="Mobile navigation">
            <span className="eyebrow">YOUR ACCOUNT</span>
            <NavigationItems />
          </nav>
        </details>
      </header>

      <main className="workspace accomplishment-workspace">{children}</main>
    </WinModalProvider>
  );
}
