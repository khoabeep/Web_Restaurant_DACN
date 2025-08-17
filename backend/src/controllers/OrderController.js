const Order = require('../models/Order');
const Cart = require('../models/Cart');

class OrderController {
  // Tạo đơn hàng mới
  static async create(req, res) {
    try {
      const { user_id, payment_method, delivery_address, notes, coupon_id, discount } = req.body;

      // Kiểm tra quyền (chỉ được tạo đơn hàng cho chính mình)
      if (req.user.userId != user_id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Không có quyền tạo đơn hàng cho người dùng này' });
      }

      // Lấy giỏ hàng của người dùng
      const cartItems = await Cart.getByUserId(user_id);
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống' });
      }

      // Tính tổng tiền
      const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
      const deliveryFee = 19000;       // ví dụ phí ship cố định
      const tax = Math.round(subtotal * 0.02); // ví dụ 2% thuế
      const finalDiscount = Number(discount || 0);
      const totalAmount = subtotal + deliveryFee + tax - finalDiscount;

      // Chuẩn hoá mảng items cho order_items
      const orderItems = cartItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }));

      // Tạo đơn + chi tiết trong 1 transaction
      const orderId = await Order.createWithItems({
        userId: user_id,
        totalAmount,
        paymentMethod: payment_method,
        deliveryAddress: delivery_address,
        notes,
        couponId: coupon_id,
        discount: finalDiscount
      }, orderItems);

      // (Tuỳ chọn) Xoá giỏ sau khi đặt hàng
      try {
        await Cart.clearByUserId(user_id);
      } catch (e) {
        // Không chặn luồng nếu dọn giỏ lỗi
        console.warn('⚠️ Lỗi xoá giỏ sau khi đặt hàng:', e.message);
      }

      return res.status(201).json({
        message: 'Đặt hàng thành công',
        orderId,
        totalAmount
      });
    } catch (error) {
      console.error('Lỗi tạo đơn hàng (stack):', error);
      return res.status(500).json({ message: error.sqlMessage || error.message || 'Lỗi server khi tạo đơn hàng' });
    }
  }

  // Lấy đơn hàng của người dùng
  static async getByUserId(req, res) {
    try {
      const { userId } = req.params;

      if (req.user.userId != userId && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Không có quyền xem đơn hàng của người dùng này' });
      }

      const orders = await Order.getByUserId(userId);
      res.json(orders);
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
    }
  }

  // Lấy tất cả đơn (admin)
  static async getAll(req, res) {
    try {
      const orders = await Order.getAll();
      res.json(orders);
    } catch (error) {
      console.error('Lỗi lấy tất cả đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng' });
    }
  }

  // Lấy chi tiết đơn
  static async getDetails(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.userId;
      const isAdmin = !!req.user.isAdmin;
      
      // Kiểm tra quyền: chỉ được xem chi tiết đơn hàng của mình hoặc admin
      if (!isAdmin) {
        const db = require('../config/database');
        const [orderRows] = await db.query('SELECT user_id FROM orders WHERE id = ?', [orderId]);
        
        if (orderRows.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        
        if (orderRows[0].user_id != userId) {
          return res.status(403).json({ message: 'Không có quyền xem chi tiết đơn hàng này' });
        }
      }
      
      const details = await Order.getDetails(orderId);
      console.log('Order details for ID', orderId, ':', details);
      res.json(details);
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn hàng' });
    }
  }

  // Cập nhật trạng thái (admin)
  static async updateStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      await Order.updateStatus(orderId, status);
      res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái' });
    }
  }

  // Thống kê (admin)
  static async getStats(req, res) {
    try {
      const stats = await Order.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy thống kê đơn hàng' });
    }
  }

  // Hủy đơn hàng
  static async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user.userId;
      const isAdmin = !!req.user.isAdmin;
      // Lấy thông tin đơn hàng từ bảng orders
      const db = require('../config/database');
      const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
      const order = rows[0];
      if (!order) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      }
      if (!isAdmin && order.user_id != userId) {
        return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' });
      }
      await Order.updateStatus(orderId, 'cancelled');
      return res.json({ message: 'Đã hủy đơn hàng thành công' });
    } catch (error) {
      console.error('Lỗi hủy đơn hàng:', error);
      return res.status(500).json({ message: 'Lỗi server khi hủy đơn hàng' });
    }
  }

  // Lấy hoạt động gần đây (admin)
  static async getRecentActivities(req, res) {
    try {
      const activities = await Order.getRecentActivities();
      res.json(activities);
    } catch (error) {
      console.error('Lỗi lấy hoạt động gần đây:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy hoạt động gần đây' });
    }
  }

  // Lấy thống kê chi tiết (admin)
  static async getDetailedStats(req, res) {
    try {
      const stats = await Order.getDetailedStats();
      res.json(stats);
    } catch (error) {
      console.error('Lỗi lấy thống kê chi tiết:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Lấy thống kê khách hàng cho admin
  static async getCustomerStats(req, res) {
    try {
      const db = require('../config/database');
      
      const [customerCountRows] = await db.execute(`
        SELECT 
          COUNT(*) as totalCustomers,
          COUNT(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as newThisMonth,
          COUNT(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as newThisWeek
        FROM users 
        WHERE role = 'customer'
      `);

      const [activeCustomersRows] = await db.execute(`
        SELECT COUNT(DISTINCT user_id) as activeCustomers 
        FROM orders 
        WHERE status = 'delivered' 
        AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      `);

      const [revenueRows] = await db.execute(`
        SELECT SUM(total_amount) as totalRevenue 
        FROM orders 
        WHERE status = 'delivered'
      `);

      const stats = {
        totalCustomers: customerCountRows[0].totalCustomers || 0,
        newThisMonth: customerCountRows[0].newThisMonth || 0,
        activeCustomers: activeCustomersRows[0].activeCustomers || 0,
        totalRevenue: revenueRows[0].totalRevenue || 0
      };

      res.json(stats);
    } catch (error) {
      console.error('Lỗi lấy thống kê khách hàng:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = OrderController;
