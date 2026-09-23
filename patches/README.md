# MBI patch set

These patches are the complete, authoritative MBI delta against upstream
Mattermost. They are applied on top of an official upstream tag when an MBI
release branch is cut (see `mbi/BUILD.md` at the repo root).

Each patch file is a `git format-patch`-style diff (`git apply` compatible),
numbered `NNNN-short-name.patch`, applied in ascending order.

| Patch | Upstream tag applied to | Touches | Purpose |
|---|---|---|---|
| `0001-no-user-limit.patch` | `v11.7.11` (062eb3ba0e) | `server/channels/app/limits.go`, `server/channels/app/limits_test.go`, `server/channels/app/user_limits_test.go`, `server/channels/api4/limits_test.go` | Remove the Team Edition hard-coded user cap (200 soft / 250 hard) on unlicensed builds |
| `0002-unlicensed-generic-oidc.patch` | `v11.7.11` (062eb3ba0e) | `server/config/client.go`, `webapp/channels/src/components/admin_console/admin_definition.tsx` | Enable generic OpenID Connect SSO without a commercial license |

## Rules

1. A patch must be justified by a real MBI requirement, never by parity with
   a commercial edition.
2. Every patch must carry or have a companion automated test that fails loudly
   when upstream refactors the gated code (e.g.
   `TestGetServerLimits` for 0001, and the `GET /api/v4/limits` smoke assertion
   `maxUsersHardLimit == 0`).
3. No patch may touch code under the Mattermost Source Available License
   (`server/enterprise/**` in the main repo, `enterprise/**` in any plugin).
   Modifying license checks there is explicitly out of scope per
   `Progetto_Mattermost_MBI_Fork_AGPL.docx` §4.
4. On every upstream upgrade, rebase: start from the new upstream tag,
   `git am` the patches, resolve conflicts, run the MBI regression suite.
   If a patch grows beyond a handful of hunks, re-evaluate its necessity
   rather than expanding it.
5. Each patch file embeds its own provenance header. Record in the MBI
   changelog (`mbi/CHANGELOG.md`) which upstream tag each patch set was
   verified against.

## Licensing of the patches

* `0001` and the server part of `0002` modify AGPL-3.0 code (the open-source
  server). Distributing the modified build triggers AGPL corresponding-source
  obligations; the patch files and this repo are the corresponding source.
* The webapp part of `0002` modifies Apache-2.0 code.
* Neither patch contains or copies code from any Source Available directory.
