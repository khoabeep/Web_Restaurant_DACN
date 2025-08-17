const express = require('express');
const CartController = require('../controllers/CartController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Tất cả routes cart đều cần xác thực
router.get('/:userId', authenticateToken, CartController.getByUserId);
router.post('/', authenticateToken, CartController.add);
router.put('/:id', authenticateToken, CartController.updateQuantity);
router.delete('/:id', authenticateToken, CartController.remove);
router.delete('/clear/:userId', authenticateToken, CartController.clear);

module.exports = router;
