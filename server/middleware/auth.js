const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* middleware para proteger rutas que requieren autenticacion */
const protect = async (req, res, next) => {
  try {
    let token;

    // verifica si el token viene en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // verifica si el token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Token not provided.'
      });
    }

    // verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // busca el usuario por id del token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Deactivated user account'
      });
    }

    // agrega al usuario a req para uso en controladores
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error in authentication middleware'
    });
  }
};

/* middleware para verificar roles especificos */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' not authorized to access this resource`
      });
    }

    next();
  };
};

/* middleware opcional de autenticacion - continua sin error si no hay token */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // en caso de error simplemente continua sin autenticar al usuario
    next();
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth
};