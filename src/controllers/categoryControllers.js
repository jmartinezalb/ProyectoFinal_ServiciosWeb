const { validationResult } = require("express-validator");
const Category = require("../models/CategoryModel");
const categoryService = require('../services/categoryService');

exports.createCategory = async (req, res) => {
  const data = req.body;
    categoryService.createCategory(data).then(category => res.status(201).json({ message: 'Categoría creada', category })).catch(next);
};

exports.getCategories = async (req, res) => {
    categoryService.getAllCategories().then(categories => res.json({ categories })).catch(next);
};