# Modules.md — AI Model Management System 模块设计

> 定义每个模块的职责、接口、依赖关系和内部实现。

---

## 1. 模块总览

```
┌─────────────────────────────────────────────────────────────┐
│                      App Module                              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Model       │  │  Provider    │  │  Settings         │  │
│  │  Management  │  │  Management  │  │  Module           │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                │                    │              │
│  ┌──────┴────────────────┴────────────────────┴──────────┐  │
│  │                Core Module                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │  │
│  │  │ Catalog    │  │ Health     │  │ Config         │  │  │
│  │  │ Service    │  │ Monitor    │  │ Store          │  │  │
│  │  └────────────┘  └────────────┘  └────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                Data Module                             │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │  │
│  │  │ Room DB    │  │ DataStore  │  │ Remote API     │  │  │
│  │  └────────────┘  └────────────┘  └────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Model Management Module（模型管理）

### 2.1 职责

- 模型的 CRUD 操作
- 模型搜索、排序、过滤
- 模型收藏、默认设置
- 模型分组管理

### 2.2 核心接口

```kotlin
interface ModelRepository {
    // 查询
    fun getModels(query: ModelQuery): Flow<PagingData<Model>>
    fun getModel(id: String): Model?
    fun getDefaultModel(): Model?
    fun searchModels(keyword: String): Flow<List<Model>>
    
    // 变更
    suspend fun createModel(model: Model): Result<String>
    suspend fun updateModel(model: Model): Result<Unit>
    suspend fun deleteModel(id: String): Result<Unit>
    suspend fun setDefaultModel(id: String): Result<Unit>
    suspend fun toggleFavorite(id: String): Result<Boolean>
    
    // 批量
    suspend fun batchUpdate(updates: List<ModelUpdate>): Result<Int>
    suspend fun importModels(providerId: String, models: List<Model>): Result<Int>
}
```

### 2.3 Use Cases

| Use Case | 输入 | 输出 | 说明 |
|----------|------|------|------|
| `GetModels` | `ModelQuery` | `Flow<PagingData<Model>>` | 分页获取模型列表 |
| `SwitchModel` | `modelId` | `Result<Unit>` | 切换当前模型 |
| `SearchModels` | `keyword` | `Flow<List<Model>>` | 搜索模型 |
| `CreateModel` | `Model` | `Result<String>` | 创建模型 |
| `UpdateModel` | `Model` | `Result<Unit>` | 更新模型 |
| `DeleteModel` | `modelId` | `Result<Unit>` | 删除模型 |
| `ToggleFavorite` | `modelId` | `Result<Boolean>` | 切换收藏 |
| `ReorderModels` | `List<String>` | `Result<Unit>` | 排序模型 |

### 2.4 内部流程

```
GetModelsUseCase(query)
  → 验证查询参数
  → Repository.getModels(query)
    → Room DB: SELECT * FROM models WHERE ... ORDER BY ...
    → 如果本地数据不足 → 触发远程发现
  → 应用用户偏好（收藏置顶、默认标记）
  → 返回 PagingData
```

---

## 3. Provider Management Module（供应商管理）

### 3.1 职责

- Provider 的 CRUD 操作
- Provider 健康检查
- 模型自动发现
- API Key 加密存储

### 3.2 核心接口

```kotlin
interface ProviderRepository {
    fun getProviders(includeDisabled: Boolean = false): Flow<List<Provider>>
    fun getProvider(id: String): Provider?
    suspend fun createProvider(provider: Provider): Result<String>
    suspend fun updateProvider(provider: Provider): Result<Unit>
    suspend fun deleteProvider(id: String): Result<Unit>
    suspend fun healthCheck(id: String): HealthCheckResult
    suspend fun discoverModels(id: String): DiscoverResult
}
```

### 3.3 健康检查实现

```kotlin
class HealthCheckUseCase @Inject constructor(
    private val providerRepo: ProviderRepository,
    private val handlers: Map<Protocol, @JvmSuppressWildcards ProviderHandler>
) {
    suspend operator fun invoke(providerId: String): HealthCheckResult {
        val provider = providerRepo.getProvider(providerId) ?: return NotFound
        val handler = handlers[provider.protocol] ?: return UnsupportedProtocol
        
        return withTimeout(5000) {
            val start = System.currentTimeMillis()
            val status = handler.healthCheck(provider)
            val latency = System.currentTimeMillis() - start
            
            HealthCheckResult(
                status = status,
                latencyMs = latency,
                timestamp = System.currentTimeMillis()
            ).also { result ->
                providerRepo.updateHealthStatus(providerId, result)
            }
        }
    }
    
    suspend fun checkAll(): Flow<ProviderHealthUpdate> = flow {
        providerRepo.getProviders().collect { providers ->
            providers.filter { it.isEnabled }
                .map { provider ->
                    async(Dispatchers.IO) {
                        ProviderHealthUpdate(provider.id, invoke(provider.id))
                    }
                }
                .awaitAll()
                .forEach { emit(it) }
        }
    }
}
```

### 3.4 ProviderHandler 实现示例

```kotlin
class OpenAIHandler @Inject constructor(
    private val httpClient: HttpClient
) : ProviderHandler {
    override val protocol = Protocol.OPENAI_COMPATIBLE
    
    override suspend fun discoverModels(provider: Provider): List<ModelDefinition> {
        val response = httpClient.get("${provider.baseUrl}/models") {
            header("Authorization", "Bearer ${provider.apiKey}")
        }
        return response.body<OpenAI ModelsResponse>().data.map { apiModel ->
            ModelDefinition(
                modelName = apiModel.id,
                displayName = apiModel.id,
                contextWindow = ModelMetadataRegistry.getContextWindow(apiModel.id),
                capabilities = ModelMetadataRegistry.getCapabilities(apiModel.id)
            )
        }
    }
    
    override suspend fun healthCheck(provider: Provider): HealthStatus {
        return try {
            val response = httpClient.get("${provider.baseUrl}/models") {
                header("Authorization", "Bearer ${provider.apiKey}")
                timeout { requestTimeoutMillis = 5000 }
            }
            if (response.status.isSuccess()) HealthStatus.HEALTHY
            else HealthStatus.DEGRADED
        } catch (e: Exception) {
            HealthStatus.UNREACHABLE
        }
    }
}
```

---

## 4. Catalog Service Module（目录服务）

### 4.1 职责

- 聚合本地 + 远程模型数据
- 缓存管理
- 来源追踪
- 增量更新

### 4.2 核心接口

```kotlin
interface CatalogService {
    fun getCatalog(): Flow<ModelCatalog>
    suspend fun refresh(providerId: String? = null, force: Boolean = false): RefreshResult
    suspend fun getCatalogEntry(modelId: String): CatalogEntry?
}
```

### 4.3 聚合流程

```
refresh()
  → 获取所有 enabled Providers
  → 对每个 Provider:
    → [本地] 从 Room DB 读取已配置模型
    → [远程] 调用 ProviderHandler.discoverModels()
    → [合并] 匹配 model_name，更新已有 + 标记新增
    → [来源] 标记每条记录的 source_type
  → 更新缓存时间戳
  → 返回 RefreshResult
```

---

## 5. Config Store Module（配置存储）

### 5.1 职责

- 用户偏好持久化
- 配置分层管理
- 配置变更通知

### 5.2 实现

```kotlin
class ConfigStore @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    // 当前选中模型
    val currentModelId: Flow<String?> = dataStore.data
        .map { it[CURRENT_MODEL_ID] }
    
    suspend fun setCurrentModel(modelId: String) {
        dataStore.edit { it[CURRENT_MODEL_ID] = modelId }
    }
    
    // 主题
    val themeMode: Flow<ThemeMode> = dataStore.data
        .map { ThemeMode.valueOf(it[THEME_MODE] ?: "SYSTEM") }
    
    // 默认温度
    val defaultTemperature: Flow<Float> = dataStore.data
        .map { it[DEFAULT_TEMPERATURE] ?: 0.7f }
    
    // 搜索历史（最近 20 条）
    val searchHistory: Flow<Set<String>> = dataStore.data
        .map { it[SEARCH_HISTORY]?.toSet() ?: emptySet() }
    
    suspend fun addSearchHistory(keyword: String) {
        dataStore.edit { prefs ->
            val current = prefs[SEARCH_HISTORY]?.toMutableSet() ?: mutableSetOf()
            current.add(keyword)
            // 只保留最近 20 条
            prefs[SEARCH_HISTORY] = if (current.size > 20) {
                current.takeLast(20).toSet()
            } else current
        }
    }
}
```

---

## 6. Health Monitor Module（健康监控）

### 6.1 职责

- 定时检查所有 Provider 可达性
- 记录健康日志
- 自动降级（Provider 不可用时切换）

### 6.2 定时策略

```kotlin
class HealthMonitorWorker(
    context: Context,
    params: WorkerParameters,
    private val healthCheckUseCase: HealthCheckUseCase
) : CoroutineWorker(context, params) {
    
    override suspend fun doWork(): Result {
        healthCheckUseCase.checkAll().collect { update ->
            // 更新通知栏状态（可选）
            if (update.result.status == UNREACHABLE) {
                showNotification(
                    "Provider ${update.providerId} 不可用",
                    "请检查网络连接或 API Key"
                )
            }
        }
        return Result.success()
    }
    
    companion object {
        fun schedulePeriodic(): PeriodicWorkRequest {
            return PeriodicWorkRequestBuilder<HealthMonitorWorker>(
                15, TimeUnit.MINUTES
            ).setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build()
            ).build()
        }
    }
}
```

---

## 7. 依赖关系

```
Model Management ──→ Catalog Service ──→ Provider Management
       │                    │                    │
       └──────────────→ Config Store ←───────────┘
                            │
                     Health Monitor
```

| 模块 | 依赖 |
|------|------|
| Model Management | Catalog Service, Config Store |
| Provider Management | Config Store, Health Monitor |
| Catalog Service | Provider Management, Room DB |
| Config Store | DataStore Preferences |
| Health Monitor | Provider Management, WorkManager |

---

> 下一步：[PackageStructure.md](./PackageStructure.md) — Kotlin 包结构