const express = require('express');
const OrderController = require('../controllers/OrderController');
const ZaloPayController = require('../controllers/ZaloPayController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Hủy đơn hàng (người dùng hoặc admin)
router.put('/:orderId/cancel', authenticateToken, OrderController.cancelOrder);

// Routes cho người dùng (cần xác thực)
router.post('/', authenticateToken, OrderController.create);
router.get('/user/:userId', authenticateToken, OrderController.getByUserId);
router.get('/details/:orderId', authenticateToken, OrderController.getDetails);

// Thêm route customer stats trước routes admin để tránh conflict
router.get('/customer-stats', authenticateToken, requireAdmin, OrderController.getCustomerStats);

// Routes cho admin (cần xác thực và quyền admin)
router.get('/', authenticateToken, requireAdmin, OrderController.getAll);
router.put('/:orderId/status', authenticateToken, requireAdmin, OrderController.updateStatus);
router.get('/stats', authenticateToken, requireAdmin, OrderController.getStats);
router.get('/recent-activities', authenticateToken, requireAdmin, OrderController.getRecentActivities);
router.get('/detailed-stats', authenticateToken, requireAdmin, OrderController.getDetailedStats);

// Routes cho ZaloPay
router.post('/zalopay/create-order', ZaloPayController.createOrder);
router.post('/zalopay/check-status', ZaloPayController.checkPaymentStatus);
router.post('/zalopay/callback', ZaloPayController.callback);

module.exports = router;
