const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Routes công khai
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Routes cần xác thực
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile/:id', authenticateToken, AuthController.updateProfile);
router.put('/change-password', authenticateToken, AuthController.changePassword);

// Routes cho admin
router.get('/customers', authenticateToken, requireAdmin, AuthController.getCustomers);
router.get('/customer-stats', authenticateToken, requireAdmin, AuthController.getCustomerStats);

module.exports = router;
