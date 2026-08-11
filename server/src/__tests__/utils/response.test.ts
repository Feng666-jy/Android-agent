import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import { success, fail, unauthorized, forbidden, notFound, serverError } from "../../utils/response.ts";
import { createMockRes } from "../helpers.ts";

afterEach(() => {
  mock.restoreAll();
});

test("success(res, data) sends code 0, default message, and data", () => {
  const { res, json } = createMockRes();
  const data = { id: 1, name: "ok" };

  success(res as any, data);

  assert.deepEqual(json.mock.calls[0].arguments[0], {
    code: 0,
    message: "success",
    data,
  });
});

test("success(res, data, message) uses the given message", () => {
  const { res, json } = createMockRes();
  success(res as any, [], "ok");

  assert.equal(json.mock.calls[0].arguments[0].message, "ok");
});

test("success with custom status code", () => {
  const { res, json, status } = createMockRes();
  success(res as any, { id: 1 }, "created", 201);

  assert.equal(status.mock.calls[0].arguments[0], 201);
  assert.equal(json.mock.calls[0].arguments[0].code, 0);
});

test("fail(res, message) defaults to status 400, code -1, data null", () => {
  const { res, json, status } = createMockRes();

  fail(res as any, "err");

  assert.equal(status.mock.calls[0].arguments[0], 400);
  assert.deepEqual(json.mock.calls[0].arguments[0], {
    code: -1,
    message: "err",
    data: null,
  });
});

test("fail(res, message, code, status) uses custom code and status", () => {
  const { res, json, status } = createMockRes();

  fail(res as any, "x", -99, 422);

  assert.equal(status.mock.calls[0].arguments[0], 422);
  assert.deepEqual(json.mock.calls[0].arguments[0], {
    code: -99,
    message: "x",
    data: null,
  });
});

test("unauthorized defaults to status 401, code 2000", () => {
  const { res, json, status } = createMockRes();

  unauthorized(res as any);

  assert.equal(status.mock.calls[0].arguments[0], 401);
  assert.deepEqual(json.mock.calls[0].arguments[0], { code: 2000,
    message: "Unauthorized",
    data: null,
  });
});

test("forbidden defaults to status 403, code 2002", () => {
  const { res, json, status } = createMockRes();

  forbidden(res as any);

  assert.equal(status.mock.calls[0].arguments[0], 403);
  assert.deepEqual(json.mock.calls[0].arguments[0], {
    code: 2002,
    message: "Forbidden",
    data: null,
  });
});

test("notFound defaults to status 404, code 1002", () => {
  const { res, json, status } = createMockRes();

  notFound(res as any);

  assert.equal(status.mock.calls[0].arguments[0], 404);
  assert.equal(json.mock.calls[0].arguments[0].code, 1002);
});

test("serverError defaults to status 500, code 5000", () => {
  const { res, json, status } = createMockRes();

  serverError(res as any);

  assert.equal(status.mock.calls[0].arguments[0], 500);
  assert.equal(json.mock.calls[0].arguments[0].code, 5000);
});