const db = require('../config/database');

class Cart {
  // Lấy giỏ hàng của người dùng
  static async getByUserId(userId) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          c.id,
          c.user_id,
          c.menu_item_id,
          c.quantity,
          m.name,
          m.price,
          m.image,
          (m.price * c.quantity) AS subtotal
        FROM cart c
        JOIN menu_items m ON c.menu_item_id = m.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `, [userId]);

      return rows;
    } catch (error) {
      console.error('❌ [MODEL] Error fetching cart items:', error);
      throw error;
    }
  }

  // Thêm món vào giỏ hàng
  static async add({ userId, menuItemId, quantity }) {
    try {
      // Kiểm tra đã tồn tại item này trong giỏ chưa
      const [existing] = await db.execute(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND menu_item_id = ?',
        [userId, menuItemId]
      );

      if (existing.length > 0) {
        const newQty = existing[0].quantity + quantity;
        const [result] = await db.execute(
          'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newQty, existing[0].id]
        );
        return result;
      } else {
        const [result] = await db.execute(
          'INSERT INTO cart (user_id, menu_item_id, quantity) VALUES (?, ?, ?)',
          [userId, menuItemId, quantity]
        );
        return result;
      }
    } catch (error) {
      console.error('❌ [MODEL] Error adding to cart:', error);
      throw error;
    }
  }

  // Cập nhật số lượng
  static async updateQuantity(cartItemId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.remove(cartItemId);
      }
      const [result] = await db.execute(
        'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [quantity, cartItemId]
      );
      return result;
    } catch (error) {
      console.error('❌ [MODEL] Error updating cart quantity:', error);
      throw error;
    }
  }

  // Xóa 1 item
  static async remove(cartItemId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM cart WHERE id = ?',
        [cartItemId]
      );
      return result;
    } catch (error) {
      console.error('❌ [MODEL] Error removing cart item:', error);
      throw error;
    }
  }

  // Xóa toàn bộ giỏ của user
  static async clearByUserId(userId) {
    try {
      const [result] = await db.execute(
        'DELETE FROM cart WHERE user_id = ?',
        [userId]
      );
      return result;
    } catch (error) {
      console.error('❌ [MODEL] Error clearing cart:', error);
      throw error;
    }
  }

  // Tìm theo id (nếu cần)
  static async findById(cartItemId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM cart WHERE id = ?',
        [cartItemId]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('❌ [MODEL] Error finding cart item by ID:', error);
      throw error;
    }
  }
}

module.exports = Cart;
