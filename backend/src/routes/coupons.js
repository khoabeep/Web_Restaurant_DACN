const express = require('express');
const CouponController = require('../controllers/CouponController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Public routes (không cần xác thực)
router.get('/public', CouponController.getPublicCoupons);

// Protected routes (cần xác thực)
router.get('/available', authenticateToken, CouponController.getAvailableCoupons);
router.post('/validate', authenticateToken, CouponController.validateCoupon);

// Admin routes (cần xác thực và quyền admin)
router.get('/', authenticateToken, requireAdmin, CouponController.getAllCoupons);
router.get('/:id', authenticateToken, requireAdmin, CouponController.getCouponById);
router.post('/', authenticateToken, requireAdmin, CouponController.createCoupon);
router.put('/:id', authenticateToken, requireAdmin, CouponController.updateCoupon);
router.put('/:id/status', authenticateToken, requireAdmin, CouponController.updateCouponStatus);
router.delete('/:id', authenticateToken, requireAdmin, CouponController.deleteCoupon);

module.exports = router;
