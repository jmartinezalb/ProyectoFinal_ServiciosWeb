const express = require('express');
const cors = require('cors');
//const userRoutes = require('./routes/userRoutes');
const sequelize = require('./src/config/databases'); 
requiere('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Conectar base de datos
sequelize.sync()
  .then(() => console.log("DB is ready"))
  .catch(err => console.error(err));

/* Routes
app.use('/api/users', userRoutes);
Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servicio funcionando' });
});*/

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.use(routes.unprotectedRoutes);