# Math 11 Diagnostic Test 2026

**2026 DIVISION DIAGNOSTIC TEST – Grade 11 Mathematics**

Production URL: **[https://mdt.vercel.app](https://mdt.vercel.app)**

## Student Flow (No Authentication)

Students enter **Full Name**, **School**, and **District** on the home page and click **Start Examination**. A session is created automatically and they proceed directly to the exam.

## Administrator Login

- **URL:** `/teacher` (e.g. `https://mdt.vercel.app/teacher`)
- **Email:** `admin@mdt.com`
- **Password:** `Admin123!`

Only pre-seeded accounts from the database can log in. There is no teacher registration page.

## Supabase Project

| Setting | Value |
|---------|-------|
| Project | MDT Math11 Exam |
| Region | ap-southeast-1 |
| Project URL | `https://zlfgvmnfzuanvhiasevd.supabase.co` |
| Project Ref | `zlfgvmnfzuanvhiasevd` |

## Quick Start (Local)

```bash
npm install
cp .env.example .env.local
# Add Supabase keys to .env.local
npm run dev
```

## Seed Administrator

```bash
npm run seed:admin
```

Default credentials: `admin@mdt.com` / `Admin123!`

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Connect custom domain `mdt.vercel.app`

## GitHub Actions

CI runs lint + build on every push. Deploys to Vercel on `main` when secrets are configured.

Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, plus Supabase env vars.

## Security

- Students: no auth — exam token secures in-progress sessions
- Scores calculated server-side only
- Duplicate submissions blocked
- RLS enabled on all tables
- Single admin account seeded in Supabase
