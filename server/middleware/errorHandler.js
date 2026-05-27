/* middleware centralizado para manejo de errores */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // log del error para debugging
  console.error('Error:', err);

  // error de validacion de mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join(', ');
    error = {
      statusCode: 400,
      message: message
    };
  }

  // error de id invalido de mongoose
  if (err.name === 'CastError') {
    error = {
      statusCode: 400,
      message: 'Resource not found - Invalid ID'
    };
  }

  // error de duplicado - codigo 11000
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      statusCode: 400,
      message: `The ${field} already exists`
    };
  }

  // error de JWT
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Invalid token'
    };
  }

  // error de token expirado
  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 401,
      message: 'Token expired'
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/* middleware para rutas no encontradas */
const notFound = (req, res, next) => {
  const error = new Error(`Rute not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/* clase de error personalizada */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {
  errorHandler,
  notFound,
  ErrorResponse
};