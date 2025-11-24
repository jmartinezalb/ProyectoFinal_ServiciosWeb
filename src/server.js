// src/server.js
console.log("Iniciando servidor...");
require("dotenv").config();
const sequelize = require("./config/database");
const app = require("./app");

// Importar modelos
const User = require("./models/UserModel");
const Category = require("./models/CategoryModel");
const Expenses = require("./models/ExpensesModel");
const Incomes = require("./models/IncomesModel");

// Definir asociaciones
User.hasMany(Category, { foreignKey: "user_id", as: "category" });
User.hasMany(Expenses, { foreignKey: "user_id", as: "expenses" });
User.hasMany(Incomes, { foreignKey: "user_id", as: "incomes" });

Category.hasMany(Expenses, { foreignKey: "category_id", as: "expenses" });
Category.belongsTo(User, { foreignKey: "user_id", as: "user" });

Expenses.belongsTo(User, { foreignKey: "user_id", as: "user" });
Expenses.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Incomes.belongsTo(User, { foreignKey: "user_id", as: "user" });

const PORT = process.env.PORT || 3000;

// Conexión a la base de datos y levantamiento del servidor
(async () => {
  try {
    console.log("Intentando conectar con la base de datos...");
    await sequelize.authenticate();
    console.log("Conexión establecida con éxito a:", process.env.DB_NAME);

    // <- Las asociaciones ya están definidas aquí
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados");

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("Error al conectar con la BD:", error);
    process.exit(1);
  }
})();

