-- 0006_memory_workflow — Phase 4（T29 memories / T31 workflows / T31 workflow_runs）
-- 原则：只做增量（CREATE TABLE），绝不 DROP 存量数据；由 scripts/migrate.ts 在事务内执行一次。

-- 1) memories（记忆库 — T30：episodic 任务经历 / semantic 事实 / preference 用户偏好）
CREATE TABLE IF NOT EXISTS "memories" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "conversation_id" TEXT,
  "agent_id" TEXT,
  "run_id" TEXT,
  "kind" TEXT NOT NULL DEFAULT 'episodic',   -- episodic | semantic | preference
  "content" TEXT NOT NULL,
  "summary" TEXT,
  "importance" REAL NOT NULL DEFAULT 0.5,    -- 0-1 重要性（检索加权）
  "access_count" INTEGER NOT NULL DEFAULT 0, -- 命中次数（热度加权）
  "last_access_at" DATETIME,
  "expires_at" DATETIME,                     -- 过期时间（时间衰减）
  "source" TEXT NOT NULL DEFAULT 'system',   -- user | agent | system
  "metadata_json" TEXT NOT NULL DEFAULT '{}',-- {task,status,toolNames,...}
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "memories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_memories_user_kind" ON "memories"("user_id", "kind");
CREATE INDEX IF NOT EXISTS "idx_memories_user_updated" ON "memories"("user_id", "updated_at");
CREATE INDEX IF NOT EXISTS "idx_memories_expires" ON "memories"("expires_at");

-- 2) workflows（工作流定义 — T31：手动/事件触发，步骤顺序执行）
CREATE TABLE IF NOT EXISTS "workflows" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "trigger" TEXT NOT NULL DEFAULT 'manual',  -- manual | event
  "steps_json" TEXT NOT NULL DEFAULT '[]',   -- [{"id":"s1","type":"tool_call","tool":"...","args":{...}}]
  "enabled" INTEGER NOT NULL DEFAULT 1,
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workflows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_workflows_user" ON "workflows"("user_id");

-- 3) workflow_runs（工作流执行记录）
CREATE TABLE IF NOT EXISTS "workflow_runs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "workflow_id" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',   -- queued | running | completed | failed | cancelled
  "input_json" TEXT NOT NULL DEFAULT '{}',
  "output_json" TEXT,
  "error" TEXT,
  "started_at" DATETIME,
  "finished_at" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workflow_runs_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "workflow_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_workflow_runs_workflow" ON "workflow_runs"("workflow_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_workflow_runs_status" ON "workflow_runs"("status");
