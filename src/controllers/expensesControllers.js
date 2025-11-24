const { validationResult } = require("express-validator");
const Exp = require("../models/ExpensesModel");
const Category = require("../models/CategoryModel");

// Crear gasto
exports.expReg = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, date, desc, category_id } = req.body; // <-- usar 'desc' del body
    const exp = await Exp.create({ 
      amount, 
      date, 
      desc: desc,
      user_id: req.user.id, 
      category_id 
    });

    res.status(201).json({ success: true, message: "Gasto registrado con éxito", data: exp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Obtener todos los gastos del usuario
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Exp.findAll({ 
      where: { user_id: req.user.id }, 
      include: [{ model: Category, as: 'category' }] 
    });
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Actualizar gasto
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const exp = await Exp.findOne({ where: { id, user_id: req.user.id } });
    if (!exp) return res.status(404).json({ success: false, message: "Gasto no encontrado" });

    const { amount, date, desc, category_id } = req.body; // <-- usar 'desc'
    await exp.update({ 
      amount, 
      date, 
      desc: desc, 
      category_id 
    });

    res.status(200).json({ success: true, message: "Gasto actualizado", data: exp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Eliminar gasto
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const exp = await Exp.findOne({ where: { id, user_id: req.user.id } });
    if (!exp) return res.status(404).json({ success: false, message: "Gasto no encontrado" });

    await exp.destroy();
    res.status(200).json({ success: true, message: "Gasto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
