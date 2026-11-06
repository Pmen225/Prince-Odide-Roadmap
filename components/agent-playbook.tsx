"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronRight, Clipboard, Clock3, LockKeyhole } from "lucide-react";
import { buildAgentBrief, buildEndToEndBrief, closedParentItems, getPlaybook, hasTaskChanges, playbookReviewDate, playbooks, resources, runRules } from "@/lib/agent-playbooks";
import { isVerified, type WorkItem } from "@/lib/work-model";

type AgentPlaybookProps = {
  item: WorkItem;
  items: WorkItem[];
  onSelect: (id: string) => void;
  onReviewProof: () => void;
};

type CopyState = { status: "idle" | "copying" | "copied" | "failed"; text: string };

/** Instructions are read-only. Opening or copying them never changes task state. */
export function AgentPlaybook({ item, items, onSelect, onReviewProof }: AgentPlaybookProps) {
  const id = useId();
  const book = getPlaybook(item.id);
  const brief = useMemo(() => buildAgentBrief(item, items), [item, items]);
  const workflowBrief = useMemo(() => buildEndToEndBrief(items), [items]);
  const [copy, setCopy] = useState<CopyState>({ status: "idle", text: "" });
  const [workflowCopy, setWorkflowCopy] = useState<CopyState>({ status: "idle", text: "" });
  const [showBrief, setShowBrief] = useState(false);
  const [showWorkflowText, setShowWorkflowText] = useState(false);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const workflowBriefRef = useRef<HTMLTextAreaElement>(null);
  const currentCopy = copy.text === brief ? copy.status : "idle";
  const currentWorkflowCopy = workflowCopy.text === workflowBrief ? workflowCopy.status : "idle";
  const workflowTasks = playbooks.map((entry) => items.find((task) => task.id === entry.taskId)).filter((task): task is WorkItem => Boolean(task));
  const missingWorkflowCount = playbooks.length - workflowTasks.length;
  const changedWorkflowCount = workflowTasks.filter(hasTaskChanges).length;
  const closedWorkflowCount = workflowTasks.filter((task) => ["done", "cancelled", "archived"].includes(task.status)).length;
  const closedParentWorkflowCount = workflowTasks.filter((task) => closedParentItems(task, items).length > 0).length;
  const closed = ["done", "cancelled", "archived"].includes(item.status);
  const closedParents = closedParentItems(item, items);
  const referenceOnly = closed || closedParents.length > 0;
  const changed = hasTaskChanges(item);
  const prerequisites = item.dependsOn.map((dependencyId) => {
    const dependency = items.find((candidate) => candidate.id === dependencyId);
    return { id: dependencyId, item: dependency, verified: dependency ? isVerified(dependency, items) : false };
  });
  const blocked = prerequisites.some((dependency) => !dependency.verified);

  useEffect(() => {
    if (currentCopy === "failed" && showBrief) {
      briefRef.current?.focus();
      briefRef.current?.select();
    }
  }, [currentCopy, showBrief]);

  useEffect(() => {
    if (currentWorkflowCopy === "failed" && showWorkflowText) {
      workflowBriefRef.current?.focus();
      workflowBriefRef.current?.select();
    }
  }, [currentWorkflowCopy, showWorkflowText]);

  async function copyBrief() {
    const text = brief;
    setCopy({ status: "copying", text });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopy({ status: "copied", text });
    } catch {
      setCopy({ status: "failed", text });
      setShowBrief(true);
    }
  }

  async function copyWorkflowBrief() {
    const text = workflowBrief;
    setWorkflowCopy({ status: "copying", text });
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setWorkflowCopy({ status: "copied", text });
    } catch {
      setWorkflowCopy({ status: "failed", text });
      setShowWorkflowText(true);
    }
  }

  if (!book) return null;

  return (
    <div className="agent-playbook">
      <header className="agent-handoff-header">
        <div className="agent-handoff-meta">
          <span><Clock3 size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" /> {book.minutes}-minute work block</span>
          <span>Preparation and checks</span>
        </div>
        <h3>Give your agent the full instructions</h3>
        <p>{book.role}</p>
        <button className="button-primary agent-copy-button" type="button" onClick={copyBrief} disabled={currentCopy === "copying"} aria-describedby={`${id}-copy-help ${id}-copy-status`}>
          <Clipboard size={16} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
          {currentCopy === "copying" ? "Copying…" : currentCopy === "copied" ? "Copied agent brief" : "Copy agent brief"}
        </button>
        <p id={`${id}-copy-help`} className="agent-note">Paste into your agent. No agent starts here. Access and approvals are still required.</p>
        <p id={`${id}-copy-status`} className="agent-copy-status" role="status" aria-live="polite">
          {currentCopy === "copied" && "Copied. No task, message or payment was changed."}
          {currentCopy === "failed" && "Not copied. Select the full text below and copy it manually."}
        </p>
        <details className="agent-section agent-workflow-brief">
          <summary><span>Full workflow <small>{workflowTasks.length} task briefs</small></span><ChevronRight size={16} aria-hidden="true" /></summary>
          <div className="agent-section-body">
            <p className="agent-note" id={`${id}-workflow-help`}>One handover, from buyer replies to received payment and repeat work. No agent is running. Run only the next ready task. Access and human approvals still apply.</p>
            {(missingWorkflowCount > 0 || changedWorkflowCount > 0 || closedWorkflowCount > 0 || closedParentWorkflowCount > 0) && (
              <div className="agent-workflow-warnings" aria-label="Current workflow checks">
                {missingWorkflowCount > 0 && <p><strong>{missingWorkflowCount} of {playbooks.length} tasks missing.</strong> Only available tasks are included. Deleted tasks are not restored.</p>}
                {changedWorkflowCount > 0 && <p><strong>{changedWorkflowCount} edited {changedWorkflowCount === 1 ? "task" : "tasks"}.</strong> The brief includes current task data and change warnings. Reconcile the reference instructions before acting.</p>}
                {closedWorkflowCount > 0 && <p><strong>{closedWorkflowCount} closed {closedWorkflowCount === 1 ? "task" : "tasks"}.</strong> Kept as reference. Do not run closed work again without new instructions.</p>}
                {closedParentWorkflowCount > 0 && <p><strong>{closedParentWorkflowCount} {closedParentWorkflowCount === 1 ? "task has" : "tasks have"} closed parent work.</strong> Reference only. Do not resume a closed project or its tasks without a new explicit instruction.</p>}
              </div>
            )}
            <button className="button-secondary" type="button" onClick={copyWorkflowBrief} disabled={currentWorkflowCopy === "copying"} aria-describedby={`${id}-workflow-help ${id}-workflow-copy-status`}>
              <Clipboard size={15} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
              {currentWorkflowCopy === "copying" ? "Copying…" : currentWorkflowCopy === "copied" ? "Copied workflow brief" : missingWorkflowCount ? `Copy ${workflowTasks.length} available task briefs` : `Copy all ${playbooks.length} task briefs`}
            </button>
            <p id={`${id}-workflow-copy-status`} className="agent-copy-status" role="status" aria-live="polite">
              {currentWorkflowCopy === "copied" && "Copied. No agent started. No task, message or payment was changed."}
              {currentWorkflowCopy === "failed" && "Not copied. Select the full workflow text below and copy it manually."}
            </p>
            <details className="agent-section agent-workflow-text" open={showWorkflowText} onToggle={(event) => setShowWorkflowText(event.currentTarget.open)}>
              <summary><span>Read or select the full workflow brief</span><ChevronRight size={16} aria-hidden="true" /></summary>
              <div className="agent-section-body">
                <label className="field-label" htmlFor={`${id}-workflow-brief`}>Complete end-to-end instructions</label>
                <textarea id={`${id}-workflow-brief`} className="field-textarea agent-brief-text" ref={workflowBriefRef} value={workflowBrief} readOnly rows={14} spellCheck={false} />
                <button className="button-secondary" type="button" onClick={() => { workflowBriefRef.current?.focus(); workflowBriefRef.current?.select(); }}>Select full workflow brief</button>
                <p className="agent-note">Selecting text does not copy it. Use your device’s Copy command.</p>
              </div>
            </details>
          </div>
        </details>
      </header>

      {(referenceOnly || changed || blocked) && (
        <div className="agent-guardrails" aria-label="Check before using this brief">
          {closed && <p><strong>Closed task.</strong> Review its proof. Do not run it again without new instructions.</p>}
          {closedParents.length > 0 && <p><strong>Closed parent work.</strong> {closedParents.map((parent) => `${parent.title} (${parent.status})`).join("; ")}. Reference only. Do not resume this work without a new explicit instruction.</p>}
          {changed && <p><strong>This task was edited.</strong> Your current task is the specification. Compare it with these reference steps before acting.</p>}
          {blocked && <p><strong>Earlier work is not verified.</strong> {referenceOnly ? "These instructions do not reopen the work." : "Check inputs or prepare drafts only. Do not claim this task is ready."}</p>}
        </div>
      )}

      <section className="agent-procedure" aria-labelledby={`${id}-procedure`}>
        <h3 id={`${id}-procedure`}>{referenceOnly ? "Reference instructions" : "Do this in order"}</h3>
        <p className="agent-note">Open one instruction at a time. These are not completion boxes.</p>
        <ol className="agent-procedure-list">
          {book.procedure.map((instruction, index) => (
            <li key={`${item.id}-${index}`}>
              <details className="agent-instruction" open={openStep === index} onToggle={(event) => {
                if (event.currentTarget.open) setOpenStep(index);
                else setOpenStep((current) => current === index ? null : current);
              }}>
                <summary>
                  <span className="agent-step-number" aria-hidden="true">{index + 1}</span>
                  <span><span className="sr-only">Instruction {index + 1}: </span>{instruction.title}</span>
                  <ChevronRight size={15} strokeWidth={2} absoluteStrokeWidth aria-hidden="true" />
                </summary>
                <div className="agent-instruction-body">
                  <p className="agent-tool"><strong>Use</strong> {instruction.tool}</p>
                  <ol className="agent-action-list">{instruction.actions.map((action, actionIndex) => <li key={actionIndex}>{action}</li>)}</ol>
                  <div className="agent-step-check"><strong>Check before the next instruction</strong><p>{instruction.check}</p></div>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <details className="agent-section">
        <summary><span>Current task and earlier work</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <dl className="agent-facts">
            <div><dt>Task</dt><dd>{item.title}</dd></div>
            <div><dt>Planned owner</dt><dd>{item.owner}</dd></div>
            <div><dt>Current state</dt><dd>{item.status.replaceAll("-", " ")} · {item.approved ? "in your plan" : "not approved"}</dd></div>
            <div><dt>Required result</dt><dd>{item.acceptance || "Not defined. Stop and define the result first."}</dd></div>
          </dl>
          <h4>Current checklist</h4>
          {item.steps.length ? <ul className="agent-list">{item.steps.map((step) => <li key={step.id}>{step.done ? "Checked: " : "Not checked: "}{step.text}</li>)}</ul> : <p>No checklist steps exist.</p>}
          <h4>Linked earlier tasks</h4>
          {prerequisites.length ? <ul className="agent-dependency-list">{prerequisites.map((dependency) => <li key={dependency.id}>
            <button className="agent-task-link" type="button" onClick={() => onSelect(dependency.id)} disabled={!dependency.item}>
              <LockKeyhole size={14} aria-hidden="true" />
              <span>{dependency.item?.title ?? `Missing task: ${dependency.id}`}<small>{dependency.verified ? "Proof verified" : "Not verified"}</small></span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </li>)}</ul> : <p>No linked prerequisite. Required facts and permissions still apply.</p>}
        </div>
      </details>

      <details className="agent-section">
        <summary><span>Inputs and start conditions</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <dl className="agent-facts">
            <div><dt>Start when</dt><dd>{book.trigger}</dd></div>
            <div><dt>First action</dt><dd>{book.start}</dd></div>
            <div><dt>Time limit</dt><dd>Use a {book.minutes}-minute work block. Save your last verified step if unfinished. This is not a promised response or delivery time.</dd></div>
          </dl>
          <h4>Required inputs</h4>
          <ul className="agent-list">{book.inputs.map((input) => <li key={input}>{input}</li>)}</ul>
        </div>
      </details>

      <details className="agent-section">
        <summary><span>Where to find the records <small>{book.resources.length}</small></span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <p className="agent-note">These are lookup instructions, not connected accounts. Resolve them before execution.</p>
          {book.resources.map((resourceId) => {
            const resource = resources.find((entry) => entry.id === resourceId);
            if (!resource) return <p key={resourceId}>Missing resource instructions: {resourceId}. Stop and resolve this.</p>;
            return <section className="agent-resource" key={resource.id}>
              <h4>{resource.name}</h4>
              <dl className="agent-facts">
                <div><dt>Find</dt><dd>{resource.locate}</dd></div>
                <div><dt>Verify</dt><dd>{resource.check}</dd></div>
                <div><dt>If missing</dt><dd>{resource.missing}</dd></div>
              </dl>
            </section>;
          })}
        </div>
      </details>

      <details className="agent-section">
        <summary><span>If this happens, do this</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          {book.decisions.map((decision, index) => {
            const next = decision.nextId ? items.find((candidate) => candidate.id === decision.nextId) : undefined;
            return <section className="agent-decision" key={index}>
              <h4>If: {decision.when}</h4>
              <p>{decision.action}</p>
              {decision.nextId && <button className="agent-task-link" type="button" onClick={() => next && onSelect(next.id)} disabled={!next}>
                <span>{next ? next.title : "Next task is not in this plan"}<small>{next ? "Open task. Does not start work." : decision.nextId}</small></span>
                <ArrowRight size={15} aria-hidden="true" />
              </button>}
            </section>;
          })}
        </div>
      </details>

      <details className="agent-section">
        <summary><span>What the agent must return</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <p>Result name: <code>{book.output.name}</code></p>
          <ul className="agent-list agent-output-fields">{book.output.fields.map((field) => <li key={field}><code>{field}</code></li>)}</ul>
          <p className="agent-note">Also return the run state, checked time, evidence links, changes, blockers, next owner and next action. Use null for unknown values. Save to an existing record only with write permission.</p>
        </div>
      </details>

      <details className="agent-section">
        <summary><span>Proof needed to finish</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <ul className="agent-list">{book.done.map((check) => <li key={check}>{check}</li>)}</ul>
          <p className="agent-note">A written summary is not proof of execution. Open the actual record and check it.</p>
          <button className="button-secondary" type="button" onClick={onReviewProof}>Open proof review <ArrowRight size={15} aria-hidden="true" /></button>
        </div>
      </details>

      <details className="agent-section">
        <summary><span>Human approval and recovery</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <dl className="agent-facts">
            <div><dt>Human approval</dt><dd>{book.humanGate}</dd></div>
            <div><dt>If the task fails</dt><dd>{book.recovery}</dd></div>
          </dl>
          <h4>Execution limits</h4>
          <ol className="agent-action-list">{runRules.map((rule) => <li key={rule}>{rule}</li>)}</ol>
        </div>
      </details>

      <details className="agent-section agent-example">
        <summary><span>Worked example <small>Illustration only</small></span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <p className="agent-note">ILLUSTRATION ONLY. Not a customer record. Does not change progress.</p>
          <dl className="agent-facts">
            <div><dt>Input</dt><dd>{book.example.input}</dd></div>
            <div><dt>Action</dt><dd>{book.example.action}</dd></div>
            <div><dt>Result</dt><dd>{book.example.result}</dd></div>
          </dl>
        </div>
      </details>

      <details className="agent-section">
        <summary><span>Method and review date</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body"><p>{book.method}</p><p className="agent-note">Procedure reviewed: {playbookReviewDate}. Recheck live records when the agent runs.</p></div>
      </details>

      <details className="agent-section agent-full-brief" open={showBrief} onToggle={(event) => setShowBrief(event.currentTarget.open)}>
        <summary><span>Full copyable brief</span><ChevronRight size={16} aria-hidden="true" /></summary>
        <div className="agent-section-body">
          <label className="field-label" htmlFor={`${id}-brief`}>Complete instructions for {item.title}</label>
          <textarea id={`${id}-brief`} className="field-textarea agent-brief-text" ref={briefRef} value={brief} readOnly rows={14} spellCheck={false} />
          <button className="button-secondary" type="button" onClick={() => { briefRef.current?.focus(); briefRef.current?.select(); }}>Select full brief</button>
          <p className="agent-note">Selecting text does not copy it. Use your device’s Copy command.</p>
        </div>
      </details>
    </div>
  );
}
