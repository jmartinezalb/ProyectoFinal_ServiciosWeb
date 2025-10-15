const { validationResult } = require("express-validator");
const Exp = require("../models/ExpensesModel");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");

exports.expReg = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, date, desc, category_id } = req.body;
    const exp = await Exp.create({ amount, date, desc, user_id: req.user.id, category_id: req.body.category_id });

    res.status(201).json({ message: "Gasto registrado con exito.", exp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Exp.findAll({ where: { user_id: req.user.id }, include: [Category] });
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};