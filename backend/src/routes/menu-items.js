const express = require('express');
const MenuController = require('../controllers/MenuController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Routes công khai
router.get('/', MenuController.getAll);
router.get('/:id', MenuController.getById);

// Routes admin (cần xác thực và quyền admin)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), MenuController.create);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), MenuController.update);
router.delete('/:id', authenticateToken, requireAdmin, MenuController.delete);

module.exports = router;
