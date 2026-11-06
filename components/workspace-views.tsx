"use client";

import {
  ArrowUpRight,
  BookOpen,
  Play,
  Bot,
  CheckCheck,
  Download,
  Upload,
  ShieldCheck,
  Unplug,
  GitBranch,
  ArrowRight,
  CircleHelp,
  Target,
} from "lucide-react";
import { getBlockers, getProgress, type WorkItem } from "@/lib/work-model";

export function TodayView({
  items,
  focus,
  proposed,
  onSelect,
}: {
  items: WorkItem[];
  focus: WorkItem[];
  proposed: boolean;
  onSelect: (id: string) => void;
}) {
  const progress = getProgress(items, "all");
  const blocked = items.filter(
    (item) =>
      item.kind === "task" &&
      item.approved &&
      getBlockers(item, items).length > 0 &&
      item.status !== "archived" &&
      item.status !== "cancelled",
  );
  return (
    <section className="content-view today-view">
      <div className="view-intro">
        <h1>Make the next move.</h1>
        <p>
          {proposed
            ? "Review the draft before you turn it into active work."
            : "Three priorities at most. Each one has a clear finish."}
        </p>
      </div>
      <div className="today-layout">
        <div>
          <div className="section-label">
            {proposed ? "PROPOSED STARTING POINTS" : "READY FOR YOU"}
            <span>{focus.length} actions</span>
          </div>
          <div className="today-actions">
            {focus.map((item, index) => (
              <button
                key={item.id}
                className="today-action"
                onClick={() => onSelect(item.id)}
              >
                <span className="today-number">0{index + 1}</span>
                <div>
                  <span className="business-label">
                    {item.business === "itad"
                      ? "ITAD"
                      : item.business === "device-care"
                        ? "DEVICE CARE"
                        : "ODIDE GROUP"}
                  </span>
                  <h2>{item.title}</h2>
                  <p>
                    {proposed
                      ? "Proposed starting point. Review what is already done before approval."
                      : item.why}
                  </p>
                  <span className="today-owner">
                    {item.owner === "Agent" && <Bot size={13} />} {item.owner}
                    {item.owner === "Agent" ? " · Planning only" : ""}
                  </span>
                </div>
                <ArrowUpRight size={19} />
              </button>
            ))}
            {!focus.length && (
              <div className="blank-state">
                <CheckCheck size={30} />
                <h2>No ready tasks</h2>
                <p>
                  Review the blockers below or approve a draft on the roadmap.
                </p>
              </div>
            )}
          </div>
          {blocked.length > 0 && (
            <>
              <div className="section-label blocked-label">
                WAITING ON SOMETHING
              </div>
              {blocked.map((item) => (
                <button
                  className="blocked-row"
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                >
                  <span>
                    {item.title}
                    <small>
                      Needs:{" "}
                      {getBlockers(item, items)
                        .map((blocker) => blocker.title)
                        .join(", ")}
                    </small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              ))}
            </>
          )}
        </div>
        <aside className="today-aside">
          <Target size={24} />
          <h2>
            Evidence over
            <br />
            busywork.
          </h2>
          <p>
            A checked box is not proof. A task counts only after its steps and
            accepted evidence pass.
          </p>
          <div className="work-progress">
            <strong>
              {progress.percent === null ? "—" : `${progress.percent}%`}
            </strong>
            <span>
              {progress.total
                ? `${progress.verified} of ${progress.total} approved tasks verified`
                : "No approved task baseline yet"}
            </span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress.percent ?? 0}%` }} />
          </div>
          <small>Task progress is not revenue or business success.</small>
        </aside>
      </div>
    </section>
  );
}

const guides = [
  {
    title: "Money Models",
    subtitle: "Alex Hormozi · Full course",
    Icon: BookOpen,
    url: "https://github.com/Pmen225/Junior-Built-skills/tree/main/skills/alex-hormozi-full-course",
    description:
      "Design a clear offer. Check the economics. Build repeat value that customers choose to keep.",
    tags: ["Offer sequence", "Gross profit & payback", "Continuity"],
  },
  {
    title: "From leads to a team",
    subtitle: "Alex Hormozi · YouTube skill",
    Icon: Play,
    url: "https://github.com/Pmen225/hormozi-youtube-channel-skill",
    description:
      "Test one route to customers. Improve sales and handover. Transfer work only when the output passes the standard.",
    tags: ["Core Four", "CLOSER", "Document · Demonstrate · Duplicate"],
  },
];
export function SourcesView({
  items,
  onSelect,
}: {
  items: WorkItem[];
  onSelect: (id: string) => void;
}) {
  const guided = items.filter(
    (item) => item.kind === "task" && item.sources.length > 0,
  );
  return (
    <section className="content-view">
      <div className="view-intro">
        <h1>Built on a clear method.</h1>
        <p>
          Two source libraries. Applied to the work, not mistaken for proof.
        </p>
      </div>
      <div className="guide-grid">
        {guides.map(({ title, subtitle, Icon, url, description, tags }) => (
          <a
            className="guide-card"
            href={url}
            target="_blank"
            rel="noreferrer"
            key={title}
          >
            <div className="guide-top">
              <Icon size={23} />
              <ArrowUpRight size={18} />
            </div>
            <span>{subtitle}</span>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="guide-tags">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
      <div className="source-disclaimer">
        <CircleHelp size={17} />
        <p>
          These are proposed applications to ODIDE. The source lessons do not
          confirm current progress, income, legal compliance or a completed
          handover.
        </p>
      </div>
      <div className="section-label">
        GUIDANCE CONNECTED TO WORK<span>{guided.length} tasks</span>
      </div>
      <div className="source-tasks">
        {guided.map((item) => (
          <div className="source-task-row" key={item.id}>
            <button onClick={() => onSelect(item.id)}>
              <span>{item.title}</span>
              <ArrowUpRight size={14} />
            </button>
            <div>
              {item.sources.map((source, index) => (
                <a
                  key={`${source.url}:${index}`}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.label}
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SettingsView({
  onExport,
  onImport,
  onRecovery,
  saveState,
  items,
}: {
  onExport: () => void;
  onImport: () => void;
  onRecovery: () => void;
  saveState: string;
  items: WorkItem[];
}) {
  return (
    <section className="content-view settings-view">
      <div className="view-intro">
        <h1>A clear view of what is live.</h1>
        <p>
          Your visual workspace is ready. External connections have not been
          enabled.
        </p>
      </div>
      <div className="settings-section">
        <div className="settings-heading">
          <ShieldCheck size={21} />
          <div>
            <h2>Browser draft</h2>
            <p>
              {items.length} work items · {saveState}
            </p>
          </div>
          <span className="local-badge">LOCAL</span>
        </div>
        <p>
          Changes stay in this browser on this device. They are not shared with
          Notion, GitHub or your team. Keep an export before changing devices or
          clearing browser data.
        </p>
        <div className="settings-buttons">
          <button className="button-primary" onClick={onExport}>
            <Download size={15} />
            Export draft
          </button>
          <button className="button-secondary" onClick={onImport}>
            <Upload size={15} />
            Import draft
          </button>
          <button className="button-quiet" onClick={onRecovery}>
            Export recovery copy
          </button>
        </div>
      </div>
      <div className="settings-section">
        <div className="settings-heading">
          <Unplug size={21} />
          <div>
            <h2>Notion</h2>
            <p>Not connected</p>
          </div>
          <span className="draft-pill">NEXT RELEASE</span>
        </div>
        <p>
          The map contains proposed planning records, not an import of your
          existing business. Your current Notion records stay unchanged. A
          dedicated runtime connection and a reviewed field mapping are required
          for live data.
        </p>
      </div>
      <div className="settings-section">
        <div className="settings-heading">
          <Bot size={21} />
          <div>
            <h2>Agent execution</h2>
            <p>Not enabled</p>
          </div>
        </div>
        <p>
          “Agent” marks an intended owner. Approving a draft activates planning
          only. No emails, purchases, supplier commitments or other external
          actions are performed.
        </p>
      </div>
      <div className="settings-section">
        <div className="settings-heading">
          <GitBranch size={21} />
          <div>
            <h2>Source code</h2>
            <p>Prince-Odide-Roadmap</p>
          </div>
          <a
            className="button-secondary"
            href="https://github.com/Pmen225/Prince-Odide-Roadmap"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ArrowUpRight size={14} />
          </a>
        </div>
        <p>
          The public repository holds application code and proposed examples
          only. Do not add private exports or business evidence to the
          repository.
        </p>
      </div>
      <div className="settings-footnote">
        Business baseline date, revenue definition, currency and team-readiness
        criteria remain unset. The 12-month goal is a direction, not a forecast.
      </div>
    </section>
  );
}
