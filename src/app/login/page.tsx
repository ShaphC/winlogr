import Link from "next/link";
import { AuthForm } from "@/components/forms";
export default function Page() {
  return (
    <main className="auth card">
      <Link className="brand" href="/">
        WinLog<span>●</span>
      </Link>
      <h1>Welcome back.</h1>
      <AuthForm />
      <p>
        New here? <Link href="/signup">Create an account</Link>
      </p>
    </main>
  );
}
