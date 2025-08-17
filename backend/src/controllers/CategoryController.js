const Category = require('../models/Category');

class CategoryController {
  // Lấy tất cả danh mục
  static async getAll(req, res) {
    try {
      const categories = await Category.getAll();
      res.json(categories);
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách danh mục' });
    }
  }

  // Tạo danh mục mới (Admin)
  static async create(req, res) {
    try {
      const { name, description } = req.body;
      const image = req.file ? req.file.filename : null;

      const categoryId = await Category.create({ name, description, image });

      res.status(201).json({
        message: 'Tạo danh mục thành công',
        categoryId: categoryId
      });

    } catch (error) {
      console.error('Lỗi tạo danh mục:', error);
      res.status(500).json({ message: 'Lỗi server khi tạo danh mục' });
    }
  }

  // Cập nhật danh mục (Admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const image = req.file ? req.file.filename : null;

      await Category.update(id, { name, description, image });

      res.json({ message: 'Cập nhật danh mục thành công' });

    } catch (error) {
      console.error('Lỗi cập nhật danh mục:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật danh mục' });
    }
  }

  // Xóa danh mục (Admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;

      await Category.delete(id);

      res.json({ message: 'Xóa danh mục thành công' });

    } catch (error) {
      console.error('Lỗi xóa danh mục:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa danh mục' });
    }
  }
}

module.exports = CategoryController;
