const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token requerido o mal formado',
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
        timestamp: new Date().toISOString()
      });
    }
    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = authMiddleware;
