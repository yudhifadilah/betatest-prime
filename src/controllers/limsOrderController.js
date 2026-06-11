const { LimsOrder, LimsProduk } = require('../models');
const makeOrderCode = require('../utils/makeOrderCode');
const { checkRolimonsPlayer } = require('../services/rolimonsService');

exports.checkTumbal = async (req, res) => {
  try {
    const { username } = req.body;
    const rolimons = await checkRolimonsPlayer(username);
    const tumbal = await LimsProduk.findAll({ where: { isTumbalAvailable: true, isActive: true } });
    res.json({ rolimons, tumbalAvailable: tumbal.length > 0, tumbal });
  } catch (error) { res.status(500).json({ message: 'Gagal mengecek tumbal LIMS', error: error.message }); }
};
exports.createOrder = async (req, res) => {
  try {
    const { limsProdukId, robloxUsername, nomorRekening } = req.body;
    const produk = await LimsProduk.findByPk(limsProdukId);
    if (!produk || !produk.isActive) return res.status(404).json({ message: 'Produk LIMS tidak ditemukan atau tidak aktif' });
    const rolimons = await checkRolimonsPlayer(robloxUsername);
    const tumbal = await LimsProduk.findAll({ where: { isTumbalAvailable: true, isActive: true } });
    if (!produk.isTumbalAvailable) return res.status(400).json({ message: 'Tumbal untuk trade belum tersedia', tumbalTersedia: tumbal });

    const paymentProof = req.file ? req.file.path : null;
 const order = await LimsOrder.create({
  orderId: makeOrderCode("LIMS"),
  limsProdukId,
  productName: produk.namaProduk,
  totalPrice: produk.harga,
  robloxUsername,
  nomorRekening,
  paymentProof,
  status: paymentProof ? "pending" : "unpaid",
});
    res.status(201).json({ message: 'Order LIMS berhasil dibuat', data: order });
  } catch (error) { res.status(500).json({ message: 'Gagal membuat order LIMS', error: error.message }); }
};
exports.getOrders = async (req, res) => { const data = await LimsOrder.findAll({ include: LimsProduk, order: [['createdAt', 'DESC']] }); res.json({ data }); };
exports.updateStatus = async (req, res) => { const data = await LimsOrder.findByPk(req.params.id); if (!data) return res.status(404).json({ message: 'Order tidak ditemukan' }); await data.update({ status: req.body.status }); res.json({ message: 'Status order LIMS berhasil diupdate', data }); };
