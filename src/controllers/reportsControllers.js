const Expenses = require("../models/ExpensesModel");
const Incomes = require("../models/IncomesModel");
const Category = require("../models/CategoryModel");

exports.getBalance = async (req, res) => {
  try {
    // Obtener todos los ingresos y gastos del usuario
    const incomes = await Incomes.findAll({ where: { user_id: req.user.id } });
    const expenses = await Expenses.findAll({ where: { user_id: req.user.id }, include: [Category] });

    // Sumar montos
    const totalIncome = incomes.reduce((acc, inc) => acc + parseFloat(inc.amount), 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
    const balance = totalIncome - totalExpenses;

    res.status(200).json({
      success: true,
      message: "Resumen financiero",
      data: {
        totalIncome,
        totalExpenses,
        balance,
        incomes,
        expenses
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
