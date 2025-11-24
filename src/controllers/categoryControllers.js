const { validationResult } = require("express-validator");
const Category = require("../models/CategoryModel");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías de usuario
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catname
 *               - desc
 *             properties:
 *               catname:
 *                 type: string
 *                 example: Alimentación
 *               desc:
 *                 type: string
 *                 example: Gastos de comida y supermercado
 *     responses:
 *       201:
 *         description: Categoría creada con éxito
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { catname, desc } = req.body;
    const category = await Category.create({ catname, desc, user_id: req.user.id });

    res.status(201).json({ success: true, message: "Categoría creada con éxito", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías del usuario
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       500:
 *         description: Error interno del servidor
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { user_id: req.user.id } });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!category) return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar categoría por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catname:
 *                 type: string
 *               desc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.updateCategory = async (req, res) => {
  try {
    const { catname, desc } = req.body;
    const category = await Category.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!category) return res.status(404).json({ success: false, message: "Categoría no encontrada" });

    await category.update({ catname, desc });
    res.json({ success: true, message: "Categoría actualizada", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar categoría por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!category) return res.status(404).json({ success: false, message: "Categoría no encontrada" });

    await category.destroy();
    res.json({ success: true, message: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
