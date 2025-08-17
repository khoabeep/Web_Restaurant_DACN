const MenuItem = require('../models/MenuItem');

class MenuController {
  // Lấy tất cả món ăn
  static async getAll(req, res) {
    try {
      const showUnavailable = req.query.admin === 'true';
      const menuItems = await MenuItem.getAll(showUnavailable);
      res.json(menuItems);
    } catch (error) {
      console.error('Lỗi lấy menu:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách menu' });
    }
  }

  // Lấy món ăn theo ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const menuItem = await MenuItem.findById(id);
      
      if (!menuItem) {
        return res.status(404).json({ message: 'Không tìm thấy món ăn' });
      }

      res.json(menuItem);
    } catch (error) {
      console.error('Lỗi lấy món ăn:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy thông tin món ăn' });
    }
  }

  // Tạo món ăn mới (Admin)
  static async create(req, res) {
    try {
      const { name, description, price, category_id, available } = req.body;
      const image = req.file ? req.file.filename : null;

      // Xử lý giá trị available một cách linh hoạt
      let isAvailable = true; // Mặc định là có sẵn
      if (available !== undefined && available !== null) {
        if (typeof available === 'string') {
          isAvailable = available.toLowerCase() === 'true';
        } else if (typeof available === 'boolean') {
          isAvailable = available;
        }
      }

      const menuItemId = await MenuItem.create({
        name,
        description,
        price: parseFloat(price),
        categoryId: category_id,
        image,
        available: isAvailable
      });

      res.status(201).json({
        message: 'Tạo món ăn thành công',
        menuItemId: menuItemId
      });

    } catch (error) {
      console.error('Lỗi tạo món ăn:', error);
      res.status(500).json({ message: 'Lỗi server khi tạo món ăn' });
    }
  }

  // Cập nhật món ăn (Admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, category_id, available } = req.body;
      const image = req.file ? req.file.filename : null;

      // Debug log
      console.log('Update request data:', { id, name, available, type: typeof available });

      // Xử lý giá trị available một cách linh hoạt
      let isAvailable = true; // Mặc định là có sẵn
      if (available !== undefined && available !== null) {
        if (typeof available === 'string') {
          isAvailable = available.toLowerCase() === 'true';
        } else if (typeof available === 'boolean') {
          isAvailable = available;
        }
      }

      console.log('Processed available value:', isAvailable);

      await MenuItem.update(id, {
        name,
        description,
        price: parseFloat(price),
        categoryId: category_id,
        image,
        available: isAvailable
      });

      res.json({ message: 'Cập nhật món ăn thành công' });

    } catch (error) {
      console.error('Lỗi cập nhật món ăn:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật món ăn' });
    }
  }

  // Xóa món ăn (Admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;

      await MenuItem.delete(id);

      res.json({ message: 'Xóa món ăn thành công' });

    } catch (error) {
      console.error('Lỗi xóa món ăn:', error);
      res.status(500).json({ message: 'Lỗi server khi xóa món ăn' });
    }
  }
}

module.exports = MenuController;
