const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const key = crypto
  .createHash("sha256")
  .update(process.env.TWO_FACTOR_SECRET_KEY)
  .digest();

const ivLength = 16;

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
  );

  let encrypted = cipher.update(
    text,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  return (
    iv.toString("hex") +
    ":" +
    encrypted
  );
};

exports.decrypt = (encryptedText) => {
  const parts =
    encryptedText.split(":");

  const iv = Buffer.from(
    parts.shift(),
    "hex"
  );

  const encrypted =
    parts.join(":");

  const decipher =
    crypto.createDecipheriv(
      algorithm,
      key,
      iv
    );

  let decrypted =
    decipher.update(
      encrypted,
      "hex",
      "utf8"
    );

  decrypted += decipher.final(
    "utf8"
  );

  return decrypted;
};