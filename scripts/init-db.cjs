const { PrismaClient } = require("@prisma/client");
const path = require("path");

// Use explicit path so there's no ambiguity
const dbPath = "file:" + path.join(__dirname, "..", "dev.db").replace(/\\/g, "/");
const prisma = new PrismaClient({ datasources: { db: { url: dbPath } } });

async function main() {
  // Drop if exists then create
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User"`);
  await prisma.$executeRawUnsafe(`CREATE TABLE "User" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "User_username_key" ON "User"("username")`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`);
  console.log("Table created!");

  // Test
  const user = await prisma.user.create({
    data: { username: "testuser", password: "123456", email: "test@test.com" }
  });
  console.log("User created successfully:", user.id, user.username);
  
  // Clean up test data
  await prisma.user.delete({ where: { id: user.id } });
  console.log("Test passed, data cleaned up");
  
  await prisma.$disconnect();
}
main().catch(e => { console.error("Failed:", e.message); prisma.$disconnect(); });