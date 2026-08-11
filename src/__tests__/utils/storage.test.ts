import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

let storageMock: {
  getItem: ReturnType<typeof mock.fn>;
  setItem: ReturnType<typeof mock.fn>;
  removeItem: ReturnType<typeof mock.fn>;
};

beforeEach(() => {
  const backing = new Map<string, string>();
  storageMock = {
    getItem: mock.fn((k: string) => (backing.has(k) ? backing.get(k)! : null)),
    setItem: mock.fn((k: string, v: string) => { backing.set(k, v); }),
    removeItem: mock.fn((k: string) => { backing.delete(k); }),
  };
  globalThis.localStorage = storageMock as unknown as Storage;
});

test("getToken reads app_token from localStorage", async () => {
  const { storage } = await import("../../utils/storage.ts?t=" + Date.now());
  storageMock.setItem("app_token", "tok123");

  const result = storage.getToken();

  assert.equal(result, "tok123");
  assert.equal(storageMock.getItem.mock.callCount(), 1);
  assert.deepEqual(storageMock.getItem.mock.calls[0].arguments, ["app_token"]);
});

test("setToken writes app_token", async () => {
  const { storage } = await import("../../utils/storage.ts?t=" + Date.now());

  storage.setToken("tok123");

  assert.equal(storageMock.setItem.mock.callCount(), 1);
  assert.deepEqual(storageMock.setItem.mock.calls[0].arguments, ["app_token", "tok123"]);
});

test("removeToken removes app_token", async () => {
  const { storage } = await import("../../utils/storage.ts?t=" + Date.now());

  storage.removeToken();

  assert.equal(storageMock.removeItem.mock.callCount(), 1);
  assert.deepEqual(storageMock.removeItem.mock.calls[0].arguments, ["app_token"]);
});

test("getTheme reads app_theme from localStorage", async () => {
  const { storage } = await import("../../utils/storage.ts?t=" + Date.now());
  storageMock.setItem("app_theme", "dark");

  const result = storage.getTheme();

  assert.equal(result, "dark");
  assert.equal(storageMock.getItem.mock.callCount(), 1);
  assert.deepEqual(storageMock.getItem.mock.calls[0].arguments, ["app_theme"]);
});

test("setTheme writes app_theme", async () => {
  const { storage } = await import("../../utils/storage.ts?t=" + Date.now());

  storage.setTheme("dark");

  assert.equal(storageMock.setItem.mock.callCount(), 1);
  assert.deepEqual(storageMock.setItem.mock.calls[0].arguments, ["app_theme", "dark"]);
});
