"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, ArrowRight } from "lucide-react";
import type { WorkItem, Business, Owner } from "@/lib/work-model";

export function NodeDialog({
  items,
  parentId,
  onCreate,
  onClose,
}: {
  items: WorkItem[];
  parentId?: string;
  onCreate: (item: WorkItem) => boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [parent, setParent] = useState(
    parentId ?? items.find((item) => item.kind === "goal")?.id ?? "",
  );
  const [business, setBusiness] = useState<Business>(
    items.find((item) => item.id === parentId)?.business === "device-care"
      ? "device-care"
      : "itad",
  );
  const [owner, setOwner] = useState<Owner>("Junior");
  const [why, setWhy] = useState("");
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="workspace-dialog"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-top">
          <span className="dialog-icon">
            <Plus size={20} />
          </span>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close new task"
          >
            <X size={18} />
          </button>
        </div>
        <h2>One step closer.</h2>
        <p>Add a task to the map. It starts as a draft.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const clean = title.trim();
            if (!clean) {
              setError("Give the task a name.");
              return;
            }
            const item: WorkItem = {
              id: crypto.randomUUID(),
              title: clean,
              kind: "task",
              business,
              status: "not-started",
              owner,
              parentId: parent || undefined,
              dependsOn: [],
              why: why.trim() || "Add the reason this work matters.",
              steps: [],
              acceptance:
                "Add a clear completion standard before approving this task.",
              evidence: [],
              sources: [],
              priority: 2,
              origin: "user",
              approved: false,
            };
            if (onCreate(item)) onClose();
          }}
        >
          <label className="field-label">
            Task name
            <input
              autoFocus
              maxLength={180}
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="field-input"
              placeholder="What needs to happen?"
            />
          </label>
          <label className="field-label">
            Part of
            <select
              className="field-select"
              value={parent}
              onChange={(event) => setParent(event.target.value)}
            >
              <option value="">No parent</option>
              {items
                .filter(
                  (item) => !["cancelled", "archived"].includes(item.status),
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
            </select>
          </label>
          <div className="field-row">
            <label className="field-label">
              Business
              <select
                value={business}
                onChange={(event) =>
                  setBusiness(event.target.value as Business)
                }
                className="field-select"
              >
                <option value="itad">ITAD</option>
                <option value="device-care">Device Care</option>
                <option value="group">ODIDE group</option>
              </select>
            </label>
            <label className="field-label">
              Owner
              <select
                value={owner}
                onChange={(event) => setOwner(event.target.value as Owner)}
                className="field-select"
              >
                <option>Junior</option>
                <option>Agent</option>
                <option>Unassigned</option>
              </select>
            </label>
          </div>
          <label className="field-label">
            Why it matters
            <textarea
              className="field-textarea"
              maxLength={2000}
              value={why}
              onChange={(event) => setWhy(event.target.value)}
              placeholder="How does this move the business forward?"
              rows={3}
            />
          </label>
          {error && (
            <p role="alert" className="error-text">
              {error}
            </p>
          )}
          <button type="submit" className="button-primary dialog-submit">
            Add to roadmap
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </dialog>
  );
}

export function ImportDialog({
  count,
  onConfirm,
  onClose,
}: {
  count: number;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog ref={dialog} className="workspace-dialog" onCancel={onClose}>
      <div className="dialog-inner">
        <div className="dialog-top">
          <span className="eyebrow">IMPORT REVIEW</span>
          <button
            className="icon-button"
            aria-label="Cancel import"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <h2>Replace this browser draft?</h2>
        <p>
          The validated file contains {count} work items. A backup of your
          current draft will download before the imported draft replaces it.
        </p>
        <p className="small-text">
          Nothing will be written to Notion or executed by an agent.
        </p>
        <button className="button-primary dialog-submit" onClick={onConfirm}>
          Download backup & replace
        </button>
        <button className="button-quiet dialog-submit" onClick={onClose}>
          Keep current draft
        </button>
      </div>
    </dialog>
  );
}
