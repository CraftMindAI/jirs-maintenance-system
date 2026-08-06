import crypto from "crypto";

const SECRET_KEY = process.env.RESET_TOKEN_SECRET || "JFM-password-reset-secret-key-2026";

/**
 * Encrypts an email into a URL-safe encrypted token string.
 */
export function encryptResetToken(email: string): string {
  const payload = JSON.stringify({ email: email.toLowerCase().trim(), timestamp: Date.now() });
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(SECRET_KEY).digest(),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(payload, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

/**
 * Decrypts an encrypted token back into { email, timestamp } or null if invalid.
 */
export function decryptResetToken(token: string): { email: string; timestamp: number } | null {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      crypto.createHash("sha256").update(SECRET_KEY).digest(),
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(token, "hex", "utf8");
    decrypted += decipher.final("utf8");
    const parsed = JSON.parse(decrypted);
    if (parsed && typeof parsed.email === "string") {
      return { email: parsed.email, timestamp: parsed.timestamp || 0 };
    }
    return null;
  } catch (err) {
    console.error("Failed to decrypt reset token:", err);
    return null;
  }
}
