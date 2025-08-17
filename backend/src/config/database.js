const mysql = require('mysql2');
require('dotenv').config();

// Cấu hình kết nối cơ sở dữ liệu
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'food_ordering',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Tạo pool kết nối database với promise support
const pool = mysql.createPool(dbConfig);
const db = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Kết nối cơ sở dữ liệu thất bại:', err);
    console.error('Vui lòng đảm bảo MySQL đang chạy và database đã tồn tại.');
    console.error('Chạy: mysql -u root -p -e "CREATE DATABASE food_ordering;"');
    console.error('Sau đó import: mysql -u root -p food_ordering < food_ordering.sql');
    return;
  }
  console.log('Đã kết nối đến cơ sở dữ liệu MySQL');
  connection.release();
});

module.exports = db;
