const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');
const payoutOrderController = require('../controllers/payoutOrderController');
const uploadPayment = require('../middleware/uploadMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.get('/produk', payoutController.findAll);
router.get('/produk/:id', payoutController.findOne);
router.post('/produk', authMiddleware, roleMiddleware('admin', 'staff'), payoutController.create);
router.put('/produk/:id', authMiddleware, roleMiddleware('admin', 'staff'), payoutController.update);
router.delete('/produk/:id', authMiddleware, roleMiddleware('admin'), payoutController.remove);

router.post("/check-username", payoutOrderController.checkUsername);

router.post('/order', uploadPayment.single('paymentProof'), payoutOrderController.createOrder);
router.get('/orders', authMiddleware, roleMiddleware('admin', 'staff'), payoutOrderController.getOrders);
router.patch('/orders/:id/status', authMiddleware, roleMiddleware('admin', 'staff'), payoutOrderController.updateStatus);
module.exports = router;
