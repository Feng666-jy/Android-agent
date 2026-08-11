/**
 * SQLite 基线 schema — 与 prisma/migrations/0001_init/migration.sql 保持一致。
 * 用 node:sqlite 执行，CREATE TABLE IF NOT EXISTS 可对已有库幂等。
 * 注意：providers.authType / providers.healthStatus 是 camelCase 列名（沿用旧迁移）。
 * ⚠️ 本文件只保留基线表（Phase 0 起）：新表/新列一律通过 prisma/migrations/0002+
 *    增量迁移 + "npm run db:migrate"（scripts/migrate.ts + server/src/db/migrate.ts）管理，
 *    避免双 Schema 漂移。
 */

export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "providers" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "base_url" TEXT NOT NULL,
  "protocol" TEXT NOT NULL DEFAULT 'OPENAI_COMPATIBLE',
  "authType" TEXT NOT NULL DEFAULT 'API_KEY',
  "api_key_encrypted" TEXT,
  "is_enabled" INTEGER NOT NULL DEFAULT 1,
  "healthStatus" TEXT NOT NULL DEFAULT 'UNKNOWN',
  "last_checked_at" DATETIME,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_builtin" INTEGER NOT NULL DEFAULT 0,
  "metadata" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "models" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "provider_id" TEXT NOT NULL,
  "model_name" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "aliases" TEXT,
  "description" TEXT,
  "is_favorite" INTEGER NOT NULL DEFAULT 0,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_default" INTEGER NOT NULL DEFAULT 0,
  "context_window" INTEGER NOT NULL DEFAULT 32768,
  "max_output_tokens" INTEGER NOT NULL DEFAULT 4096,
  "auto_compact_threshold" INTEGER,
  "effective_percent" REAL NOT NULL DEFAULT 0.8,
  "temperature" REAL NOT NULL DEFAULT 0.7,
  "top_p" REAL,
  "frequency_penalty" REAL,
  "presence_penalty" REAL,
  "capabilities" TEXT,
  "reasoning_budget" INTEGER,
  "prompt_template" TEXT,
  "custom_headers" TEXT,
  "custom_params" TEXT,
  "group_id" TEXT,
  "tags" TEXT,
  "is_enabled" INTEGER NOT NULL DEFAULT 1,
  "metadata" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "models_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "models_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "model_groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "model_groups" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "icon" TEXT,
  "color" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "is_pinned" INTEGER NOT NULL DEFAULT 0,
  "is_builtin" INTEGER NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "usage_stats" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "model_id" TEXT NOT NULL,
  "total_requests" INTEGER NOT NULL DEFAULT 0,
  "total_tokens_input" INTEGER NOT NULL DEFAULT 0,
  "total_tokens_output" INTEGER NOT NULL DEFAULT 0,
  "total_tokens_cached" INTEGER NOT NULL DEFAULT 0,
  "total_errors" INTEGER NOT NULL DEFAULT 0,
  "last_used_at" DATETIME,
  "average_latency_ms" REAL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "usage_stats_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "provider_health_logs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "provider_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "latency_ms" INTEGER,
  "error_message" TEXT,
  "checked_at" DATETIME NOT NULL,
  CONSTRAINT "provider_health_logs_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "avatar" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "agent_runs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'completed',
  "task" TEXT NOT NULL,
  "model_id" TEXT NOT NULL,
  "sandbox_root" TEXT NOT NULL,
  "iterations" INTEGER NOT NULL DEFAULT 0,
  "tool_call_count" INTEGER NOT NULL DEFAULT 0,
  "result" TEXT,
  "error" TEXT,
  "token_input" INTEGER NOT NULL DEFAULT 0,
  "token_output" INTEGER NOT NULL DEFAULT 0,
  "token_total" INTEGER NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finished_at" DATETIME,
  CONSTRAINT "agent_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "agent_messages" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "run_id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT,
  "tool_call_id" TEXT,
  "tool_calls_json" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_messages_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "agent_runs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "agent_tool_calls" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "run_id" TEXT NOT NULL,
  "tool_call_id" TEXT,
  "name" TEXT NOT NULL,
  "arguments_json" TEXT NOT NULL,
  "ok" INTEGER NOT NULL DEFAULT 0,
  "output" TEXT,
  "duration_ms" INTEGER NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_tool_calls_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "agent_runs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "agent_token_usages" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "run_id" TEXT NOT NULL,
  "turn_id" INTEGER NOT NULL DEFAULT 0,
  "input_tokens" INTEGER NOT NULL DEFAULT 0,
  "output_tokens" INTEGER NOT NULL DEFAULT 0,
  "cached_tokens" INTEGER NOT NULL DEFAULT 0,
  "total_tokens" INTEGER NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_token_usages_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "agent_runs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "models_provider_id_model_name_key" ON "models"("provider_id", "model_name");
CREATE UNIQUE INDEX IF NOT EXISTS "usage_stats_model_id_key" ON "usage_stats"("model_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

CREATE INDEX IF NOT EXISTS "providers_sort_order_idx" ON "providers"("sort_order");
CREATE INDEX IF NOT EXISTS "providers_is_enabled_idx" ON "providers"("is_enabled");
CREATE INDEX IF NOT EXISTS "models_provider_id_idx" ON "models"("provider_id");
CREATE INDEX IF NOT EXISTS "models_group_id_idx" ON "models"("group_id");
CREATE INDEX IF NOT EXISTS "models_is_favorite_idx" ON "models"("is_favorite");
CREATE INDEX IF NOT EXISTS "models_sort_order_idx" ON "models"("sort_order");
CREATE INDEX IF NOT EXISTS "model_groups_sort_order_idx" ON "model_groups"("sort_order");
CREATE INDEX IF NOT EXISTS "usage_stats_last_used_at_idx" ON "usage_stats"("last_used_at");
CREATE INDEX IF NOT EXISTS "provider_health_logs_provider_id_idx" ON "provider_health_logs"("provider_id");
CREATE INDEX IF NOT EXISTS "agent_runs_user_id_created_at_idx" ON "agent_runs"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "agent_messages_run_id_created_at_idx" ON "agent_messages"("run_id", "created_at");
CREATE INDEX IF NOT EXISTS "agent_tool_calls_run_id_created_at_idx" ON "agent_tool_calls"("run_id", "created_at");
CREATE INDEX IF NOT EXISTS "agent_token_usages_run_id_created_at_idx" ON "agent_token_usages"("run_id", "created_at");
`;
