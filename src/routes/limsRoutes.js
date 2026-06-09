const express = require('express');
const router = express.Router();
const limsController = require('../controllers/limsController');
const limsOrderController = require('../controllers/limsOrderController');
const uploadPayment = require('../middleware/uploadMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.get('/produk', limsController.findAll);
router.get('/produk/:id', limsController.findOne);
router.post('/produk', authMiddleware, roleMiddleware('admin', 'staff'), limsController.create);
router.put('/produk/:id', authMiddleware, roleMiddleware('admin', 'staff'), limsController.update);
router.delete('/produk/:id', authMiddleware, roleMiddleware('admin'), limsController.remove);

router.post('/check-tumbal', limsOrderController.checkTumbal);
router.post('/order', uploadPayment.single('paymentProof'), limsOrderController.createOrder);
router.get('/orders', authMiddleware, roleMiddleware('admin', 'staff'), limsOrderController.getOrders);
router.patch('/orders/:id/status', authMiddleware, roleMiddleware('admin', 'staff'), limsOrderController.updateStatus);

router.put(
  '/orders/:id/status',
  authMiddleware,
  roleMiddleware('admin', 'staff'),
  limsOrderController.updateStatus
);


module.exports = router;
