# DevelopmentPlan.md — AI Model Management System 开发计划

> 基于 Architecture.md / Database.md / API.md / Modules.md / PackageStructure.md 的开发实施计划。
> 分阶段执行，每个阶段有明确的交付物和验收标准。

---

## 1. 总体时间线

```
Phase 1: 基础骨架（1 周）
Phase 2: Provider 管理（1 周）
Phase 3: Model 管理（1 周）
Phase 4: Catalog 服务（3 天）
Phase 5: 健康监控（2 天）
Phase 6: 高级功能（1 周）
Phase 7: 测试 + 优化（3 天）
```

---

## 2. Phase 1: 基础骨架

**目标**：搭建项目基础架构，完成依赖注入、数据库、网络层骨架。

### 2.1 任务清单

| 任务 | 文件 | 工时 |
|------|------|------|
| 创建 Android 项目 | `settings.gradle.kts`, `build.gradle.kts` | 2h |
| 配置 Hilt 依赖注入 | `di/AppModule.kt`, `di/DatabaseModule.kt` | 3h |
| 配置 Room 数据库 | `AppDatabase.kt`, `dao/*.kt`, `entity/*.kt` | 4h |
| 配置 DataStore | `ConfigDataStore.kt` | 2h |
| 配置网络层 | `HttpClient.kt`, `NetworkModule.kt` | 3h |
| 定义领域模型 | `domain/model/*.kt`, `enums/*.kt` | 3h |
| 定义通用组件 | `Result.kt`, `UiState.kt`, `Extensions.kt` | 2h |
| 设计系统 | `theme/`, `DesignTokens.kt` | 2h |

### 2.2 验收标准

- [ ] 项目可编译通过
- [ ] Room 数据库可创建和升级
- [ ] Hilt 依赖注入正常工作
- [ ] DataStore 可读写
- [ ] 领域模型单元测试通过

### 2.3 交付物

- 可编译的 Android 项目骨架
- Room Schema v1（所有表创建）
- 单元测试框架搭建（JUnit + MockK）

---

## 3. Phase 2: Provider 管理

**目标**：实现 Provider 的完整生命周期管理。

### 3.1 任务清单

| 任务 | 文件 | 工时 |
|------|------|------|
| Provider CRUD UseCase | `domain/usecase/provider/*.kt` | 3h |
| Provider Repository 实现 | `data/repository/ProviderRepositoryImpl.kt` | 3h |
| ProviderHandler 接口 | `domain/provider/ProviderHandler.kt` | 2h |
| OpenAI 协议实现 | `data/remote/handler/OpenAIHandler.kt` | 4h |
| Anthropic 协议实现 | `data/remote/handler/AnthropicHandler.kt` | 3h |
| Ollama 协议实现 | `data/remote/handler/OllamaHandler.kt` | 3h |
| Provider 列表 UI | `presentation/providermanager/ProviderListScreen.kt` | 4h |
| Provider 详情 UI | `presentation/providermanager/ProviderDetailScreen.kt` | 3h |
| Provider 表单 UI | `presentation/providermanager/ProviderFormScreen.kt` | 4h |
| API Key 加密 | `core/security/CryptoManager.kt` | 3h |
| 种子数据 | `assets/providers.json` | 2h |

### 3.2 验收标准

- [ ] 可创建/编辑/删除自定义 Provider
- [ ] API Key 加密存储，日志中脱敏
- [ ] OpenAI / Anthropic / Ollama 三种协议全部实现
- [ ] Provider 列表按健康状态排序
- [ ] 表单校验（URL 格式、API Key 非空）

### 3.3 交付物

- Provider 管理完整功能
- 3 种 ProviderHandler 实现
- 加密存储单元测试
- Provider 管理 UI 测试

---

## 4. Phase 3: Model 管理

**目标**：实现模型的完整生命周期管理，包括搜索、排序、收藏、分组。

### 4.1 任务清单

| 任务 | 文件 | 工时 |
|------|------|------|
| Model CRUD UseCase | `domain/usecase/model/*.kt` | 4h |
| Model Repository 实现 | `data/repository/ModelRepositoryImpl.kt` | 4h |
| 搜索功能 | `GetModelsUseCase.kt` (search 分支) | 2h |
| 排序逻辑 | `ModelSortStrategy.kt` | 2h |
| 分组管理 | `GroupDao.kt`, `GroupRepository.kt` | 3h |
| Model Picker UI | `presentation/modelpicker/ModelPickerScreen.kt` | 6h |
| Model Card 组件 | `presentation/components/ModelCard.kt` | 3h |
| 搜索栏组件 | `presentation/components/SearchBar.kt` | 2h |
| 分组折叠/展开 | `ModelPickerScreen.kt` (group section) | 3h |
| 批量操作 | `BatchUpdateUseCase.kt` | 3h |

### 4.2 验收标准

- [ ] 模型列表分页加载（Paging 3）
- [ ] 搜索响应时间 < 100ms（本地缓存）
- [ ] 收藏/取消收藏即时生效
- [ ] 分组折叠/展开状态持久化
- [ ] 批量操作（启用/禁用/删除/移动分组）
- [ ] 空状态、错误状态、加载状态完整

### 4.3 交付物

- Model 管理完整功能
- Model Picker UI（对标 ChatGPT 模型选择器）
- 搜索 + 排序 + 过滤单元测试
- Model Picker UI 测试

---

## 5. Phase 4: Catalog 服务

**目标**：实现模型目录的聚合、缓存和刷新。

### 5.1 任务清单

| 任务 | 文件 | 工时 |
|------|------|------|
| Catalog Service | `domain/catalog/CatalogService.kt` | 3h |
| 多源聚合逻辑 | `CatalogRepositoryImpl.kt` | 4h |
| 缓存策略 | `CatalogCache.kt` | 2h |
| 来源追踪 | `CatalogSource.kt` | 2h |
| 增量更新 | `IncrementalUpdateStrategy.kt` | 3h |
| 刷新 UI | `ModelPickerScreen.kt` (pull-to-refresh) | 2h |

### 5.2 验收标准

- [ ] 本地 + 远程模型正确聚合
- [ ] 缓存有效期 15 分钟
- [ ] 来源信息正确标注
- [ ] 增量更新不覆盖用户自定义字段
- [ ] 下拉刷新触发远程发现

### 5.3 交付物

- Catalog 服务完整实现
- 缓存策略单元测试
- 多源聚合集成测试

---

## 6. Phase 5: 健康监控

**目标**：实现 Provider 健康检查和自动降级。

### 6.1 任务清单

| 任务 | 文件 | 工时 |
|------|------|------|
| HealthCheckUseCase | `domain/usecase/provider/HealthCheckUseCase.kt` | 3h |
| 健康检查 Worker | `core/worker/HealthMonitorWorker.kt` | 3h |
| 健康日志 | `HealthLogDao.kt`, `HealthLogEntity.kt` | 2h |
| 状态指示器 UI | `presentation/components/StatusBadge.kt` | 2h |
| 自动降级逻辑 | `AutoDegradeStrategy.kt` | 3h |

### 6.2 验收标准

- [ ] 每 15 分钟自动检查所有 Provider
- [ ] 健康状态实时更新到 UI
- [ ] Provider 不可用时自动切换到备用
- [ ] 健康日志保留 7 天
- [ ] 通知栏提示（Provider 不可用时）

### 6.3 交付物

- 健康监控完整功能
- WorkManager 定时任务
- 自动降级策略单元测试

---

## 7. Phase 6: 高级功能

**目标**：实现 auto_compact、reasoning_budget、prompt_cache 等高级特性。

### 7.1 任务清单

| 任务 | 文件 | 工时 |
|------|------|------|
| Auto Compact 策略 | `domain/compact/AutoCompactStrategy.kt` | 4h |
| 压缩比例计算 | `CompactRatioCalculator.kt` | 3h |
| Reasoning Budget | `domain/reasoning/ReasoningBudgetManager.kt` | 3h |
| Prompt Cache | `domain/cache/PromptCacheManager.kt` | 3h |
| MCP 预留接口 | `domain/mcp/McpManager.kt` (interface only) | 2h |
| Vision 支持 | `domain/vision/VisionMessageHandler.kt` | 3h |
| 设置页面 | `presentation/settings/SettingsScreen.kt` | 4h |

### 7.2 验收标准

- [ ] Auto Compact 在达到阈值时自动触发
- [ ] Reasoning Budget 正确传递给支持模型
- [ ] Prompt Cache 减少重复 token 计费
- [ ] 设置页面可配置所有参数
- [ ] MCP 接口预留，未来实现不需重构

### 7.3 交付物

- 高级功能完整实现
- 设置页面 UI
- 策略模式单元测试

---

## 8. Phase 7: 测试 + 优化

**目标**：全面测试覆盖，性能优化，文档完善。

### 8.1 任务清单

| 任务 | 文件 | 工时 |
|------|------|------|
| 单元测试补全 | `test/` 下所有模块 | 6h |
| UI 测试 | `androidTest/` 下关键流程 | 4h |
| 性能优化 | 数据库索引、查询优化 | 3h |
| 内存优化 | 大列表虚拟化、图片缓存 | 2h |
| 文档完善 | KDoc, README, 用户指南 | 3h |

### 8.2 验收标准

- [ ] 单元测试覆盖率 ≥ 85%
- [ ] UI 测试覆盖核心流程
- [ ] 模型列表加载 < 100ms
| Phase | 时间 | 核心交付 |
|-------|------|----------|
| Phase 1 | 第 1 周 | 项目骨架 + DI + DB + 网络 |
| Phase 2 | 第 2 周 | Provider 管理（CRUD + 3 种协议） |
| Phase 3 | 第 3 周 | Model 管理（搜索/排序/收藏/分组） |
| Phase 4 | 第 4 周前半 | Catalog 服务（聚合 + 缓存） |
| Phase 5 | 第 4 周后半 | 健康监控（定时检查 + 自动降级） |
| Phase 6 | 第 5 周 | 高级功能（compact/reasoning/cache） |
| Phase 7 | 第 5 周末 | 测试覆盖 + 性能优化 + 文档 |

---

## 10. 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 新 Provider 协议差异大 | 中 | 中 | ProviderHandler 接口预留扩展点 |
| 模型元数据不完整 | 高 | 低 | metadata JSON 兜底 + 用户可编辑 |
| 远程 API 限流 | 中 | 中 | 指数退避 + 缓存 + 并发控制 |
| Room 迁移破坏数据 | 低 | 高 | 迁移测试 + 备份机制 |
| Compose 性能问题 | 低 | 中 | LazyColumn + derivedStateOf |

---

## 11. 技术栈总结

| 类别 | 技术选型 |
|------|----------|
| 语言 | Kotlin 2.0+ |
| UI | Jetpack Compose + Material 3 |
| 架构 | Clean Architecture + MVVM |
| DI | Hilt |
| 数据库 | Room (SQLite) |
| 偏好存储 | DataStore Preferences |
| 网络 | OkHttp + Retrofit + Kotlin Serialization |
| 异步 | Kotlin Coroutines + Flow |
| 分页 | Paging 3 |
| 定时任务 | WorkManager |
| 加密 | Android Keystore |
| 测试 | JUnit + MockK + Turbine + Compose UI Test |
| 构建 | Kotlin DSL + Version Catalog |

---

> ⚠️ **未经确认，不直接修改代码。请先审阅以上 6 个设计文档，确认后再开始实施。**