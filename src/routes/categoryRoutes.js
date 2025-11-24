const express = require("express");
const { body } = require("express-validator");
const categoryControllers = require("../controllers/categoryControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Crear categoría
router.post(
  "/",
  [
    body("catname").notEmpty().withMessage("El nombre es obligatorio"),
    body("desc").notEmpty().withMessage("La descripción es obligatoria")
  ],
  authMiddleware,
  categoryControllers.createCategory
);

// Obtener todas las categorías
router.get("/", authMiddleware, categoryControllers.getCategories);

// Obtener categoría por id
router.get("/:id", authMiddleware, categoryControllers.getCategoryById);

// Actualizar categoría
router.put(
  "/:id",
  [
    body("catname").optional().notEmpty().withMessage("El nombre es obligatorio"),
    body("desc").optional().notEmpty().withMessage("La descripción es obligatoria")
  ],
  authMiddleware,
  categoryControllers.updateCategory
);

// Eliminar categoría
router.delete("/:id", authMiddleware, categoryControllers.deleteCategory);

module.exports = router;
