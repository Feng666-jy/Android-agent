import { test, mock, afterEach, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { DbError } from "../../db/errors.ts"
import { errorHandler } from "../../middleware/error.ts"
import { logger } from "../../utils/logger.ts"
import { createMockRes, createMockReq, createMockNext } from "../helpers.ts"

beforeEach(() => {
  mock.method(logger, "error", mock.fn())
})

afterEach(() => {
  mock.restoreAll()
})

test("unique violation -> fail with resource exists message, 409", () => {
  const { res, json, status } = createMockRes()
  const req = createMockReq()
  const next = createMockNext()
  const err = new DbError("UNIQUE constraint failed: providers.name", "unique")

  errorHandler(err, req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [409])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "\u8d44\u6e90\u5df2\u5b58\u5728")
  assert.equal(body.code, -20)
})

test("not_found -> fail with resource not found message, 404", () => {
  const { res, json, status } = createMockRes()
  const req = createMockReq()
  const next = createMockNext()
  const err = new DbError("Record not found", "not_found")

  errorHandler(err, req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [404])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "\u8d44\u6e90\u4e0d\u5b58\u5728")
  assert.equal(body.code, -21)
})

test("connection -> fail with db connection failed message, 503", () => {
  const { res, json, status } = createMockRes()
  const req = createMockReq()
  const next = createMockNext()
  const err = new DbError("no such table: users", "connection")

  errorHandler(err, req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [503])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "\u6570\u636e\u5e93\u8fde\u63a5\u5931\u8d25")
  assert.equal(body.code, -22)
})

test("generic db error -> fail with db error message, 500", () => {
  const { res, json, status } = createMockRes()
  const req = createMockReq()
  const next = createMockNext()
  const err = new DbError("boom")

  errorHandler(err, req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [500])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "\u6570\u636e\u5e93\u9519\u8bef")
  assert.equal(body.code, -23)
})

test("generic Error in production -> serverError with generic message", () => {
  const originalNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = "production"
  const { res, json, status } = createMockRes()
  const req = createMockReq()
  const next = createMockNext()
  const err = new Error("secret details")

  errorHandler(err, req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [500])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef")
  assert.equal(body.code, 5000)

  process.env.NODE_ENV = originalNodeEnv
})

test("generic Error in dev -> serverError with err.message", () => {
  const originalNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = "development"
  const { res, json, status } = createMockRes()
  const req = createMockReq()
  const next = createMockNext()
  const err = new Error("debug info")

  errorHandler(err, req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [500])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "debug info")
  assert.equal(body.code, 5000)

  process.env.NODE_ENV = originalNodeEnv
})
