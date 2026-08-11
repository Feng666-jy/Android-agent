import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_PERMISSIONS,
  normalizePermissionConfig,
  resolvePermission,
  defaultDenyHandler,
} from "../../../services/agent/permissions.ts";

describe("normalizePermissionConfig", () => {
  it("uses safe defaults when input is undefined", () => {
    const cfg = normalizePermissionConfig(undefined);
    assert.equal(cfg.default, "allow");
    assert.equal(cfg.tools.write_file, "ask");
    assert.equal(cfg.tools.edit_file, "ask");
    assert.equal(cfg.tools.run_command, "deny");
  });

  it("merges tool overrides on top of defaults", () => {
    const cfg = normalizePermissionConfig({ tools: { run_command: "allow" } });
    assert.equal(cfg.tools.run_command, "allow");
    assert.equal(cfg.tools.write_file, "ask"); // 未被覆盖的仍为默认
  });

  it("overrides default while keeping explicit tools", () => {
    const cfg = normalizePermissionConfig({ default: "deny", tools: { read_file: "allow" } });
    assert.equal(cfg.default, "deny");
    assert.equal(cfg.tools.read_file, "allow");
    assert.equal(cfg.tools.write_file, "ask");
    assert.equal(cfg.tools.run_command, "deny");
  });

  it("ignores invalid permission values", () => {
    const cfg = normalizePermissionConfig({ default: "bogus" as never, tools: { x: "hack" as never } });
    assert.equal(cfg.default, "allow");
    assert.ok(!("x" in cfg.tools));
  });
});

describe("resolvePermission", () => {
  it("prefers explicit tool override over default", () => {
    const cfg = normalizePermissionConfig({ default: "deny", tools: { list_dir: "allow" } });
    assert.equal(resolvePermission(cfg, "list_dir"), "allow");
    assert.equal(resolvePermission(cfg, "write_file"), "ask"); // 默认工具白名单保留
    assert.equal(resolvePermission(cfg, "read_file"), "deny"); // 无覆盖 + 全局 deny
    assert.equal(resolvePermission(cfg, "unknown_tool"), "deny");
  });
});

describe("defaultDenyHandler", () => {
  it("rejects any ask without returning the tool result", async () => {
    const r = await defaultDenyHandler(
      { toolCall: { name: "write_file" } } as never,
      async () => ({ ok: true, output: "must not run" })
    );
    assert.equal(r.ok, false);
    assert.match(r.output, /approval/);
  });

  it("DEFAULT_PERMISSIONS is a stable snapshot", () => {
    const tools = Object.keys(DEFAULT_PERMISSIONS.tools).sort();
    assert.deepEqual(tools, ["edit_file", "run_command", "write_file"]);
  });
});