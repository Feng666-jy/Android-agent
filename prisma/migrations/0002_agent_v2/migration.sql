-- 0002_agent_v2 — Phase 0（T05）：会话实体化 + Agent 运行时表对齐
--
-- 背景与规则：
--   1. agent_runs / agent_messages / agent_tool_calls / agent_token_usages 此前只存在于
--      server/src/db/schema.ts（运行时 SCHEMA_SQL），0001_init 迁移未包含 —— 此处用
--      CREATE TABLE IF NOT EXISTS 对齐两份 Schema，消除漂移（幂等，已有库直接跳过）。
--   2. conversations / messages / agent_steps 是 V2.0 会话模型新表。
--   3. agent_runs 增加 conversation_id / agent_id / plan_json（可空，不破坏存量数据）。
--   4. 本迁移由 scripts/migrate.ts 在事务内执行一次，_migrations 记录后不再重跑。

-- 1) Agent 运行时表（与 server/src/db/schema.ts 对齐）
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

-- 2) V2.0 会话表
CREATE TABLE IF NOT EXISTS "conversations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "agent_id" TEXT,
  "title" TEXT NOT NULL DEFAULT '',
  "model_id" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "pinned" INTEGER NOT NULL DEFAULT 0,
  "system_prompt" TEXT,
  "metadata" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "conversation_id" TEXT NOT NULL,
  "run_id" TEXT,
  "role" TEXT NOT NULL,
  "content" TEXT,
  "tool_calls_json" TEXT,
  "tool_call_id" TEXT,
  "attachments_json" TEXT,
  "tokens_json" TEXT,
  "parent_id" TEXT,
  "branch_index" INTEGER NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "agent_steps" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "run_id" TEXT NOT NULL,
  "seq" INTEGER NOT NULL,
  "kind" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "input" TEXT,
  "output" TEXT,
  "tool_call_id" TEXT,
  "tokens_json" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_steps_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "agent_runs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3) 存量表增列（可空，不破坏数据）
ALTER TABLE "agent_runs" ADD COLUMN "conversation_id" TEXT;
ALTER TABLE "agent_runs" ADD COLUMN "agent_id" TEXT;
ALTER TABLE "agent_runs" ADD COLUMN "plan_json" TEXT;

-- 4) 索引
CREATE INDEX IF NOT EXISTS "agent_runs_user_id_created_at_idx" ON "agent_runs"("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "agent_messages_run_id_created_at_idx" ON "agent_messages"("run_id", "created_at");
CREATE INDEX IF NOT EXISTS "agent_tool_calls_run_id_created_at_idx" ON "agent_tool_calls"("run_id", "created_at");
CREATE INDEX IF NOT EXISTS "agent_token_usages_run_id_created_at_idx" ON "agent_token_usages"("run_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_conversations_user_updated" ON "conversations"("user_id", "updated_at");
CREATE INDEX IF NOT EXISTS "idx_messages_conversation_created" ON "messages"("conversation_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_agent_steps_run_seq" ON "agent_steps"("run_id", "seq");
