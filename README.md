# Prince-Odide-Roadmap

ODIDE — the business, connected.

A private visual workspace for following business work from its purpose to its prerequisites, exact steps, sources and accepted completion evidence.

## This release

**Increment 1: interactive visual prototype.** It does not import live Notion records.

- Expandable mind map and a task dependency view, backed by the same stable work IDs.
- One clear Start here screen; the full connected roadmap stays one click away.
- Neutral business labels. Blue marks focus, amber marks waiting work, green marks verified completion.
- Search reveals collapsed work. Select a node to edit its detail.
- Create draft tasks, change owners, set priorities, reparent work and add prerequisites.
- Cycle checks protect the hierarchy and dependency graph.
- Start here shows one next task. Up to two alternatives stay closed until requested. Approved, unblocked work takes precedence over proposed work.
- Plain task names, one next step, a reason and a concrete finished result. Task settings and source guidance are closed by default.
- Customer work comes first: existing replies, eligible follow-ups, a small local demand test, a real job, a checked quote, delivery and payment. No new website, list template or operations manual blocks a buyer conversation.
- Verified completion needs approved work, finished steps, accepted evidence and verified prerequisites.
- Cancelled and archived items do not increase completion totals.
- Browser draft saving, revision checks, JSON export/import and recovery export.
- Responsive map, keyboard navigation, labelled controls and a mobile inspector.

Unknown business results are not presented as zero. Empty metric cards were removed from the main screen. Ten paying clients is a target. The baseline date, monthly revenue definition/currency/target and team-readiness criteria are not established.

## Sources

The proposed roadmap is guided by both user-selected sources:

- [Alex Hormozi — full course](https://github.com/Pmen225/Junior-Built-skills/tree/main/skills/alex-hormozi-full-course): offer sequence, economic checks and continuity.
- [Alex Hormozi — YouTube skill](https://github.com/Pmen225/hormozi-youtube-channel-skill): lead generation, sales and verified delegation.

Task source links identify the relevant chapters. The YouTube skill shapes contact, qualification and follow-up; Money Models shapes the scoped quote, direct-cost check, cash timing and useful repeat work. These applications are proposals; they are not evidence of completed work. Source libraries stay at their original locations. This repository does not contain full course transcripts or private Notion records.

Matt Pocock's implement, TDD, codebase-design and two-axis code-review methods guided the build. The accepted user build plan is the specification; the initial repository main commit is the comparison baseline.

The clarity update uses [Better UI](https://github.com/jakubkrehel/skills/blob/main/skills/better-ui/SKILL.md) and [Emil Design Engineering](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md): restrained colour, clear hierarchy, progressive disclosure, readable controls and minimal motion. This is a targeted usability update inside the existing design, not a new business strategy.

## Run

Node 22.13 or newer is required. The current lockfile uses npm.

```sh
npm ci
npm run dev
```

The app uses the Next.js App Router programming model through Vinext and Vite, React 19, TypeScript, React Flow and ELK. Hosted deployment uses the supplied Sites worker workflow. A standalone Vercel/Next.js deployment has not been verified.

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

## What is not live

- **Notion import and two-way sync:** not connected. No schema changes or writes are made.
- **Real business metrics:** no payment, CRM, revenue or team-readiness import.
- **Agent execution:** not enabled. “Agent” is an intended owner label; approving work is planning approval only.
- **Team collaboration:** not enabled. Changes do not sync across people, devices or browsers.
- **Persistent map layout:** node movement is session-local display state, not a hierarchy change.

Keep a private JSON export before changing devices or clearing browser data. The source-code repository is public; do not commit draft exports, evidence or secrets.

## Delivery gates

1. Visual prototype and review of proposed work.
2. Dedicated authenticated Notion runtime connection; approved field mapping; real-data reconciliation.
3. Controlled two-way edits, conflict handling and durable sync.
4. Approved evidence-backed result and schedule definitions.
5. Explicit, versioned batch approvals before actual agent tools run.
6. Approved team roles and tested access boundaries.

Do not mistake a prototype check for a pass at a later gate.

## Architecture

- [System map](docs/architecture/system-map.html)
- [Machine-readable ownership map](docs/architecture/architecture.json)
- [Release boundary and checks](docs/release-boundary.md)

One domain module owns completion, blockers, priorities and relationship validation. The map, inspector and Start here queue consume those rules. Browser storage validates every saved/imported workspace and rejects a stale revision. The versioned migration replaces a complete untouched legacy plan. A mixed plan keeps its existing graph and receives separate customer-first suggestions. User edits, approvals and evidence stay intact. A saved migration version prevents deleted tasks returning. Explicit imports are used as supplied.

## Privacy and safety

No API keys belong in client code. The prototype has no business-data backend or external action endpoint. Hosting privacy is enforced by the owner-private deployment, not by the public GitHub repository. Exported JSON is a local file and is not uploaded by this app. Links to guidance and user-added evidence open externally only when clicked.
