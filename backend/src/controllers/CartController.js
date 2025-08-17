const Cart = require('../models/Cart');

class CartController {
  // Lấy giỏ hàng của người dùng
  static async getByUserId(req, res) {
    try {
      const userIdParam = Number(req.params.userId);
      const authUserId = Number(req.user?.userId);
      const isAdmin = !!req.user?.isAdmin;

      // Chỉ cho xem giỏ của chính mình hoặc admin
      if (!isAdmin && authUserId !== userIdParam) {
        return res.status(403).json({ message: 'Không có quyền truy cập giỏ hàng này' });
      }

      const items = await Cart.getByUserId(userIdParam);
      return res.json(items);
    } catch (error) {
      console.error('❌ [GET CART] Lỗi server khi lấy giỏ hàng:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy giỏ hàng' });
    }
  }

  // Thêm món vào giỏ hàng
  static async add(req, res) {
    try {
      const userId = Number(req.body.user_id);
      const menuItemId = Number(req.body.menu_item_id);
      const quantity = Number(req.body.quantity ?? 1);

      const authUserId = Number(req.user?.userId);
      const isAdmin = !!req.user?.isAdmin;

      if (!isAdmin && authUserId !== userId) {
        return res.status(403).json({ message: 'Không có quyền thêm vào giỏ hàng này' });
      }

      await Cart.add({ userId, menuItemId, quantity });
      return res.status(201).json({ message: 'Thêm vào giỏ hàng thành công' });
    } catch (error) {
      console.error('❌ [ADD CART] Lỗi server khi thêm vào giỏ hàng:', error);
      return res.status(500).json({ message: 'Lỗi server khi thêm vào giỏ hàng' });
    }
  }

  // Cập nhật số lượng trong giỏ hàng
  static async updateQuantity(req, res) {
    try {
      const cartItemId = Number(req.params.id);
      const quantity = Number(req.body.quantity);

      await Cart.updateQuantity(cartItemId, quantity);
      return res.json({ message: 'Cập nhật số lượng thành công' });
    } catch (error) {
      console.error('❌ [UPDATE CART] Lỗi server khi cập nhật số lượng:', error);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật số lượng' });
    }
  }

  // Xóa món khỏi giỏ hàng
  static async remove(req, res) {
    try {
      const cartItemId = Number(req.params.id);

      await Cart.remove(cartItemId);
      return res.json({ message: 'Xóa khỏi giỏ hàng thành công' });
    } catch (error) {
      console.error('❌ [REMOVE CART] Lỗi server khi xóa khỏi giỏ hàng:', error);
      return res.status(500).json({ message: 'Lỗi server khi xóa khỏi giỏ hàng' });
    }
  }

  // Xóa sạch giỏ hàng theo user
  static async clear(req, res) {
    try {
      const userIdParam = Number(req.params.userId);
      const authUserId = Number(req.user?.userId);
      const isAdmin = !!req.user?.isAdmin;

      if (!isAdmin && authUserId !== userIdParam) {
        return res.status(403).json({ message: 'Không có quyền xóa giỏ hàng này' });
      }

      await Cart.clearByUserId(userIdParam);
      return res.json({ message: 'Xóa giỏ hàng thành công' });
    } catch (error) {
      console.error('❌ [CLEAR CART] Lỗi server khi xóa giỏ hàng:', error);
      return res.status(500).json({ message: 'Lỗi server khi xóa giỏ hàng' });
    }
  }
}

module.exports = CartController;
