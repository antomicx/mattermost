# MBI build procedure

Reproducible build of the MBI Mattermost distribution. Authoritative design:
`Progetto_Mattermost_MBI_Fork_AGPL.docx` (2026-09-22), §5–§6, §9.

## Baseline

| Item | Value |
|---|---|
| Upstream | https://github.com/mattermost/mattermost |
| Target ESR | v11.7 (support window 2026-05-15 → 2027-05-15) |
| Current baseline tag | `v11.7.11` (`062eb3ba0e`) |
| Integration branch | `mbi/11.7.x` |
| Patch set | `patches/0001…N` (applied in order, `git am`) |
| MBI tag scheme | `v<upstream>-mbi.<N>` e.g. `v11.7.11-mbi.1` |
| Image tag scheme | `mattermost:<upstream>-mbi.<N>` |

## Branching an upgrade

```sh
git fetch upstream
git switch -c mbi/11.7.x --force-release v11.7.12   # new upstream tag
git am patches/*.patch                              # fix conflicts as needed
# update patches/README.md "applied to" column with the new tag + verified date
```

If any patch no longer applies cleanly at the hunks documented in its header,
re-read the referenced files; do not enlarge the patch beyond a handful of
hunks without re-justifying it (rule 4 in `patches/README.md`).

## Continuous sync

`.github/workflows/mbi-sync-upstream.yml` (fork) fetches upstream
`release-11.7` weekly (Mondays 06:00 UTC), merges it into `mbi/11.7.x`,
and opens a sync PR — the fork's own `server-ci.yml` runs the server
test suite (including the sentinel `TestGetServerLimits`) on that PR.
On a conflict the merge is aborted and an issue is opened for the manual
rebase above. It never force-pushes `mbi/11.7.x`.

The **master** copy of that workflow file is what enables the schedule
(GitHub evaluates cron only from the default branch); the branch copy
serves `workflow_dispatch` and PR lint. If they drift, fix both.
When an upstream patch tag appears (e.g. `v11.7.12`), the merged sync PR
is the moment to build and tag `v11.7.12-mbi.1` — tagging stays manual.

## Required regression tests (every release)

Server (AGPL):
- `go test ./channels/app/ -run 'TestGetServerLimits|TestIsAtUserLimit|TestUpdateActiveWithUserLimits|TestCreateUserOrGuestSeatCountEnforcement|TestExtraUsersBehavior'` — 0001
- `go test ./channels/api4/ -run TestGetServerLimits` — 0001
- `go test ./config/` — 0002 (client props)
- Webapp (targets the two files 0002 touches): `npm run test-channels` (from `webapp/`)

Functional smoke (staging, per doc §10):
- [ ] Login/logout with local account
- [ ] **Create user #251 via API and UI on an unlicensed build → must succeed;
      `GET /api/v4/limits` must return `maxUsersHardLimit == 0`** (patch 0001
      sentinel; this is the test that detects upstream refactors)
- [ ] Public/private channels, messages, threads, mentions, notifications
- [ ] File upload/download, search
- [ ] Webhooks, bots, installed plugins
- [ ] Desktop/mobile login
- [ ] **Configure `OpenIdSettings` against a test IdP; OIDC login and signup
      complete; "OpenID Connect" page visible in System Console without a
      license** (patch 0002 sentinel)
- [ ] DB schema upgrade + application rollback rehearsal

## Out of perimeter (do NOT patch)

Calls, Playbooks, Bleve, and anything under `server/enterprise/**` or any
plugin's `enterprise/**` directory (Mattermost Source Available License —
see `patches/README.md` rule 3 and doc §4).
