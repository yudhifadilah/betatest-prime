const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/qris";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename =
      "qris-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, filename + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("File QRIS harus JPG, PNG, JPEG, atau WEBP"), false);
  }

  cb(null, true);
};

const uploadQris = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = uploadQris;