const express = require("express");
const { body } = require("express-validator");
const expensesController = require("../controllers/expensesControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Ruta para registrar gasto
router.post(
  "/expReg",
  [
    body("amount").notEmpty().withMessage("El usuario es obligatorio"),
    body("date").isDate().withMessage("Email inválido"),
    body("desc").notEmpty().withMessage("Mínimo 6 caracteres")
  ],
  authMiddleware,
  expensesController.expReg
);

router.get("/getExpenses", expensesController.getExpenses);

module.exports = router;