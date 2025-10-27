// index.js
const express = require("express");
const sequelize = require("./config/database");
const helmet = require("helmet");
const cors = require("cors");
const { setupMorgan } = require("./config/logger");
const authRoutes = require("./routes/authroutes");
const expensesRoutes = require("./routes/expensesRoutes"); 
const categoryRoutes = require("./routes/categoryRoutes"); 
const User = require("./models/UserModel");
const Category = require("./models/CategoryModel");
const Incomes = require("./models/IncomesModel");
const Expenses = require("./models/ExpensesModel");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Configurar Morgan según el entorno
setupMorgan(app, process.env.NODE_ENV || 'development');

// Rutas
// index.js
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // sirve todos los archivos estáticos
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/category", categoryRoutes);


// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send(`
    <h1> Servidor funcionando correctamente</h1>
    <p>Base de datos conectada a <b>${process.env.DB_NAME}</b></p>
    <p>Entorno: <b>${process.env.NODE_ENV || 'development'}</b></p>
    <p><a href="/health">Ir al health check</a></p>
  `);
});


// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Definir asociaciones
User.hasMany(Category, { foreignKey: "user_id", as: "categories" });
User.hasMany(Incomes, { foreignKey: "user_id", as: "incomes" });
User.hasMany(Expenses, { foreignKey: "user_id", as: "expenses" });
Category.hasMany(Expenses, { foreignKey: "category_id", as: "expenses" })
Category.belongsTo(User, { foreignKey: "user_id", as: "user" });
Incomes.belongsTo(User, { foreignKey: "user_id", as: "user" });
Expenses.belongsTo(User, { foreignKey: "user_id", as: "user" });
Expenses.belongsTo(Category, { foreignKey: "category_id", as: "expenses" });


// Conexión a la base de datos y sincronización de modelos
(async () => {
  try {
    console.log("Intentando conectar con la base de datos...");
    await sequelize.authenticate();
    console.log("Conexión establecida con éxito a:", process.env.DB_NAME);

    await sequelize.sync();
    console.log("Modelos sincronizados");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log("Servidor iniciado exitosamente");
      console.log('URL: http://localhost:${PORT}');
      console.log("Entorno: ${process.env.NODE_ENV || 'development'}");
      console.log('Health check: http://localhost:${PORT}/health');
      console.log("Logs de acceso disponibles en: ./logs/");
    });
  } catch (error) {
    console.error("Error al conectar con la BD:", error);
    process.exit(1);
  }
})();
