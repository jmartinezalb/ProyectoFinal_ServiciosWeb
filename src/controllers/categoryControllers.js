const { validationResult } = require("express-validator");
const Category = require("../models/CategoryModel");

// Crear categoría
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

// Obtener todas las categorías de un usuario
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { user_id: req.user.id } });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Obtener categoría por id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!category) return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Actualizar categoría
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

// Eliminar categoría
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
