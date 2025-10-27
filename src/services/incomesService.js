const Incomes = require('../models/IncomesModel');

async function createIncome({ amount, date, desc, user_id }) {
  if (amount == null || date == null || desc == null) {
    const err = new Error('Faltan campos requeridos: amount, date o desc');
    err.status = 400;
    throw err;
  }

  const income = await Incomes.create({
    amount,
    date,
    desc,
    user_id,
  });

  return income;
}

async function getIncomesByUser(user_id) {
  return await Incomes.findAll({
    where: { user_id },
    order: [['date', 'DESC']],
  });
}

module.exports = {
  createIncome,
  getIncomesByUser,
};