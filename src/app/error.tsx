"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="auth card"><h1>We couldn’t load this page.</h1><p>Your saved data has not been changed. Check the Supabase configuration and migration, then retry.</p><button onClick={reset}>Try again</button></main>;}
