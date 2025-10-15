const { validationResult } = require("express-validator");
const Category = require("../models/CategoryModel");

exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
    const {catname, desc} = req.body;
    const category = await Category.create({ catname, desc, user_id: req.user.id });
    res.status(201).json({ message: "Categoría creada con éxito", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
    try {
        const category = await Category.findAll({ where: { user_id: req.user.id }});
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};