# Architecture.md — AI Model Management System 架构设计

> 本文档是 AI Model Management System 的最高设计权威。
> 所有模块设计、数据库设计、接口设计必须以本文档为准。

---

## 1. 设计原则

| 原则 | 来源 | 在本项目中的体现 |
|------|------|------------------|
| **Provider/Model 解耦** | CodexPlusPlus relay_config | Provider 是连接属性（base_url、auth），Model 是能力声明（context_window、temperature），二者自由组合 |
| **Opt-in 零侵入** | CodexPlusPlus model_catalog | 新功能（auto_compact、reasoning_budget）通过扩展字段实现，旧数据无感知 |
| **Fallback Chain** | CodexPlusPlus suffix parser | 参数优先级：用户设置 → 模型默认值 → Provider 默认值 → 系统硬编码兜底 |
| **多源聚合** | CodexPlusPlus catalog | 模型来源：本地配置 → 远程 API → 环境变量 → bundled defaults |
| **Profile 隔离** | CodexPlusPlus per-profile catalog | 每个 Provider 配置独立存储，互不污染 |
| **插件化扩展** | CodexPlusPlus context entry | 新增 Provider 类型只需实现接口，无需修改核心代码 |

---

## 2. 核心抽象

### 2.1 Provider（供应商）

Provider 代表一个 LLM API 接入点，承载连接属性：

```
Provider
├── id: String              // 唯一标识（如 "openai", "deepseek", "ollama-local"）
├── name: String            // 显示名称（如 "OpenAI", "DeepSeek", "本地 Ollama"）
├── baseUrl: String         // API 端点
├── protocol: Enum          // OPENAI_COMPATIBLE | ANTHROPIC | GOOGLE_GEMINI | OLLAMA
├── authType: Enum          // API_KEY | OAUTH | BEARER_TOKEN | NONE
├── apiKey: String?         // 加密存储
├── isEnabled: Boolean      // 是否启用
├── healthStatus: Enum      // HEALTHY | DEGRADED | UNREACHABLE | UNKNOWN
├── lastChecked: DateTime?  // 最后健康检查时间
├── metadata: Map<String, Json>  // 扩展字段（未来新增无需迁移）
└── createdAt: DateTime
```

**设计决策：为什么 Provider 与 Model 分离？**

- 一个 Provider（如 OpenAI）可提供多个 Model（GPT-4o, o1, o3）
- 一个 Model 名称（如 `claude-sonnet-4`）可在不同 Provider 上运行（Anthropic 官方 vs AWS Bedrock）
- 分离后切换 Provider 不影响 Model 配置，切换 Model 不影响 Provider 连接

### 2.2 Model（模型）

Model 代表一个具体的 LLM 实例，承载能力声明：

```
Model
├── id: String              // 唯一标识
├── providerId: String      // 关联 Provider
├── modelName: String       // Provider 侧标识（如 "gpt-4o-2024-08-06"）
├── displayName: String     // 用户可见名称（如 "GPT-4o"）
├── aliases: List<String>   // 用户自定义别名
├── isFavorite: Boolean     // 是否收藏
├── sortOrder: Int          // 排序权重
├── isDefault: Boolean      // 是否为默认模型
│
├── contextWindow: Int      // 上下文窗口（tokens）
├── maxOutputTokens: Int    // 最大输出 tokens
├── autoCompactThreshold: Int  // 自动压缩触发阈值（tokens）
├── effectivePercent: Float    // 有效上下文百分比（0.0-1.0）
│
├── temperature: Float      // 默认温度
├── topP: Float?            // 默认 top_p
├── frequencyPenalty: Float?
├── presencePenalty: Float?
│
├── capabilities: Set<Enum> // TEXT | VISION | TOOL_CALLING | REASONING | MCP | PROMPT_CACHE | STREAMING
├── reasoningBudget: Int?   // 推理预算（tokens，用于 o1/o3/claude thinking）
│
├── promptTemplate: String? // 系统提示词模板
├── customHeaders: Map<String, String>  // 自定义请求头
├── customParams: Map<String, Json>     // 自定义请求参数
│
├── groupId: String?        // 所属分组
├── tags: List<String>      // 用户标签
│
├── isEnabled: Boolean
├── usageStats: UsageStats  // 使用统计（总请求数、总 tokens、最后使用时间）
├── createdAt: DateTime
└── updatedAt: DateTime
```

### 2.3 ModelGroup（模型分组）

```
ModelGroup
├── id: String
├── name: String            // 如 "日常对话", "代码生成", "推理任务"
├── description: String?
├── icon: String?           // 图标标识
├── color: String?          // 分组颜色
├── sortOrder: Int
├── isPinned: Boolean       // 是否置顶
├── createdAt: DateTime
```

### 2.4 ModelCatalog（模型目录）

Catalog 是 Provider + Model 的运行时聚合视图，承担职责：

1. **统一查询入口**：上层不需要知道数据来自 SQLite 还是远程 API
2. **多源聚合**：本地配置 + 远程发现 + 环境变量 → 统一视图
3. **缓存层**：远程模型列表缓存，避免每次请求 API
4. **来源追踪**：每条记录携带 source 信息，UI 可标注"来自哪里"

```
ModelCatalog
├── entries: List<CatalogEntry>
├── sources: List<CatalogSource>
├── lastRefreshed: DateTime
└── refreshStatus: Enum     // IDLE | LOADING | SUCCESS | PARTIAL_FAILURE | FAILURE

CatalogEntry
├── model: Model
├── provider: Provider
├── source: CatalogSource   // 来源信息
├── isAvailable: Boolean    // 当前是否可用（API 可达 + 认证有效）
└── confidence: Float       // 可用性置信度（0.0-1.0）

CatalogSource
├── type: Enum              // LOCAL_CONFIG | REMOTE_API | ENVIRONMENT | BUNDLED
├── id: String
├── lastFetched: DateTime
├── itemCount: Int
└── status: Enum
```

### 2.5 ConfigStore（配置存储）

配置分层（借鉴 CodexPlusPlus 四层模型）：

| 层次 | 存储位置 | 职责 | 优先级 |
|------|----------|------|--------|
| **用户配置** | SQLite / DataStore | 用户自定义的 Provider、Model、分组 | 最高 |
| **会话配置** | 内存 / 临时存储 | 当前会话覆盖（如临时切换 temperature） | 次高 |
| **Provider 默认** | Provider 元数据 | 每个 Provider 的默认参数 | 次低 |
| **系统默认** | bundled JSON | 硬编码兜底值 | 最低 |

---

## 3. 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Model Picker │  │ Provider     │  │  Settings     │  │
│  │  (Compose)    │  │ Manager      │  │  Screen       │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                │                   │           │
│  ┌──────┴────────────────┴───────────────────┴───────┐  │
│  │              ViewModel Layer                        │  │
│  │  ModelPickerViewModel │ ProviderViewModel │ ...    │  │
│  └──────────────────────┬────────────────────────────┘  │
├─────────────────────────┼───────────────────────────────┤
│                    Domain Layer                          │
│  ┌──────────────────────┴────────────────────────────┐  │
│  │              UseCase Layer                         │  │
│  │  GetModels │ SwitchModel │ RefreshCatalog │ ...   │  │
│  └──────────────────────┬────────────────────────────┘  │
│  ┌──────────────────────┴────────────────────────────┐  │
│  │              Repository Layer                      │  │
│  │  ModelRepository │ ProviderRepository │ CatalogRepo│  │
│  └──────────────────────┬────────────────────────────┘  │
├─────────────────────────┼───────────────────────────────┤
│                    Data Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Room DB │  │  DataStore│  │  Remote  │  │ Bundled│  │
│  │  (SQLite) │  │  (Prefs) │  │  API     │  │  JSON  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 数据流

### 4.1 模型选择流程

```
用户点击 ModelSelector
  → ViewModel.getModels()
    → UseCase.GetModels()
      → Repository.getModels()
        → [本地] Room DB 查询
        → [远程] Provider API 获取模型列表
        → [聚合] 合并 + 去重 + 排序
      → Repository 返回 ModelCatalog
    → UseCase 应用用户偏好（收藏、默认、别名）
  → ViewModel 暴露 StateFlow<ModelPickerUiState>
  → Compose UI 渲染下拉列表
用户选择模型
  → ViewModel.selectModel(modelId)
    → UseCase.SwitchModel(modelId)
      → Repository.setDefaultModel(modelId)
      → DataStore 保存当前会话选择
      → 通知 ChatViewModel 切换上下文
  → UI 更新选中状态
```

### 4.2 Provider 健康检查流程

```
定时触发 / 用户手动刷新
  → UseCase.HealthCheckAll()
    → 遍历所有 enabled Provider
    → 协程并发检查（withContext(Dispatchers.IO)）
      → HTTP GET /v1/models 或 /models
      → 超时 5s → DEGRADED
      → 连接失败 → UNREACHABLE
      → 200 OK → HEALTHY
    → 更新 Provider.healthStatus
    → 持久化到 Room DB
  → UI 显示状态指示器（绿/黄/灰）
```

### 4.3 自动压缩触发流程

```
每次 API 响应返回
  → 累加 session token 使用量
  → 计算 effective_limit = contextWindow * effectivePercent
  → 当 session_tokens >= autoCompactThreshold:
    → 触发 AutoCompactUseCase
    → 策略选择（固定比例 / 动态比例 / 模型特定）
    → 调用 LLM 生成摘要
    → 替换历史上下文为摘要
    → 记录压缩事件到 diagnostic log
```

---

## 5. 扩展机制

### 5.1 新增 Provider 类型

只需实现 `ProviderHandler` 接口：

```kotlin
interface ProviderHandler {
    val protocol: Protocol
    suspend fun discoverModels(provider: Provider): List<ModelDefinition>
    suspend fun healthCheck(provider: Provider): HealthStatus
    suspend fun buildRequest(provider: Provider, model: Model, messages: List<Message>): ApiRequest
    suspend fun parseResponse(provider: Provider, response: ApiResponse): ParseResult
}
```

注册方式：`ProviderRegistry.register("ollama", OllamaHandler())`

### 5.2 新增模型字段

使用 `metadata: Map<String, Json>` 扩展字段，无需数据库迁移：

```kotlin
// 新增 reasoning_budget 支持
model.metadata["reasoning_budget"] = 10000
model.metadata["prompt_cache_enabled"] = true
```

### 5.3 新增能力标签

`capabilities: Set<Capability>` 枚举扩展：

```kotlin
enum class Capability {
    TEXT, VISION, TOOL_CALLING, REASONING, MCP,
    PROMPT_CACHE, STREAMING, EMBEDDING, IMAGE_GENERATION
}
```

---

## 6. 设计决策记录（ADR）

### ADR-001：为什么用 Room 而不是 Proto DataStore？

| 方案 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| Room | 关系查询、类型安全、迁移支持 | 编译时生成代码 | ✅ 选用 |
| Proto DataStore | 类型安全、异步 | 不适合关系数据、无查询能力 | ❌ |
| DataStore Preferences | 简单 | 只适合键值对 | ❌ |
| 纯 JSON 文件 | 灵活 | 无类型安全、并发问题 | ❌ |

**决策**：Room 存储 Provider/Model/Group 关系数据，DataStore Preferences 存储用户偏好（当前选中模型、主题等）。

### ADR-002：为什么 Model 需要 aliases 字段？

用户可能想给模型起本地昵称（如把 `claude-sonnet-4-20250514` 叫"小C"）。
aliases 支持多个别名，搜索时同时匹配 displayName 和 aliases。

### ADR-003：为什么 effectivePercent 独立于 autoCompactThreshold？

- `effectivePercent`：决定"可用上下文"（如 80% 用于历史，20% 预留输出）
- `autoCompactThreshold`：决定"何时触发压缩"（绝对 token 数）
- 二者独立：不同模型可能需要不同策略（大窗口模型用固定比例，小窗口用固定值）

---

## 7. 安全设计

1. **API Key 加密**：使用 Android Keystore 加密存储，内存中使用后立即清零
2. **网络安全**：所有 API 请求强制 HTTPS（可关闭但默认开启）
3. **日志脱敏**：API Key、Bearer Token 在日志中自动替换为 `***`
4. **沙箱隔离**：不同 Provider 的配置互相不可访问

---

## 8. 性能目标

| 指标 | 目标值 |
|------|--------|
| 模型列表加载 | < 100ms（本地缓存） |
| Provider 健康检查 | < 3s（并发） |
| 模型切换 | < 50ms |
| 远程模型发现 | < 2s（每 Provider） |
| 数据库查询 | < 10ms |
| 内存占用 | < 50MB（1000 个模型） |

---

> 下一步：[Database.md](./Database.md) — 数据库表结构设计