const db = require('../config/database');

class Coupon {
  // Lấy tất cả coupons công khai (cho trang promotions)
  static async getPublicCoupons() {
    try {
      const [rows] = await db.execute(
        `SELECT id, code, description, discount_type, discount_value, 
                min_order_amount, max_discount_amount, expiry_date, 
                usage_limit, used_count, is_active
         FROM coupons 
         WHERE is_active = 1 AND expiry_date > NOW()
         ORDER BY created_at DESC`
      );
      return rows;
    } catch (error) {
      console.error('Error fetching public coupons:', error);
      throw error;
    }
  }

  // Lấy tất cả coupons (cho admin)
  static async getAllCoupons() {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM coupons ORDER BY created_at DESC`
      );
      return rows;
    } catch (error) {
      console.error('Error fetching all coupons:', error);
      throw error;
    }
  }

  // Lấy coupon theo ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM coupons WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding coupon by ID:', error);
      throw error;
    }
  }

  // Lấy coupon theo code
  static async findByCode(code) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM coupons WHERE code = ? AND is_active = 1',
        [code]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding coupon by code:', error);
      throw error;
    }
  }

  // Tạo coupon mới
  static async create(couponData) {
    try {
      const {
        code, description, discount_type, discount_value,
        min_order_amount, max_discount_amount, expiry_date,
        usage_limit, is_active = 1
      } = couponData;

      const [result] = await db.execute(
        `INSERT INTO coupons (code, description, discount_type, discount_value, 
                             min_order_amount, max_discount_amount, expiry_date, 
                             usage_limit, used_count, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
        [code, description, discount_type, discount_value, 
         min_order_amount, max_discount_amount, expiry_date, 
         usage_limit, is_active]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }

  // Cập nhật coupon
  static async update(id, couponData) {
    try {
      const {
        code, description, discount_type, discount_value,
        min_order_amount, max_discount_amount, expiry_date,
        usage_limit, is_active
      } = couponData;

      await db.execute(
        `UPDATE coupons SET 
         code = ?, description = ?, discount_type = ?, discount_value = ?,
         min_order_amount = ?, max_discount_amount = ?, expiry_date = ?,
         usage_limit = ?, is_active = ?, updated_at = NOW()
         WHERE id = ?`,
        [code, description, discount_type, discount_value,
         min_order_amount, max_discount_amount, expiry_date,
         usage_limit, is_active, id]
      );

      return true;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái coupon
  static async updateStatus(id, isActive) {
    try {
      await db.execute(
        'UPDATE coupons SET is_active = ?, updated_at = NOW() WHERE id = ?',
        [isActive, id]
      );
      return true;
    } catch (error) {
      console.error('Error updating coupon status:', error);
      throw error;
    }
  }

  // Xóa coupon
  static async delete(id) {
    try {
      await db.execute('DELETE FROM coupons WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }

  // Validate coupon
  static async validateCoupon(code, orderAmount, userId = null) {
    try {
      const coupon = await this.findByCode(code);
      
      if (!coupon) {
        return { valid: false, error: 'Mã khuyến mãi không tồn tại' };
      }

      const now = new Date();
      const expiryDate = new Date(coupon.expiry_date);
      
      if (expiryDate < now) {
        return { valid: false, error: 'Mã khuyến mãi đã hết hạn' };
      }

      if (coupon.used_count >= coupon.usage_limit) {
        return { valid: false, error: 'Mã khuyến mãi đã hết lượt sử dụng' };
      }

      if (orderAmount < coupon.min_order_amount) {
        return { 
          valid: false, 
          error: `Đơn hàng tối thiểu ${coupon.min_order_amount.toLocaleString('vi-VN')}đ để sử dụng mã này` 
        };
      }

      // Tính toán discount
      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = orderAmount * (coupon.discount_value / 100);
        if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
          discountAmount = coupon.max_discount_amount;
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      return {
        valid: true,
        coupon: coupon,
        discountAmount: Math.round(discountAmount)
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }

  // Sử dụng coupon (tăng used_count)
  static async useCoupon(id) {
    try {
      await db.execute(
        'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error using coupon:', error);
      throw error;
    }
  }
}

module.exports = Coupon;
