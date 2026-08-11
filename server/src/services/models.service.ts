import type { PrismaClient } from "../prisma.js";

const MODEL_MAP = {
  deepseek: "deepseekModel",
  claude: "claudeModel",
  chatgpt: "chatgptModel",
} as const;

export type ModelProvider = keyof typeof MODEL_MAP;

export async function getModelsByProvider(
  prisma: PrismaClient,
  provider: ModelProvider
) {
  const modelName = MODEL_MAP[provider] as keyof PrismaClient;
  const model = prisma[modelName] as unknown as {
    findMany: (args: any) => Promise<any[]>;
  };
  return model.findMany({
    where: { status: 1 },
    orderBy: { sort: "asc" },
  });
}