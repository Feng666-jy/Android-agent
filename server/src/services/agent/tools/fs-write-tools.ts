/**
 * 写工具：write_file / edit_file
 *
 * 安全约束（Phase 3）：
 * - 全部经 sandbox 校验（lexical + realpath + 敏感文件拒绝 + 大小上限）
 * - write_file 创建父目录（在根内），append 模式可选
 * - edit_file 只替换首次出现的 oldText，且不破坏大小上限
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveInSandbox, assertReadable, assertRealPathInside, maxReadBytes, maxWriteBytes } from "../sandbox.js";
import type { AgentTool, ToolResult } from "../types.js";

function requireString(args: Record<string, unknown>, key: string): string | undefined {
  const v = args[key];
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export const writeFileTool: AgentTool = {
  name: "write_file",
  description: "Write text content to a file inside the sandbox. Creates parent directories if needed.",
  parameters: {
    type: "object",
    properties: {
      path: { type: "string", description: "File path relative to sandbox root." },
      content: { type: "string", description: "Text content to write." },
      mode: { type: "string", enum: ["overwrite", "append"], description: "Default overwrite; append appends to existing file." },
    },
    required: ["path", "content"],
  },
  async execute(args, ctx): Promise<ToolResult> {
    try {
      const relPath = requireString(args, "path");
      const content = args.content;
      if (!relPath) return { ok: false, output: "path is required" };
      if (typeof content !== "string") return { ok: false, output: "content is required" };

      const limit = maxWriteBytes();
      const bytes = Buffer.byteLength(content, "utf8");
      if (bytes > limit) {
        return { ok: false, output: `Content too large (${bytes} bytes > ${limit} limit).` };
      }

      const full = resolveInSandbox(ctx.sandboxRoot, relPath);
      assertReadable(relPath, full);
      await assertRealPathInside(ctx.sandboxRoot, full);
      await mkdir(path.dirname(full), { recursive: true });
      await assertRealPathInside(ctx.sandboxRoot, full);

      const mode = args.mode === "append" ? "append" : "overwrite";
      await writeFile(full, content, mode === "append" ? { flag: "a" } : undefined);
      return { ok: true, output: `Wrote ${bytes} bytes to ${relPath} (${mode}).` };
    } catch (err) {
      return { ok: false, output: (err as Error)?.message ?? String(err) };
    }
  },
};

export const editFileTool: AgentTool = {
  name: "edit_file",
  description: "Replace the first occurrence of oldText with newText inside an existing file in the sandbox.",
  parameters: {
    type: "object",
    properties: {
      path: { type: "string", description: "File path relative to sandbox root." },
      oldText: { type: "string", description: "Existing text to replace (first occurrence)." },
      newText: { type: "string", description: "Replacement text." },
    },
    required: ["path", "oldText", "newText"],
  },
  async execute(args, ctx): Promise<ToolResult> {
    try {
      const relPath = requireString(args, "path");
      const oldText = requireString(args, "oldText");
      if (!relPath) return { ok: false, output: "path is required" };
      if (!oldText) return { ok: false, output: "oldText is required" };
      const newText = args.newText;
      if (typeof newText !== "string") return { ok: false, output: "newText is required" };

      const full = resolveInSandbox(ctx.sandboxRoot, relPath);
      assertReadable(relPath, full);
      await assertRealPathInside(ctx.sandboxRoot, full);

      const readLimit = maxReadBytes();
      const current = await readFile(full, "utf8");
      if (Buffer.byteLength(current, "utf8") > readLimit) {
        return { ok: false, output: "File too large to edit." };
      }
      if (!current.includes(oldText)) {
        return { ok: false, output: `oldText not found in ${relPath}.` };
      }
      const next = current.replace(oldText, newText);
      const writeLimit = maxWriteBytes();
      if (Buffer.byteLength(next, "utf8") > writeLimit) {
        return { ok: false, output: "Edited file would exceed size limit." };
      }
      await writeFile(full, next, "utf8");
      return { ok: true, output: `Edited ${relPath} (replaced first occurrence).` };
    } catch (err) {
      return { ok: false, output: (err as Error)?.message ?? String(err) };
    }
  },
};