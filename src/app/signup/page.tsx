import Link from "next/link";
import { AuthForm } from "@/components/forms";
import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell>
      <span className="eyebrow">START WITH ONE ACCOMPLISHMENT</span>
      <h1>Give yourself credit.</h1>
      <p className="muted">
        A personal space to remember what you’ve accomplished and recognize what
        you’re capable of.
      </p>
      <AuthForm register />
      <p className="auth-switch">
        Already registered? <Link href="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}
