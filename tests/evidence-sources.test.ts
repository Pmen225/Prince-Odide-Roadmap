import { test } from "node:test";
import assert from "node:assert/strict";
import { researchDate, researchSources, researchWindow } from "../lib/evidence-sources.ts";
import { seedItems } from "../lib/seed.ts";

test("the evidence ledger retains 50 distinct numbered sources", () => {
  assert.equal(researchSources.length, 50);
  assert.deepEqual(researchSources.map((source) => source.id), Array.from({ length: 50 }, (_, index) => index + 1));
  assert.equal(new Set(researchSources.map((source) => source.key)).size, 50);
  assert.equal(new Set(researchSources.map((source) => new URL(source.url).href)).size, 50);
  for (const source of researchSources) {
    assert.equal(new URL(source.url).protocol, "https:", `Source ${source.id} needs a direct HTTPS link`);
  }
});

test("all evidence dates fall within the declared two-year window", () => {
  assert.equal(researchDate, "2026-11-06");
  assert.equal(researchWindow, "6 Nov 2024 – 6 Nov 2026");
  for (const source of researchSources) {
    assert.match(source.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(`${source.date}T00:00:00Z`).toISOString().slice(0, 10), source.date);
    assert.ok(source.date >= "2024-11-06" && source.date <= researchDate, `Source ${source.id} is outside the research window`);
  }
});

test("each source has a complete short quote, a task rule and an explicit limit", () => {
  for (const source of researchSources) {
    for (const field of ["key", "title", "dateScope", "kind", "quote", "change", "limit"] as const) {
      assert.ok(source[field].trim().length > 0, `Source ${source.id} has an empty ${field}`);
    }
    assert.ok(source.quote.trim().split(/\s+/).length <= 25, `Source ${source.id} quote exceeds 25 words`);
  }
});

test("source groups preserve the distinction between firsthand reports and technical controls", () => {
  assert.deepEqual(
    Object.fromEntries(["itad", "sales", "execution"].map((group) => [group, researchSources.filter((source) => source.group === group).length])),
    { itad: 17, sales: 17, execution: 16 },
  );
  const reports = researchSources.filter((source) => source.group !== "execution");
  assert.equal(reports.length, 34);
  assert.ok(reports.every((source) => /(^|\.)reddit\.com$/.test(new URL(source.url).hostname)));
  const controls = researchSources.filter((source) => source.group === "execution");
  assert.equal(controls.filter((source) => /(^|\.)anthropic\.com$/.test(new URL(source.url).hostname)).length, 8);
  assert.equal(controls.filter((source) => new URL(source.url).hostname === "arxiv.org").length, 8);
  assert.ok(controls.every((source) => source.kind.startsWith("Primary")));
});

test("every evidence record maps to known tasks or all task briefs", () => {
  const taskIds = new Set(seedItems.filter((item) => item.kind === "task").map((item) => item.id));
  for (const source of researchSources) {
    assert.ok(source.taskIds.length > 0, `Source ${source.id} has no task mapping`);
    assert.equal(new Set(source.taskIds).size, source.taskIds.length);
    for (const taskId of source.taskIds) {
      assert.ok(taskId === "all" || taskIds.has(taskId), `Source ${source.id} maps to unknown task ${taskId}`);
    }
    if (source.taskIds.includes("all")) assert.deepEqual(source.taskIds, ["all"]);
  }
});
