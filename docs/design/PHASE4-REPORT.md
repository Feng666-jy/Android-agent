# Phase 4 完成报告 — Agent 审批（pending + 轮询）与会话持久化

> 日期：2026-08-11 · 状态：✅ 代码与自动化测试完成；⏳ 端到端手测待做（次日）
> 用途：供后续任何接手的 AI/工程师快速了解已做什么、下一步做什么。

## 一、本阶段做了什么

把 Agent 从「服务层可运行」推进到「前后端闭环」：跑通 **ask 审批**（前端轮询发现 → 弹窗预览 → 批准/拒绝 → runAgent 继续）和 **会话落库**（历史列表 / 详情 / 删除 / 批量删除），并在首页接入可运行的 Agent 面板。顺手把阻断 `npm run build` 的 25 个既有类型错误清掉。

### 新增/改动文件

**后端 — 审批**

| 文件 | 职责 |
|------|------|
| `services/agent/approval-store.ts`（新） | 内存待审批队列 `ApprovalStore`：`create/listByRun/get/approve/reject/settle/prune/clear`；`waitForDecision`（超时 + AbortSignal 取消）；`AGENT_APPROVAL_TIMEOUT_MS`（默认 60s，上限 300s）；进程启动后每 30s `prune` 防泄漏 |
| `services/agent/index.ts`（改） | 导出 approval-store / agent-session.service |
| `controllers/agent.controller.ts`（改） | `createApprovalHandler` 把权限 ask 桥接到 store 并 `await` 决定；新增审批三端点 + 历史五端点；`agentRunSchema` 增加 `clientRunId` |
| `routes/agent.routes.ts`（改） | 挂载审批与历史路由（全部 authMiddleware 之后） |

**后端 — 持久化**

| 文件 | 职责 |
|------|------|
| `prisma/schema.prisma`（改） | 新增 `agent_runs` / `agent_messages` / `agent_tool_calls` / `agent_token_usages` 四表，外键 `ON DELETE CASCADE`，`@@index([runId, createdAt])` |
| `services/agent/agent-session.service.ts`（新） | `saveRun`（单事务落 run+messages+toolCalls+tokenEvents）、`listRuns`（稳定排序 createdAt DESC, id DESC + 分页）、`getRun`（详情含子表）、`deleteRun` / `deleteRuns`；以 `agentSessionService` 对象导出（可 mock） |

**后端 — 测试（新增 24 个）**

| 文件 | 覆盖 |
|------|------|
| `__tests__/services/agent/approval-store.test.ts` | create/list/settle 唤醒/重复 settle 幂等/超时/已决即返回/abort 取消/prune |
| `__tests__/services/agent/agent-session.service.test.ts` | saveRun 单事务落库、listRuns 稳定排序分页、getRun 所有权校验、deleteRun/deleteRuns（mock prisma 兼容层） |
| `__tests__/controllers/agent.approvals.controller.test.ts` | 审批三端点（含 404/409 语义）、历史五端点（分页校验、404、批量删除） |
| `__tests__/controllers/agent.controller.test.ts`（改） | `run` 用例注入 `saveRun` mock，避免写真实 DB |

**前端**

| 文件 | 职责 |
|------|------|
| `src/api/agent.ts`（新） | Agent 域类型 + `agentAPI`（run 放开 15s 超时、支持 AbortSignal）+ `makeClientRunId` |
| `src/api/index.ts`（改） | 导出 agentAPI 与类型 |
| `src/components/ai-home/AgentRunPanel.vue`（新） | 运行面板：空态/运行中/结果/错误；1.5s 轮询审批；审批底部弹层（工具名 + JSON 参数 + 批准/拒绝）；停止 = abort；工具执行记录折叠展示 |
| `src/components/ai-home/AiHomePage.vue`（改） | 模型选择器（默认取 store 默认模型）+ `send → start(task, modelId)` 接线 |
| `src/views/HistoryView.vue`（重写） | 历史列表（加载更多/全选/单删/批量删）+ 详情底部弹层（任务/工具调用/对话消息/token 事件） |
| `src/types/index.ts`、`src/stores/model.ts`、`src/api/models.ts`、`ModelManager.vue`、`Provider{Detail,Form,List}.vue`、`tsconfig.json`（改） | 清 25 个类型错误，恢复构建门禁 |

### 关键设计决策

1. **clientRunId 契约**：客户端在发起 `POST /run` 前自行生成 `clientRunId`（≥8 字符，如 `run_<ts>_<rand>`），审批轮询与落库都以它为 key。因为 run 是**同步长任务**，只有先知道 runId，前端才能边等 run 边轮询审批。
2. **审批 = 内存态 pending + 轮询**（借鉴 CodexPlusPlus 思路）：`POST /run` 阻塞在 `waitForDecision` 上；前端并发轮询 `GET /runs/:runId/approvals`（1.5s）发现 pending 项并弹窗；`approve/reject` 经 `settle` 唤醒 waiter，runAgent 继续。超时或 run 取消（连接断开 → AbortSignal）按**拒绝**处理。重复 settle 幂等（第二次返回 409）。
3. **审批只在内存、不落库**：审批生命周期为秒级，单实例部署假设成立。多实例/重启丢审批是已知限制（可后续换 DB 队列）。
4. **持久化采用「运行即聚合 + 事件溯源子表」**：`saveRun` 在 run 完成后一次性单事务写入——同步语义下完成时已有全量 `AgentState`；messages/toolCalls/tokenEvents 各一行，读时聚合出详情；列表稳定排序（`createdAt DESC, id DESC`）保证翻页不重不漏；删除走外键级联。
5. **HTTP 层默认拒绝写操作**：前端 `AgentRunPanel` 显式带 `permission.tools = { write_file: ask, edit_file: ask, run_command: ask }`，把写类操作放进审批流；只读工具 `allow`。
6. **前端首个轮询循环**：仓库此前无 setInterval 模式；`AgentRunPanel` 用 interval + 防重入 flag + `onBeforeUnmount` 清理，run 结束/失败/取消即停。
7. **类型错误根因**：服务端 `Model.id` 是 `String @id @default(cuid())`，前端却把 `AiModel.id` 定为 `number`，连锁导致 6 处 Set/参数不匹配 + `sort` 联合类型缺 `"default"` + `isFavorite/isDefault/groupId` 未声明。统一改为 string 并补齐字段后，`vue-tsc` 归零。
8. **服务对象化以便 mock**：`agent-session.service` 以 `agentSessionService` 对象导出（对齐 `providerService`/`llmService` 约定），因为 Node 的 `mock.method` 对 ESM 命名空间函数导出不可靠。

### API 形态（实际挂载 `/api/agent`，均需 Bearer JWT）

```
POST   /agent/run
       body: { modelId, task, clientRunId?, maxIterations?, llmTimeoutMs?,
               tokenBudget?, sandboxRoot?, permission?: { default, tools } }
       → 200 { runId, status, result, iterations, toolCalls, tokens, usageByIteration, state }
         （长任务：前端放开 timeout:0 + AbortSignal；连接关闭服务端 abort）

审批（run 进行中轮询）：
GET    /agent/runs/:runId/approvals   → { id, runId, toolName, arguments, sandboxRoot, status, createdAt }[]
POST   /agent/approvals/:id/approve   → { ok, status:"approved" }   （不存在 404 / 已决 409）
POST   /agent/approvals/:id/reject    → { ok, status:"rejected" }   （不存在 404 / 已决 409）

历史会话：
GET    /agent/runs?page=&pageSize=    → { list[], total, page, pageSize }（非法分页 400）
GET    /agent/runs/:id                → summary + { messages[], toolCalls[], tokenEvents[] }（越权/不存在 404）
DELETE /agent/runs/:id                → { deleted:true }（不存在 404）
POST   /agent/runs/batch-delete       → { deleted }（仅删本人，事务）
```

### 验证结果

- 后端 agent 相关测试：**87 pass / 0 fail**（approval-store 8 + agent-session.service 5 + controller 11 + run/orchestrator/tools 既有）
- 全量 `npm test`（server + `src/__tests__`）：**193 pass / 0 fail / 3 skip**（3 skip 为 Windows 无 junction 的 symlink 用例）
- 前端 `vue-tsc --noEmit`：**0 错误**（修复前 25）
- `npm run build`（vue-tsc + vite build）：**通过**
- ⚠️ **端到端手测未做**（排期次日）：真实模型下跑一次 ask 审批、落库、历史详情、批量删除全链路

## 二、下一步

1. **端到端手测（次日）**：`npm run dev:all` → 配 Provider/模型 → 首页选模型发任务 → 观察审批弹窗实时批准/拒绝 → 历史页验证落库、详情、单删/批删；验证连接断开时 run 取消
2. **run_command 细粒度策略**：现前端把 run_command 一律 ask；后续可考虑按命令前缀白名单（npm/ls 等）降噪
3. 审批队列可评估迁 DB/Redis 以支持多实例（当前单实例内存）
4. `docs/design/API.md` / `Database.md` 仍是早期 Android/Room 构想，与 Web 实现脱节；如需与实现对齐需单独整理（本报告为准）

## 三、雷区（给接手者）

- `POST /run` 同步阻塞：**一定**要在客户端提供 `clientRunId` 并并发轮询审批，否则 ask 会等到 60s 超时按拒绝处理
- `approval-store` 是模块单例 + 30s prune：单元测试需 `afterEach` 里 `store.clear()`，避免用例串扰
- `agent-session.service` 走真实 `prisma`；测试必须替换 `prisma.agentRun` 等模型对象（见 provider.service.test 约定），且 `saveRun` 用 `prisma.$transaction`
- 前端 run 请求默认 15s 超时会掐断长任务：`agentAPI.run` 已显式 `timeout: 0`
- 轮询与 run 结束竞态：`approve` 后若 run 已完成，store 里条目可能已 `prune`，接口返回 404（前端忽略即可，`pendingApprovals` 对未知 run 返回 200 空数组便于继续轮询）
- 历史 `DELETE /runs/:id` 用 `prisma.agentRun.delete({ where: { id, userId } })`——复合条件在无 `@@unique([id, userId])` 时会整表扫描，数据量大时可加索引或改用 `deleteMany` 兜底
