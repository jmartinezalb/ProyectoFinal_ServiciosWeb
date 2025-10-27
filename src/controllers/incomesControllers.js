const incomesService = require('../services/incomesService');

exports.incReg = (req, res, next) => {
  const { amount, date, desc } = req.body;
  const user_id = req.user.id;
  incomesService.createIncome({ amount, date, desc, user_id })
    .then(income => res.status(201).json({ message: 'Ingreso registrado con éxito.', income }))
    .catch(next);
};

exports.getIncomes = (req, res, next) => {
  const user_id = req.user.id;
  incomesService.getIncomesByUser(user_id)
    .then(incomes => res.json({ incomes }))
    .catch(next);
};