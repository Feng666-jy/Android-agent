import { test, mock, afterEach } from "node:test"
import assert from "node:assert/strict"
import { z } from "zod"
import { validate } from "../../middleware/validate.ts"
import { createMockRes, createMockReq, createMockNext } from "../helpers.ts"

afterEach(() => {
  mock.restoreAll()
})

test("valid body: replaces req.body with parsed value and calls next", () => {
  const schema = z.object({ name: z.string().min(3) })
  const handler = validate(schema)
  const { res, json } = createMockRes()
  const req = createMockReq({}, { name: "Alice" })
  const next = createMockNext()

  handler(req, res, next)

  assert.deepEqual(req.body, { name: "Alice" })
  assert.equal(next.mock.calls.length, 1)
  assert.equal(json.mock.calls.length, 0)
})

test("invalid body: calls fail with field path and constraint message", () => {
  const schema = z.object({ name: z.string().min(3) })
  const handler = validate(schema)
  const { res, json, status } = createMockRes()
  const req = createMockReq({}, { name: "Al" })
  const next = createMockNext()

  handler(req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [400])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.code, -10)
  assert.match(body.message, /name/)
  assert.match(body.message, /at least 3/)
  assert.equal(next.mock.calls.length, 0)
})

test("valid query source: parses query and calls next", () => {
  const schema = z.object({ page: z.number().int() })
  const handler = validate(schema, "query")
  const { res, json } = createMockRes()
  const req = createMockReq({}, {}, { page: 5 })
  const next = createMockNext()

  handler(req, res, next)

  assert.deepEqual(req.query, { page: 5 })
  assert.equal(next.mock.calls.length, 1)
  assert.equal(json.mock.calls.length, 0)
})

test("invalid type: number expected, string given triggers fail", () => {
  const schema = z.object({ age: z.number() })
  const handler = validate(schema)
  const { res, json, status } = createMockRes()
  const req = createMockReq({}, { age: "not-a-number" })
  const next = createMockNext()

  handler(req, res, next)

  assert.equal(status.mock.calls.length, 1)
  assert.deepEqual(status.mock.calls[0].arguments, [400])
  const body = json.mock.calls[0].arguments[0]
  assert.equal(body.code, -10)
  assert.match(body.message, /age/)
  assert.equal(next.mock.calls.length, 0)
})
