const express = require("express");
const { body } = require("express-validator");
const expensesController = require("../controllers/expensesControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Ruta para registrar gasto
router.post(
  "/expReg",
  [
    body("amount").notEmpty().withMessage("El monto no debe estar vacio"),
    body("date").isDate().withMessage("Formato de fecha invalido"),
    body("desc").notEmpty().withMessage("La descripcion no puede estar vacia")
  ],
  authMiddleware,
  expensesController.expReg
);

router.get("/getExpenses", expensesController.getExpenses);

module.exports = router;