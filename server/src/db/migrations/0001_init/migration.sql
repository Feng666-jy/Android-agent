-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "protocol" TEXT NOT NULL DEFAULT 'OPENAI_COMPATIBLE',
    "authType" TEXT NOT NULL DEFAULT 'API_KEY',
    "api_key_encrypted" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "healthStatus" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "last_checked_at" DATETIME,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_builtin" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "aliases" TEXT,
    "description" TEXT,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
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
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "models_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "models_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "model_groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "model_groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_builtin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "usage_stats" (
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
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "usage_stats_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "provider_health_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latency_ms" INTEGER,
    "error_message" TEXT,
    "checked_at" DATETIME NOT NULL,
    CONSTRAINT "provider_health_logs_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "providers_sort_order_idx" ON "providers"("sort_order");

-- CreateIndex
CREATE INDEX "providers_is_enabled_idx" ON "providers"("is_enabled");

-- CreateIndex
CREATE INDEX "models_provider_id_idx" ON "models"("provider_id");

-- CreateIndex
CREATE INDEX "models_group_id_idx" ON "models"("group_id");

-- CreateIndex
CREATE INDEX "models_is_favorite_idx" ON "models"("is_favorite");

-- CreateIndex
CREATE INDEX "models_is_default_idx" ON "models"("is_default");

-- CreateIndex
CREATE INDEX "models_sort_order_idx" ON "models"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "models_provider_id_model_name_key" ON "models"("provider_id", "model_name");

-- CreateIndex
CREATE INDEX "model_groups_sort_order_idx" ON "model_groups"("sort_order");

-- CreateIndex
CREATE INDEX "model_groups_is_pinned_idx" ON "model_groups"("is_pinned");

-- CreateIndex
CREATE UNIQUE INDEX "usage_stats_model_id_key" ON "usage_stats"("model_id");

-- CreateIndex
CREATE INDEX "usage_stats_last_used_at_idx" ON "usage_stats"("last_used_at");

-- CreateIndex
CREATE INDEX "provider_health_logs_provider_id_idx" ON "provider_health_logs"("provider_id");

-- CreateIndex
CREATE INDEX "provider_health_logs_checked_at_idx" ON "provider_health_logs"("checked_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

