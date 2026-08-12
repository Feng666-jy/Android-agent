# Architecture Decision Records（架构决策记录）

本文件记录项目的关键架构决策（ADR）。每个 ADR 说明：背景、决策、影响。

---

## ADR-001 Database Architecture

**状态**：已采纳（2026-08）

**背景**

- 项目早期使用 **Prisma ORM**（`schema.prisma` + `prisma migrate` + `@prisma/client`）。
- 实际部署环境是 Android / Termux（Linux on Android）与轻量服务器：
  - Prisma 依赖原生二进制引擎，在 Termux / 受限 Linux 环境安装与运行不稳定；
  - 单用户 / 小规模场景不需要 ORM 的完整能力，希望零原生依赖、可直接分发；
  - SQLite 单文件数据库最适合移动端与边缘部署。

**决策**

数据库层迁移到：

```
SQLite (node:sqlite, 零原生依赖)
+ Custom Migration Runner (server/src/db/migrate.ts, 幂等 + 自动备份)
+ Typed Query Compatibility Layer (server/src/prisma.ts + db/query.ts + db/fieldmaps.ts)
```

- 保留 Prisma 风格的调用 API（`prisma.<model>.findMany/create/...`），Service 层无需感知底层实现；
- 迁移文件（`server/src/db/migrations/<序号>_<名称>/migration.sql`）由自研运行器按字典序执行，`_migrations` 表记录已应用迁移；
- 删除 `prisma/schema.prisma`、Prisma CLI 依赖与 `prisma` 目录（2026-08 架构清理完成）。

**影响**

- 支持范围见 `server/src/db/SUPPORTED.md`（不含 relation include / nested create / groupBy 等）；
- 新增表必须走增量迁移 + `fieldmaps.ts` 登记，禁止修改已应用迁移；
- 未来若需要完整 ORM 能力，可在兼容层之上扩展，无需改 Service 层。
- 已知限制：`node:sqlite` 的 DatabaseSync 为**同步 API**，单连接串行执行，长查询或高并发下会阻塞事件循环；当前单用户 / 小规模场景可接受。未来若出现并发瓶颈，缓解方向为 worker_threads 隔离、请求队列或独立读写连接（WAL），届时需评估是否替换/包装底层驱动。

---

## ADR-002 Remove Billing Center

**状态**：已采纳（2026-08）

**背景**

- Phase 5 早期实现了完整 Billing Center（套餐 / 订阅 / 配额 / 月度账单 / 计费路由）。
- 产品定位是 **BYOK（Bring Your Own Key）**：用户接入自己的 OpenAI / Anthropic / Gemini / DeepSeek API Key。
- 平台职责是 **Agent Runtime / Tool Execution / Resource Management**，不承担支付、钱包与订阅管理；
- 计费逻辑会显著增加合规（支付牌照/税务）、风控与运维成本，与当前阶段目标不符。

**决策**

- 下线 Billing Center：删除 `billing_plans` / `subscriptions` / `invoices` / `model_prices` 表与相关服务/路由/前端（迁移 `0008_ai_resource`）；
- 用量与成本估算下沉为 **AI Resource Center**：`usage_records` 事件溯源 + 模型计价列（`models.input_price` / `output_price`）+ 成本估算（写入时固定），只做可见性与可审计性，不做计费；
- API Key scope 收敛为 `agent` / `all`（移除 `billing`）。

**影响**

- 商业化（订阅 / 支付 / 钱包 / 多租户计费）未来需要时**单独设计 Billing Layer**，与 AI Resource（用量记录）解耦；
- BYOK 模式下平台不接触用户密钥明文（仅加密存储于 `providers.api_key_encrypted`）。

---

## 索引

| ADR | 主题 | 状态 |
|-----|------|------|
| ADR-001 | Database Architecture（Prisma → SQLite + Custom Layer） | 已采纳 |
| ADR-002 | Remove Billing Center（BYOK 模式） | 已采纳 |
