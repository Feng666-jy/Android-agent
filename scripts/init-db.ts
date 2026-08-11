import "dotenv/config";
import { rmSync } from "node:fs";
import path from "node:path";
import { prisma, connectDatabase, closeDatabase, resolveDbPath } from "../server/src/prisma.js";

async function main() {
  // 删除旧库（若存在）后重建空库
  const dbPath = resolveDbPath();
  rmSync(dbPath, { force: true });
  await connectDatabase();

  // 写入测试
  const user = await prisma.user.create({
    data: { username: "testuser", password: "123456", email: "test@test.com" },
  });
  console.log("User created successfully:", user.id, user.username);

  // 清理测试数据
  await prisma.user.delete({ where: { id: user.id } });
  console.log("Test passed, data cleaned up");
}

async function run() {
  try {
    await main();
  } finally {
    closeDatabase();
  }
}

run().catch((e) => {
  console.error("Failed:", e.message);
  closeDatabase();
  process.exit(1);
});
