const { RobloxCommunity } = require('../models');
exports.create = async (req, res) => { try { const data = await RobloxCommunity.create(req.body); res.status(201).json({ message: 'Community berhasil dibuat', data }); } catch (error) { res.status(500).json({ message: 'Gagal membuat community', error: error.message }); } };
exports.findAll = async (req, res) => { const data = await RobloxCommunity.findAll({ order: [['createdAt', 'DESC']] }); res.json({ data }); };
exports.findActive = async (req, res) => { const data = await RobloxCommunity.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] }); res.json({ data }); };
exports.update = async (req, res) => { const data = await RobloxCommunity.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Community tidak ditemukan' }); await data.update(req.body); res.json({ message: 'Community berhasil diupdate', data }); };
exports.remove = async (req, res) => { const data = await RobloxCommunity.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Community tidak ditemukan' }); await data.destroy(); res.json({ message: 'Community berhasil dihapus' }); };
