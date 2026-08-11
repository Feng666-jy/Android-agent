import "dotenv/config";
import { prisma, connectDatabase, closeDatabase } from "../server/src/prisma.js";

async function main() {
  // 非破坏性初始化：只确保 schema 存在，绝不删除既有数据。
  // connectDatabase 内部会执行 SCHEMA_SQL（CREATE TABLE IF NOT EXISTS），幂等。
  const userCount = await prisma.user.count();
  const providerCount = await prisma.provider.count();
  const runCount = await prisma.agentRun.count();
  console.log(
    `Database ready (users=${userCount}, providers=${providerCount}, runs=${runCount}) — schema ensured, data preserved`
  );
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