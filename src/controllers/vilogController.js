const { VilogProduk } = require('../models');
exports.create = async (req, res) => { try { const data = await VilogProduk.create(req.body); res.status(201).json({ message: 'Produk vilog berhasil dibuat', data }); } catch (error) { res.status(500).json({ message: 'Gagal membuat produk vilog', error: error.message }); } };
exports.findAll = async (req, res) => { const data = await VilogProduk.findAll({ order: [['createdAt', 'DESC']] }); res.json({ data }); };
exports.findOne = async (req, res) => { const data = await VilogProduk.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Produk tidak ditemukan' }); res.json({ data }); };
exports.update = async (req, res) => { const data = await VilogProduk.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Produk tidak ditemukan' }); await data.update(req.body); res.json({ message: 'Produk vilog berhasil diupdate', data }); };
exports.remove = async (req, res) => { const data = await VilogProduk.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Produk tidak ditemukan' }); await data.destroy(); res.json({ message: 'Produk vilog berhasil dihapus' }); };
