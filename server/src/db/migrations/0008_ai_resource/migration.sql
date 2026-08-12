-- 0008_ai_resource — Phase 5 改造：SaaS 计费（Billing）→ AI 资源中心（AI Resource）
-- 原则：billing 体系整体下线（billing_plans / subscriptions / invoices / model_prices 删除）；
-- 用量事件改名 usage_records 并增加 provider/latency/成本估算；模型增加计价列；api_keys 移除 billing 作用域。
-- 由 scripts/migrate.ts 在事务内执行一次，失败即回滚。

-- 1) 删除计费表（先子后父，遵循外键约束）
DROP TABLE IF EXISTS "invoices";
DROP TABLE IF EXISTS "subscriptions";
DROP TABLE IF EXISTS "billing_plans";
DROP TABLE IF EXISTS "model_prices";

-- 2) usage_events → usage_records（改名 + 增加 provider/latency/成本估算 + 移除计费字段）
ALTER TABLE "usage_events" RENAME TO "usage_records";
ALTER TABLE "usage_records" ADD COLUMN "provider_id" TEXT;
ALTER TABLE "usage_records" ADD COLUMN "latency_ms" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "usage_records" ADD COLUMN "estimated_cost" REAL NOT NULL DEFAULT 0;
ALTER TABLE "usage_records" DROP COLUMN "cost_cents";
ALTER TABLE "usage_records" DROP COLUMN "currency";

-- 重建索引（沿用旧索引名需改名，避免重复）
DROP INDEX IF EXISTS "idx_usage_events_user_time";
DROP INDEX IF EXISTS "idx_usage_events_org_time";
DROP INDEX IF EXISTS "idx_usage_events_model";
CREATE INDEX IF NOT EXISTS "idx_usage_records_user_time" ON "usage_records"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_usage_records_org_time" ON "usage_records"("org_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_usage_records_model" ON "usage_records"("model_id");

-- 3) models 增加计价列（成本估算：USD / 每百万 tokens，写入即估算）
ALTER TABLE "models" ADD COLUMN "input_price" REAL NOT NULL DEFAULT 0;
ALTER TABLE "models" ADD COLUMN "output_price" REAL NOT NULL DEFAULT 0;

-- 4) api_keys scope：billing → all（移除计费作用域，存量迁移为 all 保持可用）
UPDATE "api_keys" SET "scope" = 'all' WHERE "scope" = 'billing';
