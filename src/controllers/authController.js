const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role: role || 'buyer' });
    res.status(201).json({ message: 'Register berhasil', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Gagal register', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
    res.json({ message: 'Login berhasil', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Gagal login', error: error.message });
  }
};
