-- 0007_billing — Phase 5（T35 商业化：多租户 / 用量计费 / API Key 管理）
-- 原则：只做增量（CREATE TABLE / ADD COLUMN），绝不 DROP 存量数据；由 scripts/migrate.ts 在事务内执行一次。

-- 1) users 增加默认组织列（可空，不影响存量用户）
ALTER TABLE "users" ADD COLUMN "org_id" TEXT;

-- 2) organizations（组织 / 租户）
CREATE TABLE IF NOT EXISTS "organizations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "owner_user_id" INTEGER NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "settings_json" TEXT NOT NULL DEFAULT '{}',
  "status" TEXT NOT NULL DEFAULT 'active',   -- active | disabled
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "organizations_owner_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3) org_members（组织成员 + 角色）
CREATE TABLE IF NOT EXISTS "org_members" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "org_id" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',     -- owner | admin | member
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "org_members_org_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "org_members_user_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("org_id", "user_id")
);
CREATE INDEX IF NOT EXISTS "idx_org_members_user" ON "org_members"("user_id");

-- 4) billing_plans（套餐定义：free / pro / enterprise）
CREATE TABLE IF NOT EXISTS "billing_plans" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "price_monthly_cents" INTEGER NOT NULL DEFAULT 0,   -- 月费（分）
  "currency" TEXT NOT NULL DEFAULT 'CNY',
  "quota_json" TEXT NOT NULL DEFAULT '{}',            -- {"tokensPerMonth":..., "requestsPerMonth":...}
  "features_json" TEXT NOT NULL DEFAULT '[]',
  "is_default" INTEGER NOT NULL DEFAULT 0,
  "enabled" INTEGER NOT NULL DEFAULT 1,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5) subscriptions（用户订阅）
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "plan_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',            -- active | trialing | expired | canceled
  "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" DATETIME,
  "quota_reset_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 配额周期起点
  "metadata_json" TEXT NOT NULL DEFAULT '{}',
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "subscriptions_user_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "subscriptions_plan_fkey" FOREIGN KEY ("plan_id") REFERENCES "billing_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_subscriptions_user" ON "subscriptions"("user_id", "status");

-- 6) usage_events（用户级用量事件，事件溯源式，读时聚合，不可变）
CREATE TABLE IF NOT EXISTS "usage_events" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "org_id" TEXT,
  "model_id" TEXT,
  "run_id" TEXT,
  "source" TEXT NOT NULL DEFAULT 'chat',             -- chat | agent | workflow | api
  "input_tokens" INTEGER NOT NULL DEFAULT 0,
  "output_tokens" INTEGER NOT NULL DEFAULT 0,
  "cached_tokens" INTEGER NOT NULL DEFAULT 0,
  "total_tokens" INTEGER NOT NULL DEFAULT 0,
  "cost_cents" INTEGER NOT NULL DEFAULT 0,           -- 成本（分），写入即固定
  "currency" TEXT NOT NULL DEFAULT 'CNY',
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "usage_events_user_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_usage_events_user_time" ON "usage_events"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_usage_events_org_time" ON "usage_events"("org_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_usage_events_model" ON "usage_events"("model_id");

-- 7) invoices（月度账单）
CREATE TABLE IF NOT EXISTS "invoices" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "subscription_id" TEXT,
  "period_start" DATETIME NOT NULL,
  "period_end" DATETIME NOT NULL,
  "amount_cents" INTEGER NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'CNY',
  "status" TEXT NOT NULL DEFAULT 'draft',            -- draft | issued | paid | void
  "line_items_json" TEXT NOT NULL DEFAULT '[]',
  "paid_at" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invoices_user_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_invoices_user_period" ON "invoices"("user_id", "period_start");

-- 8) model_prices（模型计价：每百万 token 单价，单位：分）
CREATE TABLE IF NOT EXISTS "model_prices" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'CNY',
  "input_per_million_cents" INTEGER NOT NULL DEFAULT 0,
  "output_per_million_cents" INTEGER NOT NULL DEFAULT 0,
  "cached_discount" REAL NOT NULL DEFAULT 0.9,      -- 缓存命中折扣系数（1=原价，0.9=九折）
  "enabled" INTEGER NOT NULL DEFAULT 1,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "model_prices_model_fkey" FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("model_id", "currency")
);

-- 9) api_keys（用户 API Key：只存哈希，明文仅创建时返回一次）
CREATE TABLE IF NOT EXISTS "api_keys" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "prefix" TEXT NOT NULL,                            -- sk_<8位>（展示用）
  "key_hash" TEXT NOT NULL UNIQUE,                   -- sha256(明文)
  "scope" TEXT NOT NULL DEFAULT 'agent',             -- agent | billing | all
  "status" TEXT NOT NULL DEFAULT 'active',           -- active | revoked
  "last_used_at" DATETIME,
  "expires_at" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "api_keys_user_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_api_keys_user" ON "api_keys"("user_id", "status");
