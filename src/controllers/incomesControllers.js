const { validationResult } = require("express-validator");
const Income = require("../models/IncomesModel");

/**
 * @swagger
 * tags:
 *   name: Incomes
 *   description: Gestión de ingresos del usuario
 */

/**
 * @swagger
 * /api/incomes:
 *   post:
 *     summary: Registrar un nuevo ingreso
 *     tags: [Incomes]
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
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-24
 *               desc:
 *                 type: string
 *                 example: Pago de nómina
 *     responses:
 *       201:
 *         description: Ingreso registrado con éxito
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /api/incomes:
 *   get:
 *     summary: Obtener todos los ingresos del usuario
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ingresos
 *       500:
 *         description: Error interno del servidor
 */
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { user_id: req.user.id } });
    res.status(200).json({ success: true, data: incomes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @swagger
 * /api/incomes/{id}:
 *   put:
 *     summary: Actualizar ingreso por ID
 *     tags: [Incomes]
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
 *                 example: 550
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-11-25
 *               desc:
 *                 type: string
 *                 example: Pago de nómina actualizado
 *     responses:
 *       200:
 *         description: Ingreso actualizado
 *       404:
 *         description: Ingreso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /api/incomes/{id}:
 *   delete:
 *     summary: Eliminar ingreso por ID
 *     tags: [Incomes]
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
 *         description: Ingreso eliminado
 *       404:
 *         description: Ingreso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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
