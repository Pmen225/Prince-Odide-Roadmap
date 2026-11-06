# ODIDE clarity update

Scope: reduce competing attention targets and explain existing proposed work. Preserve the connected roadmap, current source references, saved edits, access settings and completion rules. This is not a new business strategy, live Notion sync or agent execution release.

## Design ledger

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| High | Opening screen | Map, three sidebar tasks, four empty result cards and a large goal card compete | One leading task; alternatives closed; full roadmap available | One clear point to begin |
| High | Task copy | Assets, offer, revenue record and other undefined terms | Website/documents/tools; what a customer buys; job cost sheet; sales-and-payments tracker | Name the actual action and output |
| Medium | Colours | Business labels, drafts, active navigation and many nodes use accent colours | Neutral navigation and business labels; focus blue, waiting amber, verified green | Colour communicates state |
| Medium | Task details | Metadata, dependencies, explanation and controls have similar emphasis | One next step; reason and finished result; settings and guidance closed | Keep context beside the action |
| Medium | Motion | Camera movement on every layout, reveal and zoom | Immediate map movement and tabs; restrained primary-button press feedback | Frequent controls should not interrupt work |
| High | Old saved drafts | A seed change does not reach existing drafts | Exact-match migration of untouched original proposals only | Improve default language without overwriting edits |
| Medium | Keyboard navigation | Hidden mobile sidebar remains focusable; new task loses focus | Closed sidebar hidden from focus; opened task heading gets focus | Keep the user's place |
| High | Initial page load | The map engine starts during server rendering and returns a temporary error page | Load the engine only when a layout is requested | Opening the workspace must not flash an error |
| Medium | Phone search | Results extend beyond the left edge at 390 px | Results use a fixed inset inside the phone viewport | Keep every result readable |

The requested Better UI and Emil Design Engineering skills informed this update. No raster concept is needed for this bounded change inside the existing design system. Existing brand, palette and map remain the reference; the user's new direction intentionally changes the opening screen, copy and attention hierarchy.

## Content contract

- Primary heading: Start here.
- One current task title, plain reason, first unfinished step and Review/Open task control.
- Suggestions are labelled as unapproved. Add to my plan does not run an agent.
- Full roadmap remains accessible in navigation and from the current task.
- No business revenue, customer or team results are invented.
- Personal source notes and profile information are not included in this repository or app.

## Verification

- 35 domain, graph, storage, copy-migration, starting-point and Worker-import tests pass.
- TypeScript and ESLint pass for the integrated components.
- Managed local preview reports a URL but the route is unavailable. This is an environment limitation; no networking bypass or substitute server was used.
- The deployed app was inspected in the connected browser at the normal desktop size and at 390 × 844. Temporary viewport overrides are reset after testing.
- Start screen: one primary task and action; alternatives closed; no horizontal page overflow.
- Task panel: the task heading receives focus; the first step, reason and result are visible; settings and guidance start closed.
- Map: keyboard expansion works; selecting a task opens its details; prerequisite buttons open the named earlier task. Neutral branches preserve the relationships without competing accent colours.
- Phone: navigation opens with focus on Close and returns focus to Open when closed. Search finds the renamed cost task. The new-task dialog fits; it was closed without adding test work.
- Browser review found and led to fixes for the narrow search popup and the first-load server error. A Worker-shaped import test reproduces and guards the server-rendering failure. The release check also exercises the built Worker in-process and then checks a fresh live load.
- No business task was approved, started or marked complete during browser testing.

Visual review covers opening focus and copy, task detail hierarchy, map colour/expansion, typography and spacing, and mobile navigation/overflow. Automated tests remain separate from visual checks; this is not a claim of a complete accessibility audit.
