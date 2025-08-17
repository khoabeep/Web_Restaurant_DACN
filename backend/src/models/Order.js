const db = require('../config/database'); // mysql2/promise pool

class Order {
  /**
   * Tạo đơn + order_items trong 1 transaction
   * @param {{userId:number,totalAmount:number,paymentMethod:'cash'|'card'|'zalopay',deliveryAddress:string,notes?:string|null,couponId?:number|null,discount?:number}} orderData
   * @param {{menu_item_id:number,quantity:number,price:number}[]} items
   * @returns {Promise<number>} orderId
   */
  static async createWithItems(
    { userId, totalAmount, paymentMethod, deliveryAddress, notes = null, couponId = null, discount = 0 },
    items
  ) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1) Tạo đơn
      const [orderRes] = await conn.execute(
        'INSERT INTO orders (user_id, total_amount, payment_method, delivery_address, notes, coupon_id, discount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, totalAmount, paymentMethod, deliveryAddress, notes, couponId, discount, 'pending']
      );
      const orderId = orderRes.insertId;

      // 2) Thêm chi tiết đơn
      if (Array.isArray(items) && items.length > 0) {
        const values = items.map(i => [orderId, i.menu_item_id, i.quantity, i.price]);
        await conn.query('INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?', [values]);
      }

      await conn.commit();
      return orderId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // Lấy đơn hàng theo user ID
  static async getByUserId(userId) {
    const [rows] = await db.query(`
      SELECT o.*, 
             GROUP_CONCAT(CONCAT(oi.quantity, 'x ', m.name) ORDER BY m.name SEPARATOR ', ') AS items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);
    return rows;
  }

  // Lấy tất cả đơn hàng (admin)
  static async getAll() {
    const [rows] = await db.query(`
      SELECT o.*, u.name AS customer_name, u.email AS customer_email,
             GROUP_CONCAT(CONCAT(oi.quantity, 'x ', m.name) ORDER BY m.name SEPARATOR ', ') AS items_summary
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    return rows;
  }

  // Lấy chi tiết đơn hàng
  static async getDetails(orderId) {
    const [rows] = await db.query(`
      SELECT oi.*, m.name, m.description, m.image
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?
    `, [orderId]);
    return rows;
  }

  // Cập nhật trạng thái đơn hàng
  static async updateStatus(orderId, status) {
    const [res] = await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    return res;
  }

  // Thống kê
  static async getStats() {
    const [orderStats] = await db.query(`
      SELECT 
        COUNT(*) AS total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) AS confirmed_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders,
        SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) AS total_revenue
      FROM orders
    `);

    const [customerStats] = await db.query(`
      SELECT COUNT(*) AS total_customers
      FROM users
      WHERE role = 'customer'
    `);

    return {
      ...orderStats[0],
      total_customers: customerStats[0].total_customers
    };
  }

  // Lấy hoạt động gần đây
  static async getRecentActivities() {
    const [rows] = await db.query(`
      SELECT 
        o.id as order_id,
        o.status,
        o.created_at,
        o.updated_at,
        u.name as customer_name,
        'order' as activity_type
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.updated_at DESC
      LIMIT 10
    `);
    return rows;
  }

  // Thống kê chi tiết
  static async getDetailedStats() {
    // Thống kê tổng quan
    const [overallStats] = await db.query(`
      SELECT 
        COUNT(*) AS total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) AS confirmed_orders,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) AS preparing_orders,
        COUNT(CASE WHEN status = 'ready' THEN 1 END) AS ready_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders,
        SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) AS total_revenue,
        AVG(CASE WHEN status = 'delivered' THEN total_amount ELSE NULL END) AS avg_order_value
      FROM orders
    `);

    // Thống kê khách hàng
    const [customerStats] = await db.query(`
      SELECT COUNT(DISTINCT id) as total_customers
      FROM users
      WHERE role = 'user'
    `);

    // Thống kê theo ngày (7 ngày gần đây)
    const [dailyStats] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders_count,
        SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) as revenue
      FROM orders 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Món ăn bán chạy nhất
    const [topItems] = await db.query(`
      SELECT 
        m.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'delivered'
      GROUP BY m.id, m.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    return {
      overview: overallStats[0],
      totalCustomers: customerStats[0].total_customers,
      dailyStats,
      topItems
    };
  }
}

module.exports = Order;
