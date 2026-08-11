# API.md — AI Model Management System 接口设计

> 定义前后端交互的 RESTful API 接口。
> 所有接口遵循统一响应格式。

---

## 1. 通用规范

### 1.1 基础路径

```
/api/v1/
```

### 1.2 统一响应格式

```json
{
  "code": 0,          // 0=成功, 非0=错误码
  "message": "success",
  "data": { ... },     // 业务数据
  "meta": {            // 分页等元数据（可选）
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

### 1.3 错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数校验失败 |
| 1002 | 资源不存在 |
| 1003 | 资源已存在 |
| 1004 | 操作不允许 |
| 2000 | 未认证 |
| 2001 | Token 过期 |
| 2002 | 无权限 |
| 3000 | Provider 不可达 |
| 3001 | Provider 认证失败 |
| 3002 | 模型列表获取失败 |
| 5000 | 服务器内部错误 |

### 1.4 认证方式

```
Authorization: Bearer <jwt_token>
```

---

## 2. Provider 接口

### 2.1 获取 Provider 列表

```
GET /api/v1/providers
```

**Query Parameters**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `include_disabled` | Boolean | 是否包含已禁用（默认 false） |
| `protocol` | String | 按协议过滤 |

**Response**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "openai",
      "name": "OpenAI",
      "baseUrl": "https://api.openai.com/v1",
      "protocol": "OPENAI_COMPATIBLE",
      "authType": "API_KEY",
      "isEnabled": true,
      "healthStatus": "HEALTHY",
      "modelCount": 5,
      "lastCheckedAt": 1719000000000,
      "createdAt": 1718000000000
    }
  ]
}
```

### 2.2 获取单个 Provider

```
GET /api/v1/providers/{id}
```

### 2.3 创建 Provider

```
POST /api/v1/providers
```

**Request Body**:
```json
{
  "name": "本地 Ollama",
  "baseUrl": "http://localhost:11434/v1",
  "protocol": "OLLAMA",
  "authType": "NONE",
  "apiKey": null
}
```

### 2.4 更新 Provider

```
PUT /api/v1/providers/{id}
```

### 2.5 删除 Provider

```
DELETE /api/v1/providers/{id}
```

> 注意：删除 Provider 会级联删除其下所有 Model。

### 2.6 测试 Provider 连通性

```
POST /api/v1/providers/{id}/health-check
```

**Response**:
```json
{
  "code": 0,
  "data": {
    "status": "HEALTHY",
    "latencyMs": 245,
    "availableModels": 12
  }
}
```

### 2.7 发现 Provider 下的模型

```
POST /api/v1/providers/{id}/discover
```

**Response**:
```json
{
  "code": 0,
  "data": {
    "discovered": 8,
    "new": 3,
    "existing": 5,
    "models": [
      {
        "modelName": "gpt-4o",
        "displayName": "GPT-4o",
        "contextWindow": 128000,
        "capabilities": ["TEXT", "VISION", "TOOL_CALLING"]
      }
    ]
  }
}
```

---

## 3. Model 接口

### 3.1 获取模型列表

```
GET /api/v1/models
```

**Query Parameters**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `provider_id` | String | 按 Provider 过滤 |
| `group_id` | String | 按分组过滤 |
| `is_favorite` | Boolean | 只看收藏 |
| `is_enabled` | Boolean | 是否启用 |
| `search` | String | 搜索关键词（匹配 name, displayName, aliases） |
| `capability` | String | 按能力过滤（如 TOOL_CALLING） |
| `sort` | String | 排序方式（name/created/usage/favorite） |
| `page` | Int | 页码（默认 1） |
| `page_size` | Int | 每页条数（默认 20） |

**Response**:
```json
{
  "code": 0,
  "data": [
    {
      "id": "model-uuid-1",
      "providerId": "openai",
      "providerName": "OpenAI",
      "modelName": "gpt-4o",
      "displayName": "GPT-4o",
      "aliases": ["4o", "gpt4o"],
      "isFavorite": true,
      "isDefault": true,
      "contextWindow": 128000,
      "maxOutputTokens": 16384,
      "temperature": 0.7,
      "capabilities": ["TEXT", "VISION", "TOOL_CALLING", "STREAMING"],
      "groupId": null,
      "tags": ["coding", "general"],
      "usageStats": {
        "totalRequests": 1523,
        "totalTokensInput": 4500000,
        "totalTokensOutput": 1200000,
        "lastUsedAt": 1719000000000
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 42
  }
}
```

### 3.2 获取单个模型

```
GET /api/v1/models/{id}
```

### 3.3 创建模型

```
POST /api/v1/models
```

**Request Body**:
```json
{
  "providerId": "openai",
  "modelName": "o1-preview",
  "displayName": "o1 Preview",
  "aliases": ["o1", "reasoning"],
  "contextWindow": 200000,
  "maxOutputTokens": 100000,
  "temperature": 1.0,
  "capabilities": ["TEXT", "REASONING", "TOOL_CALLING"],
  "reasoningBudget": 100000,
  "tags": ["reasoning", "complex"]
}
```

### 3.4 更新模型

```
PUT /api/v1/models/{id}
```

> 支持部分更新：只传需要修改的字段。

### 3.5 删除模型

```
DELETE /api/v1/models/{id}
```

### 3.6 切换默认模型

```
POST /api/v1/models/{id}/set-default
```

> 设置为新默认模型，自动取消之前的默认标记。

### 3.7 切换收藏

```
POST /api/v1/models/{id}/toggle-favorite
```

### 3.8 批量操作

```
POST /api/v1/models/batch
```

**Request Body**:
```json
{
  "action": "enable",         // enable | disable | delete | move_group | add_tag
  "modelIds": ["id1", "id2"],
  "params": {
    "groupId": "group-uuid"
  }
}
```

---

## 4. 分组接口

### 4.1 获取分组列表

```
GET /api/v1/groups
```

### 4.2 创建分组

```
POST /api/v1/groups
```

### 4.3 更新分组

```
PUT /api/v1/groups/{id}
```

### 4.4 删除分组

```
DELETE /api/v1/groups/{id}
```

> 删除分组后，其中的模型变为未分组状态。

### 4.5 排序分组

```
POST /api/v1/groups/reorder
```

**Request Body**:
```json
{
  "groupIds": ["id1", "id2", "id3"]
}
```

---

## 5. Catalog 接口

### 5.1 获取模型目录（聚合视图）

```
GET /api/v1/catalog
```

> 返回本地配置 + 远程发现的完整模型目录，按 Provider 分组。

### 5.2 刷新目录

```
POST /api/v1/catalog/refresh
```

**Query Parameters**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `provider_id` | String | 指定 Provider 刷新（不传则全部） |
| `force` | Boolean | 强制刷新缓存 |

**Response**:
```json
{
  "code": 0,
  "data": {
    "refreshed": 3,
    "failed": 0,
    "durationMs": 1234,
    "providers": [
      {
        "providerId": "openai",
        "status": "SUCCESS",
        "modelsFound": 12,
        "latencyMs": 456
      }
    ]
  }
}
```

---

## 6. 统计接口

### 6.1 获取使用统计

```
GET /api/v1/stats/usage
```

**Query Parameters**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `model_id` | String | 按模型过滤 |
| `date_from` | Long | 起始时间戳 |
| `date_to` | Long | 结束时间戳 |

### 6.2 获取热门模型

```
GET /api/v1/stats/top-models?limit=10
```

---

## 7. 未来扩展接口（预留）

### 7.1 MCP 管理

```
GET    /api/v1/mcp/servers
POST   /api/v1/mcp/servers
PUT    /api/v1/mcp/servers/{id}
DELETE /api/v1/mcp/servers/{id}
```

### 7.2 推理任务

```
POST   /api/v1/reasoning/tasks
GET    /api/v1/reasoning/tasks/{id}
DELETE /api/v1/reasoning/tasks/{id}
```

### 7.3 Image Generation

```
POST   /api/v1/images/generate
GET    /api/v1/images/history
```

---

> 下一步：[Modules.md](./Modules.md) — 模块详细设计