> ⚠️ **现状标注（2026-08）**：本文档为早期 Android 原生（Room/Kotlin）设计档案，**不代表当前实现**。
> 当前数据库架构为 **SQLite + Custom Migration Runner + Typed Query Compatibility Layer**
> （详见 `server/src/db/SUPPORTED.md` 与 `docs/architecture-decisions.md` ADR-001）。
# Database.md — AI Model Management System 数据库设计

> 基于 Architecture.md 的规范，定义具体的数据库表结构。
> 使用 Room (SQLite) 作为 ORM 引擎。

---

## 1. 存储方案对比

| 方案 | 适用场景 | 本项目用法 |
|------|----------|------------|
| **Room (SQLite)** | 关系数据、复杂查询 | Provider / Model / Group / UsageStats |
| **DataStore Preferences** | 键值对、用户偏好 | 当前选中模型、主题、字体大小 |
| **bundled JSON** | 只读默认值 | 预置 Provider 模板、模型元数据 |

---

## 2. ER 关系图

```
Provider (1) ──── (N) Model (N) ──── (N) ModelTag
  │                │
  │                └── (N) ModelGroupMembership ──── (1) ModelGroup
  │
  └── (1) ProviderHealthLog

Model (1) ──── (N) UsageStats
Model (1) ──── (N) Conversation (future)
```

---

## 3. 表结构

### 3.1 `providers` — 供应商表

```sql
CREATE TABLE providers (
    id              TEXT PRIMARY KEY,           -- UUID 或用户自定义 slug
    name            TEXT NOT NULL,              -- 显示名称
    base_url        TEXT NOT NULL,              -- API 端点
    protocol        TEXT NOT NULL DEFAULT 'OPENAI_COMPATIBLE',
                        -- OPENAI_COMPATIBLE | ANTHROPIC | GOOGLE_GEMINI | OLLAMA
    auth_type       TEXT NOT NULL DEFAULT 'API_KEY',
                        -- API_KEY | OAUTH | BEARER_TOKEN | NONE
    api_key_encrypted TEXT,                     -- 加密后的 API Key (Android Keystore)
    is_enabled      INTEGER NOT NULL DEFAULT 1,
    health_status   TEXT NOT NULL DEFAULT 'UNKNOWN',
                        -- HEALTHY | DEGRADED | UNREACHABLE | UNKNOWN
    last_checked_at INTEGER,                    -- Unix timestamp (ms)
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_builtin      INTEGER NOT NULL DEFAULT 0,  -- 是否内置（内置不可删除）
    metadata        TEXT,                       -- JSON map（扩展字段）
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
);

CREATE INDEX idx_providers_sort ON providers(sort_order);
CREATE INDEX idx_providers_enabled ON providers(is_enabled);
```

### 3.2 `models` — 模型表

```sql
CREATE TABLE models (
    id              TEXT PRIMARY KEY,
    provider_id     TEXT NOT NULL,
    model_name      TEXT NOT NULL,              -- Provider 侧标识
    display_name    TEXT NOT NULL,
    aliases_text    TEXT,                       -- 逗号分隔的别名列表
    description     TEXT,
    
    -- 排序与收藏
    is_favorite     INTEGER NOT NULL DEFAULT 0,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_default      INTEGER NOT NULL DEFAULT 0,
    
    -- Context Window
    context_window  INTEGER NOT NULL DEFAULT 32768,
    max_output_tokens INTEGER NOT NULL DEFAULT 4096,
    auto_compact_threshold INTEGER,             -- NULL = 使用 Provider 默认值
    effective_percent REAL NOT NULL DEFAULT 0.8,  -- 0.0 ~ 1.0
    
    -- 采样参数
    temperature     REAL NOT NULL DEFAULT 0.7,
    top_p           REAL,
    frequency_penalty REAL,
    presence_penalty REAL,
    
    -- 能力
    capabilities_text TEXT,                     -- JSON array ["TEXT","VISION","TOOL_CALLING"]
    reasoning_budget INTEGER,                   -- NULL = 不支持或不启用
    
    -- 自定义
    prompt_template TEXT,
    custom_headers  TEXT,                       -- JSON map
    custom_params   TEXT,                       -- JSON map
    
    -- 分组与标签
    group_id        TEXT,
    tags_text       TEXT,                       -- JSON array
    
    -- 状态
    is_enabled      INTEGER NOT NULL DEFAULT 1,
    
    -- 扩展
    metadata        TEXT,                       -- JSON map（未来新增字段无需迁移）
    
    -- 时间
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL,
    
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES model_groups(id) ON DELETE SET NULL
);

CREATE INDEX idx_models_provider ON models(provider_id);
CREATE INDEX idx_models_group ON models(group_id);
CREATE INDEX idx_models_favorite ON models(is_favorite);
CREATE INDEX idx_models_default ON models(is_default);
CREATE INDEX idx_models_sort ON models(sort_order);

-- 唯一约束：一个 Provider 下 model_name 唯一
CREATE UNIQUE INDEX idx_models_provider_model ON models(provider_id, model_name);
```

### 3.3 `model_groups` — 模型分组表

```sql
CREATE TABLE model_groups (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    description     TEXT,
    icon            TEXT,                       -- 图标标识（Lucide/Material）
    color           TEXT,                       -- HEX 颜色 (#RRGGBB)
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_pinned       INTEGER NOT NULL DEFAULT 0,
    is_builtin      INTEGER NOT NULL DEFAULT 0,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
);

CREATE INDEX idx_model_groups_sort ON model_groups(sort_order);
CREATE INDEX idx_model_groups_pinned ON model_groups(is_pinned);
```

### 3.4 `usage_stats` — 使用统计表

```sql
CREATE TABLE usage_stats (
    id              TEXT PRIMARY KEY,
    model_id        TEXT NOT NULL,
    total_requests  INTEGER NOT NULL DEFAULT 0,
    total_tokens_input  INTEGER NOT NULL DEFAULT 0,
    total_tokens_output INTEGER NOT NULL DEFAULT 0,
    total_tokens_cached INTEGER NOT NULL DEFAULT 0,
    total_errors    INTEGER NOT NULL DEFAULT 0,
    last_used_at    INTEGER,                    -- Unix timestamp (ms)
    average_latency_ms REAL,                    -- 平均响应延迟
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL,
    
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

CREATE INDEX idx_usage_stats_model ON usage_stats(model_id);
CREATE INDEX idx_usage_stats_last_used ON usage_stats(last_used_at);
```

### 3.5 `provider_health_logs` — Provider 健康日志表

```sql
CREATE TABLE provider_health_logs (
    id              TEXT PRIMARY KEY,
    provider_id     TEXT NOT NULL,
    status          TEXT NOT NULL,              -- HEALTHY | DEGRADED | UNREACHABLE
    latency_ms      INTEGER,                    -- 响应延迟
    error_message   TEXT,                       -- 失败原因
    checked_at      INTEGER NOT NULL,
    
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

CREATE INDEX idx_health_logs_provider ON provider_health_logs(provider_id);
CREATE INDEX idx_health_logs_time ON provider_health_logs(checked_at);
```

### 3.6 `conversations` — 会话表（未来扩展）

```sql
CREATE TABLE conversations (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    model_id        TEXT NOT NULL,
    provider_id     TEXT NOT NULL,
    system_prompt   TEXT,
    total_tokens    INTEGER NOT NULL DEFAULT 0,
    message_count   INTEGER NOT NULL DEFAULT 0,
    is_archived     INTEGER NOT NULL DEFAULT 0,
    is_pinned       INTEGER NOT NULL DEFAULT 0,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL,
    
    FOREIGN KEY (model_id) REFERENCES models(id),
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

CREATE INDEX idx_conversations_model ON conversations(model_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at);
```

---

## 4. DataStore Preferences 设计

| Key | Type | 说明 |
|-----|------|------|
| `current_model_id` | String | 当前选中的模型 |
| `current_provider_id` | String | 当前选中的 Provider |
| `theme_mode` | String | SYSTEM | LIGHT | DARK |
| `font_size_scale` | Float | 字体缩放倍数 |
| `default_temperature` | Float | 全局默认温度 |
| `auto_compact_enabled` | Boolean | 是否启用自动压缩 |
| `streaming_enabled` | Boolean | 是否启用流式输出 |
| `search_history` | StringSet | 搜索历史 |
| `collapsed_groups` | StringSet | 已折叠的分组 |
| `model_picker_mode` | String | GRID | LIST | COMPACT |

---

## 5. 迁移策略

### 5.1 Room Migration

```kotlin
// 版本 1 → 2：新增 models.metadata 字段
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL("ALTER TABLE models ADD COLUMN metadata TEXT")
    }
}
```

### 5.2 未来扩展无需迁移的方案

`metadata TEXT` 字段使用 JSON 序列化，新增字段直接写入 metadata：

```kotlin
// 无需 ALTER TABLE
model.metadata = jsonObject {
    "prompt_cache_enabled" to true
    "mcp_servers" to jsonArray { "filesystem", "browser" }
    "reasoning_effort" to "medium"
}
```

---

## 6. 种子数据

应用首次启动时，从 `assets/providers.json` 加载预置 Provider：

```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "baseUrl": "https://api.openai.com/v1",
      "protocol": "OPENAI_COMPATIBLE",
      "authType": "API_KEY",
      "isBuiltin": true,
      "models": [
        {
          "modelName": "gpt-4o",
          "displayName": "GPT-4o",
          "contextWindow": 128000,
          "capabilities": ["TEXT", "VISION", "TOOL_CALLING", "STREAMING"]
        }
      ]
    },
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "baseUrl": "https://api.deepseek.com/v1",
      "protocol": "OPENAI_COMPATIBLE",
      "authType": "API_KEY",
      "isBuiltin": true,
      "models": [
        {
          "modelName": "deepseek-chat",
          "displayName": "DeepSeek V3",
          "contextWindow": 64000,
          "capabilities": ["TEXT", "TOOL_CALLING", "STREAMING"]
        }
      ]
    }
  ]
}
```

---

## 7. 索引策略总结

| 查询场景 | 使用的索引 |
|----------|-----------|
| 按 Provider 查模型 | `idx_models_provider` |
| 按分组查模型 | `idx_models_group` |
| 收藏的模型 | `idx_models_favorite` |
| 默认模型 | `idx_models_default` |
| Provider 健康日志 | `idx_health_logs_provider` + `idx_health_logs_time` |
| 会话列表按时间 | `idx_conversations_updated` |

---

> 下一步：[API.md](./API.md) — RESTful 接口设计
