const { validationResult } = require("express-validator");
const Exp = require("../models/ExpensesModel");
const Category = require("../models/CategoryModel");

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Gestión de gastos del usuario
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Registrar un nuevo gasto
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - date
 *               - desc
 *               - category_id
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 300
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-24
 *               desc:
 *                 type: string
 *                 example: Compra de alimentos
 *               category_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Gasto registrado con éxito
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
exports.expReg = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, date, desc, category_id } = req.body;
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

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Obtener todos los gastos del usuario
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de gastos
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Actualizar gasto por ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 350
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-25
 *               desc:
 *                 type: string
 *                 example: Compra actualizada
 *               category_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Gasto actualizado
 *       404:
 *         description: Gasto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const exp = await Exp.findOne({ where: { id, user_id: req.user.id } });
    if (!exp) return res.status(404).json({ success: false, message: "Gasto no encontrado" });

    const { amount, date, desc, category_id } = req.body;
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

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Eliminar gasto por ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gasto eliminado
 *       404:
 *         description: Gasto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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
