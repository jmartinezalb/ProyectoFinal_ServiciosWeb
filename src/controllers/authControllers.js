const { validationResult } = require("express-validator");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// Registro de usuario
exports.register = async (req, res) => {
  // Validación de errores de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    // Verificar si el email o username ya existen
    const existingUser = await User.findOne({ 
      where: { 
        username 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Crear usuario
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
};
