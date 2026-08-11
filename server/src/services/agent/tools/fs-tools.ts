/**
 * 只读工具：list_dir / read_file / search
 *
 * 安全约束（审查定稿）：
 * - 全部经 sandbox 路径校验，禁止越界
 * - read_file 有大小上限（MAX_READ_BYTES）
 * - search 用 Node 递归扫描（不依赖 rg）
 */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { resolveInSandbox, assertReadable, assertRealPathInside, maxReadBytes } from "../sandbox.js";
import type { AgentTool, ToolResult } from "../types.js";

export const listDirTool: AgentTool = {
  name: "list_dir",
  description: "List files and directories inside the sandbox. Returns name, type (dir/file), and size for each entry.",
  parameters: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Directory path relative to sandbox root (default: '/').",
      },
    },
  },
  async execute(args, ctx): Promise<ToolResult> {
    try {
      const relPath = (args.path as string) ?? "/";
      const dir = resolveInSandbox(ctx.sandboxRoot, relPath);
      await assertRealPathInside(ctx.sandboxRoot, dir);
      const entries = await readdir(dir, { withFileTypes: true });
      const rows: Array<{ name: string; type: string; size?: number }> = [];
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        const row: { name: string; type: string; size?: number } = {
          name: entry.name,
          type: entry.isDirectory() ? "dir" : "file",
        };
        if (!entry.isDirectory() && !entry.isSymbolicLink()) {
          try {
            const st = await stat(full);
            row.size = st.size;
          } catch {
            // 忽略 stat 失败
          }
        }
        rows.push(row);
      }
      rows.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1));
      return { ok: true, output: JSON.stringify(rows, null, 2) };
    } catch (err) {
      return { ok: false, output: (err as Error)?.message ?? String(err) };
    }
  },
};

export const readFileTool: AgentTool = {
  name: "read_file",
  description: `Read a text file inside the sandbox. Max ${(maxReadBytes() / 1024).toFixed(0)}KB. Returns file content.`,
  parameters: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "File path relative to sandbox root.",
      },
    },
    required: ["path"],
  },
  async execute(args, ctx): Promise<ToolResult> {
    try {
      const relPath = args.path as string;
      if (typeof relPath !== "string" || !relPath.trim()) {
        return { ok: false, output: "path is required" };
      }
      const full = resolveInSandbox(ctx.sandboxRoot, relPath);
      assertReadable(relPath, full);
      await assertRealPathInside(ctx.sandboxRoot, full);

      const limit = maxReadBytes();
      const st = await stat(full);
      if (st.size > limit) {
        return {
          ok: false,
          output: `File too large (${st.size} bytes > ${limit} limit). Refuse to read.`,
        };
      }
      const content = await readFile(full, "utf8");
      return { ok: true, output: content };
    } catch (err) {
      return { ok: false, output: (err as Error)?.message ?? String(err) };
    }
  },
};

/** 常见文本文件扩展名（search 只扫这些） */
const TEXT_EXT = new Set([
  ".txt", ".md", ".json", ".ts", ".js", ".jsx", ".tsx", ".vue", ".css", ".scss",
  ".html", ".htm", ".xml", ".yml", ".yaml", ".toml", ".ini", ".cfg", ".conf",
  ".sh", ".bash", ".py", ".go", ".rs", ".java", ".c", ".h", ".cpp", ".sql",
  ".log", ".csv", ".env", ".gitignore", ".lock",
]);

/** 默认跳过这些目录 */
const SKIP_DIRS = new Set([".git", "node_modules", ".venv", "venv", "dist", ".cache"]);

export const searchTool: AgentTool = {
  name: "search",
  description:
    "Search files inside the sandbox by substring (filename or content). Uses Node recursive scan. Returns matching file paths with matched lines.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Substring to search in filenames and file contents.",
      },
      path: {
        type: "string",
        description: "Directory to start from (default sandbox root '/').",
      },
      maxResults: {
        type: "integer",
        description: "Max matches to return (default 50).",
      },
    },
    required: ["query"],
  },
  async execute(args, ctx): Promise<ToolResult> {
    try {
      const query = args.query as string;
      if (typeof query !== "string" || !query.trim()) {
        return { ok: false, output: "query is required" };
      }
      const start = resolveInSandbox(ctx.sandboxRoot, (args.path as string) ?? "/");
      await assertRealPathInside(ctx.sandboxRoot, start);
      const maxResults = typeof args.maxResults === "number" ? Math.max(1, Math.min(200, args.maxResults)) : 50;
      const limit = maxReadBytes();

      const matches: Array<{ file: string; lines: number[] }> = [];
      const needle = query.toLowerCase();

      async function walk(dir: string): Promise<void> {
        if (matches.length >= maxResults) return;
        let entries;
        try {
          entries = await readdir(dir, { withFileTypes: true });
        } catch {
          return;
        }
        for (const entry of entries) {
          if (matches.length >= maxResults) return;
          if (entry.isSymbolicLink()) continue;
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) continue;
            await walk(full);
            continue;
          }
          // 文件名匹配
          const rel = path.relative(ctx.sandboxRoot, full);
          if (entry.name.toLowerCase().includes(needle)) {
            matches.push({ file: rel, lines: [] });
            if (matches.length >= maxResults) return;
          }
          // 内容匹配（仅文本文件）
          const ext = path.extname(entry.name).toLowerCase();
          if (!TEXT_EXT.has(ext) && !entry.name.startsWith(".")) continue;
          try {
            const st = await stat(full);
            if (st.size > limit) continue;
            const content = await readFile(full, "utf8");
            const lower = content.toLowerCase();
            if (lower.includes(needle)) {
              const lines: number[] = [];
              const parts = content.split("\n");
              for (let i = 0; i < parts.length && lines.length < 20; i++) {
                if (parts[i].toLowerCase().includes(needle)) lines.push(i + 1);
              }
              if (matches.length >= maxResults) return;
              matches.push({ file: rel, lines });
            }
          } catch {
            // 忽略读取失败（二进制等）
          }
        }
      }

      await walk(start);

      const truncated = matches.length >= maxResults;
      const output = JSON.stringify({ truncated, matches }, null, 2);
      return {
        ok: true,
        output: matches.length === 0 ? "No matches found." : output,
      };
    } catch (err) {
      return { ok: false, output: (err as Error)?.message ?? String(err) };
    }
  },
};
