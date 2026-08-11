import { test, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma.ts";

process.env.JWT_SECRET = "test-secret";

const { authService, AppError } = await import("../../services/auth.service.ts");

beforeEach(() => {
  mock.restoreAll();
  mock.reset();
  // bcrypt/jwt are writable default-export objects
  mock.method(bcrypt, "hash", async () => "HASHED");
  mock.method(bcrypt, "compare", async () => true);
  mock.method(jwt, "sign", () => "TOKEN");
  // prisma.user is a Proxy; direct assignment works (writable:true descriptor)
  const u = prisma.user as any;
  u.findFirst = mock.fn(async () => null);
  u.findUnique = mock.fn(async () => null);
  u.create = mock.fn(async (args: any) => ({
    id: 1, username: args.data.username, email: args.data.email, createdAt: "2026-01-01",
  }));
  u.update = mock.fn(async (args: any) => ({
    id: 1, username: args.data.username || "alice", email: args.data.email,
    avatar: args.data.avatar, updatedAt: "2026-01-02",
  }));
});

afterEach(() => {
  mock.restoreAll();
});

test("register: success", async () => {
  const result = await authService.register({ username: "alice", password: "pw123", email: "a@b.cn" });
  assert.equal(result.user.username, "alice");
  assert.equal(result.token, "TOKEN");
  assert.equal((bcrypt.hash as any).mock.calls.length, 1);
  assert.deepEqual((bcrypt.hash as any).mock.calls[0].arguments, ["pw123", 10]);
});

test("register: username taken throws AppError -11", async () => {
  (prisma.user as any).findFirst = mock.fn(async () => ({ username: "alice", email: "other@x.cn" }));
  await assert.rejects(
    () => authService.register({ username: "alice", password: "pw", email: "a@b.cn" }),
    (err: any) => { assert.equal(err.code, -11); assert.ok(err instanceof AppError); return true; }
  );
});

test("register: email taken throws AppError -12", async () => {
  (prisma.user as any).findFirst = mock.fn(async () => ({ username: "other", email: "a@b.cn" }));
  await assert.rejects(
    () => authService.register({ username: "alice", password: "pw", email: "a@b.cn" }),
    (err: any) => { assert.equal(err.code, -12); return true; }
  );
});

test("login: success returns user without password", async () => {
  (prisma.user as any).findUnique = mock.fn(async () => ({ id: 1, username: "alice", password: "HASHED", email: "a@b.cn", createdAt: "2026-01-01" }));
  const result = await authService.login({ username: "alice", password: "pw123" });
  assert.equal(result.user.username, "alice");
  assert.equal(result.token, "TOKEN");
  assert.ok(!("password" in result.user));
});

test("login: user not found throws AppError -13", async () => {
  (prisma.user as any).findUnique = mock.fn(async () => null);
  await assert.rejects(
    () => authService.login({ username: "ghost", password: "pw" }),
    (err: any) => { assert.equal(err.code, -13); return true; }
  );
});

test("login: wrong password throws AppError -13", async () => {
  (prisma.user as any).findUnique = mock.fn(async () => ({ id: 1, username: "alice", password: "HASHED", email: "a@b.cn", createdAt: "2026-01-01" }));
  mock.method(bcrypt, "compare", async () => false);
  await assert.rejects(
    () => authService.login({ username: "alice", password: "wrong" }),
    (err: any) => { assert.equal(err.code, -13); return true; }
  );
});

test("getUserInfo: success", async () => {
  (prisma.user as any).findUnique = mock.fn(async () => ({ id: 1, username: "alice", email: "a@b.cn", avatar: "img", createdAt: "2026-01-01", updatedAt: "2026-01-02" }));
  const result = await authService.getUserInfo(1);
  assert.equal(result.username, "alice");
  assert.equal(result.avatar, "img");
});

test("getUserInfo: not found throws AppError -14", async () => {
  (prisma.user as any).findUnique = mock.fn(async () => null);
  await assert.rejects(
    () => authService.getUserInfo(999),
    (err: any) => { assert.equal(err.code, -14); return true; }
  );
});

test("updateProfile: success", async () => {
  const result = await authService.updateProfile(1, { email: "x@y.cn", avatar: "new" });
  assert.equal(result.email, "x@y.cn");
  assert.equal(result.avatar, "new");
});

test("AppError: is Error with code and name", () => {
  const err = new AppError("boom", -99);
  assert.ok(err instanceof Error);
  assert.equal(err.code, -99);
  assert.equal(err.name, "AppError");
});