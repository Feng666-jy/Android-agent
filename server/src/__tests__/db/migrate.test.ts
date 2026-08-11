/**
 * 迁移运行器测试（Phase 0 / T01）
 *
 * 覆盖：
 * - 空库按序应用全部迁移
 * - 已有基线库（users 表存在）只记录基线、不重复执行
 * - 幂等：第二次运行不再应用任何迁移
 * - 失败迁移整体回滚（DDL 事务）
 * - dbPath 提供时自动备份
 * - 目录排序与缺失 migration.sql 的处理
 */

import { test, after } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  applyMigrations,
  appliedMigrationNames,
  backupFileName,
  listMigrationDirs,
  tableNames,
} from "../../db/migrate.js";

const tempRoots: string[] = [];

after(() => {
  for (const root of tempRoots) {
    rmSync(root, { recursive: true, force: true });
  }
});

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  tempRoots.push(dir);
  return dir;
}

interface MigrationFixture {
  dir: string;
  dbPath: string;
}

function makeFixture(migrations: Record<string, string>): MigrationFixture {
  const dir = makeTempDir("migrate-dir-");
  for (const [name, sql] of Object.entries(migrations)) {
    const migrationDir = path.join(dir, name);
    mkdirSync(migrationDir, { recursive: true });
    writeFileSync(path.join(migrationDir, "migration.sql"), sql);
  }
  const dbPath = path.join(makeTempDir("migrate-db-"), "test.db");
  return { dir, dbPath };
}

function openDb(dbPath: string): DatabaseSync {
  return new DatabaseSync(dbPath);
}

function columnNames(db: DatabaseSync, table: string): string[] {
  const rows = db.prepare(`PRAGMA table_info("${table}")`).all() as Array<{ name: string }>;
  return rows.map((row) => row.name);
}

const MIG_0001 = `CREATE TABLE "users" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL,
  "email" TEXT NOT NULL
);
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");`;

const MIG_0002 = `CREATE TABLE "conversations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" INTEGER NOT NULL
);
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
CREATE INDEX "idx_conversations_user" ON "conversations"("user_id");`;

test("empty database: applies all migrations in order and records them", () => {
  const { dir, dbPath } = makeFixture({
    "0001_init": MIG_0001,
    "0002_agent_v2": MIG_0002,
  });
  const db = openDb(dbPath);
  try {
    const result = applyMigrations(db, { migrationsDir: dir });

    assert.deepEqual(result.applied, ["0001_init", "0002_agent_v2"]);
    assert.deepEqual(result.skipped, []);
    assert.deepEqual([...appliedMigrationNames(db)].sort(), ["0001_init", "0002_agent_v2"]);
    assert.ok(tableNames(db).has("conversations"));
    assert.ok(columnNames(db, "users").includes("role"));
  } finally {
    db.close();
  }
});

test("existing baseline database: 0001 is recorded as baseline without re-execution", () => {
  const { dir, dbPath } = makeFixture({
    "0001_init": MIG_0001,
    "0002_agent_v2": MIG_0002,
  });
  const db = openDb(dbPath);
  try {
    // 模拟 SCHEMA_SQL 已建好基线（users 表已存在）
    db.exec(MIG_0001);

    const result = applyMigrations(db, { migrationsDir: dir });

    assert.deepEqual(result.applied, ["0002_agent_v2"]);
    assert.deepEqual(result.skipped, ["0001_init (baseline)"]);
    assert.deepEqual([...appliedMigrationNames(db)].sort(), ["0001_init", "0002_agent_v2"]);
    assert.ok(columnNames(db, "users").includes("role"));
  } finally {
    db.close();
  }
});

test("idempotent: second run applies nothing and creates no backup", () => {
  const { dir, dbPath } = makeFixture({
    "0001_init": MIG_0001,
    "0002_agent_v2": MIG_0002,
  });
  const db = openDb(dbPath);
  try {
    const first = applyMigrations(db, { migrationsDir: dir, dbPath });
    assert.equal(first.applied.length, 2);
    assert.ok(first.backupPath !== null && existsSync(first.backupPath));

    const second = applyMigrations(db, { migrationsDir: dir, dbPath });
    assert.deepEqual(second.applied, []);
    assert.deepEqual(second.skipped, ["0001_init", "0002_agent_v2"]);
    assert.equal(second.backupPath, null);
  } finally {
    db.close();
  }
});

test("failing migration rolls back atomically and stops the run", () => {
  const { dir, dbPath } = makeFixture({
    "0001_init": MIG_0001,
    "0002_agent_v2": MIG_0002,
    "0003_broken": `CREATE TABLE "broken" ("id" TEXT NOT NULL PRIMARY KEY);
CREATE TABLE "broken" ("id" TEXT NOT NULL PRIMARY KEY);`,
  });
  const db = openDb(dbPath);
  try {
    assert.throws(
      () => applyMigrations(db, { migrationsDir: dir }),
      (err: unknown) => {
        assert.match((err as Error).message, /0003_broken failed/);
        return true;
      }
    );

    assert.deepEqual([...appliedMigrationNames(db)].sort(), ["0001_init", "0002_agent_v2"]);
    assert.ok(!tableNames(db).has("broken"), "broken table must be rolled back");
    assert.ok(tableNames(db).has("conversations"), "previous migration must stay applied");
  } finally {
    db.close();
  }
});

test("missing migration.sql fails with a clear error", () => {
  const dir = makeTempDir("migrate-missing-");
  mkdirSync(path.join(dir, "0001_init"));
  const dbPath = path.join(dir, "test.db");
  const db = openDb(dbPath);
  try {
    assert.throws(
      () => applyMigrations(db, { migrationsDir: dir }),
      /0001_init is missing migration\.sql/
    );
  } finally {
    db.close();
  }
});

test("listMigrationDirs sorts lexically and ignores plain files", () => {
  const dir = makeTempDir("migrate-list-");
  mkdirSync(path.join(dir, "0002_agent_v2"));
  mkdirSync(path.join(dir, "0001_init"));
  writeFileSync(path.join(dir, "migration_lock.toml"), "provider = \"sqlite\"");

  assert.deepEqual(listMigrationDirs(dir), ["0001_init", "0002_agent_v2"]);
  assert.deepEqual(listMigrationDirs(path.join(dir, "not-exists")), []);
});

test("backupFileName produces a timestamped path next to the database", () => {
  const stamp = backupFileName("C:\\data\\dev.db", new Date(2026, 7, 12, 10, 30, 0));
  assert.equal(stamp, "C:\\data\\dev.db.backup-20260812-103000");
});
