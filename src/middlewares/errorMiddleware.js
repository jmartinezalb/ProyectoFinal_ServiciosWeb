function errorMiddleware(err, req, res, next) {
    console.error(err.stack); // Log en consola para desarrollo
  
    const statusCode = err.status || 500; 
    const message = err.message || "Error interno del servidor";
  
    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    });
  }
  
  module.exports = errorMiddleware;
  