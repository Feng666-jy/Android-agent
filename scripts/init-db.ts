import 'dotenv/config'
import { DatabaseSync } from 'node:sqlite'
import { prisma, closeDatabase, resolveDbPath } from '../server/src/prisma.js'
import { applyMigrations } from '../server/src/db/migrate.js'

async function main() {
  // 非破坏性初始化：只确保 schema 存在，绝不删除既有数据。
  // connectDatabase 内部会执行 SCHEMA_SQL（CREATE TABLE IF NOT EXISTS），幂等。
  // 随后应用增量迁移（server/src/db/migrations/0002+），保证新表/新列与迁移文件一致。
  const dbPath = resolveDbPath()
  const rawDb = new DatabaseSync(dbPath)
  try {
    rawDb.exec('PRAGMA foreign_keys = ON;')
    const migrateResult = applyMigrations(rawDb, { dbPath })
    for (const name of migrateResult.applied) console.log(`migration applied: ${name}`)
    if (migrateResult.backupPath) console.log(`database backup: ${migrateResult.backupPath}`)
  } finally {
    rawDb.close()
  }
  const userCount = await prisma.user.count()
  const providerCount = await prisma.provider.count()
  const runCount = await prisma.agentRun.count()
  console.log(
    `Database ready (users=${userCount}, providers=${providerCount}, runs=${runCount}) — schema ensured, data preserved`
  )
}

async function run() {
  try {
    await main()
  } finally {
    closeDatabase()
  }
}

run().catch(e => {
  console.error('Failed:', e.message)
  closeDatabase()
  process.exit(1)
})
