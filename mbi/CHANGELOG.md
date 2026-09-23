# MBI changelog

## v11.7.11-mbi.1 (2026-09-23)

First MBI release build. Baseline: upstream `v11.7.11` (`062eb3ba0e`).

* `0001-no-user-limit.patch` — open-source build user cap removed.
  Unlicensed servers now report unlimited seats (`GET /api/v4/limits`
  returns 0/0; user creation and reactivation never blocked by the former
  200 soft / 250 hard Team Edition cap). Licensed seat-count enforcement
  unchanged. Server-side test adjustments: `TestGetServerLimits`,
  `TestIsAtUserLimit`, `TestUpdateActiveWithUserLimits` (upstream
  "blocked at hard limit" subtests removed), `TestExtraUsersBehavior`,
  `api4 TestGetServerLimits`.
* `0002-unlicensed-generic-oidc.patch` — generic OpenID Connect usable
  without a commercial license. OIDC client props published from config
  regardless of license (`server/config/client.go`); System Console
  "OpenID Connect" page no longer license-hidden and its upsell twin
  removed (`webapp/.../admin_definition.tsx`). No Source Available
  licensed code touched or copied.

Verified with: `go build ./config/ ./channels/app/`, `go vet` (clean),
`gofmt` (clean), `go test ./config/` (ok), app limits tests (ok),
`go test ./channels/api4/ -run TestGetServerLimits` (ok).
