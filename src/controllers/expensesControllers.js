const { validationResult } = require("express-validator");
const Exp = require("../models/ExpensesModel");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");
const expensesService = require('../services/expensesService');

exports.expReg = async (req, res) => {
  const { amount, date, desc, category_id } = req.body;
    const user_id = req.user.id;
    expensesService.createExpense({ amount, date, desc, user_id, category_id })
        .then(expense => res.status(201).json({ message: 'Gasto registrado con éxito.', expense }))
        .catch(next);
};

exports.getExpenses = async (req, res) => {
    const user_id = req.user.id;
    expensesService.getExpensesByUser(user_id)
        .then(expenses => res.json({ expenses }))
        .catch(next);
};