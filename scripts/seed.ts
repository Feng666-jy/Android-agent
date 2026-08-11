import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma, connectDatabase, closeDatabase } from "../server/src/prisma.js";

async function main() {
  console.log("Seeding database...");

  // Clean slate (respect FK order)
  await prisma.providerHealthLog.deleteMany();
  await prisma.usageStats.deleteMany();
  await prisma.model.deleteMany();
  await prisma.modelGroup.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();

  // ---- Demo Users ----
  const adminPwd = await bcrypt.hash("admin123", 10);
  const testPwd = await bcrypt.hash("test123", 10);
  await prisma.user.createMany({
    data: [
      { username: "admin", password: adminPwd, email: "admin@test.com" },
      { username: "demo", password: testPwd, email: "demo@test.com" },
    ],
  });
  console.log("Users created: admin / demo");

  // ---- Model Groups ----
  const codingGroup = await prisma.modelGroup.create({
    data: { name: "Coding", icon: "code", color: "#4F46E5", isPinned: true, isBuiltin: true, sortOrder: 0 },
  });
  const chatGroup = await prisma.modelGroup.create({
    data: { name: "Chat", icon: "message-circle", color: "#0EA5E9", isPinned: false, isBuiltin: true, sortOrder: 1 },
  });
  const reasoningGroup = await prisma.modelGroup.create({
    data: { name: "Reasoning", icon: "brain", color: "#F59E0B", isPinned: false, isBuiltin: true, sortOrder: 2 },
  });
  console.log("Groups created:", [codingGroup.name, chatGroup.name, reasoningGroup.name].join(", "));

  // ---- Providers ----
  const deepseek = await prisma.provider.create({
    data: {
      name: "DeepSeek",
      baseUrl: "https://api.deepseek.com/v1",
      protocol: "OPENAI_COMPATIBLE",
      authType: "API_KEY",
      isEnabled: true,
      healthStatus: "UNKNOWN",
      sortOrder: 0,
      isBuiltin: true,
    },
  });

  const anthropic = await prisma.provider.create({
    data: {
      name: "Anthropic",
      baseUrl: "https://api.anthropic.com/v1",
      protocol: "ANTHROPIC",
      authType: "API_KEY",
      isEnabled: true,
      healthStatus: "UNKNOWN",
      sortOrder: 1,
      isBuiltin: true,
    },
  });

  const openai = await prisma.provider.create({
    data: {
      name: "OpenAI",
      baseUrl: "https://api.openai.com/v1",
      protocol: "OPENAI_COMPATIBLE",
      authType: "API_KEY",
      isEnabled: true,
      healthStatus: "UNKNOWN",
      sortOrder: 2,
      isBuiltin: true,
    },
  });
  console.log("Providers created:", [deepseek.name, anthropic.name, openai.name].join(", "));

  // ---- Models ----
  const modelData = [
    // DeepSeek
    { providerId: deepseek.id, modelName: "deepseek-chat", displayName: "DeepSeek V3", aliases: "v3,chat", description: "General-purpose chat model", contextWindow: 64000, maxOutputTokens: 8192, temperature: 0.7, capabilities: '["TEXT","CODE"]', isFavorite: true, isDefault: true, groupId: chatGroup.id, sortOrder: 0 },
    { providerId: deepseek.id, modelName: "deepseek-reasoner", displayName: "DeepSeek R1", aliases: "r1,reasoner", description: "Advanced reasoning model", contextWindow: 64000, maxOutputTokens: 8192, temperature: 0.3, capabilities: '["TEXT","CODE","REASONING"]', isFavorite: false, isDefault: false, groupId: reasoningGroup.id, sortOrder: 1 },
    { providerId: deepseek.id, modelName: "deepseek-coder", displayName: "DeepSeek Coder", aliases: "coder", description: "Code-specialized model", contextWindow: 64000, maxOutputTokens: 4096, temperature: 0.1, capabilities: '["TEXT","CODE"]', isFavorite: true, isDefault: false, groupId: codingGroup.id, sortOrder: 2 },
    { providerId: deepseek.id, modelName: "deepseek-v2.5", displayName: "DeepSeek V2.5", aliases: "v2.5", description: "Previous generation general model", contextWindow: 32768, maxOutputTokens: 4096, temperature: 0.7, capabilities: '["TEXT","CODE"]', isFavorite: false, isDefault: false, isEnabled: false, groupId: chatGroup.id, sortOrder: 3 },
    // Anthropic
    { providerId: anthropic.id, modelName: "claude-3-5-sonnet-20241022", displayName: "Claude 3.5 Sonnet", aliases: "sonnet,3.5", description: "Most intelligent Claude model", contextWindow: 200000, maxOutputTokens: 8192, temperature: 0.7, capabilities: '["TEXT","CODE","VISION"]', isFavorite: true, isDefault: false, groupId: chatGroup.id, sortOrder: 0 },
    { providerId: anthropic.id, modelName: "claude-3-opus-20240229", displayName: "Claude 3 Opus", aliases: "opus", description: "Powerful model for complex tasks", contextWindow: 200000, maxOutputTokens: 4096, temperature: 0.7, capabilities: '["TEXT","CODE","VISION"]', isFavorite: false, isDefault: false, groupId: reasoningGroup.id, sortOrder: 1 },
    { providerId: anthropic.id, modelName: "claude-3-haiku-20240307", displayName: "Claude 3 Haiku", aliases: "haiku", description: "Fastest and most compact", contextWindow: 200000, maxOutputTokens: 4096, temperature: 0.7, capabilities: '["TEXT","VISION"]', isFavorite: false, isDefault: false, groupId: chatGroup.id, sortOrder: 2 },
    // OpenAI
    { providerId: openai.id, modelName: "gpt-4o", displayName: "GPT-4o", aliases: "4o", description: "Omni-modal model", contextWindow: 128000, maxOutputTokens: 16384, temperature: 0.7, capabilities: '["TEXT","CODE","VISION"]', isFavorite: false, isDefault: false, groupId: chatGroup.id, sortOrder: 0 },
    { providerId: openai.id, modelName: "gpt-4o-mini", displayName: "GPT-4o Mini", aliases: "mini", description: "Affordable and fast", contextWindow: 128000, maxOutputTokens: 16384, temperature: 0.7, capabilities: '["TEXT","CODE","VISION"]', isFavorite: false, isDefault: false, groupId: chatGroup.id, sortOrder: 1 },
    { providerId: openai.id, modelName: "o1-preview", displayName: "o1 Preview", aliases: "o1", description: "Reasoning model for complex problems", contextWindow: 128000, maxOutputTokens: 16384, temperature: 1.0, reasoningBudget: 100000, capabilities: '["TEXT","REASONING"]', isFavorite: false, isDefault: false, groupId: reasoningGroup.id, sortOrder: 2 },
  ];

  const createdModels = [];
  for (const m of modelData) {
    const created = await prisma.model.create({ data: m });
    createdModels.push(created);
  }
  console.log("Models created:", createdModels.length);

  // ---- Usage Stats (for a few models) ----
  const statsData = createdModels.slice(0, 5).map((m, i) => ({
    modelId: m.id,
    totalRequests: (i + 1) * 150,
    totalTokensInput: (i + 1) * 45000,
    totalTokensOutput: (i + 1) * 12000,
    totalTokensCached: (i + 1) * 8000,
    totalErrors: i,
    lastUsedAt: new Date(Date.now() - i * 3600_000),
    averageLatencyMs: 200 + i * 50,
  }));
  await prisma.usageStats.createMany({ data: statsData });
  console.log("Usage stats created:", statsData.length);

  // ---- Health Logs ----
  const healthData = [
    { providerId: deepseek.id, status: "HEALTHY", latencyMs: 245, checkedAt: new Date() },
    { providerId: anthropic.id, status: "HEALTHY", latencyMs: 180, checkedAt: new Date() },
    { providerId: openai.id, status: "DEGRADED", latencyMs: 1200, checkedAt: new Date(), errorMessage: "High latency" },
  ];
  await prisma.providerHealthLog.createMany({ data: healthData });
  console.log("Health logs created:", healthData.length);

  console.log("Seeding complete.");
}

async function run() {
  await connectDatabase();
  try {
    await main();
  } finally {
    closeDatabase();
  }
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
