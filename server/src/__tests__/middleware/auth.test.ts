process.env.JWT_SECRET = "test-secret"

import { test, mock, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import jwt from "jsonwebtoken"
import { createMockRes, createMockReq, createMockNext } from "../helpers.ts"

let authMiddleware: (req: any, res: any, next: any) => void

beforeEach(async () => {
  const mod = await import("../../middleware/auth.ts")
  authMiddleware = mod.authMiddleware
})

afterEach(() => {
  mock.restoreAll()
})

test("returns 401 when no authorization header", () => {
  const { res, json, status } = createMockRes()
  const req = createMockReq()
  const next = createMockNext()

  authMiddleware(req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [401])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.code, 2000)
  assert.equal(body.message, "No token provided")
  assert.equal(next.mock.calls.length, 0)
})

test("returns 401 when header does not start with Bearer", () => {
  const { res, json, status } = createMockRes()
  const req = createMockReq({ authorization: "Basic xyz" })
  const next = createMockNext()

  authMiddleware(req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [401])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "No token provided")
  assert.equal(next.mock.calls.length, 0)
})

test("returns 401 when jwt.verify throws", () => {
  mock.method(jwt, "verify", mock.fn(() => {
    throw new Error("bad token")
  }))
  const { res, json, status } = createMockRes()
  const req = createMockReq({ authorization: "Bearer xyz" })
  const next = createMockNext()

  authMiddleware(req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [401])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.message, "Invalid or expired token")
  assert.equal(next.mock.calls.length, 0)
})

test("sets req.user and calls next when token is valid", () => {
  const decoded = { userId: 1, username: "test" }
  mock.method(jwt, "verify", mock.fn(() => decoded))
  const { res, json, status } = createMockRes()
  const req = createMockReq({ authorization: "Bearer xyz" })
  const next = createMockNext()

  authMiddleware(req, res, next)

  assert.deepEqual(req.user, decoded)
  assert.equal(next.mock.calls.length, 1)
  assert.equal(status.mock.calls.length, 0)
  assert.equal(json.mock.calls.length, 0)
})
