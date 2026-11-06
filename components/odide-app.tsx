"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Network,
  Menu,
  X,
  Check,
  RefreshCw,
  Download,
  AlertCircle,
  ArrowUpRight,
  Layers2,
  ArrowLeft,
} from "lucide-react";
import { CommandMap } from "./command-map";
import { TaskPanel } from "./task-panel";
import { WorkspaceSidebar, type WorkspaceView } from "./workspace-sidebar";
import { SourcesView, SettingsView } from "./workspace-views";
import { StartView } from "./start-view";
import { NodeDialog, ImportDialog } from "./node-dialog";
import { seedItems, initialExpanded } from "@/lib/seed";
import { refreshSeedCopy } from "@/lib/seed-copy-migration";
import { getStartingPoints } from "@/lib/start-focus";
import {
  getAncestors,
  updateItem,
  validateWorkspace,
  type Business,
  type WorkItem,
} from "@/lib/work-model";
import {
  DRAFT_KEY,
  readDraft,
  writeDraft,
  parseImport,
  exportDraft,
} from "@/lib/storage";
import type { MapMode } from "@/lib/graph-layout";

function downloadFile(content: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "application/json" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function OdideApp() {
  const [items, setItems] = useState<WorkItem[]>(seedItems);
  const [expanded, setExpanded] = useState<string[]>(initialExpanded);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<WorkspaceView>("today");
  const [mode, setMode] = useState<MapMode>("mind");
  const [business, setBusiness] = useState<"all" | Business>("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createParent, setCreateParent] = useState<string | null>(null);
  const [importItems, setImportItems] = useState<WorkItem[] | null>(null);
  const [revealId, setRevealId] = useState<string | null>(null);
  const [layoutRevision, setLayoutRevision] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState("Draft loaded");
  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState("");
  const revision = useRef(0);
  const itemsRef = useRef(items);
  const blockedStorage = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    let active = true;
    // Load external browser state after hydration, preserving the server's first frame.
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = readDraft(localStorage);
        if (saved) {
          const refreshed = refreshSeedCopy(saved.items, saved.seedPlanVersion);
          setItems(refreshed.items);
          itemsRef.current = refreshed.items;
          revision.current = saved.revision;
          if (refreshed.updatedIds.length || refreshed.seedPlanVersion !== saved.seedPlanVersion) {
            revision.current = writeDraft(localStorage, refreshed.items, saved.revision, refreshed.seedPlanVersion);
            if (refreshed.updatedIds.length) setNotice("Customer-first tasks loaded. Your edits were kept.");
          }
          setSaveState("Saved in this browser");
        }
      } catch (error) {
        blockedStorage.current = true;
        setSaveError(
          error instanceof Error
            ? error.message
            : "Browser storage is unavailable.",
        );
        setSaveState("Recovery needed");
      }
      setHydrated(true);
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key === DRAFT_KEY) {
        blockedStorage.current = true;
        setSaveError(
          "Another tab changed this draft. Export your changes before reloading.",
        );
        setSaveState("Conflict · reload needed");
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        search.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
        if (document.activeElement?.closest("#workspace-navigation")) {
          menuButton.current?.focus();
        }
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("keydown", onKey);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const commit = useCallback(
    (next: WorkItem[]) => {
      if (!hydrated) return false;
      if (blockedStorage.current) {
        setNotice("Export your draft, then reload before making more changes.");
        return false;
      }
      try {
        const checked = validateWorkspace(next);
        revision.current = writeDraft(localStorage, checked, revision.current);
        itemsRef.current = checked;
        setItems(checked);
        setSaveState("Saved in this browser");
        setSaveError("");
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "The change could not be saved.";
        setSaveError(message);
        setSaveState("Change not saved");
        setNotice(message);
        return false;
      }
    },
    [hydrated],
  );
  const onUpdate = useCallback(
    (id: string, patch: Partial<WorkItem>) => {
      try {
        const next = updateItem(itemsRef.current, id, patch);
        if (!commit(next)) return false;
        setNotice(
          patch.approved
            ? "Draft approved for planning. No external action was run."
            : "Saved in this browser",
        );
        return true;
      } catch (error) {
        setNotice(
          error instanceof Error ? error.message : "This change is not valid.",
        );
        return false;
      }
    },
    [commit],
  );
  const onSelect = useCallback((id: string) => {
    setSelected(id);
    setView("roadmap");
    setSearchOpen(false);
  }, []);
  const openTask = useCallback((id: string) => {
    setSelected(id);
    setView("today");
    setBusiness("all");
    setSearchOpen(false);
  }, []);
  const reveal = useCallback((id: string) => {
    setBusiness("all");
    setSelected(id);
    setView("roadmap");
    setQuery("");
    setSearchOpen(false);
    setExpanded((previous) => [
      ...new Set([
        ...previous,
        ...getAncestors(id, itemsRef.current).map((item) => item.id),
      ]),
    ]);
    setRevealId(id);
  }, []);
  const onExpand = useCallback((id: string) => {
    setRevealId(null);
    setExpanded((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
  }, []);
  const onView = (next: WorkspaceView) => {
    setView(next);
    setSelected(null);
    setSearchOpen(false);
    if (next === "today") setBusiness("all");
  };
  const isProposed = !items.some(
    (item) =>
      item.approved &&
      item.kind === "task" &&
      !["archived", "cancelled"].includes(item.status) &&
      !getAncestors(item.id, items).some((parent) => ["archived", "cancelled"].includes(parent.status)),
  );
  const focus = useMemo(() => getStartingPoints(items, business), [items, business]);
  const rootId =
    items.find((item) => item.kind === "goal" && !item.parentId)?.id ??
    items.find((item) => !item.parentId)?.id ??
    "";
  const selectedItem = items.find((item) => item.id === selected);
  const matches = useMemo(
    () =>
      query.trim()
        ? items
            .filter((item) =>
              `${item.title} ${item.why}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .slice(0, 9)
        : [],
    [items, query],
  );
  const exportCurrent = () => {
    downloadFile(exportDraft(items), "odide-draft.json");
    setNotice("Draft exported. Keep this file private.");
  };
  const exportRecovery = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) {
        setNotice("No stored draft to recover. Use Export draft instead.");
        return;
      }
      downloadFile(raw, "odide-recovery.json");
      setNotice("Recovery copy exported without changing the saved data.");
    } catch {
      setNotice(
        "Browser storage is unavailable. Use Export draft for the current view.",
      );
    }
  };

  return (
    <div className="odide-app">
      <WorkspaceSidebar
        view={view}
        onView={onView}
        mobileOpen={mobileOpen}
        onClose={() => { setMobileOpen(false); if (mobileOpen) menuButton.current?.focus(); }}
      />
      <div className="workspace-main">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuButton}
              className="icon-button mobile-only"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              aria-controls="workspace-navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={19} />
            </button>
            <span>ODIDE</span>
            <ChevronRight size={13} />
            <strong>
              {view === "today" ? "Start here" : view === "sources" ? "Guides" : view === "settings" ? "Settings" : "Roadmap"}
            </strong>
          </div>
          <div className="topbar-actions">
            <div className="search-wrap">
              <Search size={15} />
              <input
                ref={search}
                aria-label="Find a task"
                placeholder="Find a task"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
              <kbd>⌘ K</kbd>
              {query && (
                <button
                  className="icon-button search-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    setSearchOpen(false);
                  }}
                >
                  <X size={13} />
                </button>
              )}
              {searchOpen && query && (
                <div className="search-results">
                  <div className="search-results-label">
                    {matches.length ? "MATCHING WORK" : "NO MATCHES"}
                  </div>
                  {matches.map((item) => (
                    <button key={item.id} onClick={() => view === "roadmap" ? reveal(item.id) : openTask(item.id)}>
                      <span>
                        {item.title}
                        <small>
                          {item.kind}
                          {["archived", "cancelled"].includes(item.status)
                            ? ` · ${item.status}`
                            : ""}
                        </small>
                      </span>
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                  {!matches.length && (
                    <p>Try a task, milestone or business name.</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="button-secondary add-node-button"
              aria-label="Add task"
              onClick={() => setCreateParent(rootId)}
              disabled={!hydrated}
            >
              <Plus size={16} />
              <span>Add task</span>
            </button>
          </div>
        </header>
        {saveError && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{saveError}</span>
            <button onClick={() => setView("settings")}>
              Recovery options
            </button>
          </div>
        )}
        <div
          className={`workspace-body ${selectedItem && view === "roadmap" ? "with-inspector" : ""} ${view === "today" && selectedItem ? "single-task-view" : ""}`}
        >
          {view === "roadmap" ? (
            <main className="roadmap-region">
              <div className="roadmap-heading">
                <div>
                  <h1>The full picture<span>.</span></h1>
                  <p>Open a branch to see its tasks. Select a task to see what must happen first.</p>
                </div>
                <button
                  className="icon-button export-icon"
                  onClick={exportCurrent}
                  aria-label="Export draft"
                  title="Export draft"
                >
                  <Download size={17} />
                </button>
              </div>
              <div className="map-toolbar">
                <div className="mode-tabs" aria-label="Map view">
                  <button
                    aria-pressed={mode === "mind"}
                    className={mode === "mind" ? "active" : ""}
                    onClick={() => {
                      setMode("mind");
                      setRevealId(null);
                    }}
                  >
                    <GitBranch size={14} />
                    Mind map
                  </button>
                  <button
                    aria-pressed={mode === "dependencies"}
                    className={mode === "dependencies" ? "active" : ""}
                    onClick={() => {
                      setMode("dependencies");
                      setRevealId(null);
                    }}
                  >
                    <Network size={14} />
                    What comes first
                  </button>
                </div>
                <div className="map-toolbar-end">
                  <button
                    className="icon-button"
                    aria-label="Arrange map"
                    title="Arrange map"
                    onClick={() => {
                      setRevealId(null);
                      setLayoutRevision((value) => value + 1);
                    }}
                  >
                    <RefreshCw size={15} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Collapse to milestones"
                    title="Collapse to milestones"
                    onClick={() => {
                      setExpanded(
                        items
                          .filter((item) => !item.parentId)
                          .map((item) => item.id),
                      );
                      setRevealId(null);
                    }}
                  >
                    <Layers2 size={15} />
                  </button>
                  <label className="business-select">
                    <span className="sr-only">Filter business</span>
                    <span className={`business-indicator ${business}`} />
                    <select
                      value={business}
                      onChange={(event) => {
                        setBusiness(event.target.value as "all" | Business);
                        setRevealId(null);
                      }}
                    >
                      <option value="all">All businesses</option>
                      <option value="itad">ITAD</option>
                      <option value="device-care">Device Care</option>
                      <option value="group">ODIDE group</option>
                    </select>
                    <ChevronDown size={13} />
                  </label>
                </div>
              </div>
              <CommandMap
                items={items}
                expanded={expanded}
                business={business}
                mode={mode}
                selected={selected}
                focusIds={focus.filter((item) => item.approved).map((item) => item.id)}
                onSelect={onSelect}
                onExpand={onExpand}
                revealId={revealId}
                layoutRevision={layoutRevision}
              />
            </main>
          ) : view === "today" ? (
            selectedItem ? (
              <main className="single-task-shell" id="main-content">
                <div className="single-task-nav">
                  <button className="button-quiet" onClick={() => setSelected(null)}><ArrowLeft size={16} /> Back to start</button>
                  <button className="button-quiet" onClick={() => reveal(selectedItem.id)}>Show on roadmap <GitBranch size={16} /></button>
                </div>
                <TaskPanel
                  item={selectedItem}
                  items={items}
                  onUpdate={onUpdate}
                  onSelect={openTask}
                  onClose={() => setSelected(null)}
                  onAddChild={(id) => setCreateParent(id)}
                />
              </main>
            ) : (
              <StartView items={items} focus={focus} onSelect={openTask} onMap={() => onView("roadmap")} />
            )
          ) : view === "sources" ? (
            <SourcesView items={items} onSelect={openTask} />
          ) : (
            <SettingsView
              items={items}
              saveState={saveState}
              onExport={exportCurrent}
              onImport={() => fileInput.current?.click()}
              onRecovery={exportRecovery}
            />
          )}
          {view === "roadmap" && selectedItem && (
            <TaskPanel
              item={selectedItem}
              items={items}
              onUpdate={onUpdate}
              onSelect={reveal}
              onClose={() => setSelected(null)}
              onAddChild={(id) => setCreateParent(id)}
            />
          )}
        </div>
        <footer className="statusbar">
          <span>
            <span className={`save-dot ${saveError ? "error" : ""}`} />
            {hydrated ? saveState : "Opening workspace…"}
            <span className="status-separator">·</span>
            <span className="draft-status">{isProposed ? "Suggested plan · Not yet approved" : "Your plan"}</span>
          </span>
          <button onClick={() => onView("settings")}>Save & connections</button>
        </footer>
      </div>
      {notice && (
        <div className="toast" role="status">
          <Check size={15} />
          <span>{notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
      <input
        className="sr-only"
        type="file"
        ref={fileInput}
        accept="application/json,.json"
        aria-label="Import ODIDE draft file"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          try {
            if (file.size > 2_000_000)
              throw new Error("This file is too large. The maximum is 2 MB.");
            setImportItems(parseImport(await file.text()));
          } catch (error) {
            setNotice(
              error instanceof Error
                ? error.message
                : "The file could not be read.",
            );
          }
        }}
      />
      {createParent !== null && (
        <NodeDialog
          items={items}
          parentId={createParent}
          onClose={() => setCreateParent(null)}
          onCreate={(item) => {
            if (!commit([...items, item])) return false;
            setNotice(
              "Draft task added. Open its details to define the finish.",
            );
            setExpanded((previous) => [
              ...new Set([
                ...previous,
                ...getAncestors(item.id, [...items, item]).map(
                  (parent) => parent.id,
                ),
              ]),
            ]);
            setSelected(item.id);
            setView("roadmap");
            return true;
          }}
        />
      )}
      {importItems && (
        <ImportDialog
          count={importItems.length}
          onClose={() => setImportItems(null)}
          onConfirm={() => {
            downloadFile(exportDraft(items), "odide-before-import.json");
            if (commit(importItems)) {
              setImportItems(null);
              setSelected(null);
              setExpanded(
                importItems
                  .filter((item) => !item.parentId)
                  .map((item) => item.id),
              );
              setNotice("Draft imported and saved in this browser.");
            }
          }}
        />
      )}
    </div>
  );
}
