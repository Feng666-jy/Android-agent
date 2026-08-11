/**
 * 迁移运行器 — 幂等增量迁移（Phase 0 / T01）
 *
 * 背景：
 * - 运行时数据层是 node:sqlite + 自研 Prisma 兼容层（server/src/prisma.ts），
 *   此前只执行 SCHEMA_SQL（CREATE TABLE IF NOT EXISTS），没有 ALTER 能力。
 * - 本模块提供真正的迁移能力：按 prisma/migrations/<序号>_<名称>/migration.sql
 *   顺序执行，_migrations 表记录已应用迁移，天然幂等、可重入。
 *
 * 规则：
 * - 目录列表按名称字典序（0001_init < 0002_agent_v2）。
 * - 第一个迁移视为基线（baseline）：若库中已存在 users 表（说明基线已由
 *   SCHEMA_SQL / 旧库建立），只记录不执行，避免 "table already exists"。
 * - 每个迁移在单个事务内执行（SQLite DDL 可回滚），失败即整体回滚并抛错。
 * - 提供 dbPath 时，应用前自动备份数据库文件（*.db.backup-<时间戳>）。
 *
 * 注意：迁移文件一旦应用即视为不可变，不要事后修改已应用的迁移。
 */

import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, readdirSync, readFileSync, copyFileSync } from "node:fs";
import path from "node:path";

export interface MigrationOptions {
  /** 迁移目录（默认 process.cwd()/prisma/migrations） */
  migrationsDir?: string;
  /** 数据库文件路径：提供时在应用新迁移前自动备份 */
  dbPath?: string;
  /** 备份目录（默认与数据库文件同目录） */
  backupDir?: string;
}

export interface MigrationResult {
  /** 本次实际执行的迁移 */
  applied: string[];
  /** 已应用 / 基线跳过的迁移 */
  skipped: string[];
  /** 自动备份文件路径（未提供 dbPath 或无需迁移时为 null） */
  backupPath: string | null;
}

export const DEFAULT_MIGRATIONS_DIR = path.resolve(process.cwd(), "prisma/migrations");

/** 按名称排序的迁移目录列表（只取目录，忽略 migration_lock.toml 等文件） */
export function listMigrationDirs(migrationsDir: string): string[] {
  if (!existsSync(migrationsDir)) return [];
  return readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** 当前库全部表名 */
export function tableNames(db: DatabaseSync): Set<string> {
  const rows = db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table'`)
    .all() as Array<{ name: string }>;
  return new Set(rows.map((row) => row.name));
}

function ensureMigrationsTable(db: DatabaseSync): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS "_migrations" (
       "name" TEXT NOT NULL PRIMARY KEY,
       "applied_at" TEXT NOT NULL
     )`
  );
}

/** 已应用迁移名集合 */
export function appliedMigrationNames(db: DatabaseSync): Set<string> {
  const rows = db
    .prepare(`SELECT name FROM "_migrations" ORDER BY name`)
    .all() as Array<{ name: string }>;
  return new Set(rows.map((row) => row.name));
}

function recordApplied(db: DatabaseSync, name: string): void {
  db.prepare(`INSERT INTO "_migrations" ("name", "applied_at") VALUES (?, ?)`).run(
    name,
    new Date().toISOString()
  );
}

/** 生成备份文件名：<dbPath>.backup-<YYYYMMDD-HHmmss> */
export function backupFileName(dbPath: string, now: Date = new Date()): string {
  const pad = (value: number): string => String(value).padStart(2, "0");
  const stamp =
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `${dbPath}.backup-${stamp}`;
}

/** 复制数据库文件为备份，返回备份路径；目录不存在时自动创建 */
export function backupDatabaseFile(dbPath: string, backupDir?: string): string {
  const target = backupDir
    ? path.join(backupDir, path.basename(backupFileName(dbPath)))
    : backupFileName(dbPath);
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(dbPath, target);
  return target;
}

/**
 * 应用所有未执行的迁移。
 * - 已有基线库：首条迁移标记为已应用，不重复执行。
 * - 单迁移失败：事务回滚，抛错（不影响已应用的迁移）。
 */
export function applyMigrations(
  db: DatabaseSync,
  options: MigrationOptions = {}
): MigrationResult {
  const migrationsDir = options.migrationsDir ?? DEFAULT_MIGRATIONS_DIR;
  const dirs = listMigrationDirs(migrationsDir);
  ensureMigrationsTable(db);

  const applied = appliedMigrationNames(db);
  const result: MigrationResult = { applied: [], skipped: [], backupPath: null };

  const pending = dirs.filter((name) => !applied.has(name));
  if (pending.length > 0 && options.dbPath) {
    result.backupPath = backupDatabaseFile(options.dbPath, options.backupDir);
  }

  const baseline = dirs[0];
  const baselineAlreadyPresent = baseline !== undefined && tableNames(db).has("users");

  for (const name of dirs) {
    if (applied.has(name)) {
      result.skipped.push(name);
      continue;
    }

    const sqlFile = path.join(migrationsDir, name, "migration.sql");
    if (!existsSync(sqlFile)) {
      throw new Error(`Migration ${name} is missing migration.sql`);
    }

    if (name === baseline && baselineAlreadyPresent) {
      recordApplied(db, name);
      result.skipped.push(`${name} (baseline)`);
      continue;
    }

    const sql = readFileSync(sqlFile, "utf8");
    db.exec("BEGIN");
    try {
      db.exec(sql);
      recordApplied(db, name);
      db.exec("COMMIT");
      result.applied.push(name);
    } catch (err) {
      db.exec("ROLLBACK");
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Migration ${name} failed: ${message}`);
    }
  }

  return result;
}
