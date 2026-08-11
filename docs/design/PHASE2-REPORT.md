# Phase 2 完成报告 — Agent 编排器

> 日期：2026-08-10 · 状态：✅ 完成并验证（139/139 测试通过）
> 用途：供后续任何接手的 AI/工程师快速了解已做什么、下一步做什么。

## 一、本阶段做了什么

在 `server/src/services/agent/` 建立了**只读文件分析 Agent 编排器**：tool-registry / sandbox / orchestrator / session + 三个只读工具，并新增 `POST /api/agent/run`。

### 新增/改动文件

| 文件 | 职责 |
|------|------|
| `services/agent/types.ts` | `AgentRunInput/AgentState/AgentResult/AgentTool/ToolCallRecord` + 熔断参数归一化 |
| `services/agent/sandbox.ts` | 沙盒边界：`resolveSandboxRoot`（env 可覆盖）、`resolveInSandbox`（防 `../` 逃逸）、`assertReadable`（敏感文件/扩展名黑名单）、`maxReadBytes` |
| `services/agent/tool-registry.ts` | 工具注册表：`register/getDefinitions/executeTool`；执行错误收敛为 `{ok:false,output}` 让 LLM 自行恢复；内置三工具默认注册 |
| `services/agent/tools/fs-tools.ts` | `list_dir` / `read_file` / `search`（Node 递归扫描，跳过 .git/node_modules 等） |
| `services/agent/session.ts` | `AgentSession`：消息历史、工具记录、token 累计、状态机（running/completed/failed/cancelled/budget_exceeded） |
| `services/agent/orchestrator.ts` | `runAgent` 核心循环：LLM 调用 → 工具执行 → 回填 → 熔断 |
| `services/agent/index.ts` | 聚合导出 |
| `controllers/agent.controller.ts` | 薄控制器 + Zod schema + 客户端断开 abort + 错误码映射 |
| `routes/agent.routes.ts` + `routes/index.ts` | 挂载 `POST /api/agent/run`（鉴权 + validate） |

### 关键设计决策

1. **循环熔断（三层）**：
   - `maxIterations`（默认 10，上限 50）：防御 tool-call 死循环
   - `tokenBudget`（默认 100k）：每次迭代前用 `llmService.countTokens` 估算历史，超限置 `budget_exceeded`
   - `llmTimeoutMs`（默认 60s）+ 外部 `signal`：单次调用超时用 `AbortSignal.timeout` 合并外层 signal（`AbortSignal.any` 带 <20.3 回退）
2. **错误语义**：已知 LLM 错误（LlmValidationError/Auth/Unreachable/Error）**透传** controller 映射 HTTP 状态码（与 chat 一致）；未知错误转 `failed` 状态；取消转 `cancelled`。
3. **工具错误不抛出**：路径越界/文件缺失/敏感文件等预期错误由工具捕获返回 `ok:false`，LLM 可读 output 修正参数重试。
4. **安全边界**：所有文件路径经 `path.resolve` 后校验在沙盒根内；`/` 与 `\` 视为根（Windows 上 `path.resolve(root,"/")` 会落到盘符根，已特殊处理）；read_file 上限 1MB（`AGENT_MAX_READ_BYTES` 可覆盖）；`.env`/`.sqlite`/私钥等拒绝读取。
5. **`/api/agent/run` 取消**：`res.on("close")` + 未 `writableEnded` 时 abort，与 chat 流式一致。
6. **controller 返回 promise**：`run()` 返回 Promise（Express 忽略返回值），便于测试 await 与结果断言。

### API 形态

```
POST /api/agent/run   (Bearer JWT)
{ "modelId":"<uuid>", "task":"探索沙盒里有什么", "maxIterations":10, "tokenBudget":100000, "sandboxRoot":"可选" }
→ { "code":0, "data":{ "status":"completed", "result":"...", "iterations":2, "toolCalls":1,
      "tokens":{...}, "state":{ "id","status","messages","toolHistory","tokenUsed",... } } }
```

### 验证结果

- `npm test`：**139 pass / 0 fail**（Phase 0+1 的 106 + Phase 2 新增 33）
- 新增生产文件 tsc 0 错误（server tsc 既有遗留错误与 Phase 1 报告一致，均在 `__tests__` 基建 + model/provider.controller 未使用变量）
- 测试用 `mock.method(llmService,"chat")` 驱动 orchestrator，工具测试用 `os.tmpdir` fixture 并在 afterEach 清理

## 二、下一步（Phase 3 沙盒强化）

明确不做（已在 Phase 2 边界内预留）：
1. `write_file` / `edit_file` / `run_command`：Phase 3 安全控制（child_process + 超时/截断 + 审批）再实现
2. sandbox.ts 权限模型（auto/ask 审批）、符号链接真实路径校验（当前防字符串逃逸，未防 symlink 指向根外）
3. Agent 前端界面（Capacitor/PWA）：任务输入、工具日志、文件树、审批弹窗

## 三、雷区（给接手者）

- 工具执行上下文 `{ sandboxRoot }` 由 orchestrator 注入；直接单测工具时需自行构造 `ToolContext`
- `toolRegistry` 是单例，内置三工具在模块加载时注册；自定义注册表用 `createDefaultRegistry()` 或 `new ToolRegistry()` + register
- 沙盒默认根 `~/agent-sandbox`（`AGENT_SANDBOX` env 覆盖）；E2E 前先创建目录
- search 默认跳过 `.git`/`node_modules`/`.venv`/`dist`/`.cache`，只扫文本扩展名（含 dotfile）
- Windows 路径注意：搜索返回的相对路径用 `\` 分隔，断言用 `endsWith` 而非拼接 `/`
