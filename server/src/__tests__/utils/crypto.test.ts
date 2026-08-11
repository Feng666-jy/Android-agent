import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

process.env.API_KEY_SECRET = "test-api-key-secret-0123456789abcdef";

const { encryptSecret, decryptSecret, isSecretEncrypted, ensureEncrypted } = await import("../../utils/crypto.ts");

describe("crypto (AES-256-GCM secret encryption)", () => {
  const plaintext = "sk-test-long-api-key-abcdefghijklmnop1234567890";

  it("encrypts to an enc:v1: prefixed payload and round-trips", () => {
    const secret = encryptSecret(plaintext);
    assert.ok(isSecretEncrypted(secret));
    assert.equal(secret.startsWith("enc:v1:"), true);
    assert.equal(secret.includes(plaintext), false);
    assert.equal(decryptSecret(secret), plaintext);
  });

  it("produces unique ciphertext for identical plaintext (random IV)", () => {
    const a = encryptSecret(plaintext);
    const b = encryptSecret(plaintext);
    assert.notEqual(a, b);
    assert.equal(decryptSecret(a), plaintext);
    assert.equal(decryptSecret(b), plaintext);
  });

  it("returns legacy plaintext as-is when not prefixed", () => {
    assert.equal(decryptSecret("sk-legacy-plain"), "sk-legacy-plain");
    assert.equal(isSecretEncrypted("sk-legacy-plain"), false);
  });

  it("ensureEncrypted is idempotent", () => {
    const once = ensureEncrypted(plaintext) as string;
    assert.ok(isSecretEncrypted(once));
    const twice = ensureEncrypted(once) as string;
    assert.equal(twice, once);
    assert.equal(decryptSecret(twice), plaintext);
    assert.equal(ensureEncrypted(null), null);
    assert.equal(ensureEncrypted(""), "");
  });

  it("rejects tampered ciphertext", () => {
    const secret = encryptSecret(plaintext);
    const tampered = secret.slice(0, -2) + (secret.endsWith("==") ? "AA" : "ab");
    assert.throws(() => decryptSecret(tampered));
  });

  it("needs a configured secret to encrypt", () => {
    const prev = process.env.API_KEY_SECRET;
    process.env.API_KEY_SECRET = "";
    process.env.JWT_SECRET = "";
    try {
      assert.throws(() => encryptSecret("sk-x"), /must be set/);
    } finally {
      process.env.API_KEY_SECRET = prev;
    }
  });

  describe("key derivation fallback", () => {
    beforeEach(() => {
      delete process.env.API_KEY_SECRET;
      process.env.JWT_SECRET = "jwt-fallback-secret";
    });

    afterEach(() => {
      process.env.API_KEY_SECRET = "test-api-key-secret-0123456789abcdef";
      delete process.env.JWT_SECRET;
    });

    it("derives key from JWT_SECRET when API_KEY_SECRET absent", () => {
      const secret = encryptSecret(plaintext);
      assert.equal(decryptSecret(secret), plaintext);
    });
  });
});