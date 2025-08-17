const db = require('../config/database');

class MenuItem {
  // Lấy tất cả món ăn với thông tin danh mục
  static async getAll(showUnavailable = false) {
    try {
      let query = `
        SELECT m.*, c.name as category_name 
        FROM menu_items m 
        LEFT JOIN categories c ON m.category_id = c.id
      `;
      
      if (!showUnavailable) {
        query += ' WHERE m.available = 1';
      }
      
      query += ' ORDER BY c.name, m.name';

      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }

  // Tìm món ăn theo ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE m.id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding menu item by ID:', error);
      throw error;
    }
  }

  // Tạo món ăn mới
  static async create(menuItemData) {
    try {
      const { name, description, price, categoryId, image, available } = menuItemData;
      const [result] = await db.execute(
        'INSERT INTO menu_items (name, description, price, category_id, image, available) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, categoryId, image, available]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  }

  // Cập nhật món ăn
  static async update(id, menuItemData) {
    try {
      const { name, description, price, categoryId, image, available } = menuItemData;
      
      const query = image 
        ? 'UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ?, image = ?, available = ? WHERE id = ?'
        : 'UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ?, available = ? WHERE id = ?';
      
      const params = image 
        ? [name, description, price, categoryId, image, available, id]
        : [name, description, price, categoryId, available, id];

      const [result] = await db.execute(query, params);
      return result;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  // Xóa món ăn
  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM menu_items WHERE id = ?', [id]);
      return result;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }
}

module.exports = MenuItem;
