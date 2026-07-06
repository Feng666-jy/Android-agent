const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // 清空旧数据避免冲突
  await prisma.deepseekModel.deleteMany();

  // DeepSeek models - demo data
  const deepseekModels = [
    { modelName: "deepseek-chat", displayName: "DeepSeek V3", apiProvider: "DeepSeek", status: 1, sort: 1 },
    { modelName: "deepseek-reasoner", displayName: "DeepSeek R1", apiProvider: "DeepSeek", status: 1, sort: 2 },
    { modelName: "deepseek-coder", displayName: "DeepSeek Coder", apiProvider: "DeepSeek", status: 1, sort: 3 },
    { modelName: "deepseek-v2.5", displayName: "DeepSeek V2.5", apiProvider: "DeepSeek", status: 1, sort: 4 },
    { modelName: "deepseek-v2", displayName: "DeepSeek V2", apiProvider: "DeepSeek", status: 0, sort: 5 }
  ];

  for (const m of deepseekModels) {
    await prisma.deepseekModel.create({ data: m });
  }
  console.log("DeepSeek models seeded:", deepseekModels.length);

  // Claude models - empty (table only)
  const claudeCount = await prisma.claudeModel.count();
  console.log("Claude models count:", claudeCount);

  // ChatGPT models - empty (table only)
  const chatgptCount = await prisma.chatgptModel.count();
  console.log("ChatGPT models count:", chatgptCount);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });