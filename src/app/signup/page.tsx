import Link from "next/link";
import { AuthForm } from "@/components/forms";
export default function Page(){return <main className="auth card"><Link className="brand" href="/">WinLog<span>●</span></Link><h1>Start remembering.</h1><p className="muted">One private place for the work worth remembering.</p><AuthForm register/><p>Already registered? <Link href="/login">Log in</Link></p></main>;}
