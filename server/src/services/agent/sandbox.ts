/**
 * Agent 沙盒 — 路径安全边界
 *
 * 所有文件工具（list_dir / read_file / search / write_file / edit_file / run_command）
 * 必须经过这里。
 * 规则：
 * - 沙盒根目录：AGENT_SANDBOX env，否则 ~/agent-sandbox
 * - 所有相对路径 resolve 后必须仍位于根目录内（防 ../ 逃逸）
 * - 已存在路径还要解析符号链接真实路径，必须在根内（防 symlink 逃逸）
 * - 拒绝读写敏感文件（.env、*.db、私钥等）
 * - read / write 均有大小上限
 */

import { homedir } from "node:os";
import { relative, isAbsolute, sep } from "node:path";
import path from "node:path";
import { mkdir, realpath } from "node:fs/promises";
import { LlmValidationError } from "../llm/errors.js";

export function resolveSandboxRoot(override?: string): string {
  if (override) return path.resolve(override);
  const env = process.env.AGENT_SANDBOX;
  if (env) return path.resolve(env);
  return path.join(homedir(), "agent-sandbox");
}

/** 检查 target 是否位于 root 内部（resolve 后），防符号链接不在此列 */
export function isInside(root: string, target: string): boolean {
  const rel = relative(root, target);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

/**
 * 将用户传入的相对/绝对路径解析为沙盒内绝对路径。
 * 越界（../ 逃逸或绝对路径指向根外）抛 LlmValidationError。
 * "/" 与 "\" 视为沙盒根本身。
 */
export function resolveInSandbox(root: string, userPath: string): string {
  if (typeof userPath !== "string" || !userPath.trim()) {
    throw new LlmValidationError("Path is required");
  }
  const trimmed = userPath.trim();
  if (trimmed === "/" || trimmed === "\\") return root;
  const resolved = isAbsolute(trimmed)
    ? path.normalize(trimmed)
    : path.resolve(root, trimmed);
  if (!isInside(root, resolved)) {
    throw new LlmValidationError(`Path escapes sandbox: ${userPath}`);
  }
  return resolved;
}

/** 拒绝访问的敏感文件名（精确匹配 basename） */
const SENSITIVE_NAMES = new Set([
  ".env",
  ".env.local",
  ".env.production",
  "id_rsa",
  "id_ed25519",
  "id_dsa",
  "known_hosts",
  "authorized_keys",
  ".bash_history",
  ".zsh_history",
]);

/** 拒绝访问的扩展名 */
const SENSITIVE_EXT = new Set([
  ".db",
  ".sqlite",
  ".sqlite3",
  ".pem",
  ".key",
  ".p12",
  ".pfx",
]);

/**
 * 校验文件可读性：拒绝敏感文件。
 * 传入已解析的沙盒内绝对路径。
 */
export function assertReadable(name: string, fullPath: string): void {
  const basename = path.basename(fullPath).toLowerCase();
  const ext = path.extname(fullPath).toLowerCase();
  if (SENSITIVE_NAMES.has(basename)) {
    throw new LlmValidationError(`File is restricted: ${name}`);
  }
  if (SENSITIVE_EXT.has(ext)) {
    throw new LlmValidationError(`File type is restricted: ${name}`);
  }
}

/** 单文件读取上限（字节），防超大文件撑爆 LLM context */
export const MAX_READ_BYTES = 1024 * 1024; // 1MB

export function maxReadBytes(): number {
  const v = Number(process.env.AGENT_MAX_READ_BYTES);
  return Number.isFinite(v) && v > 0 ? v : MAX_READ_BYTES;
}

/** 单文件写入上限（字节） */
export const MAX_WRITE_BYTES = 1024 * 1024; // 1MB

export function maxWriteBytes(): number {
  const v = Number(process.env.AGENT_MAX_WRITE_BYTES);
  return Number.isFinite(v) && v > 0 ? v : MAX_WRITE_BYTES;
}

/** 确保沙盒根目录存在（幂等） */
export async function ensureSandboxRoot(root: string): Promise<string> {
  await mkdir(root, { recursive: true });
  return root;
}

async function realPathOrUndefined(p: string): Promise<string | undefined> {
  try {
    return await realpath(p);
  } catch {
    return undefined;
  }
}

/**
 * 符号链接真实路径校验：沿 target 向上找到第一个已存在路径，解析真实路径（symlink 目标），
 * 必须仍位于 root 内。用于 read / write / command 前统一调用，防 symlink 逃逸。
 * 目标本身不存在（写入新文件）时退化为校验其最近存在的祖先目录。
 */
export async function assertRealPathInside(root: string, target: string): Promise<void> {
  const rootReal = (await realPathOrUndefined(root)) ?? root;
  let p = target;
  for (;;) {
    const real = await realPathOrUndefined(p);
    if (real !== undefined) {
      if (!isInside(rootReal, real)) {
        throw new LlmValidationError(`Path escapes sandbox via symlink: ${target}`);
      }
      return;
    }
    const parent = path.dirname(p);
    if (parent === p) {
      // 已追踪到路径顶端仍不存在（仅在 root 不存在时发生，调用方已 ensure）
      throw new LlmValidationError(`Path has no existing ancestor inside sandbox: ${target}`);
    }
    p = parent;
  }
}

export { sep };
