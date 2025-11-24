const express = require("express");
const { body } = require("express-validator");
const expensesController = require("../controllers/expensesControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Crear gasto
router.post(
  "/",
  [
    body("amount").notEmpty().withMessage("El monto no debe estar vacio"),
    body("date").isDate().withMessage("Formato de fecha invalido"),
    body("desc").notEmpty().withMessage("La descripcion no puede estar vacia")
  ],
  authMiddleware,
  expensesController.expReg
);

// Obtener todos los gastos del usuario
router.get("/", authMiddleware, expensesController.getExpenses);

// Actualizar gasto
router.put("/:id", authMiddleware, expensesController.updateExpense);

// Eliminar gasto
router.delete("/:id", authMiddleware, expensesController.deleteExpense);

module.exports = router;
