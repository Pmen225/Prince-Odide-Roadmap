# Release boundary

This build implements the approved plan's visual-prototype increment. It does not claim that the complete operating system or first live-data release is finished.

## Confirmed requirements

- One typed work model drives both map views, the inspector and Start here.
- Hierarchy and prerequisites are separate relations. Moving a node changes layout only.
- A task has a purpose, owner, steps, completion standard, sources and evidence.
- Proposals require review before activation. Activation is not agent execution approval.
- No payment or revenue totals are inferred from task counts.
- Public-safe proposed records only; no private Notion data is embedded.

## Test map

| Requirement | Evidence owner |
| --- | --- |
| Hierarchy and dependency validity | tests/domain.test.ts |
| Completion evidence and reopen behaviour | tests/domain.test.ts |
| Ready-work priorities and progress denominator | tests/domain.test.ts |
| JSON schema, revision conflicts, corrupt-data recovery | tests/storage.test.ts |
| Safe refresh of unchanged original wording | tests/seed-copy.test.ts |
| One leading suggestion, ready work, blocked work and follow-on tasks | tests/start-focus.test.ts |
| Graph selection, expansion, search, mode switch | Browser interaction checks |
| Saved edits after reload | Browser interaction checks and storage suite |
| Desktop/mobile visual layout | Browser screenshot review |
| Private hosted publication | Deployment status and live-page inspection |
| Notion reads/writes, unauthorized data APIs | Not implemented; do not mark passed |
| Agent batches and team permissions | Not implemented; do not mark passed |

## Intentional design adaptations

The initial concept set the charcoal palette, connected map and right inspector. The user then requested a clear starting point, meaningful colour and concrete task language. The clarity update preserves the palette and roadmap but opens on one task. Extra task choices, settings and source guidance are closed until requested. Blue marks focus, amber marks a blocker, and green marks verified completion. Empty metric cards no longer compete with the work. The existing plan remains explicitly proposed; no new company facts are asserted.

See [clarity review](clarity-review.md) for the before/after design ledger and verification limits.

## Data boundaries

The public repository contains code and proposed records. The hosted app stays owner-private. Browser drafts never leave the current browser through a background network operation. Exports leave only as explicit local downloads. Import replaces the browser draft only after validation and confirmation, with a backup download.

## Next blocked integration gate

An approved runtime Notion connection is not available in this build environment. Do not work around it by embedding exported private records, connector tokens or user session credentials. The next implementation must add a server-side allowlisted adapter, complete import reconciliation and field-conflict review before advertising live data.
