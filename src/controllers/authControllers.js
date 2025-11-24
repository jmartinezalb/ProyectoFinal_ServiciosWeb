const { validationResult } = require("express-validator");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas de autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan123
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Error de validación o usuario/email ya registrado
 *       500:
 *         description: Error interno del servidor
 */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@mail.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Credenciales inválidas o error de validación
 *       500:
 *         description: Error interno del servidor
 */
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
};
