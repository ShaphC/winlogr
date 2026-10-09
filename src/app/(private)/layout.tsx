import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { signout } from "@/app/actions";
import { ThemeSelect } from "@/components/theme";
import { WinModalProvider, AddWinButton } from "@/components/add-win-modal";
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
      <header className="nav">
        <Link className="brand" href="/app">
          WinLog<span>●</span>
        </Link>
        <nav className="row" aria-label="App navigation">
          <Link href="/app">Your Impact</Link>
          <Link href="/app/records">Timeline</Link>
          <Link href="/app/reflect">Reflect</Link>
          <Link href="/settings">Settings</Link>
          <ThemeSelect />
          <AddWinButton />
          <form action={signout}>
            <button className="text-button">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="workspace">{children}</main>
    </WinModalProvider>
  );
}
