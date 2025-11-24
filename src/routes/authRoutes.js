const express = require("express");
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authControllers");

const router = express.Router();

// Ruta para registrar usuario
router.post(
  "/register",
  [
    body("username")
      .trim()
      .notEmpty().withMessage("El usuario es obligatorio")
      .isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),
    body("email")
      .trim()
      .isEmail().withMessage("Email inválido"),
    body("password")
      .trim()
      .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await authController.register(req, res);
    } catch (err) {
      res.status(500).json({ error: "Error al registrar el usuario", details: err.message });
    }
  }
);

// Ruta para login
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail().withMessage("Email inválido"),
    body("password")
      .trim()
      .notEmpty().withMessage("La contraseña es obligatoria")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      await authController.login(req, res);
    } catch (err) {
      res.status(500).json({ error: "Error al iniciar sesión", details: err.message });
    }
  }
);

module.exports = router;
