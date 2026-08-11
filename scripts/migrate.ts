/**
 * 迁移 CLI — npm run db:migrate
 *
 * 用法：
 *   npm run db:migrate            # 应用 prisma/migrations 下所有未执行迁移（自动备份 dev.db）
 *   npm run db:migrate -- --no-backup   # 跳过自动备份（不推荐）
 */

import "dotenv/config";
import { DatabaseSync } from "node:sqlite";
import { resolveDbPath } from "../server/src/prisma.js";
import { applyMigrations } from "../server/src/db/migrate.js";

const noBackup = process.argv.includes("--no-backup");

function main(): void {
  const dbPath = resolveDbPath();
  const db = new DatabaseSync(dbPath);
  try {
    db.exec("PRAGMA foreign_keys = ON;");
    const result = applyMigrations(db, { dbPath: noBackup ? undefined : dbPath });
    for (const name of result.applied) {
      console.log(`applied:  ${name}`);
    }
    for (const name of result.skipped) {
      console.log(`skipped:  ${name}`);
    }
    if (result.backupPath) {
      console.log(`backup:   ${result.backupPath}`);
    }
    console.log(
      `Migration finished (applied=${result.applied.length}, skipped=${result.skipped.length})`
    );
  } catch (err) {
    console.error(`Migration failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

main();
