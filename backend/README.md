# Backend API - Food Ordering System

## Cấu trúc dự án

```
backend/
├── app.js                    # Entry point chính
├── server.js                 # File cũ (có thể xóa)
├── package.json              # Dependencies và scripts
├── .env                      # Biến môi trường
├── food_ordering.sql         # Database schema
├── uploads/                  # Thư mục chứa file upload
└── src/
    ├── config/
    │   └── database.js       # Cấu hình kết nối database
    ├── controllers/          # Business logic
    │   ├── AuthController.js
    │   ├── CategoryController.js
    │   ├── MenuController.js
    │   ├── CartController.js
    │   └── OrderController.js
    ├── models/               # Data access layer
    │   ├── User.js
    │   ├── Category.js
    │   ├── MenuItem.js
    │   ├── Cart.js
    │   └── Order.js
    ├── routes/               # API routes
    │   ├── auth.js
    │   ├── categories.js
    │   ├── menu-items.js
    │   ├── cart.js
    │   └── orders.js
    ├── middlewares/          # Middleware functions
    │   ├── auth.js           # JWT authentication
    │   └── upload.js         # File upload handling
    └── utils/                # Utility functions (cho tương lai)
```

## Kiến trúc MVC

### Models (src/models/)
- **User.js**: Quản lý người dùng (đăng ký, đăng nhập, profile)
- **Category.js**: Quản lý danh mục món ăn
- **MenuItem.js**: Quản lý món ăn
- **Cart.js**: Quản lý giỏ hàng
- **Order.js**: Quản lý đơn hàng và thống kê

### Controllers (src/controllers/)
- **AuthController.js**: Xử lý xác thực và authorization
- **CategoryController.js**: CRUD danh mục
- **MenuController.js**: CRUD món ăn
- **CartController.js**: Quản lý giỏ hàng
- **OrderController.js**: Xử lý đặt hàng và quản lý đơn hàng

### Routes (src/routes/)
- **auth.js**: Routes xác thực (/api/auth/*)
- **categories.js**: Routes danh mục (/api/categories/*)
- **menu-items.js**: Routes món ăn (/api/menu-items/*)
- **cart.js**: Routes giỏ hàng (/api/cart/*)
- **orders.js**: Routes đơn hàng (/api/orders/*)

### Middlewares (src/middlewares/)
- **auth.js**: JWT authentication và authorization
- **upload.js**: Xử lý upload file hình ảnh

## API Endpoints

### Authentication (/api/auth)
- `POST /register` - Đăng ký
- `POST /login` - Đăng nhập
- `GET /profile` - Lấy thông tin profile
- `PUT /profile/:id` - Cập nhật profile
- `PUT /change-password` - Đổi mật khẩu

### Categories (/api/categories)
- `GET /` - Lấy tất cả danh mục
- `POST /` - Tạo danh mục mới (Admin)
- `PUT /:id` - Cập nhật danh mục (Admin)
- `DELETE /:id` - Xóa danh mục (Admin)

### Menu Items (/api/menu-items)
- `GET /` - Lấy tất cả món ăn
- `GET /:id` - Lấy món ăn theo ID
- `POST /` - Tạo món ăn mới (Admin)
- `PUT /:id` - Cập nhật món ăn (Admin)
- `DELETE /:id` - Xóa món ăn (Admin)

### Cart (/api/cart)
- `GET /:userId` - Lấy giỏ hàng của user
- `POST /` - Thêm món vào giỏ hàng
- `PUT /:id` - Cập nhật số lượng
- `DELETE /:id` - Xóa món khỏi giỏ hàng
- `DELETE /clear/:userId` - Xóa toàn bộ giỏ hàng

### Orders (/api/orders)
- `POST /` - Tạo đơn hàng mới
- `GET /user/:userId` - Lấy đơn hàng của user
- `GET /details/:orderId` - Lấy chi tiết đơn hàng
- `GET /` - Lấy tất cả đơn hàng (Admin)
- `PUT /:orderId/status` - Cập nhật trạng thái (Admin)
- `GET /stats` - Thống kê đơn hàng (Admin)

## Chạy ứng dụng

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Health Check
```
GET http://localhost:3000/health
```

## Lợi ích của cấu trúc mới

1. **Separation of Concerns**: Mỗi layer có trách nhiệm riêng biệt
2. **Maintainability**: Code dễ bảo trì và debug
3. **Scalability**: Dễ mở rộng thêm tính năng mới
4. **Testability**: Dễ viết unit test cho từng component
5. **Code Reusability**: Models và middlewares có thể tái sử dụng
6. **Clean Architecture**: Tuân thủ nguyên tắc clean code

## Migration từ server.js cũ

File `server.js` cũ vẫn được giữ lại để tham khảo. Sau khi test kỹ, có thể xóa file này.

Các thay đổi chính:
- Tách logic thành Models, Controllers, Routes
- Middleware authentication riêng biệt
- Error handling tập trung
- Configuration tách riêng
- Cấu trúc thư mục chuẩn MVC
