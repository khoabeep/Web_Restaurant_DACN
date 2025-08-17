const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log(`🔐 [AUTH] Authorization header:`, authHeader ? 'Present' : 'Missing');

  if (!token) {
    return res.status(401).json({ message: 'Thiếu access token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ [AUTH] Verify error:', err.message);
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    // decoded kỳ vọng: { userId, email, isAdmin }
    req.user = {
      userId: Number(decoded.userId),
      email: decoded.email,
      isAdmin: !!decoded.isAdmin
    };

    console.log('✅ [AUTH] decoded user:', req.user);
    next();
  });
};

// Middleware kiểm tra quyền admin (nếu cần)
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Cần quyền admin để truy cập' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
