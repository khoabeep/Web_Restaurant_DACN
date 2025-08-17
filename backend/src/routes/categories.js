const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Routes công khai
router.get('/', CategoryController.getAll);

// Routes admin (cần xác thực và quyền admin)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), CategoryController.create);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), CategoryController.update);
router.delete('/:id', authenticateToken, requireAdmin, CategoryController.delete);

module.exports = router;
