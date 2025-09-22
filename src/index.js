// index.js
const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authroutes"); // 👈 importa las rutas de auth
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", authRoutes);

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
