import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";

async function loadLogger(level: string | undefined) {
  if (level === undefined) {
    delete process.env.LOG_LEVEL;
  } else {
    process.env.LOG_LEVEL = level;
  }
  const mod = await import(`../../utils/logger.ts?t=${Date.now()}-${Math.random()}`);
  return mod.logger;
}

afterEach(() => {
  mock.restoreAll();
});

test("LOG_LEVEL unset: all levels call console methods", async () => {
  const logger = await loadLogger(undefined);
  mock.method(console, "debug", mock.fn());
  mock.method(console, "info", mock.fn());
  mock.method(console, "warn", mock.fn());
  mock.method(console, "error", mock.fn());

  logger.debug("d");
  logger.info("i");
  logger.warn("w");
  logger.error("e");

  assert.equal((console.debug as any).mock.callCount(), 1);
  assert.equal((console.info as any).mock.callCount(), 1);
  assert.equal((console.warn as any).mock.callCount(), 1);
  assert.equal((console.error as any).mock.callCount(), 1);
});

test('LOG_LEVEL="info": info calls through, debug does not', async () => {
  const logger = await loadLogger("info");
  mock.method(console, "debug", mock.fn());
  mock.method(console, "info", mock.fn());

  logger.debug("d");
  logger.info("i");

  assert.equal((console.debug as any).mock.callCount(), 0);
  assert.equal((console.info as any).mock.callCount(), 1);
});

test('LOG_LEVEL="warn": info is no-op, warn and error call through', async () => {
  const logger = await loadLogger("warn");
  mock.method(console, "info", mock.fn());
  mock.method(console, "warn", mock.fn());
  mock.method(console, "error", mock.fn());

  logger.info("i");
  logger.warn("w");
  logger.error("e");

  assert.equal((console.info as any).mock.callCount(), 0);
  assert.equal((console.warn as any).mock.callCount(), 1);
  assert.equal((console.error as any).mock.callCount(), 1);
});

test('LOG_LEVEL="error": only error calls through', async () => {
  const logger = await loadLogger("error");
  mock.method(console, "debug", mock.fn());
  mock.method(console, "info", mock.fn());
  mock.method(console, "warn", mock.fn());
  mock.method(console, "error", mock.fn());

  logger.debug("d");
  logger.info("i");
  logger.warn("w");
  logger.error("e");

  assert.equal((console.debug as any).mock.callCount(), 0);
  assert.equal((console.info as any).mock.callCount(), 0);
  assert.equal((console.warn as any).mock.callCount(), 0);
  assert.equal((console.error as any).mock.callCount(), 1);
});

test("formatTimestamp: info logs ISO timestamp and context in output", async () => {
  const logger = await loadLogger(undefined);
  mock.method(console, "info", mock.fn());

  logger.info("test");

  const call = (console.info as any).mock.calls[0];
  const firstArg = call.arguments[0];
  assert.match(firstArg, /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] \[app\] test$/);
});

test("child logger uses sub-context in output", async () => {
  const logger = await loadLogger(undefined);
  mock.method(console, "info", mock.fn());

  const child = logger.child("db");
  child.info("connected");

  const call = (console.info as any).mock.calls[0];
  const firstArg = call.arguments[0];
  assert.match(firstArg, /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] \[app:db\] connected$/);
});