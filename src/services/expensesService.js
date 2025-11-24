const Expenses = require('../models/ExpensesModel');
const Category = require('../models/CategoryModel');

async function createExpense({ amount, date, desc, user_id, category_id }) {
  // validar category existe
  if (category_id) {
    const cat = await Category.findByPk(category_id);
    if (!cat) {
      const err = new Error('Category not found');
      err.status = 400;
      throw err;
    }
  }

  const expense = await Expenses.create({
    amount,
    date,
    desc,
    user_id,
    category_id,
  });

  return expense;
}

async function getExpensesByUser(user_id) {
  return await Expenses.findAll({
    where: { user_id },
    order: [['date', 'DESC']],
  });
}

module.exports = {
  createExpense,
  getExpensesByUser,
};