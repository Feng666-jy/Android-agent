# Phase 3 完成报告 — 沙盒强化（写工具 / run_command / 权限模型）

> 日期：2026-08-11 · 状态：✅ 完成并验证（169/169 通过，3 个 symlink 用例按平台跳过）
> 用途：供后续任何接手的 AI/工程师快速了解已做什么、下一步做什么。

## 一、本阶段做了什么

在 Phase 2 的只读 Agent 之上补齐三个能力：**写工具**（write_file / edit_file）、**命令执行**（run_command）、**工具级权限模型**（allow / ask / deny），并把符号链接真实路径校验补进全部文件工具。

### 新增/改动文件

| 文件 | 职责 |
|------|------|
| `services/agent/sandbox.ts`（改） | 新增 `assertRealPathInside`（沿目标向上解析 symlink 真实路径，防链接逃逸根外）、`maxWriteBytes`、`ensureSandboxRoot`（幂等建根） |
| `services/agent/types.ts`（改） | 新增 `ToolPermission` / `PermissionConfigInput` / `PermissionConfig` / `ApprovalRequest` / `ApprovalHandler`；`AgentRunInput` 增加 `permission` / `approvalHandler` |
| `services/agent/permissions.ts`（新） | 默认策略（默认 allow；write_file/edit_file=ask；run_command=deny）、`normalizePermissionConfig`（忽略非法值）、`resolvePermission`（工具覆盖 > 工具默认 > 全局默认）、`defaultDenyHandler`（无审批句柄时拒绝 ask） |
| `services/agent/system-prompt.ts`（新） | 系统提示词把每个工具的权限级别告知 LLM（`name [allow/ask/deny]`） |
| `services/agent/tools/fs-write-tools.ts`（新） | `write_file`（自动建父目录、append 模式、大小上限、拒绝越界/敏感文件/symlink 逃逸）、`edit_file`（替换首次匹配、旧文本未命中报错、超限拒绝） |
| `services/agent/tools/command-tool.ts`（新） | `run_command`：cwd 限定沙盒根；timeout（默认 15s，上限 60s）超时**杀整棵进程树**（Windows `taskkill /T /F`，POSIX 杀进程组）；输出截断（默认 32KB）；非零退出码是合法结果 |
| `services/agent/tools/fs-tools.ts`（改） | list_dir / read_file / search 补 `assertRealPathInside`（与写/命令形成统一防线） |
| `services/agent/tool-registry.ts`（改） | 注册 write_file / edit_file / run_command |
| `services/agent/orchestrator.ts`（改） | `runAgent` 开头 `ensureSandboxRoot`；工具执行经 `executeWithPermission` 权限门（allow 直行 / ask 调 approvalHandler / deny 直接拒绝）；系统提示词换 system-prompt.ts |
| `services/agent/index.ts`（改） | 导出新模块 + `createDefaultRegistry` 注册全部六工具 |
| `controllers/agent.controller.ts`（改） | `agentRunSchema` 支持 `permission`；透传 `runAgent`（HTTP 层不注入 approvalHandler → ask 由 defaultDenyHandler 拒绝） |

### 关键设计决策

1. **默认最小权限**：`run_command` 出厂即 `deny`（无法做 OS 级隔离，shell 可 `cd ..` 出根），靠权限策略显式放开；`write_file`/`edit_file` 出厂 `ask`。`POST /api/agent/run` 不注入审批句柄，因此写操作在 HTTP 层默认被拒——权限配置只在服务层显式 `allow` 时才执行，安全性不依赖外部输入。
2. **ask 语义可插拔**：`ApprovalHandler(request, execute)` 由调用方注入，批准自行调 `execute()`，拒绝返回 `{ok:false}`；缺省 `defaultDenyHandler` 返回“需要审批”的拒绝文本，agent 可读取 output 自行恢复。
3. **规范化即审计**：`normalizePermissionConfig` 丢弃非法权限值、合并默认清单，保证运行时 `resolvePermission` 的结果恒为三态之一。
4. **进程树击杀**：超时用 `spawn`+看门狗，Windows 用 `taskkill /pid <pid> /T /F`（测试中发现仅杀壳进程会留下孙进程占目录句柄），POSIX `detached` 后杀进程组。
5. **symlink 防线**：`assertRealPathInside` 沿目标向上解析最近存在路径的真实路径，必须仍在根内；新增文件退化为校验其祖先目录。Windows 无管理员时无法建 junction 的用例自动跳过（`{skip}`）。
6. **错误语义不变**：工具内部预期错误收敛为 `{ok:false,output}` 回填给 LLM；deny/ask 拒绝同样按工具结果回填，不中断 agent 循环。

### API 形态（新增字段）

```
POST /api/agent/run   (Bearer JWT)
{ "modelId":"<uuid>", "task":"...",
  "permission": { "default":"allow", "tools":{ "write_file":"allow", "run_command":"deny" } },
  "approvalHandler": "服务层注入（HTTP 不暴露）" }
```

### 验证结果

- `npm test`：**169 pass / 0 fail / 3 skipped**（Phase 2 的 139 + Phase 3 新增 30；3 个 skipped 为 Windows 无 junction 的 symlink 用例，POSIX 上会执行）
- 生产代码 tsc：`services/agent/*` 与 `controllers/agent.controller.ts` 0 错误（server tsc 的遗留测试文件 TS5097/未使用变量与 Phase 2 报告一致，均非本阶段引入；`fs-tools.ts` 的 `no-inner-declarations` 为既有 `walk` 嵌套函数）
- 新增测试覆盖：permissions 单元、write_file/edit_file 全路径、run_command 退出码/超时击杀/截断/进程树清理、orchestrator 权限门（deny/ask 批准/ask 拒绝/无句柄缺省拒绝/allow 直行）

## 二、下一步（Phase 4）

1. ✅ **Agent 前端界面**（见 [PHASE4-REPORT.md](./PHASE4-REPORT.md)）：任务输入、工具调用日志、审批弹窗（`approvalHandler` 桥接到 UI，ask 流程已跑通）
2. ✅ **会话持久化**（见 [PHASE4-REPORT.md](./PHASE4-REPORT.md)）：AgentState 落库（`agent_runs` 等四表），支持历史任务回看
3. 若暴露 run_command 给 UI：考虑按命令前缀（npm/ls 白名单）的细粒度策略，而非 only 全局 deny/allow

## 三、雷区（给接手者）

- 工具直接单测需自造 `ToolContext{ sandboxRoot }`；orchestrator 会先 `ensureSandboxRoot`
- Windows 杀进程树依赖 `taskkill`；POSIX 依赖 `detached` 进程组，两者实现不同（见 command-tool.ts `runShell`）
- `assertRealPathInside` 目标不存在时校验最近存在祖先；根目录本身不存在时先 `ensureSandboxRoot`
- HTTP 层不注入 approvalHandler：前端要跑写工具必须先把审批信号桥到服务层（Phase 4）