// index.js
const express = require("express");
const sequelize = require("./config/database");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors")
const authRoutes = require("./routes/authroutes"); // 👈 importa las rutas de auth
const User = require("./models/UserModel");
const Category = require("./models/CategoryModel");
const Incomes = require("./models/IncomesModel");
const Expenses = require("./models/ExpensesModel");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Rutas
app.use("/api/auth", authRoutes);

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
    await sequelize.authenticate();
    console.log("Conexión establecida con éxito a:", process.env.DB_NAME);

    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la BD:", error);
  }
})();
