"use client";

import { useEffect, useRef } from "react";

import {
  GitBranch,
  Target,
  Library,
  Settings2,
  ArrowRight,
  X,
} from "lucide-react";

export type WorkspaceView = "roadmap" | "today" | "sources" | "settings";
const navigation = [
  { id: "today", label: "Start here", Icon: Target },
  { id: "roadmap", label: "Roadmap", Icon: GitBranch },
  { id: "sources", label: "Guides", Icon: Library },
  { id: "settings", label: "Settings", Icon: Settings2 },
] as const;

export function WorkspaceSidebar({
  view,
  onView,
  mobileOpen,
  onClose,
}: {
  view: WorkspaceView;
  onView: (view: WorkspaceView) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (mobileOpen) closeButton.current?.focus(); }, [mobileOpen]);
  return (
    <>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside id="workspace-navigation" className={`workspace-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand-row">
          <button
            className="brand"
            onClick={() => { onView("today"); onClose(); }}
            aria-label="ODIDE start here"
          >
            <span className="brand-symbol">
              <span />
              <span />
              <span />
            </span>
            ODIDE<span className="brand-period">.</span>
          </button>
          <button
            ref={closeButton}
            className="icon-button mobile-only"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <p className="sidebar-workspace-name">Your business workspace</p>
        <nav aria-label="Workspace navigation">
          {navigation.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${view === id ? "active" : ""}`}
              onClick={() => {
                onView(id);
                onClose();
              }}
              aria-current={view === id ? "page" : undefined}
            >
              <Icon size={17} />
              <span>{label}</span>
              {view === id && <ArrowRight className="nav-current-arrow" size={14} aria-hidden="true" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p className="sidebar-storage-note">Changes save in this browser.<br />Export a copy in Settings.</p>
          <div className="sidebar-person">
            <div className="person-avatar">J</div>
            <span>
              Junior<small>ODIDE workspace</small>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
