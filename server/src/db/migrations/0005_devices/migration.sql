-- 0005_devices — Phase 3（T22 设备注册 / T23-T27 设备能力声明）
-- 原则：只做增量（CREATE TABLE），绝不 DROP 存量数据。

-- 1) devices（端侧设备注册表 — Device Bridge 的持久化侧）
CREATE TABLE IF NOT EXISTS "devices" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "device_id" TEXT NOT NULL,              -- 设备侧生成（Android ID 哈希），跨重装稳定
  "name" TEXT NOT NULL DEFAULT '',
  "platform" TEXT NOT NULL DEFAULT 'android',
  "model" TEXT,
  "os_version" TEXT,
  "app_version" TEXT,
  "capabilities_json" TEXT NOT NULL DEFAULT '{}',  -- {"native":true,"a11y":true,"vision":true}
  "status" TEXT NOT NULL DEFAULT 'offline',        -- online | offline
  "last_seen_at" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_devices_user_device" ON "devices"("user_id", "device_id");
CREATE INDEX IF NOT EXISTS "idx_devices_status" ON "devices"("status");
