import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { signout } from "@/app/actions";
import { ThemeSelect } from "@/components/theme";
import { WinModalProvider } from "@/components/add-win-modal";
import "./app/accomplishments.css";

export const dynamic = "force-dynamic";

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
          <Link href="/app">Accomplishments</Link>
          <Link href="/app/reflect">Reflect</Link>
          <Link href="/settings">Settings</Link>
          <ThemeSelect />
          <form action={signout}>
            <button className="text-button" type="submit">
              Sign out
            </button>
          </form>
        </nav>

        <details className="ac-mobile-menu">
          <summary aria-label="Open navigation">☰</summary>
          <nav className="ac-mobile-drawer" aria-label="Mobile navigation">
            <span className="eyebrow">YOUR ACCOUNT</span>
            <Link href="/app">Accomplishments</Link>
            <Link href="/app/reflect">Reflect</Link>
            <Link href="/settings">Settings</Link>
            <ThemeSelect />
            <form action={signout}>
              <button className="text-button" type="submit">
                Sign out
              </button>
            </form>
          </nav>
        </details>
      </header>

      <main className="workspace accomplishment-workspace">{children}</main>
    </WinModalProvider>
  );
}
