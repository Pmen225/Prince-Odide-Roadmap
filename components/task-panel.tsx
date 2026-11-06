"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronRight,
  Circle,
  FileCheck2,
  GitBranch,
  Link2,
  ListChecks,
  LockKeyhole,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  getBlockers,
  getChildren,
  isVerified,
  type WorkItem,
} from "@/lib/work-model";

type TaskPanelProps = {
  item: WorkItem;
  items: WorkItem[];
  onUpdate: (id: string, patch: Partial<WorkItem>) => boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
  onAddChild: (parentId: string) => void;
};

type PanelTab = "overview" | "steps" | "evidence";

const tabs: { id: PanelTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "steps", label: "Steps" },
  { id: "evidence", label: "Proof" },
];

const businessLabels: Record<WorkItem["business"], string> = {
  group: "ODIDE Group",
  itad: "ODIDE ITAD",
  "device-care": "ODIDE Device Care",
};

const statusLabels: Record<WorkItem["status"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  done: "Complete",
  cancelled: "Cancelled",
  archived: "Archived",
};

/** Reset transient editors when the selected work item changes. */
export function TaskPanel(props: TaskPanelProps) {
  return <TaskPanelContent key={props.item.id} {...props} />;
}

function TaskPanelContent({
  item,
  items,
  onUpdate,
  onSelect,
  onClose,
  onAddChild,
}: TaskPanelProps) {
  const panelId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [activeTab, setActiveTab] = useState<PanelTab>("overview");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(item.title);
  const [whyDraft, setWhyDraft] = useState<string | null>(null);
  const [acceptanceDraft, setAcceptanceDraft] = useState<string | null>(null);
  const [stepText, setStepText] = useState("");
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [formError, setFormError] = useState("");
  const children = getChildren(item.id, items);
  const blockers = getBlockers(item, items);
  const verified = isVerified(item, items);
  const stepsDone = item.steps.filter((step) => step.done).length;
  const nextStepIndex = item.steps.findIndex((step) => !step.done);
  const nextStep = item.steps[nextStepIndex];
  const inactive = item.status === "archived" || item.status === "cancelled";
  const acceptedEvidence = item.evidence.filter(
    (proof) => proof.accepted,
  ).length;
  const availableDependencies = items.filter(
    (candidate) =>
      candidate.id !== item.id &&
      !item.dependsOn.includes(candidate.id) &&
      candidate.status !== "archived" &&
      candidate.status !== "cancelled",
  );

  useEffect(() => {
    // The keyed panel mounts for a newly selected task, not for field edits.
    // Move focus from the old trigger without shifting the map or page.
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  function saveTitle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = titleDraft.trim();
    if (!title) return;
    if (onUpdate(item.id, { title })) setEditingTitle(false);
  }

  function saveWhy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (whyDraft !== null && onUpdate(item.id, { why: whyDraft.trim() }))
      setWhyDraft(null);
  }

  function saveAcceptance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      acceptanceDraft !== null &&
      onUpdate(item.id, { acceptance: acceptanceDraft.trim() })
    )
      setAcceptanceDraft(null);
  }

  function addStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = stepText.trim();
    if (!text) return;
    if (
      onUpdate(item.id, {
        steps: [...item.steps, { id: crypto.randomUUID(), text, done: false }],
      })
    )
      setStepText("");
  }

  function addEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const title = evidenceTitle.trim();
    const url = evidenceUrl.trim();
    if (!title || !url) {
      setFormError("Add a title and a link to the finished work.");
      return;
    }
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:")
        throw new Error("Invalid protocol");
    } catch {
      setFormError("Enter a full link that starts with https:// or http://.");
      return;
    }
    if (
      onUpdate(item.id, {
        evidence: [
          ...item.evidence,
          {
            id: crypto.randomUUID(),
            title,
            url,
            accepted: false,
            addedAt: new Date().toISOString(),
          },
        ],
      })
    ) {
      setEvidenceTitle("");
      setEvidenceUrl("");
    }
  }

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    const nextButton =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        "[role='tab']",
      )[nextIndex];
    nextButton?.focus();
  }

  function openTab(tab: PanelTab) {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      document.getElementById(`${panelId}-tab-${tab}`)?.focus();
    });
  }

  return (
    <aside className="task-panel" aria-labelledby={`${panelId}-heading`}>
      <div className="panel-top">
        <span className="eyebrow">
          {businessLabels[item.business]} <span aria-hidden="true">/</span>{" "}
          {item.kind}
        </span>
        <button
          className="icon-button"
          type="button"
          onClick={onClose}
          aria-label="Close details"
          title="Close details"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>

      {editingTitle ? (
        <form className="panel-title-editor" onSubmit={saveTitle}>
          <h2
            id={`${panelId}-heading`}
            ref={headingRef}
            tabIndex={-1}
            className="sr-only"
          >
            Edit {item.title}
          </h2>
          <label className="field-label" htmlFor={`${panelId}-title`}>
            Title
          </label>
          <input
            id={`${panelId}-title`}
            className="field-input"
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            maxLength={180}
            autoFocus
            required
          />
          <div className="form-row">
            <button
              className="button-secondary"
              type="submit"
              disabled={!titleDraft.trim()}
            >
              <Check size={14} aria-hidden="true" /> Save
            </button>
            <button
              className="button-quiet"
              type="button"
              onClick={() => setEditingTitle(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="panel-title-row">
          <h2
            id={`${panelId}-heading`}
            ref={headingRef}
            tabIndex={-1}
            className="panel-title"
          >
            {item.title}
          </h2>
        </div>
      )}

      <div className="panel-tags">
        {!item.approved ? (
          <span className="panel-proposal-label">
            {item.origin === "proposal" ? "Suggested by AI" : "Your draft"}
            <span aria-hidden="true"> · </span>Not approved
          </span>
        ) : (
          <span className={`status-pill status-${verified ? "verified" : item.status}`}>
            {verified ? <ShieldCheck size={13} aria-hidden="true" /> : <Circle size={10} aria-hidden="true" />}
            {verified ? "Done · proof checked" : statusLabels[item.status]}
          </span>
        )}
        {item.approved && blockers.length > 0 && (
          <span className="panel-blocked-label">
            <LockKeyhole size={12} aria-hidden="true" />
            Waiting on {blockers.length} {blockers.length === 1 ? "task" : "tasks"}
          </span>
        )}
      </div>

      <div
        className="panel-tabs"
        role="tablist"
        aria-label="Work item information"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`${panelId}-tab-${tab.id}`}
            type="button"
            role="tab"
            className={activeTab === tab.id ? "tab-active" : ""}
            aria-selected={activeTab === tab.id}
            aria-controls={`${panelId}-content-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            {tab.label}
            {tab.id === "steps" && item.steps.length > 0 && (
              <span className="tab-count">{item.steps.length}</span>
            )}
            {tab.id === "evidence" && item.evidence.length > 0 && (
              <span className="tab-count">{item.evidence.length}</span>
            )}
          </button>
        ))}
      </div>

      <div
        className="panel-body"
        id={`${panelId}-content-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${activeTab}`}
        tabIndex={0}
      >
        {activeTab === "overview" && (
          <>
            <section
              className={`panel-next-action ${blockers.length > 0 && !inactive ? "has-blockers" : ""} ${verified ? "is-verified" : ""} ${inactive ? "is-inactive" : ""}`}
              aria-labelledby={`${panelId}-next-step`}
            >
              <div className="panel-next-heading">
                <h3 id={`${panelId}-next-step`}>
                  {inactive
                    ? "This task is closed"
                    : verified
                      ? "Done, with proof"
                      : blockers.length > 0
                        ? "Do these first"
                        : !item.approved
                          ? "First step, if you approve"
                          : nextStep
                            ? "Your next step"
                            : "Check the finished work"}
                </h3>
                {!inactive && !verified && blockers.length === 0 && nextStep && (
                  <span>Step {nextStepIndex + 1} of {item.steps.length}</span>
                )}
              </div>
              {inactive ? (
                <p>This {item.kind} is {item.status}. Its notes and proof are still here.</p>
              ) : verified ? (
                <>
                  <p>The steps are complete and the proof has been checked.</p>
                  <button className="panel-step-link" type="button" onClick={() => openTab("evidence")}>
                    View proof <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </>
              ) : blockers.length > 0 ? (
                <>
                  <p>This task waits for the work below.</p>
                  <div className="panel-blocker-list">
                    {blockers.map((blocker) => (
                      <button className="panel-blocker-link" type="button" key={blocker.id} onClick={() => onSelect(blocker.id)}>
                        <LockKeyhole size={14} aria-hidden="true" />
                        <span>{blocker.title}</span>
                        <ChevronRight size={16} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <button className="panel-step-link" type="button" onClick={() => openTab("steps")}>
                    See this task’s steps <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </>
              ) : (
                <>
                  <p>{nextStep?.text ?? (item.steps.length ? "The steps are checked. Add a link to the result, then review it." : "Add the first action this task needs.")}</p>
                  <button className="panel-step-link" type="button" onClick={() => openTab(nextStep || !item.steps.length ? "steps" : "evidence")}>
                    {nextStep ? "See all steps" : item.steps.length ? "Review proof" : "Add a step"}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </>
              )}
            </section>

            <dl className="panel-task-context">
              <div>
                <dt>Why this task</dt>
                <dd>{item.why || "No reason has been added. Open Task settings to add one."}</dd>
              </div>
              <div>
                <dt>What you will have</dt>
                <dd>{item.acceptance || "The finished result has not been defined. Open Task settings to add it."}</dd>
              </div>
            </dl>

            {children.length > 0 && (
              <section className="panel-included-work" aria-labelledby={`${panelId}-included-work`}>
                <h3 id={`${panelId}-included-work`}>Work inside this {item.kind}</h3>
                {children.map((child) => (
                  <button className="related-item" key={child.id} type="button" onClick={() => onSelect(child.id)}>
                    <span className={`related-icon ${isVerified(child, items) ? "proof-checked" : ""}`}>
                      {isVerified(child, items) ? <CheckCheck size={15} aria-hidden="true" /> : <Circle size={11} aria-hidden="true" />}
                    </span>
                    <span>{child.title}</span>
                    <ChevronRight size={15} aria-hidden="true" />
                  </button>
                ))}
              </section>
            )}

            <details className="panel-disclosure">
              <summary>
                <span>Task settings</span>
                <ChevronRight size={16} aria-hidden="true" />
              </summary>
              <div className="panel-disclosure-content">
                <p className="small-text">Change the wording, owner or task connections.</p>
                <button className="button-secondary panel-edit-title" type="button" onClick={() => { setTitleDraft(item.title); setEditingTitle(true); }}>
                  <Pencil size={14} aria-hidden="true" /> Edit task name
                </button>
                <section className="detail-section">
                  <div className="section-heading-row">
                    <h3 className="section-label">Why this task</h3>
                    {whyDraft === null && (
                      <button
                        className="button-quiet"
                        type="button"
                        aria-label="Edit why this task"
                        onClick={() => setWhyDraft(item.why)}
                      >
                        <Pencil size={12} aria-hidden="true" /> Edit
                      </button>
                    )}
                  </div>
                  {whyDraft === null ? (
                    <p className="detail-copy">
                      {item.why || "No reason has been added yet."}
                    </p>
                  ) : (
                    <form className="detail-editor" onSubmit={saveWhy}>
                      <label className="field-label" htmlFor={`${panelId}-why`}>
                        Reason
                      </label>
                      <textarea
                        id={`${panelId}-why`}
                        className="field-textarea"
                        rows={4}
                        value={whyDraft}
                        onChange={(event) => setWhyDraft(event.target.value)}
                        autoFocus
                        required
                      />
                      <div className="form-row">
                        <button
                          className="button-secondary"
                          type="submit"
                          aria-label="Save why this task"
                          disabled={!whyDraft.trim()}
                        >
                          <Check size={14} aria-hidden="true" /> Save
                        </button>
                        <button
                          className="button-quiet"
                          type="button"
                          onClick={() => setWhyDraft(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </section>

                <section className="detail-section" aria-label="Item properties">
                  <div className="field-row">
                    <label className="field-label" htmlFor={`${panelId}-owner`}>
                      Who does the work
                    </label>
                    <select
                      id={`${panelId}-owner`}
                      className="field-select"
                      value={item.owner}
                      onChange={(event) =>
                        onUpdate(item.id, {
                          owner: event.target.value as WorkItem["owner"],
                        })
                      }
                    >
                      {["Junior", "Agent", "Unassigned", "Review needed"].map(
                        (owner) => (
                          <option key={owner} value={owner}>
                            {owner}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="field-row">
                    <label className="field-label" htmlFor={`${panelId}-priority`}>
                      Priority
                    </label>
                    <select
                      id={`${panelId}-priority`}
                      className="field-select"
                      value={item.priority}
                      onChange={(event) =>
                        onUpdate(item.id, {
                          priority: Number(
                            event.target.value,
                          ) as WorkItem["priority"],
                        })
                      }
                    >
                      <option value={1}>High</option>
                      <option value={2}>Normal</option>
                      <option value={3}>Low</option>
                    </select>
                  </div>
                  <div className="field-row">
                    <label className="field-label" htmlFor={`${panelId}-parent`}>
                      Part of
                    </label>
                    <select
                      id={`${panelId}-parent`}
                      className="field-select"
                      value={item.parentId ?? ""}
                      onChange={(event) =>
                        onUpdate(item.id, {
                          parentId: event.target.value || undefined,
                        })
                      }
                    >
                      <option value="">Separate task</option>
                      {items
                        .filter((candidate) => candidate.id !== item.id)
                        .map((candidate) => (
                          <option key={candidate.id} value={candidate.id}>
                            {candidate.title}
                          </option>
                        ))}
                    </select>
                  </div>
                  {item.owner === "Agent" && (
                    <p className="small-text">Agent is a planned owner. No agent is running.</p>
                  )}
                </section>

                <section className="detail-section">
                  <h3 className="section-label">
                    <GitBranch size={13} aria-hidden="true" /> Needs these tasks{" "}
                    <span>{item.dependsOn.length}</span>
                  </h3>
                  {item.dependsOn.length === 0 && (
                    <p className="empty-message">
                      No earlier task is linked.
                    </p>
                  )}
                  {item.dependsOn.map((id) => {
                    const dependency = items.find(
                      (candidate) => candidate.id === id,
                    );
                    const complete = dependency
                      ? isVerified(dependency, items)
                      : false;
                    return (
                      <div className="related-row" key={id}>
                        <button
                          className="related-item"
                          type="button"
                          onClick={() => onSelect(id)}
                          disabled={!dependency}
                        >
                          <span className="related-icon">
                            {complete ? (
                              <CheckCheck size={14} aria-hidden="true" />
                            ) : (
                              <Circle size={13} aria-hidden="true" />
                            )}
                          </span>
                          <span>{dependency?.title ?? "Missing task"}</span>
                          <ChevronRight size={13} aria-hidden="true" />
                        </button>
                        <button
                          className="icon-button"
                          type="button"
                          aria-label={`Remove task connection: ${dependency?.title ?? id}`}
                          title="Remove task connection"
                          onClick={() =>
                            onUpdate(item.id, {
                              dependsOn: item.dependsOn.filter(
                                (candidate) => candidate !== id,
                              ),
                            })
                          }
                        >
                          <X size={13} aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                  {availableDependencies.length > 0 && (
                    <label className="field-label dependency-add">
                      <span className="sr-only">Add a task that must finish first</span>
                      <select
                        className="field-select"
                        value=""
                        onChange={(event) => {
                          if (event.target.value)
                            onUpdate(item.id, {
                              dependsOn: [...item.dependsOn, event.target.value],
                            });
                        }}
                      >
                        <option value="">+ Add an earlier task</option>
                        {availableDependencies.map((candidate) => (
                          <option key={candidate.id} value={candidate.id}>
                            {candidate.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </section>

                <section className="detail-section">
                  <div className="section-heading-row">
                    <h3 className="section-label">
                      <FileCheck2 size={13} aria-hidden="true" /> Finished result
                    </h3>
                    {acceptanceDraft === null && (
                      <button
                        className="button-quiet"
                        type="button"
                        aria-label="Edit finished result"
                        onClick={() => setAcceptanceDraft(item.acceptance)}
                      >
                        <Pencil size={12} aria-hidden="true" /> Edit
                      </button>
                    )}
                  </div>
                  {acceptanceDraft === null ? (
                    <p className="detail-copy">
                      {item.acceptance ||
                        "Describe the finished result before marking this task done."}
                    </p>
                  ) : (
                    <form className="detail-editor" onSubmit={saveAcceptance}>
                      <label
                        className="field-label"
                        htmlFor={`${panelId}-acceptance`}
                      >
                        What must be ready
                      </label>
                      <textarea
                        id={`${panelId}-acceptance`}
                        className="field-textarea"
                        rows={4}
                        value={acceptanceDraft}
                        onChange={(event) => setAcceptanceDraft(event.target.value)}
                        autoFocus
                        required
                      />
                      <div className="form-row">
                        <button
                          className="button-secondary"
                          type="submit"
                          aria-label="Save finished result"
                          disabled={!acceptanceDraft.trim()}
                        >
                          <Check size={14} aria-hidden="true" /> Save
                        </button>
                        <button
                          className="button-quiet"
                          type="button"
                          onClick={() => setAcceptanceDraft(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </section>

                <section className="detail-section">
                  <div className="section-heading-row">
                    <h3 className="section-label">
                      <ListChecks size={13} aria-hidden="true" /> Work inside this{" "}
                      <span>{children.length}</span>
                    </h3>
                    <button
                      className="button-quiet"
                      type="button"
                      onClick={() => onAddChild(item.id)}
                    >
                      <Plus size={13} aria-hidden="true" /> Add a task
                    </button>
                  </div>
                  {children.length === 0 ? (
                    <p className="empty-message">No smaller tasks are linked inside this one.</p>
                  ) : (
                    children.map((child) => (
                      <button
                        className="related-item"
                        key={child.id}
                        type="button"
                        onClick={() => onSelect(child.id)}
                      >
                        <span className="related-icon">
                          {isVerified(child, items) ? (
                            <CheckCheck size={14} aria-hidden="true" />
                          ) : (
                            <Circle size={13} aria-hidden="true" />
                          )}
                        </span>
                        <span>{child.title}</span>
                        <ChevronRight size={13} aria-hidden="true" />
                      </button>
                    ))
                  )}
                  {children.length > 0 && (
                    <p className="small-text">
                      Finishing the smaller tasks is not enough. Check the finished
                      result and its proof too.
                    </p>
                  )}
                </section>

              </div>
            </details>

            <details className="panel-disclosure panel-guidance">
              <summary>
                <span>Where this task came from</span>
                <ChevronRight size={16} aria-hidden="true" />
              </summary>
              <div className="panel-disclosure-content">
                <p className="small-text">
                  {item.origin === "proposal"
                    ? "This task started as an AI suggestion for the roadmap. Check that the work is needed before you approve it."
                    : "This task was added to this workspace."}
                </p>
                {item.sources.length > 0 && (
                  <section className="detail-section">
                    <h3 className="section-label">
                      <Link2 size={13} aria-hidden="true" /> Guidance used
                    </h3>
                    {item.sources.map((source, index) => (
                      <a
                        className="source-link"
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        key={`${source.url}-${index}`}
                      >
                        <span>
                          {source.label}
                          {source.chapter && (
                            <span className="small-text"> · {source.chapter}</span>
                          )}
                        </span>
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    ))}
                  </section>
                )}
                <p className="small-text">Guidance explains the idea. It is not proof that the work is done.</p>
              </div>
            </details>
          </>
        )}

        {activeTab === "steps" && (
          <>
            <section className="detail-section">
              <h3 className="section-label">
                Steps to finish{" "}
                <span>
                  {stepsDone}/{item.steps.length}
                </span>
              </h3>
              <p className="small-text">
                Tick a step only when it is done. Add proof of the result before
                you finish the whole task.
              </p>
              {item.steps.length === 0 && (
                <p className="empty-message">
                  No steps yet. Add the first action below.
                </p>
              )}
              {item.steps.map((step) => (
                <div className="step-row" key={step.id}>
                  <label className="step-label">
                    <input
                      className="step-check"
                      type="checkbox"
                      checked={step.done}
                      onChange={(event) =>
                        onUpdate(item.id, {
                          steps: item.steps.map((current) =>
                            current.id === step.id
                              ? { ...current, done: event.target.checked }
                              : current,
                          ),
                        })
                      }
                    />
                    <span className={step.done ? "step-complete" : ""}>
                      {step.text}
                    </span>
                  </label>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={`Delete step: ${step.text}`}
                    title="Delete step"
                    onClick={() =>
                      onUpdate(item.id, {
                        steps: item.steps.filter(
                          (current) => current.id !== step.id,
                        ),
                      })
                    }
                  >
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </section>
            <form className="detail-section" onSubmit={addStep}>
              <label className="field-label" htmlFor={`${panelId}-new-step`}>
                Add a step
              </label>
              <div className="form-row">
                <input
                  id={`${panelId}-new-step`}
                  className="field-input"
                  placeholder="Describe the next action"
                  value={stepText}
                  onChange={(event) => setStepText(event.target.value)}
                  required
                  maxLength={500}
                />
                <button
                  className="icon-button"
                  type="submit"
                  disabled={!stepText.trim()}
                  aria-label="Add step"
                  title="Add step"
                >
                  <Plus size={17} aria-hidden="true" />
                </button>
              </div>
            </form>
          </>
        )}

        {activeTab === "evidence" && (
          <>
            <section className="detail-section">
              <h3 className="section-label">
                Proof of completion <span>{acceptedEvidence} reviewed</span>
              </h3>
              <p className="small-text">
                Open the result. Check that it matches “What you will have” on
                the Overview tab. Then tick the review box.
              </p>
              {item.evidence.length === 0 && (
                <p className="empty-message">
                  No proof yet. Add a link to the finished work below.
                </p>
              )}
              {item.evidence.map((proof) => (
                <div className="evidence-card" key={proof.id}>
                  <div className="evidence-heading">
                    <a
                      className="source-link"
                      href={proof.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FileCheck2 size={15} aria-hidden="true" />
                      <span>{proof.title}</span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={`Remove proof: ${proof.title}`}
                      title="Remove proof"
                      onClick={() =>
                        onUpdate(item.id, {
                          evidence: item.evidence.filter(
                            (current) => current.id !== proof.id,
                          ),
                          ...(item.status === "done"
                            ? { status: "in-progress" as const }
                            : {}),
                        })
                      }
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                  <label className="step-label evidence-review">
                    <input
                      className="step-check"
                      type="checkbox"
                      checked={proof.accepted}
                      onChange={(event) =>
                        onUpdate(item.id, {
                          evidence: item.evidence.map((current) =>
                            current.id === proof.id
                              ? { ...current, accepted: event.target.checked }
                              : current,
                          ),
                          ...(!event.target.checked && item.status === "done"
                            ? { status: "in-progress" as const }
                            : {}),
                        })
                      }
                    />
                    <span>I opened and checked this proof</span>
                  </label>
                </div>
              ))}
            </section>
            <form
              className="detail-section evidence-form"
              onSubmit={addEvidence}
            >
              <h3 className="section-label">Add proof</h3>
              <label className="field-label" htmlFor={`${panelId}-proof-title`}>
                Title
              </label>
              <input
                id={`${panelId}-proof-title`}
                className="field-input"
                placeholder="What does this prove?"
                value={evidenceTitle}
                onChange={(event) => setEvidenceTitle(event.target.value)}
                maxLength={180}
                required
              />
              <label className="field-label" htmlFor={`${panelId}-proof-url`}>
                Link
              </label>
              <input
                id={`${panelId}-proof-url`}
                className="field-input"
                placeholder="https://"
                type="url"
                value={evidenceUrl}
                onChange={(event) => {
                  setEvidenceUrl(event.target.value);
                  setFormError("");
                }}
                aria-describedby={
                  formError ? `${panelId}-proof-error` : undefined
                }
                aria-invalid={Boolean(formError)}
                required
              />
              {formError && (
                <p
                  id={`${panelId}-proof-error`}
                  className="error-text"
                  role="alert"
                >
                  {formError}
                </p>
              )}
              <button
                className="button-secondary"
                type="submit"
                disabled={!evidenceTitle.trim() || !evidenceUrl.trim()}
              >
                <Plus size={14} aria-hidden="true" /> Add proof
              </button>
              <p className="small-text">
                A new link still needs your review. Removing checked proof
                reopens a finished task.
              </p>
            </form>
          </>
        )}
      </div>

      <div className="panel-footer">
        {!item.approved ? (
          <>
            <button
              className="button-primary"
              type="button"
              disabled={inactive}
              onClick={() => onUpdate(item.id, { approved: true })}
            >
              <Check size={15} aria-hidden="true" /> Add to my plan
            </button>
            <p className="small-text">
              Approves this task. Does not start an agent.
            </p>
          </>
        ) : (
          <>
            {item.status === "not-started" && children.length === 0 && (
              <button
                className="button-primary"
                type="button"
                disabled={blockers.length > 0}
                onClick={() => onUpdate(item.id, { status: "in-progress" })}
              >
                <Play size={14} aria-hidden="true" /> Mark as started
              </button>
            )}
            {item.status === "not-started" && children.length > 0 && (
              <button
                className="button-secondary"
                type="button"
                disabled={blockers.length > 0}
                onClick={() => onUpdate(item.id, { status: "in-progress" })}
              >
                <Play size={14} aria-hidden="true" /> Mark as started
              </button>
            )}
            {item.status === "in-progress" && (
              <>
                <button
                  className="button-primary"
                  type="button"
                  onClick={() => onUpdate(item.id, { status: "done" })}
                >
                  <ShieldCheck size={15} aria-hidden="true" /> Check and finish
                </button>
                <p className="small-text">
                  All steps, earlier tasks and proof must be complete.
                </p>
              </>
            )}
            {item.status === "done" && (
              <button
                className="button-secondary"
                type="button"
                onClick={() => onUpdate(item.id, { status: "in-progress" })}
              >
                <RotateCcw size={14} aria-hidden="true" /> Reopen this task
              </button>
            )}
            {(item.status === "archived" || item.status === "cancelled") && (
              <p className="small-text">This item is {item.status}.</p>
            )}
            {item.status === "not-started" && (
              <p className="small-text">
                {blockers.length > 0
                  ? "Finish the linked tasks first. Open Overview to see them."
                  : "Records the status only. Does not start an agent."}
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
