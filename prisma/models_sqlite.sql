-- SQLite AI model tables

CREATE TABLE IF NOT EXISTS "DeepseekModel" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "modelName" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "apiProvider" TEXT NOT NULL DEFAULT "DeepSeek",
  "status" INTEGER NOT NULL DEFAULT 1,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ClaudeModel" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "modelName" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "apiProvider" TEXT NOT NULL DEFAULT "Claude",
  "status" INTEGER NOT NULL DEFAULT 1,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ChatgptModel" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "modelName" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "apiProvider" TEXT NOT NULL DEFAULT "ChatGPT",
  "status" INTEGER NOT NULL DEFAULT 1,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "createTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "DeepseekModel" ("id", "modelName", "displayName", "apiProvider", "status", "sort") VALUES
(1, "deepseek-chat", "DeepSeek V3", "DeepSeek", 1, 1),
(2, "deepseek-reasoner", "DeepSeek R1", "DeepSeek", 1, 2),
(3, "deepseek-coder", "DeepSeek Coder", "DeepSeek", 1, 3),
(4, "deepseek-v2.5", "DeepSeek V2.5", "DeepSeek", 1, 4),
(5, "deepseek-v2", "DeepSeek V2", "DeepSeek", 0, 5);