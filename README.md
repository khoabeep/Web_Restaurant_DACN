# 🍽️ Nhà Hàng Chez Maman - Hệ Thống Đặt Món Online Chuyên Nghiệp

Ứng dụng đặt món ăn full-stack được xây dựng với Angular, Node.js, MySQL và Tailwind CSS. Hệ thống chuyên nghiệp này bao gồm đặt món của khách hàng, quản lý admin, theo dõi đơn hàng thời gian thực và các tính năng quản lý nhà hàng toàn diện.

**Hệ thống đặt món ăn online chuyên nghiệp với đầy đủ tính năng như các trang web hàng đầu thế giới.**

## ✨ Tính Năng

### Tính Năng Khách Hàng
- 🏠 **Trang Chủ Đẹp Mắt** - Trang chủ responsive với các món ăn nổi bật
- 🔐 **Xác Thực Người Dùng** - Hệ thống đăng ký và đăng nhập
- 🍕 **Duyệt Menu** - Xem menu theo danh mục với chức năng tìm kiếm
- 🛒 **Giỏ Hàng** - Thêm/xóa món, cập nhật số lượng
- 💳 **Thanh Toán An Toàn** - Nhiều phương thức thanh toán (Tiền mặt, Thẻ, Online)
- 📋 **Theo Dõi Đơn Hàng** - Cập nhật trạng thái đơn hàng thời gian thực

### Tính Năng Admin
- 📊 **Bảng Điều Khiển** - Tổng quan về đơn hàng, doanh thu và thống kê khách hàng
- 📦 **Quản Lý Đơn Hàng** - Xem và cập nhật trạng thái đơn hàng
- 🍽️ **Quản Lý Menu** - Thêm/sửa danh mục và món ăn
- 👥 **Quản Lý Khách Hàng** - Xem thông tin khách hàng
- 📈 **Phân Tích** - Báo cáo bán hàng và thông tin chi tiết

### Tính Năng Kỹ Thuật
- 🔒 **Xác Thực JWT** - Phiên làm việc người dùng an toàn
- 🛡️ **Phân Quyền Theo Vai Trò** - Vai trò Khách hàng và Admin
- 📸 **Tải Lên Hình Ảnh** - Hình ảnh món ăn và danh mục
- ⚡ **Cập Nhật Thời Gian Thực** - Thay đổi trạng thái đơn hàng
- 🎨 **Giao Diện Hiện Đại** - Thiết kế đẹp mắt với Tailwind CSS
- 📊 **RESTful API** - API backend có cấu trúc tốt

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **Angular 19** - Framework web hiện đại
- **Tailwind CSS 4** - Framework CSS utility-first
- **TypeScript** - JavaScript an toàn kiểu
- **RxJS** - Lập trình phản ứng

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Framework ứng dụng web
- **MySQL** - Cơ sở dữ liệu quan hệ
- **JWT** - JSON Web Tokens cho xác thực
- **Multer** - Xử lý tải lên file
- **bcryptjs** - Mã hóa mật khẩu

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống
- Node.js (v16 trở lên)
- MySQL (v8 trở lên)
- Angular CLI

### Cài Đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd DoAnChuyenNganh
   ```

2. **Cài Đặt Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Cài Đặt Frontend**
   ```bash
   cd ../frontend/food-ordering-app
   npm install
   ```

4. **Cài Đặt Cơ Sở Dữ Liệu**
   - Tạo cơ sở dữ liệu MySQL có tên `food_ordering`
   - Import schema cơ sở dữ liệu:
   ```bash
   mysql -u root -p food_ordering < backend/database.sql
   ```

5. **Cấu Hình Môi Trường**
   - Sao chép `backend/.env` và cấu hình thông tin đăng nhập cơ sở dữ liệu:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=ten_nguoi_dung_mysql
   DB_PASSWORD=mat_khau_mysql
   DB_NAME=food_ordering
   JWT_SECRET=khoa-bi-mat-jwt-cua-ban
   ```

6. **Khởi Chạy Ứng Dụng**
   
   Khởi động server backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Khởi động server phát triển frontend:
   ```bash
   cd ../frontend/food-ordering-app
   npm start
   ```

7. **Truy Cập Ứng Dụng**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

## 👤 Tài Khoản Admin Mặc Định

- **Email:** admin@restaurant.com
- **Mật khẩu:** admin123

## 📁 Cấu Trúc Dự Án

```
DoAnChuyenNganh/
├── backend/                     # Backend API với Node.js (MVC Architecture)
│   ├── .env                    # Cấu hình môi trường
│   ├── app.js                  # Entry point chính
│   ├── package.json            # Dependencies backend
│   ├── food_ordering.sql       # Database schema
│   ├── README.md               # Hướng dẫn backend
│   ├── uploads/                # Folder chứa ảnh upload
│   │   └── *.jpg              # Ảnh món ăn
│   └── src/                    # Source code
│       ├── config/             # Cấu hình
│       │   └── database.js     # Kết nối database
│       ├── controllers/        # Business logic
│       │   ├── AuthController.js
│       │   ├── CategoryController.js
│       │   ├── MenuController.js
│       │   ├── CartController.js
│       │   └── OrderController.js
│       ├── models/             # Data access layer
│       │   ├── User.js
│       │   ├── Category.js
│       │   ├── MenuItem.js
│       │   ├── Cart.js
│       │   └── Order.js
│       ├── routes/             # API routes
│       │   ├── auth.js
│       │   ├── categories.js
│       │   ├── menu-items.js
│       │   ├── cart.js
│       │   └── orders.js
│       ├── middlewares/        # Middleware functions
│       │   ├── auth.js
│       │   └── upload.js
│       └── utils/              # Utility functions
│
└── frontend/food-ordering-app/
    ├── src/
    │   ├── app/
    │   │   ├── components/     # Angular components
    │   │   │   ├── admin/     # Admin management
    │   │   │   │   ├── admin-dashboard/
    │   │   │   │   ├── admin-menu/
    │   │   │   │   └── admin-orders/
    │   │   │   ├── auth/      # Authentication
    │   │   │   │   ├── login/
    │   │   │   │   └── register/
    │   │   │   ├── home/      # Homepage
    │   │   │   ├── header/    # Navigation
    │   │   │   ├── footer/    # Footer
    │   │   │   ├── about/     # About page
    │   │   │   ├── contact/   # Contact page
    │   │   │   ├── orders/    # Order management
    │   │   │   ├── profile/   # User profile
    │   │   │   ├── promotions/ # Promotions/Coupons
    │   │   │   ├── checkout/  # Checkout process
    │   │   │   ├── notification/ # Notifications
    │   │   │   ├── privacy-policy/
    │   │   │   ├── terms-of-service/
    │   │   │   └── return-policy/
    │   │   ├── menu/          # Menu browsing
    │   │   ├── cart/          # Shopping cart
    │   │   ├── services/      # Angular services (cleaned up)
    │   │   │   ├── auth.service.ts
    │   │   │   ├── cart.service.ts
    │   │   │   ├── menu.service.ts
    │   │   │   ├── order.service.ts
    │   │   │   ├── coupon.service.ts
    │   │   │   ├── contact.service.ts
    │   │   │   └── notification.service.ts
    │   │   └── guards/        # Route guards
    │   │       ├── auth.guard.ts
    │   │       └── admin.guard.ts
    │   ├── assets/            # Static assets (cleaned up)
    │   └── styles.css         # Global styles
    ├── tailwind.config.js     # Tailwind configuration
    ├── proxy.conf.json        # Development proxy
    └── package.json           # Frontend dependencies
```

## 🔧 API Endpoints

### Xác Thực
- `POST /api/auth/register` - Đăng ký người dùng
- `POST /api/auth/login` - Đăng nhập người dùng

### Menu
- `GET /api/categories` - Lấy tất cả danh mục
- `GET /api/menu-items` - Lấy các món ăn
- `POST /api/categories` - Tạo danh mục (Admin)
- `POST /api/menu-items` - Tạo món ăn (Admin)

### Giỏ Hàng
- `GET /api/cart/:userId` - Lấy giỏ hàng của người dùng
- `POST /api/cart` - Thêm món vào giỏ hàng
- `PUT /api/cart/:id` - Cập nhật món trong giỏ hàng
- `DELETE /api/cart/:id` - Xóa món khỏi giỏ hàng

### Đơn Hàng
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/user/:userId` - Lấy đơn hàng của người dùng
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin)
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)

## 🎨 Tính Năng Thiết Kế

- **Giao Diện Hiện Đại** - Thiết kế sạch sẽ, chuyên nghiệp
- **Thiết Kế Responsive** - Phương pháp mobile-first
- **Chế Độ Tối/Sáng** - Bảng màu thích ứng
- **Hoạt Ảnh Mượt Mà** - CSS transitions và transforms
- **Trạng Thái Tải** - Phản hồi người dùng trong các thao tác
- **Xử Lý Lỗi** - Thông báo lỗi toàn diện

## 🔒 Tính Năng Bảo Mật

- **Xác Thực JWT** - Xác thực dựa trên token an toàn
- **Mã Hóa Mật Khẩu** - bcrypt cho bảo mật mật khẩu
- **Xác Thực Đầu Vào** - Xác thực phía server
- **Bảo Mật Tải Lên File** - Xác thực loại hình ảnh
- **Giới Hạn Tốc Độ** - Giới hạn yêu cầu API
- **Bảo Vệ CORS** - Bảo mật yêu cầu cross-origin

## 🚀 Triển Khai

### Triển Khai Frontend
```bash
cd frontend/food-ordering-app
npm run build
# Triển khai thư mục 'dist' lên dịch vụ hosting của bạn
```

### Triển Khai Backend
```bash
cd backend
npm start
# Triển khai lên server với PM2 hoặc process manager tương tự
```

## 🤝 Đóng Góp

1. Fork repository
2. Tạo nhánh tính năng (`git checkout -b feature/TinhNangTuyetVoi`)
3. Commit các thay đổi (`git commit -m 'Thêm TinhNangTuyetVoi'`)
4. Push lên nhánh (`git push origin feature/TinhNangTuyetVoi`)
5. Mở Pull Request

## 📄 Giấy Phép

Dự án này được cấp phép theo Giấy phép MIT - xem file LICENSE để biết thêm chi tiết.

## 📞 Hỗ Trợ

Để được hỗ trợ, email support@foodieapp.com hoặc tạo issue trong repository.

## 🙏 Lời Cảm Ơn

- Đội ngũ Angular cho framework tuyệt vời
- Tailwind CSS cho hệ thống styling đẹp mắt
- MySQL cho quản lý cơ sở dữ liệu đáng tin cậy
- Tất cả những người đóng góp đã giúp dự án này tốt hơn

---

**Được xây dựng với ❤️ dành cho những người yêu thích ẩm thực!** 🍕🍔🍣
