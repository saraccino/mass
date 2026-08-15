# 35mm, by hand

A responsive primary-research survey for people who personally develop 35mm film. The interface is a one-question-at-a-time editorial experience; submissions are stored securely in Supabase and can be exported from a protected admin page.

## What is included

- Fourteen accessible, responsive survey questions
- Required-field validation and back/next navigation
- Automatic draft recovery using local browser storage
- Server-side Supabase submission
- Unique UUID and timestamp for every response
- Protected `/admin` page with CSV and Excel-compatible `.xls` exports
- One respondent per row, with each difficulty stage in its own column

## Run locally in Visual Studio Code

1. Install Node.js 22.13 or newer.
2. Open this folder in Visual Studio Code.
3. In **Terminal → New Terminal**, run:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env.local` and enter your Supabase values.
5. Run:

   ```bash
   npm run dev
   ```

6. Open the local address printed in the terminal. The export page is at `/admin`.

## Configure Supabase

1. Create a Supabase project.
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it once.
3. In **Project Settings → API**, copy the project URL and publishable key.
4. Put them in `.env.local`:

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
   ```

The publishable key is limited by Row Level Security: visitors can insert a survey response but cannot read, edit, or delete responses. Never commit `.env.local`.

To enable the private export page, generate a long random password and run this once in the Supabase SQL Editor, replacing the placeholder:

```sql
insert into private.survey_config (key, value)
values ('export_key', 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD')
on conflict (key) do update set value = excluded.value;
```

Do not commit that password. Enter it only on the `/admin` page when exporting responses.

## Verify the project

```bash
npm run lint
npm test
```

## Deploy from GitHub

This project uses vinext with the Cloudflare Vite plugin and includes `.github/workflows/deploy-cloudflare.yml`. GitHub Pages cannot run the required server-side `/api/responses` route, so the complete site must run on a server-capable host.

1. Push the project to a GitHub repository.
2. Create a Cloudflare API token with Workers edit permission and copy your Cloudflare account ID.
3. In **GitHub → Repository Settings → Secrets and variables → Actions**, add:

   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`

4. Push to `main`. GitHub Actions builds and deploys the Worker.

Cloudflare provides a `workers.dev` address with no ChatGPT-site branding. A custom domain can later be attached in **Cloudflare Workers → Settings → Domains & Routes** without changing the survey.

## Project map

```text
app/
  api/responses/route.ts   submission and export endpoint
  admin/page.tsx           private-key export interface
  survey.tsx               survey interactions and validation
  survey-data.ts           options, stages and answer types
  globals.css              responsive editorial styling
public/                    images and static assets
supabase/schema.sql        database, RLS, and export setup
.github/workflows/         GitHub-to-Cloudflare deployment
.env.example               environment variable template
```
