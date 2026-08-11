/**
 * Agent 服务 — 聚合导出
 */

import { listDirTool, readFileTool, searchTool } from "./tools/fs-tools.js";
import { writeFileTool, editFileTool } from "./tools/fs-write-tools.js";
import { runCommandTool } from "./tools/command-tool.js";
import { ToolRegistry } from "./tool-registry.js";

export * from "./types.js";
export * from "./sandbox.js";
export * from "./session.js";
export * from "./permissions.js";
export * from "./approval-store.js";
export { ToolRegistry, toolRegistry } from "./tool-registry.js";
export { runAgent } from "./orchestrator.js";
export { buildSystemPrompt } from "./system-prompt.js";
export * from "./agent-session.service.js";
export { listDirTool, readFileTool, searchTool } from "./tools/fs-tools.js";
export { writeFileTool, editFileTool } from "./tools/fs-write-tools.js";
export { runCommandTool } from "./tools/command-tool.js";

/** 默认注册表：注册内置工具（幂等） */
export function createDefaultRegistry(): ToolRegistry {
  const registry = new ToolRegistry();
  registry.register(listDirTool);
  registry.register(readFileTool);
  registry.register(searchTool);
  registry.register(writeFileTool);
  registry.register(editFileTool);
  registry.register(runCommandTool);
  return registry;
}
