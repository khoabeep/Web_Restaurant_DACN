const db = require('../config/database');

class Category {
  // Lấy tất cả danh mục
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
      return rows;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Tạo danh mục mới
  static async create(categoryData) {
    try {
      const { name, description, image } = categoryData;
      const [result] = await db.execute(
        'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
        [name, description, image]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Cập nhật danh mục
  static async update(id, categoryData) {
    try {
      const { name, description, image } = categoryData;
      const query = image 
        ? 'UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?'
        : 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
      
      const params = image 
        ? [name, description, image, id]
        : [name, description, id];

      const [result] = await db.execute(query, params);
      return result;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Xóa danh mục
  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
      return result;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

module.exports = Category;
