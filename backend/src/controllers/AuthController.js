const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Đăng ký người dùng mới
  static async register(req, res) {
    try {
      const { email, password, fullName, phone, address } = req.body;

      // Kiểm tra xem người dùng đã tồn tại chưa
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const userId = await User.create({
        email,
        password: hashedPassword,
        fullName,
        phone,
        address
      });

      // Tạo JWT token cho người dùng mới
      const token = jwt.sign(
        { 
          userId: userId, 
          email: email, 
          isAdmin: false 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ 
        message: 'Đăng ký thành công',
        token: token,
        user: {
          id: userId,
          name: fullName,
          email: email,
          phone: phone,
          address: address,
          role: 'customer'
        }
      });

    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({ message: 'Lỗi server khi đăng ký' });
    }
  }

    // Đăng nhập
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Tìm người dùng theo email
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          isAdmin: user.role === 'admin' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = {
        message: 'Đăng nhập thành công',
        token: token,
        user: {
          id: user.id,
          name: user.name,  // Sử dụng user.name từ database
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role  // Sử dụng user.role từ database
        }
      };

      res.json(response);

    } catch (error) {
      console.error('❌ Lỗi đăng nhập:', error);
      res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
    }
  }

  // Lấy thông tin profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      res.json({
        id: user.id,
        name: user.name,  // Database field là 'name'
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role  // Database field là 'role'
      });
    } catch (error) {
      console.error('Lỗi lấy profile:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy thông tin profile' });
    }
  }

  // Cập nhật profile
  static async updateProfile(req, res) {
    try {
      const { name, phone, address } = req.body;
      const userId = req.params.id;

      // Kiểm tra quyền (chỉ được cập nhật profile của chính mình hoặc là admin)
      if (req.user.userId != userId && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Không có quyền cập nhật thông tin này' });
      }

      await User.update(userId, { name, phone, address });

      // Lấy thông tin đã cập nhật
      const updatedUser = await User.findById(userId);
      
      res.json({
        message: 'Cập nhật thông tin thành công',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,  // Database field là 'name'
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          role: updatedUser.role  // Database field là 'role'
        }
      });

    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
    }
  }

  // Đổi mật khẩu
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      // Lấy thông tin người dùng hiện tại
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      // Kiểm tra mật khẩu hiện tại
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
      }

      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu
      await User.updatePassword(userId, hashedNewPassword);

      res.json({ message: 'Đổi mật khẩu thành công' });

    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu' });
    }
  }

  // Lấy danh sách khách hàng (admin)
  static async getCustomers(req, res) {
    try {
      const customers = await User.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error('Lỗi lấy danh sách khách hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng' });
    }
  }

  // Lấy thống kê khách hàng (admin)
  static async getCustomerStats(req, res) {
    try {
      const stats = await User.getCustomerStats();
      res.json(stats);
    } catch (error) {
      console.error('Lỗi lấy thống kê khách hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy thống kê khách hàng' });
    }
  }

  // Lấy tất cả users (admin)
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Lỗi lấy danh sách users:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách users' });
    }
  }
}

module.exports = AuthController;
