-- 0004_tools — Phase 2（T14 tools 表 / T16 tool_permissions / T17 mcp_servers / T19 skills）
-- 原则：只做增量（CREATE TABLE），绝不 DROP 存量数据；由 scripts/migrate.ts 在事务内执行一次。

-- 1) tools（动态工具注册表 — T14：内置工具登记 + 用户自定义工具 + MCP/Skill 工具）
CREATE TABLE IF NOT EXISTS "tools" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL DEFAULT '',
  "parameters_json" TEXT NOT NULL DEFAULT '{}',
  "source" TEXT NOT NULL DEFAULT 'builtin',   -- builtin | custom | mcp | skill
  "enabled" INTEGER NOT NULL DEFAULT 1,
  "config_json" TEXT,                          -- MCP/Skill 绑定信息等扩展字段
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tools_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_tools_enabled" ON "tools"("enabled");
CREATE INDEX IF NOT EXISTS "idx_tools_user" ON "tools"("user_id");

-- 2) tool_permissions（三级作用域持久化策略 — T16：global / user / agent）
-- 参数规则 argument_rules_json 示例：
--   [{"path":"path","operator":"contains","value":"/etc","permission":"ask"}]
CREATE TABLE IF NOT EXISTS "tool_permissions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "scope" TEXT NOT NULL DEFAULT 'user',        -- global | user | agent
  "user_id" INTEGER,
  "agent_id" TEXT,
  "tool_name" TEXT NOT NULL,
  "permission" TEXT NOT NULL DEFAULT 'allow',  -- allow | ask | deny
  "argument_rules_json" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 唯一约束（COALESCE 处理 NULL，保证每个作用域+工具只有一条）
CREATE UNIQUE INDEX IF NOT EXISTS "idx_tool_permissions_unique" ON "tool_permissions"(
  "scope",
  COALESCE("user_id", 0),
  COALESCE("agent_id", ''),
  "tool_name"
);
CREATE INDEX IF NOT EXISTS "idx_tool_permissions_tool" ON "tool_permissions"("tool_name");

-- 3) mcp_servers（MCP 服务器配置 — T17：SSE/streamable-http 传输）
CREATE TABLE IF NOT EXISTS "mcp_servers" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "transport" TEXT NOT NULL DEFAULT 'sse',     -- sse | streamable-http
  "url" TEXT NOT NULL,
  "headers_json" TEXT NOT NULL DEFAULT '{}',
  "enabled" INTEGER NOT NULL DEFAULT 1,
  "status" TEXT NOT NULL DEFAULT 'disconnected', -- disconnected | connecting | connected | error
  "error" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "mcp_servers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_mcp_servers_user" ON "mcp_servers"("user_id", "enabled");

-- 4) skills（Skill 包 — T19：加载器 + read_skill 工具）
CREATE TABLE IF NOT EXISTS "skills" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "content" TEXT NOT NULL DEFAULT '',
  "version" TEXT NOT NULL DEFAULT '1.0.0',
  "enabled" INTEGER NOT NULL DEFAULT 1,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_skills_user" ON "skills"("user_id", "enabled");
