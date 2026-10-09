import Link from "next/link";
import { AuthForm } from "@/components/forms";
import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell>
      <span className="eyebrow">YOUR PROGRESS IS WAITING</span>
      <h1>Welcome back.</h1>
      <p className="muted">Pick up where you left off.</p>
      <AuthForm />
      <p className="auth-switch">
        New here? <Link href="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
