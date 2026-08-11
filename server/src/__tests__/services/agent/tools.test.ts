import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import { listDirTool, readFileTool, searchTool } from "../../../services/agent/tools/fs-tools.ts";
import type { ToolContext } from "../../../services/agent/types.ts";

let root: string;
let ctx: ToolContext;

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "agent-tools-"));
  mkdirSync(path.join(root, "src"));
  writeFileSync(path.join(root, "src", "app.ts"), "export const foo = 'hello agent';\n");
  writeFileSync(path.join(root, "README.md"), "# Sandbox Fixture\n\nhello world\n");
  writeFileSync(path.join(root, ".env"), "SECRET=abc\n");
  writeFileSync(path.join(root, "data.sqlite"), "binary-data");
  ctx = { sandboxRoot: root };
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("list_dir", () => {
  it("lists root entries with types", async () => {
    const r = await listDirTool.execute({}, ctx);
    assert.equal(r.ok, true);
    const rows = JSON.parse(r.output);
    const names = rows.map((x: any) => x.name);
    assert.ok(names.includes("src"));
    assert.ok(names.includes("README.md"));
    const src = rows.find((x: any) => x.name === "src");
    assert.equal(src.type, "dir");
  });

  it("lists subdirectory", async () => {
    const r = await listDirTool.execute({ path: "src" }, ctx);
    assert.equal(r.ok, true);
    const rows = JSON.parse(r.output);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, "app.ts");
    assert.equal(rows[0].type, "file");
  });

  it("rejects escaping path", async () => {
    const r = await listDirTool.execute({ path: "../" }, ctx);
    assert.equal(r.ok, false);
  });
});

describe("read_file", () => {
  it("reads a text file", async () => {
    const r = await readFileTool.execute({ path: "src/app.ts" }, ctx);
    assert.equal(r.ok, true);
    assert.ok(r.output.includes("hello agent"));
  });

  it("requires path", async () => {
    const r = await readFileTool.execute({}, ctx);
    assert.equal(r.ok, false);
  });

  it("rejects escaping path", async () => {
    const r = await readFileTool.execute({ path: "../outside.txt" }, ctx);
    assert.equal(r.ok, false);
  });

  it("refuses sensitive files", async () => {
    const r = await readFileTool.execute({ path: ".env" }, ctx);
    assert.equal(r.ok, false);
    const r2 = await readFileTool.execute({ path: "data.sqlite" }, ctx);
    assert.equal(r2.ok, false);
  });

  it("refuses missing file", async () => {
    const r = await readFileTool.execute({ path: "nope.md" }, ctx);
    assert.equal(r.ok, false);
  });
});

describe("search", () => {
  it("finds substring in content", async () => {
    const r = await searchTool.execute({ query: "hello agent" }, ctx);
    assert.equal(r.ok, true);
    const parsed = JSON.parse(r.output);
    assert.equal(parsed.matches.length, 1);
    assert.ok(parsed.matches[0].file.endsWith("app.ts"));
    assert.ok(parsed.matches[0].lines.includes(1));
  });

  it("finds substring in filename", async () => {
    const r = await searchTool.execute({ query: "readme" }, ctx);
    assert.equal(r.ok, true);
    const parsed = JSON.parse(r.output);
    assert.ok(parsed.matches.some((m: any) => m.file.endsWith("README.md")));
  });

  it("returns no matches", async () => {
    const r = await searchTool.execute({ query: "zzz-nothing" }, ctx);
    assert.equal(r.ok, true);
    assert.equal(r.output, "No matches found.");
  });

  it("skips .env and .git", async () => {
    mkdirSync(path.join(root, ".git"));
    writeFileSync(path.join(root, ".git", "config"), "hello agent secret\n");
    const r = await searchTool.execute({ query: "hello agent" }, ctx);
    const parsed = JSON.parse(r.output);
    assert.ok(!parsed.matches.some((m: any) => m.file.includes(".git")));
    assert.ok(!parsed.matches.some((m: any) => m.file.endsWith(".env")));
  });

  it("rejects escaping path", async () => {
    const r = await searchTool.execute({ query: "x", path: "../../" }, ctx);
    assert.equal(r.ok, false);
  });
});
