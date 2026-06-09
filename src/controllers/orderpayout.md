const { PayoutOrder, PayoutProduk, RobloxCommunity } = require('../models');
const makeOrderCode = require('../utils/makeOrderCode');
const { getUserByUsername, checkUserInGroup } = require('../services/robloxService');

exports.createOrder = async (req, res) => {
  try {
    const { payoutProdukId, robloxUsername, nomorRekening } = req.body;
    const produk = await PayoutProduk.findByPk(payoutProdukId);
    if (!produk || !produk.isActive) return res.status(404).json({ message: 'Produk payout tidak ditemukan atau tidak aktif' });

    const activeCommunity = await RobloxCommunity.findOne({ where: { isActive: true } });
    if (!activeCommunity) return res.status(400).json({ message: 'Belum ada community Roblox aktif' });

    const robloxUser = await getUserByUsername(robloxUsername);
    if (!robloxUser) return res.status(404).json({ message: 'Username Roblox tidak ditemukan' });

    const joinCheck = await checkUserInGroup(robloxUser.userId, activeCommunity.groupId);
    if (!joinCheck.isJoined) return res.status(400).json({ success: false, message: 'User belum bergabung ke group Roblox', joinUrl: activeCommunity.groupLink });

    const paymentProof = req.file ? req.file.path : null;
    const order = await PayoutOrder.create({
      orderId: makeOrderCode('PAYOUT'), payoutProdukId, robloxUsername,
      robloxUserId: robloxUser.userId, nomorRekening, paymentProof,
      isJoinedGroup: true, status: paymentProof ? 'pending' : 'unpaid'
    });
    res.status(201).json({ message: 'Order payout berhasil dibuat', data: order });
  } catch (error) { res.status(500).json({ message: 'Gagal membuat order payout', error: error.message }); }
};
exports.getOrders = async (req, res) => { const data = await PayoutOrder.findAll({ include: PayoutProduk, order: [['createdAt', 'DESC']] }); res.json({ data }); };
exports.updateStatus = async (req, res) => { const data = await PayoutOrder.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Order tidak ditemukan' }); await data.update({ status: req.body.status }); res.json({ message: 'Status order payout berhasil diupdate', data }); };
