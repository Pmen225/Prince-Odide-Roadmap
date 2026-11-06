import { validateWorkspace, type WorkItem } from "./work-model.ts";

export const DRAFT_KEY = "odide.workspace.v1";
export type DraftStorage = Pick<Storage, "getItem" | "setItem">;
export type SavedDraft = {
  version: 1;
  revision: number;
  savedAt: string;
  items: WorkItem[];
};

export function readDraft(storage: DraftStorage): SavedDraft | null {
  const raw = storage.getItem(DRAFT_KEY);
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") throw new Error();
    const draft = value as Partial<SavedDraft>;
    if (
      draft.version !== 1 ||
      !Number.isSafeInteger(draft.revision) ||
      draft.revision! < 1 ||
      typeof draft.savedAt !== "string"
    )
      throw new Error();
    return {
      version: 1,
      revision: draft.revision!,
      savedAt: draft.savedAt,
      items: validateWorkspace(draft.items),
    };
  } catch {
    throw new Error(
      "The saved draft could not be read. It has not been replaced. Export a recovery copy in Workspace settings.",
    );
  }
}

export function writeDraft(
  storage: DraftStorage,
  items: WorkItem[],
  expectedRevision: number,
): number {
  const checked = validateWorkspace(items);
  const current = readDraft(storage);
  if ((current?.revision ?? 0) !== expectedRevision) {
    throw new Error(
      "Another tab has saved a newer draft. Export your changes, then reload to use the newer version.",
    );
  }
  const revision = expectedRevision + 1;
  storage.setItem(
    DRAFT_KEY,
    JSON.stringify({
      version: 1,
      revision,
      savedAt: new Date().toISOString(),
      items: checked,
    }),
  );
  return revision;
}

export function exportDraft(items: WorkItem[]): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      items: validateWorkspace(items),
    },
    null,
    2,
  );
}

export function parseImport(raw: string): WorkItem[] {
  if (raw.length > 2_000_000)
    throw new Error("This file is too large. The maximum is 2 MB.");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("This is not a valid JSON export.");
  }
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 1
  ) {
    throw new Error(
      "This export version is not supported. Use an ODIDE version 1 export.",
    );
  }
  if (!("items" in value)) throw new Error("This export has no work items.");
  return validateWorkspace(value.items);
}
