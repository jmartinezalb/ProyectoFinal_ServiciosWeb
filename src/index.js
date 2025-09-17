const sequelize = require("./config/database");
const User = require("./models/User");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con éxito a:", process.env.DB_NAME);

    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados");

  } catch (error) {
    console.error("Error al conectar con la BD:", error);
  }
})();
