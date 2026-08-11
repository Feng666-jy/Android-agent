import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, symlinkSync, rmSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

import { writeFileTool, editFileTool } from "../../../services/agent/tools/fs-write-tools.ts";
import { listDirTool } from "../../../services/agent/tools/fs-tools.ts";
import { assertRealPathInside } from "../../../services/agent/sandbox.ts";
import type { ToolContext } from "../../../services/agent/types.ts";
import { LlmValidationError } from "../../../services/llm/index.ts";

let root: string;
let outside: string;
let ctx: ToolContext;

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "agent-write-"));
  outside = mkdtempSync(path.join(os.tmpdir(), "agent-outside-"));
  writeFileSync(path.join(root, "hello.txt"), "hello world\n");
  ctx = { sandboxRoot: root };
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  rmSync(outside, { recursive: true, force: true });
});

describe("write_file", () => {
  it("creates a new file with parent directories", async () => {
    const r = await writeFileTool.execute({ path: "src/new.ts", content: "export const x = 1;\n" }, ctx);
    assert.equal(r.ok, true);
    assert.equal(readFileSync(path.join(root, "src", "new.ts"), "utf8"), "export const x = 1;\n");
  });

  it("overwrites an existing file by default", async () => {
    await writeFileTool.execute({ path: "hello.txt", content: "overwritten\n" }, ctx);
    assert.equal(readFileSync(path.join(root, "hello.txt"), "utf8"), "overwritten\n");
  });

  it("appends when mode=append", async () => {
    await writeFileTool.execute({ path: "hello.txt", content: "more\n", mode: "append" }, ctx);
    assert.equal(readFileSync(path.join(root, "hello.txt"), "utf8"), "hello world\nmore\n");
  });

  it("rejects escaping path", async () => {
    const r = await writeFileTool.execute({ path: "../evil.txt", content: "x" }, ctx);
    assert.equal(r.ok, false);
    assert.equal(existsSync(path.join(outside, "evil.txt")), false);
  });

  it("rejects sensitive file names", async () => {
    const r = await writeFileTool.execute({ path: ".env", content: "SECRET=1" }, ctx);
    assert.equal(r.ok, false);
    assert.equal(existsSync(path.join(root, ".env")), false);
  });

  it("rejects oversized content", async () => {
    const prev = process.env.AGENT_MAX_WRITE_BYTES;
    process.env.AGENT_MAX_WRITE_BYTES = "16";
    try {
      const r = await writeFileTool.execute({ path: "big.txt", content: "x".repeat(64) }, ctx);
      assert.equal(r.ok, false);
      assert.match(r.output, /too large/i);
    } finally {
      if (prev === undefined) delete process.env.AGENT_MAX_WRITE_BYTES;
      else process.env.AGENT_MAX_WRITE_BYTES = prev;
    }
  });
});

describe("edit_file", () => {
  it("replaces first occurrence", async () => {
    const r = await editFileTool.execute({ path: "hello.txt", oldText: "world", newText: "agent" }, ctx);
    assert.equal(r.ok, true);
    assert.equal(readFileSync(path.join(root, "hello.txt"), "utf8"), "hello agent\n");
  });

  it("fails when oldText not found", async () => {
    const r = await editFileTool.execute({ path: "hello.txt", oldText: "nope", newText: "x" }, ctx);
    assert.equal(r.ok, false);
    assert.match(r.output, /not found/i);
  });

  it("rejects escaping path", async () => {
    const r = await editFileTool.execute({ path: "../evil.txt", oldText: "a", newText: "b" }, ctx);
    assert.equal(r.ok, false);
  });
});

describe("symlink escape (Windows junction / POSIX symlink)", () => {
  // Windows 下目录符号链接用 junction（无需管理员/开发者模式）；失败则跳过
  let junctionAvailable = true;
  try {
    symlinkSync(outside, path.join(root, "leak"), "junction");
  } catch {
    junctionAvailable = false;
  }

  it(
    "assertRealPathInside rejects a junction pointing outside",
    { skip: !junctionAvailable },
    async () => {
      await assert.rejects(
        () => assertRealPathInside(root, path.join(root, "leak", "secret.txt")),
        LlmValidationError
      );
    }
  );

  it(
    "write_file refuses to write through an escaping symlink",
    { skip: !junctionAvailable },
    async () => {
      const r = await writeFileTool.execute({ path: "leak/evil.txt", content: "pwned" }, ctx);
      assert.equal(r.ok, false);
      assert.match(r.output, /symlink/i);
      assert.equal(existsSync(path.join(outside, "evil.txt")), false);
    }
  );

  it(
    "read_file refuses to read through an escaping symlink",
    { skip: !junctionAvailable },
    async () => {
      writeFileSync(path.join(outside, "secret.txt"), "outside data\n");
      const r = await listDirTool.execute({ path: "leak" }, ctx);
      assert.equal(r.ok, false);
      assert.match(r.output, /symlink/i);
    }
  );
});