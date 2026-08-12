/**
 * 数据库查看 CLI — npm run db:inspect
 *
 * 用法：
 *   npm run db:inspect                  # 列出表 + 每表列数 + 迁移状态
 *   npm run db:inspect -- --columns     # 每表完整列定义
 *   npm run db:inspect -- --indexes     # 每表索引
 *   npm run db:inspect -- --migrations  # 已应用迁移列表
 *   npm run db:inspect -- --all         # 全部信息
 */

import 'dotenv/config'
import { DatabaseSync } from 'node:sqlite'
import { resolveDbPath } from '../server/src/prisma.js'

interface TableRow {
  name: string
  type: string
}

interface ColumnRow {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: string | null
  pk: number
}

const showAll = process.argv.includes('--all')
const showColumns = showAll || process.argv.includes('--columns')
const showIndexes = showAll || process.argv.includes('--indexes')
const showMigrations = showAll || process.argv.includes('--migrations')

function main(): void {
  const dbPath = resolveDbPath()
  console.log(`Database: ${dbPath}`)
  const db = new DatabaseSync(dbPath)

  try {
    const tables = db
      .prepare(
        `SELECT name, type FROM sqlite_master WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%' ORDER BY name`
      )
      .all() as TableRow[]

    console.log(`\n=== Tables (${tables.length}) ===`)
    for (const table of tables) {
      const count = (db.prepare(`SELECT COUNT(*) AS n FROM "${table.name}"`).get() as { n: number })
        .n
      console.log(`  ${table.name} (${table.type}, ${count} rows)`)
    }

    if (showColumns) {
      console.log(`\n=== Columns ===`)
      for (const table of tables) {
        console.log(`\n  ${table.name}:`)
        const cols = db.prepare(`PRAGMA table_info("${table.name}")`).all() as ColumnRow[]
        for (const col of cols) {
          const parts = [col.type]
          if (col.notnull) parts.push('NOT NULL')
          if (col.dflt_value !== null) parts.push(`DEFAULT ${col.dflt_value}`)
          if (col.pk) parts.push('PRIMARY KEY')
          console.log(`    ${col.name} ${parts.join(' ')}`)
        }
      }
    }

    if (showIndexes) {
      console.log(`\n=== Indexes ===`)
      for (const table of tables) {
        const idxs = db.prepare(`PRAGMA index_list("${table.name}")`).all() as Array<{
          name: string
          unique: number
          origin: string
        }>
        if (!idxs.length) continue
        console.log(`\n  ${table.name}:`)
        for (const idx of idxs) {
          const detail = db.prepare(`PRAGMA index_info("${idx.name}")`).all() as Array<{
            seqno: number
            name: string
          }>
          const cols = detail.map(d => d.name).join(', ')
          console.log(`    ${idx.name} (${cols})${idx.unique ? ' UNIQUE' : ''} [${idx.origin}]`)
        }
      }
    }

    if (showMigrations) {
      console.log(`\n=== Migrations ===`)
      const hasTable = db
        .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '_migrations'`)
        .get()
      if (!hasTable) {
        console.log('  (no _migrations table — migrations never applied)')
      } else {
        const rows = db
          .prepare(`SELECT name, applied_at FROM "_migrations" ORDER BY name`)
          .all() as Array<{ name: string; applied_at: string }>
        if (!rows.length) console.log('  (empty)')
        for (const row of rows) console.log(`  ${row.name}  @ ${row.applied_at}`)
      }
    }
  } finally {
    db.close()
  }
}

main()
