const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const OrderController = require('../controllers/OrderController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// Tất cả các route admin đều cần xác thực và quyền admin
router.use(authenticateToken);
router.use(requireAdmin);

// User management routes
router.get('/users', AuthController.getAllUsers);
router.get('/customers', AuthController.getCustomers);
router.get('/customer-stats', AuthController.getCustomerStats);

// Order management routes
router.get('/orders/stats', OrderController.getStats);
router.get('/orders/recent-activities', OrderController.getRecentActivities);
router.get('/orders/detailed-stats', OrderController.getDetailedStats);
router.get('/orders/customer-stats', OrderController.getCustomerStats);

module.exports = router;
