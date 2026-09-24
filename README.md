# NTU Cup public results

This repository is the read-only public frontend for NTU Cup schedules,
standings, brackets, and match results. The organizer application publishes the
existing JSON storage shape to Supabase; this site reads the published snapshot
and never receives database write permission.

## Cloudflare Pages deployment

Create a Cloudflare Pages project for this repository with:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` after the integration branch is reviewed |

Configure the same values used by the admin site:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` — never use `service_role`
- `NTUCUP_TOURNAMENT_SLUG` — optional; defaults to `ntu-cup`

The required schema and Row Level Security migration live in the administrator
repository under `supabase/migrations/`. Anonymous visitors receive `SELECT`
access only to snapshots whose `is_published` value is true.

For local verification, provide the environment values while building, then
serve the generated directory:

```sh
SUPABASE_URL="https://PROJECT.supabase.co" \
SUPABASE_PUBLISHABLE_KEY="PUBLIC_KEY" \
npm run build
python3 -m http.server 8001 --directory dist
```

The former `LocalStorageBackup/ntu-cup-backup.json` import is intentionally no
longer used. Browser storage is only a last-known-good display cache.
