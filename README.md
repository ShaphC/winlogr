# WinLog — Foundation (Step 1)
Next.js App Router + TypeScript + Supabase SSR. Intended for Vercel.

## Run
1. Extract this project and open a terminal in `winlog`.
2. Run `npm install` (Node 20.9+; Node 22+ recommended).
3. Copy `.env.example` to `.env.local`. Fill in your existing Supabase project URL and publishable key (legacy anon key also works). Never use the service-role key here.
4. Run `supabase/migrations/001_winlog.sql` once in the Supabase SQL editor. It only creates `win_` objects; it does not change your other apps' tables. If any `win_` object already exists, review first instead of deleting it.
5. In Supabase Authentication > URL Configuration, set the appropriate Site URL and allowed redirect URLs for your app. This foundation uses password login; email confirmation sends users back to sign in. If using one Supabase project across apps, review the shared email-confirmation configuration before changing it.
6. Run `npm run dev` and visit http://localhost:3000.

## Included
- Landing page, signup, login, logout, protected pages.
- Private wins: create, edit, delete, date selection, newest first.
- RLS isolation; all mutations verify the user server-side.
- Weekly reflection: one line becomes one saved win, no AI required.
- Reminder day/time/timezone preferences. Delivery is explicitly not enabled.
- Light / Dark / System themes, responsive layout.

## Next steps
AI improve/extract + user-approved suggestions; generation; atomic AI quotas and usage logging; payment entitlements; reminder delivery with consent and unsubscribe; coverage; pagination; password reset; privacy/terms. This is a foundation, not a paid launch-ready product. There are no AI calls or checkout buttons in this version. Manual wins are currently uncapped; do not advertise the Free/Pro plans until server/database enforcement is added. Never reuse Checkmarkr subscription entitlements automatically: WinLog needs its own product-aware billing records.

## Verify with your Supabase connection
- Create two test accounts; add a win in each. Each account must see only its own wins.
- Save, edit, reload, delete; refresh and confirm persistence.
- Save three reflection lines and confirm three wins appear.
- Save reflection preferences and reload Settings.
- Sign out and verify /app redirects to /login.
- Test dark/system mode and narrow browser width.
- Test an expired session and account confirmation.

## Deploy later
Import into your own Git repository, connect Vercel, set the two environment variables, apply the migration and configure production auth URLs. `npm run build` is the production check. No deployment was performed by this starter.
