const { LimsProduk } = require('../models');
exports.create = async (req, res) => { try { const data = await LimsProduk.create(req.body); res.status(201).json({ message: 'Produk LIMS berhasil dibuat', data }); } catch (error) { res.status(500).json({ message: 'Gagal membuat produk LIMS', error: error.message }); } };
exports.findAll = async (req, res) => { const data = await LimsProduk.findAll({ order: [['createdAt', 'DESC']] }); res.json({ data }); };
exports.findOne = async (req, res) => { const data = await LimsProduk.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Produk tidak ditemukan' }); res.json({ data }); };
exports.update = async (req, res) => { const data = await LimsProduk.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Produk tidak ditemukan' }); await data.update(req.body); res.json({ message: 'Produk LIMS berhasil diupdate', data }); };
exports.remove = async (req, res) => { const data = await LimsProduk.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Produk tidak ditemukan' }); await data.destroy(); res.json({ message: 'Produk LIMS berhasil dihapus' }); };
