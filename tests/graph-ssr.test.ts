import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("graph helpers load in a Worker server without starting the browser layout engine", () => {
  const graphModule = new URL("../lib/graph-layout.ts", import.meta.url).href;
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--input-type=module",
      "-e",
      `
        import assert from "node:assert/strict";
        // Workers expose self but not document. Keep this environment isolated
        // from the ordinary layout tests, which run the engine in Node.
        globalThis.self = globalThis;
        assert.equal(typeof document, "undefined");
        const originalHandler = globalThis.onmessage;
        const { visibleWork, mapLinks, arrangeGraph } = await import(${JSON.stringify(graphModule)});
        assert.deepEqual(visibleWork([], [], "all", "mind"), []);
        assert.deepEqual(mapLinks([], "mind"), []);
        assert.equal(typeof arrangeGraph, "function");
        assert.equal(globalThis.onmessage, originalHandler);
      `,
    ],
    { encoding: "utf8", timeout: 10_000 },
  );
  assert.equal(
    result.status,
    0,
    result.error?.message ?? result.stderr ?? "Worker-shaped server import failed",
  );
});
