const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/auth');
const categoryRoutes = require('./src/routes/categories');
const menuRoutes = require('./src/routes/menu-items');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/orders');
const couponRoutes = require('./src/routes/coupons');
const adminRoutes = require('./src/routes/admin');


// Import database connection để khởi tạo kết nối
require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware bảo mật
app.use(helmet());

// Giới hạn tốc độ - Thoải mái hơn cho phát triển
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 1000, // giới hạn mỗi IP tối đa 1000 requests mỗi windowMs (tăng cho dev)
  standardHeaders: true, // Trả về thông tin rate limit trong `RateLimit-*` headers
  legacyHeaders: false, // Tắt `X-RateLimit-*` headers
});
app.use(limiter);

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Middleware xử lý JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware logging cho tất cả requests
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📝 Body:`, req.body);
  }
  if (req.headers.authorization) {
    console.log(`🔑 Authorization: ${req.headers.authorization.substring(0, 20)}...`);
  }
  next();
});

// Middleware phục vụ file tĩnh (uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Route kiểm tra sức khỏe server
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server đang hoạt động bình thường',
    timestamp: new Date().toISOString()
  });
});

// Middleware xử lý lỗi 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Không tìm thấy endpoint này',
    path: req.originalUrl
  });
});

// Middleware xử lý lỗi global
app.use((err, req, res, next) => {
  console.error('Lỗi server:', err);
  
  // Lỗi multer (upload file)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File quá lớn. Giới hạn 5MB.' });
  }
  
  if (err.message.includes('upload')) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ 
    message: 'Lỗi server nội bộ',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📁 Uploads folder: ${path.join(__dirname, 'uploads')}`);
  console.log(`🌟 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
