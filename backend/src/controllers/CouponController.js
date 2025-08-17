const Coupon = require('../models/Coupon');

class CouponController {
  // Lấy danh sách coupons công khai (không cần xác thực)
  static async getPublicCoupons(req, res) {
    try {
      console.log('📋 Getting public coupons...');
      const coupons = await Coupon.getPublicCoupons();
      console.log(`✅ Found ${coupons.length} public coupons`);
      res.json(coupons);
    } catch (error) {
      console.error('❌ Error getting public coupons:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách khuyến mãi' });
    }
  }

  // Lấy tất cả coupons (admin only)
  static async getAllCoupons(req, res) {
    try {
      const coupons = await Coupon.getAllCoupons();
      res.json(coupons);
    } catch (error) {
      console.error('Error getting all coupons:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách coupon' });
    }
  }

  // Lấy coupon theo ID
  static async getCouponById(req, res) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      
      if (!coupon) {
        return res.status(404).json({ message: 'Không tìm thấy coupon' });
      }

      res.json(coupon);
    } catch (error) {
      console.error('Error getting coupon by ID:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy thông tin coupon' });
    }
  }

  // Tạo coupon mới (admin only)
  static async createCoupon(req, res) {
    try {
      const couponData = req.body;
      
      // Kiểm tra xem code đã tồn tại chưa
      const existingCoupon = await Coupon.findByCode(couponData.code);
      if (existingCoupon) {
        return res.status(400).json({ message: 'Mã coupon đã tồn tại' });
      }

      const couponId = await Coupon.create(couponData);
      const newCoupon = await Coupon.findById(couponId);
      
      res.status(201).json({
        message: 'Tạo coupon thành công',
        coupon: newCoupon
      });
    } catch (error) {
      console.error('Error creating coupon:', error);
      res.status(500).json({ message: 'Lỗi server khi tạo coupon' });
    }
  }

  // Cập nhật coupon (admin only)
  static async updateCoupon(req, res) {
    try {
      const { id } = req.params;
      const couponData = req.body;

      const existingCoupon = await Coupon.findById(id);
      if (!existingCoupon) {
        return res.status(404).json({ message: 'Không tìm thấy coupon' });
      }

      await Coupon.update(id, couponData);
      const updatedCoupon = await Coupon.findById(id);

      res.json({
        message: 'Cập nhật coupon thành công',
        coupon: updatedCoupon
      });
    } catch (error) {
      console.error('Error updating coupon:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật coupon' });
    }
  }

  // Cập nhật trạng thái coupon (admin only)
  static async updateCouponStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      const existingCoupon = await Coupon.findById(id);
      if (!existingCoupon) {
        return res.status(404).json({ message: 'Không tìm thấy coupon' });
      }

      await Coupon.updateStatus(id, is_active);
      
      res.json({
        message: `${is_active ? 'Kích hoạt' : 'Tạm dừng'} coupon thành công`
      });
    } catch (error) {
      console.error('Error updating coupon status:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái coupon' });
    }
  }

  // Xóa coupon (admin only)
  static async deleteCoupon(req, res) {
    try {
      const { id } = req.params;

      const existingCoupon = await Coupon.findById(id);
      if (!existingCoupon) {
        return res.status(404).json({ message: 'Không tìm thấy coupon' });
      }

      await Coupon.delete(id);
      res.json({ message: 'Xóa coupon thành công' });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa coupon' });
    }
  }

  // Validate coupon
  static async validateCoupon(req, res) {
    try {
      const { code, order_amount } = req.body;
      const userId = req.user?.userId;

      if (!code || !order_amount) {
        return res.status(400).json({ 
          valid: false, 
          error: 'Thiếu thông tin mã coupon hoặc số tiền đơn hàng' 
        });
      }

      const result = await Coupon.validateCoupon(code, order_amount, userId);
      res.json(result);
    } catch (error) {
      console.error('Error validating coupon:', error);
      res.status(500).json({ 
        valid: false, 
        error: 'Lỗi server khi kiểm tra mã coupon' 
      });
    }
  }

  // Lấy danh sách coupons khả dụng cho user
  static async getAvailableCoupons(req, res) {
    try {
      const coupons = await Coupon.getPublicCoupons();
      res.json(coupons);
    } catch (error) {
      console.error('Error getting available coupons:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách coupon khả dụng' });
    }
  }
}

module.exports = CouponController;
