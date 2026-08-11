/**
 * Secret 加解密 — AES-256-GCM
 *
 * 用途：Provider.apiKeyEncrypted 等敏感字段的静态加密。
 * - 密钥来源：环境变量 API_KEY_SECRET（优先）或 JWT_SECRET（回退），SHA-256 派生 32 字节 key
 * - 密文格式：`enc:v1:<base64(iv+authTag+ciphertext)>`，带版本前缀便于将来轮换
 * - 兼容：非 `enc:v1:` 前缀的存量值按旧明文原样返回（迁移前不破坏运行时）
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const PREFIX = "enc:v1:";
const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const secret = process.env.API_KEY_SECRET || process.env.JWT_SECRET || "";
  if (!secret) {
    throw new Error("API_KEY_SECRET (or JWT_SECRET) must be set to encrypt/decrypt secrets");
  }
  return createHash("sha256").update(secret).digest();
}

export function isSecretEncrypted(stored: string): boolean {
  return stored.startsWith(PREFIX);
}

export function encryptSecret(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptSecret(stored: string): string {
  // 存量明文兼容（迁移完成前）
  if (!isSecretEncrypted(stored)) return stored;
  const key = getKey();
  const raw = Buffer.from(stored.slice(PREFIX.length), "base64");
  if (raw.length < IV_LEN + TAG_LEN) {
    throw new Error("Invalid encrypted secret payload");
  }
  const iv = raw.subarray(0, IV_LEN);
  const tag = raw.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const data = raw.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

/** 幂等保护：已是密文则原样返回，否则加密（用于写入路径） */
export function ensureEncrypted(stored: string | null | undefined): string | null | undefined {
  if (stored == null || stored === "") return stored;
  return isSecretEncrypted(stored) ? stored : encryptSecret(stored);
}