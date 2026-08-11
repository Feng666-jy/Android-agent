# PackageStructure.md — Kotlin 包结构

> 定义 Android 项目的 Kotlin 包组织。
> 遵循 Clean Architecture + MVVM + 模块化原则。

---

## 1. 项目结构

```
app/
├── build.gradle.kts                    # 应用级构建配置
├── proguard-rules.pro
└── src/
    ├── main/
    │   ├── java/com/androidagent/
    │   │   ├── AndroidAgentApp.kt      # Application 入口
    │   │   ├── MainActivity.kt         # 主 Activity（单 Activity 架构）
    │   │   │
    │   │   ├── di/                     # 依赖注入（Hilt）
    │   │   │   ├── AppModule.kt        # 应用级单例
    │   │   │   ├── DataModule.kt       # 数据层绑定
    │   │   │   ├── NetworkModule.kt    # 网络客户端
    │   │   │   ├── DatabaseModule.kt   # Room 数据库
    │   │   │   └── ViewModelModule.kt  # ViewModel 工厂
    │   │   │
    │   │   ├── core/                   # 核心工具
    │   │   │   ├── common/
    │   │   │   │   ├── Result.kt       # Result<T> 密封类
    │   │   │   │   ├── UiState.kt      # Loading/Success/Error
    │   │   │   │   └── Extensions.kt   # 通用扩展函数
    │   │   │   ├── network/
    │   │   │   │   ├── HttpClient.kt   # OkHttp + Retrofit 配置
    │   │   │   │   └── ApiResult.kt    # API 响应包装
    │   │   │   ├── security/
    │   │   │   │   └── CryptoManager.kt # Android Keystore 加密
    │   │   │   └── dispatcher/
    │   │   │       └── DispatcherProvider.kt
    │   │   │
    │   │   ├── data/                   # 数据层
    │   │   │   ├── local/
    │   │   │   │   ├── database/
    │   │   │   │   │   ├── AppDatabase.kt
    │   │   │   │   │   ├── dao/
    │   │   │   │   │   │   ├── ModelDao.kt
    │   │   │   │   │   │   ├── ProviderDao.kt
    │   │   │   │   │   │   ├── GroupDao.kt
    │   │   │   │   │   │   ├── UsageStatsDao.kt
    │   │   │   │   │   │   └── HealthLogDao.kt
    │   │   │   │   │   └── converters/
    │   │   │   │   │       └── Converters.kt  // List<String>, Map<String, Json>
    │   │   │   │   ├── datastore/
    │   │   │   │   │   └── ConfigDataStore.kt
    │   │   │   │   └── entity/
    │   │   │   │       ├── ModelEntity.kt
    │   │   │   │       ├── ProviderEntity.kt
    │   │   │   │       ├── GroupEntity.kt
    │   │   │   │       └── UsageStatsEntity.kt
    │   │   │   ├── remote/
    │   │   │   │   ├── api/
    │   │   │   │   │   ├── ModelApi.kt
    │   │   │   │   │   └── ProviderApi.kt
    │   │   │   │   └── dto/
    │   │   │   │       ├── ModelDto.kt
    │   │   │   │       └── ProviderDto.kt
    │   │   │   └── repository/
    │   │   │       ├── ModelRepositoryImpl.kt
    │   │   │       ├── ProviderRepositoryImpl.kt
    │   │   │       ├── CatalogRepositoryImpl.kt
    │   │   │       └── repository.mk (mapper)
    │   │   │
    │   │   ├── domain/                 # 领域层
    │   │   │   ├── model/
    │   │   │   │   ├── Model.kt
    │   │   │   │   ├── Provider.kt
    │   │   │   │   ├── ModelGroup.kt
    │   │   │   │   ├── ModelCatalog.kt
    │   │   │   │   └── enums/
    │   │   │   │       ├── Protocol.kt
    │   │   │   │       ├── AuthType.kt
    │   │   │   │       ├── HealthStatus.kt
    │   │   │   │       └── Capability.kt
    │   │   │   ├── repository/
    │   │   │   │   ├── ModelRepository.kt    # 接口
    │   │   │   │   ├── ProviderRepository.kt
    │   │   │   │   └── CatalogRepository.kt
    │   │   │   └── usecase/
    │   │   │       ├── model/
    │   │   │       │   ├── GetModelsUseCase.kt
    │   │   │       │   ├── SwitchModelUseCase.kt
    │   │   │       │   ├── SearchModelsUseCase.kt
    │   │   │       │   └── ToggleFavoriteUseCase.kt
    │   │   │       ├── provider/
    │   │   │       │   ├── GetProvidersUseCase.kt
    │   │   │       │   ├── HealthCheckUseCase.kt
    │   │   │       │   └── DiscoverModelsUseCase.kt
    │   │   │       └── catalog/
    │   │   │           ├── GetCatalogUseCase.kt
    │   │   │           └── RefreshCatalogUseCase.kt
    │   │   │
    │   │   └── presentation/           # 表现层
    │   │       ├── navigation/
    │   │       │   ├── AppNavGraph.kt
    │   │       │   └── Screen.kt
    │   │       ├── theme/
    │   │       │   ├── Color.kt
    │   │       │   ├── Theme.kt
    │   │       │   ├── Type.kt
    │   │       │   └── DesignTokens.kt
    │   │       ├── components/         # 通用 UI 组件
    │   │       │   ├── ModelCard.kt
    │   │       │   ├── ProviderIcon.kt
    │   │       │   ├── StatusBadge.kt
    │   │       │   ├── SearchBar.kt
    │   │       │   └── EmptyState.kt
    │   │       ├── modelpicker/
    │   │       │   ├── ModelPickerScreen.kt    # Composable
    │   │       │   ├── ModelPickerViewModel.kt
    │   │       │   └── ModelPickerUiState.kt
    │   │       ├── providermanager/
    │   │       │   ├── ProviderListScreen.kt
    │   │       │   ├── ProviderDetailScreen.kt
    │   │       │   ├── ProviderFormScreen.kt
    │   │       │   └── ProviderViewModel.kt
    │   │       ├── settings/
    │   │       │   ├── SettingsScreen.kt
    │   │       │   └── SettingsViewModel.kt
    │   │       └── chat/
    │   │           ├── ChatScreen.kt
    │   │           ├── ChatViewModel.kt
    │   │           └── ChatUiState.kt
    │   │
    │   └── res/
    │       ├── values/
    │       ├── drawable/
    │       ├── mipmap/
    │       └── xml/
    │
    ├── test/                           # 单元测试
    │   └── java/com/androidagent/
    │       ├── data/repository/
    │       ├── domain/usecase/
    │       └── presentation/viewmodel/
    │
    └── androidTest/                    # UI 测试
        └── java/com/androidagent/
            └── presentation/
```

---

## 2. 模块依赖图

```
presentation ──→ domain ──→ data
     │              │         │
     └──────────────┴─────────┘
              ↑
            core
              ↑
            di
```

---

## 3. 关键类职责

### 3.1 Data Layer

| 类 | 职责 |
|----|------|
| `ModelDao.kt` | Room DAO，定义 SQL 查询 |
| `ProviderDao.kt` | Provider 表 CRUD |
| `ModelEntity.kt` | 数据库实体（扁平化存储） |
| `ModelRepositoryImpl.kt` | 协调本地 DB + 远程 API + 缓存 |
| `Converters.kt` | List/String ↔ JSON 转换 |

### 3.2 Domain Layer

| 类 | 职责 |
|----|------|
| `Model.kt` | 领域模型（业务逻辑载体） |
| `GetModelsUseCase.kt` | 封装获取模型的完整业务逻辑 |
| `ModelRepository.kt` | 仓库接口（依赖倒置） |

### 3.3 Presentation Layer

| 类 | 职责 |
|----|------|
| `ModelPickerViewModel.kt` | 持有 UI 状态，调用 UseCase |
| `ModelPickerUiState.kt` | 不可变 UI 状态数据类 |
| `ModelPickerScreen.kt` | Composable 函数，纯 UI 渲染 |
| `ModelCard.kt` | 单个模型卡片组件 |

---

## 4. 命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| Composable | PascalCase + Screen/Card | `ModelPickerScreen` |
| ViewModel | PascalCase + ViewModel | `ModelPickerViewModel` |
| UiState | PascalCase + UiState | `ModelPickerUiState` |
| UseCase | PascalCase + UseCase | `GetModelsUseCase` |
| Repository 接口 | PascalCase + Repository | `ModelRepository` |
| Repository 实现 | PascalCase + RepositoryImpl | `ModelRepositoryImpl` |
| Entity | PascalCase + Entity | `ModelEntity` |
| DAO | PascalCase + Dao | `ModelDao` |
| DTO | PascalCase + Dto | `ModelDto` |

---

## 5. 依赖注入（Hilt）模块组织

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    @Provides @Singleton
    fun provideDatabase(app: Application): AppDatabase = Room.databaseBuilder(...)
    
    @Provides
    fun provideModelDao(db: AppDatabase): ModelDao = db.modelDao()
}

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {
    @Binds
    abstract fun bindModelRepository(impl: ModelRepositoryImpl): ModelRepository
}

@Module
@InstallIn(SingletonComponent::class)
object HandlerModule {
    @Provides @Singleton
    fun provideHandlers(
        openAIHandler: OpenAIHandler,
        anthropicHandler: AnthropicHandler,
        ollamaHandler: OllamaHandler
    ): Map<Protocol, ProviderHandler> = mapOf(
        Protocol.OPENAI_COMPATIBLE to openAIHandler,
        Protocol.ANTHROPIC to anthropicHandler,
        Protocol.OLLAMA to ollamaHandler
    )
}
```

---

> 下一步：[DevelopmentPlan.md](./DevelopmentPlan.md) — 开发计划