const crypto = require("crypto");
const qrcode = require("qrcode");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const { User } = require("../models");

const getUserId = (req) => req.user?.id || req.user?.userId;

const getOtpLib = async () => {
  return await import("otplib");
};

const algorithm = "aes-256-cbc";

const getEncryptionKey = () => {
  const secretKey =
    process.env.TWO_FACTOR_SECRET_KEY ||
    process.env.JWT_SECRET ||
    "primeblox_default_secret_key";

  return crypto.createHash("sha256").update(secretKey).digest();
};

const encryptText = (text) => {
  const iv = crypto.randomBytes(16);
  const key = getEncryptionKey();

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

const decryptText = (encryptedText) => {
  if (!encryptedText) return null;

  if (!encryptedText.includes(":")) {
    return encryptedText;
  }

  const key = getEncryptionKey();
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

const cleanToken = (token) => {
  return String(token || "").replace(/\s/g, "").trim();
};

const getAccountLabel = (user) => {
  const username = user.name || "User";
  const email = user.email || "no-email";

  return `${username} - ${email}`;
};

const createOtpAuthUrl = ({ secret, accountLabel }) => {
  const issuer = "PrimeBlox";

  return (
    `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(
      accountLabel
    )}` +
    `?secret=${encodeURIComponent(secret)}` +
    `&issuer=${encodeURIComponent(issuer)}` +
    `&algorithm=SHA1` +
    `&digits=6` +
    `&period=30`
  );
};

const createPrimeBloxQR = async (otpauth) => {
  const qrSize = 900;
  const finalSize = 1000;
  const padding = 50;

  const qrBuffer = await qrcode.toBuffer(otpauth, {
    errorCorrectionLevel: "H",
    type: "png",
    width: qrSize,
    margin: 2,
    color: {
      dark: "#10D9FF",
      light: "#07111F",
    },
  });

  const backgroundSvg = Buffer.from(`
    <svg width="${finalSize}" height="${finalSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#0A1728"/>
          <stop offset="55%" stop-color="#07111F"/>
          <stop offset="100%" stop-color="#030712"/>
        </radialGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="18" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      <rect
        x="${padding - 10}"
        y="${padding - 10}"
        width="${qrSize + 20}"
        height="${qrSize + 20}"
        rx="32"
        fill="#10D9FF"
        opacity="0.08"
        filter="url(#glow)"
      />

      <rect
        x="${padding - 5}"
        y="${padding - 5}"
        width="${qrSize + 10}"
        height="${qrSize + 10}"
        rx="28"
        fill="#07111F"
      />
    </svg>
  `);

  const finalImage = await sharp(backgroundSvg)
    .composite([
      {
        input: qrBuffer,
        top: padding,
        left: padding,
      },
    ])
    .png()
    .toBuffer();

  return `data:image/png;base64,${finalImage.toString("base64")}`;
};

exports.getStatus = async (req, res) => {
  try {
    const userId = getUserId(req);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    return res.json({
      twoFactorEnabled: Boolean(user.twoFactorEnabled),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil status 2FA",
      error: error.message,
    });
  }
};

exports.generate2FA = async (req, res) => {
  try {
    const { generateSecret } = await getOtpLib();

    const userId = getUserId(req);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        message:
          "2FA sudah aktif. Nonaktifkan 2FA terlebih dahulu jika ingin generate QR Code baru.",
      });
    }

    const secret = generateSecret();
    const accountLabel = getAccountLabel(user);
    const issuer = "PrimeBlox";
    const websiteDomain = "https://primeblox.com";

    const otpauth = createOtpAuthUrl({
      secret,
      accountLabel,
    });

    const qrCode = await createPrimeBloxQR(otpauth);

    user.twoFactorSecret = encryptText(secret);
    user.twoFactorEnabled = false;
    await user.save();

    return res.json({
      message: "QR Code berhasil dibuat",
      qrCode,
      issuer,
      accountLabel,
      website: websiteDomain,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal membuat 2FA",
      error: error.message,
    });
  }
};

exports.enable2FA = async (req, res) => {
  try {
    const { verify } = await getOtpLib();
    const { token } = req.body;

    const userId = getUserId(req);
    const user = await User.findByPk(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({
        message: "Silakan generate QR Code 2FA terlebih dahulu",
      });
    }

    const decryptedSecret = decryptText(user.twoFactorSecret);
    const otpToken = cleanToken(token);

    if (otpToken.length !== 6) {
      return res.status(400).json({
        message: `Token harus 6 digit, sekarang ${otpToken.length} digit`,
      });
    }

    const result = await verify({
      secret: decryptedSecret,
      token: otpToken,
    });

    if (!result.valid) {
      return res.status(400).json({
        message: "Kode 2FA tidak valid",
      });
    }

    user.twoFactorEnabled = true;
    await user.save();

    return res.json({
      message: "2FA berhasil diaktifkan",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengaktifkan 2FA",
      error: error.message,
    });
  }
};

exports.disable2FA = async (req, res) => {
  try {
    const { verify } = await getOtpLib();
    const { password, token } = req.body;

    const userId = getUserId(req);
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    if (user.twoFactorEnabled) {
      const decryptedSecret = decryptText(user.twoFactorSecret);
      const otpToken = cleanToken(token);

      if (otpToken.length !== 6) {
        return res.status(400).json({
          message: `Token harus 6 digit, sekarang ${otpToken.length} digit`,
        });
      }

      const result = await verify({
        secret: decryptedSecret,
        token: otpToken,
      });

      if (!result.valid) {
        return res.status(400).json({
          message: "Kode 2FA salah",
        });
      }
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    return res.json({
      message: "2FA berhasil dinonaktifkan",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal menonaktifkan 2FA",
      error: error.message,
    });
  }
};

exports.testQR = async (req, res) => {
  try {
    const { generateSecret } = await getOtpLib();

    const secret = generateSecret();

    const otpauth = createOtpAuthUrl({
      secret,
      accountLabel: "Test User - test@primeblox.com",
    });

    const qrCode = await createPrimeBloxQR(otpauth);

    return res.send(`
      <html>
        <body style="margin:0;background:#020711;display:flex;align-items:center;justify-content:center;min-height:100vh;">
          <img src="${qrCode}" style="width:520px;max-width:90vw;border-radius:24px;" />
        </body>
      </html>
    `);
  } catch (error) {
    return res.status(500).json({
      message: "Gagal membuat test QR",
      error: error.message,
    });
  }
};