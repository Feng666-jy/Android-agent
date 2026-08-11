// 一次性迁移：将 provider.api_key_encrypted 中的存量明文 API key 加密（AES-256-GCM）
// 用法：node --experimental-strip-types scripts/migrate-encrypt-keys.ts
import "dotenv/config";

const { prisma } = await import("../server/src/prisma.ts");
const { isSecretEncrypted, encryptSecret } = await import("../server/src/utils/crypto.ts");

const providers = await prisma.provider.findMany({});

let migrated = 0;
let alreadyEncrypted = 0;
for (const p of providers) {
  const value = p.apiKeyEncrypted;
  if (!value) continue;
  if (isSecretEncrypted(value)) {
    alreadyEncrypted++;
    continue;
  }
  await prisma.provider.update({
    where: { id: p.id },
    data: { apiKeyEncrypted: encryptSecret(value) },
  });
  migrated++;
  console.log(`[migrate-keys] encrypted "${p.name}" (${p.id})`);
}

console.log(`[migrate-keys] done: migrated=${migrated} alreadyEncrypted=${alreadyEncrypted} total=${providers.length}`);
await prisma.$disconnect();