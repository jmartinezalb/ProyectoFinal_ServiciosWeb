const Category = require('../models/CategoryModel');

async function createCategory(data) {
  return await Category.create(data);
}

async function getAllCategories() {
  return await Category.findAll({ order: [['name', 'ASC']] });
}

module.exports = {
  createCategory,
  getAllCategories,
};