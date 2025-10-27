const sequelize = require('./config/database');
const User = require('./models/UserModel');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('BD conectada correctamente');

    const user = await User.create({
      username: 'testuser',
      email: 'test@correo.com',
      password: '123456'
    });

    console.log('Usuario creado:', user.toJSON());
  } catch (err) {
    console.error('Error al crear usuario:', err);
  }
})();
