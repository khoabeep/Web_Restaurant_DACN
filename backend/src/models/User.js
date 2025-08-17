const db = require('../config/database');

class User {
  // Tìm người dùng theo email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Tìm người dùng theo ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, email, name, phone, address, role FROM users WHERE id = ?', 
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Tạo người dùng mới
  static async create(userData) {
    try {
      const { email, password, fullName, phone, address } = userData;
      const [result] = await db.execute(
        'INSERT INTO users (email, password, name, phone, address) VALUES (?, ?, ?, ?, ?)',
        [email, password, fullName, phone, address]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Cập nhật thông tin người dùng
  static async update(id, userData) {
    try {
      const { name, phone, address } = userData;
      const [result] = await db.execute(
        'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
        [name ?? null, phone ?? null, address ?? null, id]
      );
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Cập nhật mật khẩu
  static async updatePassword(id, newPassword) {
    try {
      const [result] = await db.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, id]
      );
      return result;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  // Lấy danh sách khách hàng
  static async getCustomers() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          u.id, 
          u.name, 
          u.email, 
          u.phone, 
          u.address, 
          u.created_at,
          COUNT(o.id) as total_orders,
          SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error getting customers:', error);
      throw error;
    }
  }

  // Lấy thống kê khách hàng
  static async getCustomerStats() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          COUNT(*) as total_customers,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_customers_this_month,
          COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_customers_this_week,
          (SELECT COUNT(DISTINCT user_id) FROM orders WHERE status = 'delivered') as active_customers
        FROM users 
        WHERE role = 'customer'
      `);
      return rows[0];
    } catch (error) {
      console.error('Error getting customer stats:', error);
      throw error;
    }
  }

  // Lấy tất cả users với thống kê đơn hàng
  static async getAllUsers() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          u.id, 
          u.name as full_name, 
          u.email, 
          u.phone, 
          u.address,
          u.role,
          u.created_at,
          COUNT(o.id) as total_orders,
          SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}

module.exports = User;
