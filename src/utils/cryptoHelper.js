const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const getKey = () => {
  const secret =
    process.env.VILOG_SECRET_KEY ||
    process.env.JWT_SECRET ||
    "primeblox_default_secret_key";

  return crypto.createHash("sha256").update(secret).digest();
};

const encryptText = (text) => {
  if (!text) return null;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);

  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

const decryptText = (encryptedText) => {
  try {
    if (!encryptedText) return null;

    const [ivHex, encrypted] = String(encryptedText).split(":");
    if (!ivHex || !encrypted) return encryptedText;

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return null;
  }
};

module.exports = {
  encryptText,
  decryptText,
};