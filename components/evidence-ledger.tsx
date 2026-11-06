"use client";

import { useId, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  researchDate,
  researchSources,
  researchWindow,
  type ResearchSource,
} from "@/lib/evidence-sources";
import type { WorkItem } from "@/lib/work-model";
import "@/app/evidence-ledger.css";

const groupLabels: Record<ResearchSource["group"], string> = {
  itad: "ITAD buyers and delivery",
  sales: "Customer contact and sales",
  execution: "Agent execution and controls",
};

function displayDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function EvidenceLedger({
  items,
  onSelect,
}: {
  items: WorkItem[];
  onSelect: (id: string) => void;
}) {
  const controlId = useId();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<ResearchSource["group"] | "all">("all");
  const search = query.trim().toLowerCase();
  const filtered = researchSources.filter((source) => {
    if (group !== "all" && source.group !== group) return false;
    const taskNames = source.taskIds.map(
      (id) => items.find((item) => item.id === id)?.title ?? id,
    );
    return !search || [
      `Source ${source.id}`,
      source.title,
      source.quote,
      source.change,
      source.limit,
      source.kind,
      source.date,
      groupLabels[source.group],
      ...taskNames,
    ].join(" ").toLowerCase().includes(search);
  });
  const filtersActive = query.length > 0 || group !== "all";

  function clearFilters() {
    setQuery("");
    setGroup("all");
  }

  return (
    <section className="evidence-ledger" aria-labelledby={`${controlId}-heading`}>
      <div className="evidence-ledger-heading">
        <h2 id={`${controlId}-heading`}>Evidence behind the task briefs</h2>
        <p>
          {researchSources.length} separate sources · Checked{" "}
          <time dateTime={researchDate}>{displayDate(researchDate)}</time>
        </p>
        <p>Use the reports to test the work. They do not prove ODIDE has customer demand.</p>
      </div>

      <details className="evidence-ledger-method">
        <summary>
          <span>Research checks and limits</span>
          <ChevronDown size={16} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
        </summary>
        <div className="evidence-ledger-method-body">
          <ol>
            <li><strong>Plan.</strong> Research date: {displayDate(researchDate)}. Source window: {researchWindow}. Goal: task instructions an agent can execute.</li>
            <li><strong>Select.</strong> Include dated buyer reports, operator reports, sales experience, primary engineering accounts and primary research. Exclude old or undated evidence, empty pages and vendor sales pages.</li>
            <li><strong>Check.</strong> 34 Reddit firsthand reports, 8 primary engineering accounts and 8 primary research sources. No LinkedIn or Quora sources verified in this set. Each record retains its date, direct quote and link.</li>
            <li><strong>Compare.</strong> Keep conflicting reports. Free collection, paid disposal and failed outreach all appear. An individual result is not a market conversion rate. These are not 50 independent replications.</li>
            <li><strong>Infer.</strong> The task labels lack execution detail. This is the strongest supported explanation for an unclear agent handoff. The actual business bottleneck is not verified.</li>
            <li><strong>Apply.</strong> Specify inputs, steps, decision rules, output, approval and proof. Confidence in this handoff requirement: high. Local demand and expected sales: unknown. Technical sources support execution controls, not market success.</li>
          </ol>
        </div>
      </details>

      <details className="evidence-ledger-list">
        <summary>
          <span>Open all {researchSources.length} sources</span>
          <span className="evidence-ledger-summary-meta">Quotes · task links · limits</span>
          <ChevronDown size={16} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
        </summary>
        <div className="evidence-ledger-list-body">
          <div className="evidence-ledger-filters">
            <label htmlFor={`${controlId}-search`}>
              Search sources or tasks
              <input
                id={`${controlId}-search`}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try quotes, costs or follow-up"
                aria-controls={`${controlId}-results`}
              />
            </label>
            <label htmlFor={`${controlId}-group`}>
              Source group
              <select
                id={`${controlId}-group`}
                value={group}
                onChange={(event) => setGroup(event.target.value as typeof group)}
                aria-controls={`${controlId}-results`}
              >
                <option value="all">All sources ({researchSources.length})</option>
                {(Object.keys(groupLabels) as ResearchSource["group"][]).map((key) => (
                  <option key={key} value={key}>
                    {groupLabels[key]} ({researchSources.filter((source) => source.group === key).length})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="evidence-ledger-filter-status">
            <p role="status" aria-live="polite" aria-atomic="true">
              {filtered.length} of {researchSources.length} sources shown
            </p>
            {filtersActive && <button type="button" onClick={clearFilters}>Clear filters</button>}
          </div>
          <p className="evidence-ledger-caveat">
            Firsthand reports are self-reported. Technical sources test controls, not customer demand.
          </p>

          <ol className="evidence-ledger-records" id={`${controlId}-results`}>
            {filtered.map((source) => (
              <li key={source.key} value={source.id} id={`evidence-source-${source.id}`}>
                <article className="evidence-ledger-record" aria-labelledby={`${controlId}-source-${source.id}`}>
                  <div className="evidence-ledger-record-meta">
                    <strong>Source {source.id}</strong>
                    <span>{groupLabels[source.group]}</span>
                    <time dateTime={source.date}>{displayDate(source.date)}</time>
                  </div>
                  <h3 id={`${controlId}-source-${source.id}`}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <span>{source.title}</span>
                      <ArrowUpRight size={16} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
                    </a>
                  </h3>
                  <blockquote cite={source.url}>“{source.quote}”</blockquote>
                  <p className="evidence-ledger-source-type">{source.kind} · Date: {source.dateScope}</p>
                  <details className="evidence-ledger-record-detail">
                    <summary>
                      <span>Task use and limits</span>
                      <ChevronDown size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                    </summary>
                    <div>
                      <p><strong>Task rule.</strong> {source.change}</p>
                      <div className="evidence-ledger-task-links" aria-label={`Tasks linked to source ${source.id}`}>
                        {source.taskIds.map((taskId) => {
                          if (taskId === "all") return <span key={taskId}>Applies to all task briefs</span>;
                          const task = items.find((item) => item.id === taskId && item.kind === "task");
                          return task ? (
                            <button type="button" key={taskId} onClick={() => onSelect(taskId)}>
                              {task.title}
                              <ArrowUpRight size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                            </button>
                          ) : <span key={taskId}>Task reference: {taskId} (not in this draft)</span>;
                        })}
                      </div>
                      <p><strong>Limit.</strong> {source.limit}</p>
                    </div>
                  </details>
                </article>
              </li>
            ))}
          </ol>
          {filtered.length === 0 && (
            <p className="evidence-ledger-empty">No source matches these filters. Change the search or clear the filters.</p>
          )}
        </div>
      </details>
    </section>
  );
}
