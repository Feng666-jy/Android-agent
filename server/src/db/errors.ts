/**
 * 数据库错误类型。
 * 替代 Prisma.PrismaClientKnownRequestError 的语义映射：
 *   unique      -> 唯一约束冲突（对标 P2002）
 *   not_found   -> 记录不存在（对标 P2025）
 *   connection  -> 数据库连接失败（对标 P1001 / PrismaClientInitializationError）
 *   generic     -> 其它数据库错误
 */

export type DbErrorKind = "unique" | "not_found" | "connection" | "generic";

export class DbError extends Error {
  readonly kind: DbErrorKind;

  constructor(message: string, kind: DbErrorKind = "generic") {
    super(message);
    this.name = "DbError";
    this.kind = kind;
  }
}

export function toDbError(err: unknown): DbError {
  const message = err instanceof Error ? err.message : String(err);
  if (/UNIQUE constraint failed/i.test(message)) {
    return new DbError(message, "unique");
  }
  if (/no such table|unable to open|database is not open|SQLITE_CANTOPEN/i.test(message)) {
    return new DbError(message, "connection");
  }
  return new DbError(message, "generic");
}
