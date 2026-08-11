import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import {
  resolveInSandbox,
  isInside,
  assertReadable,
} from "../../../services/agent/sandbox.ts";
import { LlmValidationError } from "../../../services/llm/index.ts";

const ROOT = path.resolve("E:\\sandbox-test-root");

describe("sandbox", () => {
  it("resolves a relative path inside the root", () => {
    const resolved = resolveInSandbox(ROOT, "src/app.ts");
    assert.equal(resolved, path.join(ROOT, "src/app.ts"));
    assert.equal(isInside(ROOT, resolved), true);
  });

  it("allows the root itself", () => {
    assert.equal(resolveInSandbox(ROOT, "."), ROOT);
    assert.equal(resolveInSandbox(ROOT, "/"), ROOT);
  });

  it("rejects path traversal (../)", () => {
    assert.throws(() => resolveInSandbox(ROOT, "../etc/passwd"), LlmValidationError);
    assert.throws(() => resolveInSandbox(ROOT, "a/../../b"), LlmValidationError);
  });

  it("rejects absolute path escaping the root", () => {
    assert.throws(
      () => resolveInSandbox(ROOT, "C:\\Windows\\System32"),
      LlmValidationError
    );
  });

  it("rejects empty path", () => {
    assert.throws(() => resolveInSandbox(ROOT, ""), LlmValidationError);
    assert.throws(() => resolveInSandbox(ROOT, "   "), LlmValidationError);
  });

  it("isInside is false for siblings", () => {
    assert.equal(isInside(ROOT, path.join(path.dirname(ROOT), "other")), false);
  });

  it("assertReadable blocks sensitive names and extensions", () => {
    assert.throws(() => assertReadable(".env", path.join(ROOT, ".env")));
    assert.throws(() => assertReadable("db", path.join(ROOT, "data.sqlite")));
    assert.throws(() => assertReadable("key", path.join(ROOT, "id_rsa")));
    assert.throws(() => assertReadable("key.pem", path.join(ROOT, "cert.pem")));
    // 正常文件不抛
    assert.doesNotThrow(() => assertReadable("app.ts", path.join(ROOT, "src/app.ts")));
  });
});
