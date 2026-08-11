# CONTEXT.md — AI Model Management System 领域术语表

> 本文档定义项目的领域语言（Ubiquitous Language）。
> 所有代码、文档、注释必须使用以下术语，不得替换为同义词。

---

## 核心实体

### Provider（供应商）
- **定义**：LLM API 的接入点，承载连接属性（base_url、认证方式、协议类型）
- **英避**：不要用 "vendor"、"service"、"API"、"endpoint" 替代
- **属性**：id, name, baseUrl, protocol, authType, healthStatus, isEnabled
- **状态机**：UNKNOWN → HEALTHY | DEGRADED | UNREACHABLE
- **内置保护**：isBuiltin=true 的 Provider 不可删除

### Model（模型）
- **定义**：具体的 LLM 实例，承载能力声明（context_window、temperature、capabilities）
- **英避**：不要用 "AI"、"LLM"、"algorithm"、"model_version" 替代
- **与 Provider 的关系**：多对一（一个 Provider 提供多个 Model）
- **互斥**：同一 Provider 下 model_name 唯一

### ModelGroup（模型分组）
- **定义**：用户自定义的模型集合，用于组织和快速筛选
- **英避**：不要用 "category"、"folder"、"collection"、"tag" 替代

### ModelCatalog（模型目录）
- **定义**：Provider + Model 的运行时聚合视图，统一查询入口
- **职责**：多源聚合、缓存管理、来源追踪
- **英避**：不要用 "registry"、"index"、"list" 替代

---

## 关键概念

### Context Window（上下文窗口）
- **定义**：单次对话可承载的最大 token 数
- **计算**：effective_limit = contextWindow × effectivePercent
- **单位**：tokens

### Auto Compact（自动压缩）
- **定义**：当会话 token 达到阈值时，自动调用 LLM 生成摘要替换历史
- **触发**：session_tokens >= autoCompactThreshold
- **策略**：固定比例 / 动态比例 / 模型特定

### Health Status（健康状态）
- **HEALTHY**：API 可达且认证有效
- **DEGRADED**：API 可达但响应异常（HTTP 4xx/5xx）
- **UNREACHABLE**：网络不可达或超时
- **UNKNOWN**：尚未检查

### Capability（能力）
- **TEXT**：文本对话
- **VISION**：图像理解
- **TOOL_CALLING**：工具调用
- **REASONING**：推理思考
- **MCP**：Model Context Protocol
- **PROMPT_CACHE**：提示缓存
- **STREAMING**：流式输出

### Approval（审批）
- **定义**：权限为 ask 的工具调用在真正执行前，需获得授权人（前端用户）明确批准或拒绝的过程
- **英避**：不要用 "permission"、"confirm"、"audit" 替代
- **生命周期**：pending → approved | rejected | timeout
- **决定**：approve / reject；超时或 run 取消按 rejected 处理

### AgentRun（运行记录）
- **定义**：Agent 一次完整任务的持久化记录（run 聚合 + messages/toolCalls/tokenEvents 子表）
- **英避**：不要用 "job"、"task"、"session" 替代（task 指用户输入的任务文本）
- **标识**：`clientRunId`（客户端生成，审批轮询与落库共用；缺省服务端生成 UUID）

### PendingApproval（待审批项）
- **定义**：运行中一次 ask 工具请求在内存队列中的条目，前端轮询发现后弹窗决定
- **存储**：单实例内存（ApprovalStore），非 DB；30s 清理已决条目

---

## 协议类型

| Protocol | 说明 | API 路径 |
|----------|------|----------|
| OPENAI_COMPATIBLE | OpenAI 兼容格式 | /v1/chat/completions |
| ANTHROPIC | Anthropic 原生格式 | /v1/messages |
| GOOGLE_GEMINI | Google Gemini 格式 | :generateContent |
| OLLAMA | Ollama 本地格式 | /api/chat |

---

## 数据流术语

| 术语 | 定义 |
|------|------|
| Discovery | 从远程 API 获取模型列表的过程 |
| Aggregation | 本地 + 远程数据的合并去重 |
| Reorder | 用户拖拽/调整排序权重 |
| SwitchModel | 切换当前会话使用的模型 |
| HealthCheck | 探测 Provider 可达性和认证有效性 |
| PollApprovals | 前端在 run 进行中轮询待审批项列表（GET /agent/runs/:runId/approvals） |
| SettleApproval | 对审批项作出最终决定（approve/reject），唤醒等待的 runAgent 继续执行 |
| PersistRun | AgentRun 完成后一次性单事务落库（run + messages + toolCalls + tokenEvents） |

---

> ⚠️ 术语变更必须先更新本文档，再修改代码。