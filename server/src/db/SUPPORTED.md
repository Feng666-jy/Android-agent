# Query Compatibility Layer — Supported Scope

> 本文档描述 `server/src/db/`（`prisma.ts` 兼容层 + `query.ts` 查询构建器）当前支持的能力范围。
> 新增 Service 代码时必须遵守本范围，超出范围的能力需要先扩展兼容层，而不是绕过它。

## 数据流

```
Migration Files (server/src/db/migrations/*.sql)
        ↓
Migration Runner (server/src/db/migrate.ts, 幂等 + 自动备份)
        ↓
SQLite Database (node:sqlite, DatabaseSync)
        ↓
Query Compatibility Layer (server/src/prisma.ts + query.ts + fieldmaps.ts)
        ↓
Service Layer (server/src/services/**)
```

## Supported

### 查询方法（`prisma.<model>`）

| 方法 | 说明 |
|------|------|
| `findMany` | 列表查询，支持 `where` / `orderBy` / `select` / `take` / `skip` |
| `findUnique` / `findFirst` | 单条查询（`where` 唯一/任意条件） |
| `count` | 计数 |
| `aggregate` | 聚合（`_sum` / `_count` 等） |
| `create` | 单条插入 |
| `createMany` | 批量插入 |
| `update` | 单条更新（`where` + `data`，含 `LazyOp` 惰性操作） |
| `updateMany` | 批量更新 |
| `delete` / `deleteMany` | 删除 |
| `$transaction` | 事务（函数式 `(tx) => {...}` 或数组式 `[op1, op2]`） |
| `$disconnect` | 关闭连接 |

### where 条件

- `equals`：直接值（`{ field: value }`）、`null`（`IS NULL`）
- `in`：`{ field: { in: [...] } }`（空数组 → `1=0`）
- 比较操作符：`lt` / `lte` / `gt` / `gte`（可组合，AND 连接）
- `not`：`{ field: { not: value } }`、`{ field: { not: null } }`
- `contains`：`{ field: { contains: 'text' } }` → `LIKE '%text%'`
- 顶层 `OR`：`{ OR: [cond1, cond2] }`

### 排序（orderBy）

- 字段排序：`{ field: 'asc' | 'desc' }` 或数组多字段
- 嵌套关系排序：`[{ relation: { field: 'desc' } }]`（自动 LEFT JOIN）

### 分页

- `take`（limit）+ `skip`（offset）

## Not Supported

以下 Prisma 能力**未实现**，新增代码不得使用：

- ❌ `include` / relation 自动加载（嵌套关系数据需分两次查询再 JS 组装）
- ❌ nested `create` / `update`（关联表需分别写操作，必要时包 `$transaction`）
- ❌ `groupBy`（分组聚合请用 `findMany` + JS 聚合，或先扩展兼容层）
- ❌ 复杂事务 API（interactive transaction 仅支持同步函数；嵌套事务、隔离级别等不支持）
- ❌ 自动 relation loading / lazy loading
- ❌ Prisma 客户端生成（无 `prisma generate`）

## 新增表约束

1. 新表/新列一律通过**增量迁移**：`server/src/db/migrations/<序号>_<名称>/migration.sql` + `npm run db:migrate`
2. 在 `server/src/db/fieldmaps.ts` 登记模型（表名、字段映射、布尔列）
3. 基线表（Phase 0 前）才允许修改 `server/src/db/schema.ts`（SCHEMA_SQL）
4. 迁移文件一旦应用即不可变，禁止事后修改已应用的迁移
