const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  // Create User table using Prisma's naming convention
  await prisma.$executeRawUnsafe(`CREATE TABLE "User" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log("Created User table");

  // Create the unique indexes that Prisma expects
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "User_username_key" ON "User"("username")`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`);
  console.log("Created indexes");

  // Test: try to use Prisma Client to insert
  const user = await prisma.user.create({
    data: { username: "prisma_test", password: "test123", email: "prisma@test.com" }
  });
  console.log("Prisma create works! User:", JSON.stringify(user));
  
  await prisma.$disconnect();
}
main().catch(async e => {
  console.error("Error:", e.message);
  // Try lowercase table
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE "user" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      avatar TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("Created 'user' table (lowercase)");
    const user = await prisma.user.create({
      data: { username: "prisma_test2", password: "test123", email: "prisma2@test.com" }
    });
    console.log("Prisma create works with lowercase table! User:", JSON.stringify(user));
  } catch(e2) {
    console.error("Lowercase also failed:", e2.message);
  }
  await prisma.$disconnect();
});