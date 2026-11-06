"use client";

import { ArrowRight, ChevronDown, GitBranch, LockKeyhole } from "lucide-react";
import { getAncestors, getBlockers, type WorkItem } from "@/lib/work-model";

type StartViewProps = {
  items: WorkItem[];
  focus: WorkItem[];
  onSelect: (id: string) => void;
  onMap: () => void;
};

/** One entry point. The rest of the plan remains available, not competing. */
export function StartView({ items, focus, onSelect, onMap }: StartViewProps) {
  const current = focus[0];
  const goal = items.find((item) => item.kind === "goal" && !item.parentId);
  const blocked = items.filter(
    (item) => item.kind === "task" && item.approved &&
      !["done", "archived", "cancelled"].includes(item.status) &&
      !getAncestors(item.id, items).some((parent) => ["archived", "cancelled"].includes(parent.status)) &&
      getBlockers(item, items).length > 0,
  );
  const firstBlocker = blocked[0] ? getBlockers(blocked[0], items)[0] : undefined;
  const nextStep = current?.steps.find((step) => !step.done);
  const remaining = focus.slice(1);
  const context = current
    ? getAncestors(current.id, items).find((item) => item.kind === "milestone")
    : undefined;

  return (
    <main className="start-view" id="main-content">
      <div className="start-content">
        <header className="start-heading">
          <h1>Start here<span>.</span></h1>
          <p>One task at a time. Open the roadmap when you need the full picture.</p>
        </header>
        {current ? (
          <section className="next-task" aria-labelledby="next-task-title">
            <div className="next-task-status">
              <span className="focus-indicator" aria-hidden="true" />
              {current.approved
                ? current.status === "done" ? "Reported done · Proof needs checking" : current.status === "in-progress" ? "Continue this task" : "Ready to start"
                : current.origin === "proposal" ? "AI suggestion · Not approved" : "Your draft · Not approved"}
            </div>
            <h2 id="next-task-title">{current.title}</h2>
            <p className="next-task-why">{current.why}</p>
            {nextStep && (
              <div className="next-step-preview">
                <span>First unfinished step</span>
                <p>{nextStep.text}</p>
              </div>
            )}
            <div className="next-task-action">
              <button className="button-primary focus-primary" onClick={() => onSelect(current.id)}>
                {current.approved && current.status !== "done" ? "Open this task" : "Review this task"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              {!current.approved && <small>Review first. Nothing starts automatically.</small>}
            </div>
          </section>
        ) : (
          <section className={`next-task ${firstBlocker ? "next-task-waiting" : "next-task-empty"}`}>
            {firstBlocker ? (
              <>
                <div className="next-task-status"><LockKeyhole size={15} /> Work is waiting</div>
                <h2>Clear this first.</h2>
                <p className="next-task-why">{blocked[0].title} needs this task to be complete:</p>
                <div className="next-step-preview"><p>{firstBlocker.title}</p></div>
                <button className="button-primary focus-primary" onClick={() => onSelect(firstBlocker.id)}>
                  Open the required task <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                <h2>No ready task.</h2>
                <p className="next-task-why">Open the roadmap to review your plan or add a task.</p>
                <button className="button-primary focus-primary" onClick={onMap}>
                  Open roadmap <ArrowRight size={18} />
                </button>
              </>
            )}
          </section>
        )}
        {current && context && (
          <div className="task-context">
            <span>This task helps you</span>
            <p>{context.title.charAt(0).toLowerCase() + context.title.slice(1)}</p>
          </div>
        )}
        <div className="start-secondary">
          {remaining.length > 0 && (
            <details className="other-tasks">
              <summary>Choose a different task <ChevronDown size={16} aria-hidden="true" /></summary>
              <div>
                {remaining.map((item) => (
                  <button key={item.id} onClick={() => onSelect(item.id)}>
                    <span>{item.title}</span><ArrowRight size={16} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </details>
          )}
          <button className="open-map-link" onClick={onMap}>
            <GitBranch size={17} aria-hidden="true" /> See how the work connects <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        {goal && (
          <footer className="start-goal">
            <span>The goal</span>
            <p>{goal.title}</p>
          </footer>
        )}
      </div>
    </main>
  );
}
