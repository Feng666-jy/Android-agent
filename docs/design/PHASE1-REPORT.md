# Phase 1 完成报告 — LLM Adapter 层

> 日期：2026-08-10 · 状态：✅ 完成并验证（106/106 测试通过）
> 用途：供后续任何接手的 AI/工程师快速了解已做什么、下一步做什么。
> 更完整的交接上下文见 `C:\Users\1\AppData\Local\Temp\opencode\handoff-android-agent-phase2.md`

## 一、本阶段做了什么

在 `server/src/services/llm/` 建立了**统一 LLM 适配层**，把 4 种 Provider 协议（OPENAI_COMPATIBLE / ANTHROPIC / GOOGLE_GEMINI / OLLAMA）归一为同一套类型与接口，并新增对话 API。

### 新增/改动文件

| 文件 | 职责 |
|------|------|
| `services/llm/types.ts` | 统一类型：`ChatMessage/ToolCall/ChatResponse/ChatStreamEvent/ChatRequest/ProviderConfig/ModelConfig/TokenUsage/ProtocolType` |
| `services/llm/errors.ts` | 错误体系 + 错误码：3000 不可达 / 3001 认证失败 / 3002 上游错误 / 1001 参数错误 |
| `services/llm/base.ts` | `BaseHandler` 抽象类：可注入 fetch 的统一 chat/stream 编排、SSE 逐行解析、token 估算、toolCall 归一化 |
| `services/llm/factory.ts` | 按 `provider.protocol` 选择 handler 的工厂 |
| `services/llm/index.ts` | `llmService` 深度模块：`resolveTarget`（DB 解析）、`chat`、`stream`、`countTokens` |
| `services/llm/protocols/openai.ts` | OPENAI_COMPATIBLE（OpenAI/DeepSeek/Qwen/Moonshot 等兼容端点） |
| `services/llm/protocols/anthropic.ts` | ANTHROPIC（system 提升顶层、tool_result 块、流式 input_json 累积） |
| `services/llm/protocols/gemini.ts` | GOOGLE_GEMINI（role=model、systemInstruction、functionDeclarations） |
| `services/llm/protocols/ollama.ts` | OLLAMA（NDJSON 流、options 映射） |
| `controllers/chat.controller.ts` | 薄控制器 + Zod schema + SSE 输出 + 错误码映射 |
| `routes/chat.routes.ts` | `POST /api/chat/completions`（鉴权 + validate） |
| `routes/index.ts` | 挂载 `/chat` |

### 关键设计决策

1. **统一接口**：所有协议转换到统一领域类型，service/controller/agent 只见一套类型（遵循 CONTEXT.md 术语）。
2. **fetch 可注入**：`BaseHandler(fetchImpl)` 构造注入，测试用 mock、APK 内嵌可替换传输层。
3. **配置来源**：Provider 行 `baseUrl/protocol/apiKeyEncrypted/metadata`，Model 行 `modelName/temperature/maxOutputTokens/customHeaders/customParams`；请求显式传参优先。
4. **`apiKeyEncrypted` 目前明文**（无加解密逻辑），Phase 5 安全时处理。
5. **SSE 客户端断开判定用 `res.on("close")`**，勿用 `req.on("close")`（请求体读完后即触发，导致首个事件就 break）。

### API 形态

```
POST /api/chat/completions   (Bearer JWT)
{ "modelId":"<uuid>", "messages":[{"role":"user","content":"hi"}], "stream":false }
→ { "code":0, "data":{ "content":"...", "toolCalls":[], "usage":{...} } }

stream:true → SSE：
data: {"type":"content_delta","delta":"Hel"}
data: {"type":"done","content":"Hello","toolCalls":[]}
data: [DONE]
```

### 验证结果

- `npm test`：**106 pass / 0 fail**（Phase 0 的 78 + Phase 1 新增 28）
- 新增生产文件 tsc 0 错误
- E2E 冒烟通过：本地 mock LLM 服务器 + 真 provider/model → 非流式返回内容、流式 SSE 正常

## 二、下一步（Phase 2 Agent 编排器）

路径：`server/src/services/agent/`

**必须遵守的审查约束（已定稿）：**
1. 工具安全边界：read_file/list_dir/search 限定 sandbox 根目录（`path.resolve` 后校验在根内，防 `../` 逃逸）；read_file 设大小上限（建议 1MB）；search 用 Node 递归（勿依赖 rg）。
2. LLM 接口带 modelId（Phase 1 已支持，agent 调用必须传）。
3. Agent Loop 熔断：最大循环 10 次；单次调用超时（base.ts 默认 60s 已实现）；总 token 预算（`llmService.countTokens` 累计）；`/api/agent/run` 需超时/取消（AbortSignal + 客户端断开）。
4. 测试：mock LLM 层，勿调真实 API；sandbox/测试文件用 os.tmpdir 建 fixture，测试后清理。

**实施计划：**
1. `services/agent/`：tool-registry / orchestrator / session + `tools/`（list_dir/read_file/search）+ sandbox.ts（路径校验）
2. `POST /api/agent/run` 路由（body：`{modelId, task}`），Zod + 鉴权
3. 测试：mock llmService + tmpdir fixture
4. 明确不做：write_file / edit_file / run_command（Phase 3 安全控制再实现）

## 三、后续（Phase 1 之后全景）

- **Phase 3 沙盒**：sandbox.ts 强化 — 权限模型 auto/ask、run_command（child_process + 超时/截断）
- **Phase 4 前端**：Capacitor 打包 APK（或先 PWA），Agent 界面：任务输入/工具日志/文件树/审批弹窗
- **Phase 5 安全**：API Key 加密存储、日志脱敏、命令审批 UI

## 四、APK 打包接缝（用户全程要求留后手）

- 已保证：零原生依赖（node:sqlite 内置）、无平台硬编码、fetch 可注入、baseUrl/apiKey 存 DB
- 待保证：沙盒根目录 / DATABASE_URL / PORT 均走 env 可覆盖

## 五、雷区（给接手者）

- 根 `prisma/` 保留作参考，已无代码引用
- `models.service.ts` 是死代码（查不存在的 deepseekModel），勿接路由
- server tsc 报错都在 `__tests__` 基建 + `model.controller.ts`/`provider.controller.ts` 的未使用变量（既有遗留）
- SSE 客户端断开用 `res.on("close")`
- `apiKeyEncrypted` 明文，接入真实 key 前先做 Phase 5 加密
