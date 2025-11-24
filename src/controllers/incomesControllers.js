const { validationResult } = require("express-validator");
const Income = require("../models/IncomesModel");

exports.incomeReg = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, date, desc } = req.body;
    const income = await Income.create({ amount, date, desc, user_id: req.user.id });
    res.status(201).json({ success: true, message: "Ingreso registrado con éxito", data: income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { user_id: req.user.id } });
    res.status(200).json({ success: true, data: incomes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findOne({ where: { id, user_id: req.user.id } });
    if (!income) return res.status(404).json({ success: false, message: "Ingreso no encontrado" });

    const { amount, date, desc } = req.body;
    await income.update({ amount, date, desc });
    res.status(200).json({ success: true, message: "Ingreso actualizado", data: income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findOne({ where: { id, user_id: req.user.id } });
    if (!income) return res.status(404).json({ success: false, message: "Ingreso no encontrado" });

    await income.destroy();
    res.status(200).json({ success: true, message: "Ingreso eliminado" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
