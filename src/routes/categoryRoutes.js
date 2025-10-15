const express = require("express");
const { body } = require("express-validator");
const categoryControllers = require("../controllers/categoryControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Ruta para registrar gasto
router.post(
  "/createCategory",
  [
    body("catname").notEmpty().withMessage("El nombre es obligatorio"),
    body("desc").notEmpty().withMessage("La descripción es obligatoria")
  ],
  authMiddleware,
  categoryControllers.createCategory
);

router.get("/getCategories", categoryControllers.getCategories);

module.exports = router;