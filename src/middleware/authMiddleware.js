const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User tidak valid' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid', error: error.message });
  }
};
