// routes/authRoutes.js
const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

// Ruta para registrar usuario
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("El usuario es obligatorio"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres")
  ],
  authController.register
);
//faltan los throws de errores + await y valiaciones de cadenas
// Ruta para login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria")
  ],
  authController.login
);

module.exports = router;
