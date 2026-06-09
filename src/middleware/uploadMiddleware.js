const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/payments'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('File harus JPG, PNG, atau PDF'), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
