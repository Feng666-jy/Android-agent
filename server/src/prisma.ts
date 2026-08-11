/**
 * 数据库门�?�?Prisma 兼容层，底层�?node:sqlite�? *
 * 提供�?@prisma/client 兼容�?`prisma` 对象（findMany/findUnique/findFirst/
 * count/aggregate/create/createMany/update/updateMany/delete/deleteMany/$transaction），
 * �?service/controller 层无需改动即可�?Prisma 迁移�?node:sqlite�? *
 * 零原生依赖：Windows 开发与 Termux (Android Linux) 行为一致�? */
import "dotenv/config";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { TABLES, RELATIONS } from "./db/fieldmaps.js";
import { SCHEMA_SQL } from "./db/schema.js";
import { LazyOp } from "./db/lazy-op.js";
import { DbError, toDbError } from "./db/errors.js";
import {
  buildWhere,
  buildOrderBy,
  mapRowToJs,
  mapDataToColumns,
  pick,
  nowIso,
} from "./db/query.js";
import { logger } from "./utils/logger.js";

// ---- 连接管理 ----

let db: DatabaseSync | null = null;

export function resolveDbPath(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  const withoutPrefix = raw.startsWith("file:") ? raw.slice("file:".length) : raw;
  return path.resolve(process.cwd(), withoutPrefix);
}

function openDatabase(): DatabaseSync {
  const dbPath = resolveDbPath();
  mkdirSync(path.dirname(dbPath), { recursive: true });
  const database = new DatabaseSync(dbPath);
  database.exec(SCHEMA_SQL);
  return database;
}

function ensureDb(): DatabaseSync {
  if (!db) db = openDatabase();
  return db;
}

export async function connectDatabase(): Promise<void> {
  try {
    ensureDb();
    logger.info("Database connected");
  } catch (error) {
    logger.error(
      "Failed to connect to database:",
      error instanceof Error ? error.message : error
    );
    logger.warn("Server will start without database.");
  }
}

export function closeDatabase(): void {
  db?.close();
  db = null;
}

// ---- 基础操作（同步执行，�?LazyOp 包装�?----

type AnyArgs = Record<string, any>;

function findManyOp(model: string, args: AnyArgs): any[] {
  const cfg = TABLES[model];
  const database = ensureDb();
  const where = buildWhere(cfg, args.where);
  const order = buildOrderBy(model, args.orderBy);

  let sql = `SELECT "${cfg.table}".* FROM "${cfg.table}"`;
  for (const join of order.joins) sql += ` ${join}`;
  const params: any[] = [...where.params];

  if (where.sql) sql += ` WHERE ${where.sql}`;
  if (order.sql) sql += ` ORDER BY ${order.sql}`;
  if (args.take !== undefined) {
    sql += ` LIMIT ?`;
    params.push(Number(args.take));
  }
  if (args.skip) {
    sql += ` OFFSET ?`;
    params.push(Number(args.skip));
  }

  const rows = database.prepare(sql).all(...params) as Record<string, any>[];
  const jsRows = rows.map((r) => mapRowToJs(cfg, r));
  resolveIncludes(model, jsRows, args.include);
  return args.select ? jsRows.map((r) => pick(r, args.select)) : jsRows;
}

function findFirstOp(model: string, args: AnyArgs): any {
  const rows = findManyOp(model, { ...args, take: 1 });
  return rows[0] ?? null;
}

function countOp(model: string, args: AnyArgs): number {
  const cfg = TABLES[model];
  const database = ensureDb();
  const where = buildWhere(cfg, args.where);
  let sql = `SELECT COUNT(*) AS c FROM "${cfg.table}"`;
  const params: any[] = [...where.params];
  if (where.sql) sql += ` WHERE ${where.sql}`;
  const row = database.prepare(sql).get(...params) as { c: number };
  return Number(row.c);
}

function aggregateOp(model: string, args: AnyArgs): Record<string, any> {
  const cfg = TABLES[model];
  const database = ensureDb();
  const entries = Object.entries(args);
  const opEntry = entries.find(([key]) => key !== "where");
  if (!opEntry) throw new DbError("aggregate requires an aggregation key", "generic");

  const [opKey, fieldsObj] = opEntry as [string, Record<string, any>];
  const field = Object.keys(fieldsObj)[0];
  const col = cfg.fields[field];
  if (!col) throw new DbError(`Unknown field "${field}" on "${cfg.table}"`, "generic");

  const fn = opKey.replace(/^_/, "").toUpperCase();
  const where = buildWhere(cfg, args.where);
  let sql = `SELECT ${fn}("${col}") AS v FROM "${cfg.table}"`;
  const params: any[] = [...where.params];
  if (where.sql) sql += ` WHERE ${where.sql}`;
  const row = database.prepare(sql).get(...params) as { v: number | null };
  return { [opKey]: { [field]: row.v } };
}

function createOp(model: string, args: AnyArgs): any {
  const cfg = TABLES[model];
  const database = ensureDb();
  const data: Record<string, any> = { ...(args.data ?? {}) };

  if (!cfg.autoId && data.id === undefined) data.id = randomUUID();
  if (cfg.fields.createdAt && data.createdAt === undefined) data.createdAt = new Date();
  if (cfg.fields.updatedAt && data.updatedAt === undefined) data.updatedAt = new Date();

  const cols = mapDataToColumns(cfg, data);
  const names = Object.keys(cols);
  const values = Object.values(cols);

  let rowId: unknown;
  try {
    const sql = `INSERT INTO "${cfg.table}" (${names.map((n) => `"${n}"`).join(", ")}) VALUES (${names.map(() => "?").join(", ")})`;
    const info = database.prepare(sql).run(...values);
    rowId = cfg.autoId ? Number(info.lastInsertRowid) : data.id;
  } catch (err) {
    throw toDbError(err);
  }

  const js = mapRowToJs(cfg, { ...cols, [cfg.fields.id]: rowId });
  return args.select ? pick(js, args.select) : js;
}

function createManyOp(model: string, args: AnyArgs): { count: number } {
  let count = 0;
  for (const item of args.data ?? []) {
    createOp(model, { data: item });
    count++;
  }
  return { count };
}

function updateOp(model: string, args: AnyArgs): any {
  const cfg = TABLES[model];
  const database = ensureDb();
  const where = buildWhere(cfg, args.where);
  if (!where.sql) throw new DbError("update requires a where clause", "generic");

  const data: Record<string, any> = { ...(args.data ?? {}) };
  if (cfg.fields.updatedAt) data.updatedAt = nowIso();
  const cols = mapDataToColumns(cfg, data);
  const sets = Object.keys(cols).map((c) => `"${c}" = ?`);
  const values = [...Object.values(cols), ...where.params];

  let changes = 0;
  try {
    const sql = `UPDATE "${cfg.table}" SET ${sets.join(", ")} WHERE ${where.sql}`;
    changes = Number(database.prepare(sql).run(...values).changes);
  } catch (err) {
    throw toDbError(err);
  }
  if (changes === 0) throw new DbError(`Record not found`, "not_found");

  const row = database
    .prepare(`SELECT * FROM "${cfg.table}" WHERE ${where.sql} LIMIT 1`)
    .get(...where.params) as Record<string, any>;
  const js = mapRowToJs(cfg, row);
  return args.select ? pick(js, args.select) : js;
}

function updateManyOp(model: string, args: AnyArgs): { count: number } {
  const cfg = TABLES[model];
  const database = ensureDb();
  const where = buildWhere(cfg, args.where);
  const data: Record<string, any> = { ...(args.data ?? {}) };
  if (cfg.fields.updatedAt) data.updatedAt = nowIso();
  const cols = mapDataToColumns(cfg, data);
  if (Object.keys(cols).length === 0) return { count: 0 };

  const sets = Object.keys(cols).map((c) => `"${c}" = ?`);
  let sql = `UPDATE "${cfg.table}" SET ${sets.join(", ")}`;
  const params: any[] = [...Object.values(cols)];
  if (where.sql) {
    sql += ` WHERE ${where.sql}`;
    params.push(...where.params);
  }
  const changes = Number(database.prepare(sql).run(...params).changes);
  return { count: changes };
}

function deleteOp(model: string, args: AnyArgs): any {
  const cfg = TABLES[model];
  const database = ensureDb();
  const where = buildWhere(cfg, args.where);
  if (!where.sql) throw new DbError("delete requires a where clause", "generic");

  const row = database
    .prepare(`SELECT * FROM "${cfg.table}" WHERE ${where.sql} LIMIT 1`)
    .get(...where.params) as Record<string, any> | undefined;

  let changes = 0;
  try {
    changes = Number(
      database.prepare(`DELETE FROM "${cfg.table}" WHERE ${where.sql}`).run(...where.params).changes
    );
  } catch (err) {
    throw toDbError(err);
  }
  if (changes === 0) throw new DbError(`Record not found`, "not_found");
  return row ? mapRowToJs(cfg, row) : null;
}

function deleteManyOp(model: string, args: AnyArgs): { count: number } {
  const cfg = TABLES[model];
  const database = ensureDb();
  const where = buildWhere(cfg, args.where);
  let sql = `DELETE FROM "${cfg.table}"`;
  const params: any[] = [];
  if (where.sql) {
    sql += ` WHERE ${where.sql}`;
    params.push(...where.params);
  }
  const changes = Number(database.prepare(sql).run(...params).changes);
  return { count: changes };
}

// ---- include 解析（额外查�?+ 内存组装�?----

function resolveIncludes(model: string, rows: any[], include: AnyArgs): void {
  if (!include || rows.length === 0) return;
  const database = ensureDb();

  for (const [relKey, spec] of Object.entries(include)) {
    if (relKey === "_count") {
      const countKey = Object.keys(spec?.select ?? { models: true })[0] ?? "models";
      const rel = RELATIONS[model]?.[countKey];
      if (!rel) continue;
      const childCfg = TABLES[rel.table];
      const childCol = childCfg.fields[rel.childCol];
      const ids = rows.map((r) => r.id).filter((v) => v != null);
      if (ids.length === 0) {
        rows.forEach((r) => (r._count = { [countKey]: 0 }));
        continue;
      }
      const sql = `SELECT "${childCol}" AS _fk, COUNT(*) AS _c FROM "${childCfg.table}" WHERE "${childCol}" IN (${ids.map(() => "?").join(",")}) GROUP BY "${childCol}"`;
      const counts = new Map<unknown, number>();
      for (const r of database.prepare(sql).all(...ids) as any[]) {
        counts.set(r._fk, Number(r._c));
      }
      rows.forEach((r) => (r._count = { [countKey]: counts.get(r.id) ?? 0 }));
      continue;
    }

    const rel = RELATIONS[model]?.[relKey];
    if (!rel) continue;
    const childCfg = TABLES[rel.table];
    const childCol = childCfg.fields[rel.childCol];
    const fkValues = [...new Set(rows.map((r) => r[rel.parentCol]).filter((v) => v != null))];

    if (fkValues.length === 0) {
      if (rel.singular) rows.forEach((r) => (r[relKey] = null));
      else rows.forEach((r) => (r[relKey] = []));
      continue;
    }

    let whereSql = `"${childCol}" IN (${fkValues.map(() => "?").join(",")})`;
    const params: any[] = [...fkValues];
    if (spec && typeof spec === "object" && spec.where) {
      const w = buildWhere(childCfg, spec.where);
      if (w.sql) {
        whereSql += ` AND ${w.sql}`;
        params.push(...w.params);
      }
    }

    const sql = `SELECT * FROM "${childCfg.table}" WHERE ${whereSql}`;
    const childRows = (database.prepare(sql).all(...params) as Record<string, any>[]).map((r) =>
      mapRowToJs(childCfg, r)
    );

    if (rel.singular) {
      const map = new Map<unknown, any>();
      for (const r of childRows) map.set(r[rel.childCol], r);
      rows.forEach((r) => {
        r[relKey] = r[rel.parentCol] != null ? map.get(r[rel.parentCol]) ?? null : null;
      });
    } else {
      const map = new Map<unknown, any[]>();
      for (const r of childRows) {
        const arr = map.get(r[rel.childCol]) ?? [];
        arr.push(r);
        map.set(r[rel.childCol], arr);
      }
      rows.forEach((r) => (r[relKey] = map.get(r.id) ?? []));
    }
  }
}

// ---- Prisma 兼容门面 ----

export interface PrismaModelApi {
  findMany<T = any>(args?: AnyArgs): LazyOp<T[]>;
  findUnique<T = any>(args: AnyArgs): LazyOp<T | null>;
  findFirst<T = any>(args?: AnyArgs): LazyOp<T | null>;
  count(args?: AnyArgs): LazyOp<number>;
  aggregate(args: AnyArgs): LazyOp<any>;
  create<T = any>(args: AnyArgs): LazyOp<T>;
  createMany(args: AnyArgs): LazyOp<{ count: number }>;
  update<T = any>(args: AnyArgs): LazyOp<T>;
  updateMany(args: AnyArgs): LazyOp<{ count: number }>;
  delete<T = any>(args: AnyArgs): LazyOp<T | null>;
  deleteMany(args?: AnyArgs): LazyOp<{ count: number }>;
}

export type PrismaClient = Record<string, PrismaModelApi> & {
  $transaction(arg: any): LazyOp<any>;
  $disconnect(): Promise<void>;
};

function makeModelApi(model: string): PrismaModelApi {
  return {
    findMany: (args: AnyArgs = {}) => new LazyOp(() => findManyOp(model, args)),
    findUnique: (args: AnyArgs) => new LazyOp(() => findFirstOp(model, args)),
    findFirst: (args: AnyArgs = {}) => new LazyOp(() => findFirstOp(model, args)),
    count: (args: AnyArgs = {}) => new LazyOp(() => countOp(model, args)),
    aggregate: (args: AnyArgs) => new LazyOp(() => aggregateOp(model, args)),
    create: (args: AnyArgs) => new LazyOp(() => createOp(model, args)),
    createMany: (args: AnyArgs) => new LazyOp(() => createManyOp(model, args)),
    update: (args: AnyArgs) => new LazyOp(() => updateOp(model, args)),
    updateMany: (args: AnyArgs) => new LazyOp(() => updateManyOp(model, args)),
    delete: (args: AnyArgs) => new LazyOp(() => deleteOp(model, args)),
    deleteMany: (args: AnyArgs = {}) => new LazyOp(() => deleteManyOp(model, args)),
  };
}

const prismaImpl = Object.fromEntries(
  Object.keys(TABLES).map((model) => [model, makeModelApi(model)])
) as unknown as PrismaClient;

prismaImpl.$transaction = (arg: any): LazyOp<any> =>
  new LazyOp(async () => {
    const database = ensureDb();
    database.exec("BEGIN");
    try {
      if (typeof arg === "function") {
        const result = await arg(prismaImpl);
        database.exec("COMMIT");
        return result;
      }
      const results = (arg ?? []).map((op: any) => op._run());
      database.exec("COMMIT");
      return results;
    } catch (err) {
      try {
        database.exec("ROLLBACK");
      } catch {
        // 忽略回滚失败
      }
      throw err;
    }
  });

prismaImpl.$disconnect = (): Promise<void> => {
  closeDatabase();
  return Promise.resolve();
};

export const prisma: PrismaClient = prismaImpl;
