// src/app.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { setupMorgan } = require("./config/logger");

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// ------------------- Evitar cache en páginas sensibles -------------------
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Middlewares globales
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
setupMorgan(app, process.env.NODE_ENV || 'development');

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Finanzas Personales',
      version: '1.0.0',
      description: 'API para gestionar gastos, ingresos y categorías',
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};
const specs = swaggerJsdoc(swaggerOptions);

// Registrar Swagger **antes** de las rutas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
const authRoutes = require("./routes/authRoutes");
const expensesRoutes = require("./routes/expensesRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const incomesRoutes = require("./routes/incomesRoutes");
const reportsRoutes = require("./routes/reportsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/incomes", incomesRoutes); 
app.use("/api/reports", reportsRoutes);

// Health check simple
app.get("/", (req, res) => {
  res.status(200).send("Servidor funcionando correctamente");
});

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Middleware global de errores
const errorMiddleware = require("./middlewares/errorMiddleware"); 
app.use(errorMiddleware);

module.exports = app;
