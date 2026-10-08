import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { signout } from "@/app/actions";
import { ThemeSelect } from "@/components/theme";
export const dynamic = "force-dynamic";
export default async function Private({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/login");
  return (
    <>
      <header className="nav">
        <Link className="brand" href="/app">
          WinLog<span>●</span>
        </Link>
        <nav className="row">
          <Link href="/app">My Wins</Link>
          <Link href="/app/records">Records</Link>
          <Link href="/app/reflect">Reflect</Link>
          <Link href="/settings">Settings</Link>
          <ThemeSelect />
          <form action={signout}>
            <button className="text-button">Sign out</button>
          </form>
        </nav>
      </header>
      <main className="workspace">{children}</main>
    </>
  );
}
