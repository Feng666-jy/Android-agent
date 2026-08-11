-- 0003_agent_core — Phase 1（T13 审批落库 + Agent 配置单元）
-- 原则：只做增量（CREATE TABLE / ADD COLUMN），绝不 DROP 存量数据。
-- 由 scripts/migrate.ts 在事务内执行一次，_migrations 记录后不再重跑。

-- 1) agents（Agent 配置单元 — 借鉴 RikkaHub Assistant；Phase 1 建表，前端管理在 Phase 2）
CREATE TABLE IF NOT EXISTS "agents" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "avatar" TEXT,
  "description" TEXT,
  "system_prompt" TEXT,
  "model_id" TEXT,
  "config_json" TEXT,
  "enable_memory" INTEGER NOT NULL DEFAULT 0,
  "memory_scope" TEXT NOT NULL DEFAULT 'agent',
  "mcp_server_ids" TEXT,
  "skill_ids" TEXT,
  "tool_ids" TEXT,
  "workspace_id" TEXT,
  "enabled" INTEGER NOT NULL DEFAULT 1,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_agents_user_enabled" ON "agents"("user_id", "enabled");

-- 2) approvals（审批落库 — T13；与 v1 内存 ApprovalStore 并存，DB 为审计权威）
CREATE TABLE IF NOT EXISTS "approvals" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "run_id" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "tool_name" TEXT NOT NULL,
  "arguments_json" TEXT NOT NULL DEFAULT '{}',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "model_id" TEXT,
  "task" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "settled_at" DATETIME,
  CONSTRAINT "approvals_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "agent_runs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "approvals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_approvals_run_status" ON "approvals"("run_id", "status");
CREATE INDEX IF NOT EXISTS "idx_approvals_user_created" ON "approvals"("user_id", "created_at");
