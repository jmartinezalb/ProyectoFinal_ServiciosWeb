const Expenses = require("../models/ExpensesModel");
const Incomes = require("../models/IncomesModel");
const Category = require("../models/CategoryModel");

/**
 * @swagger
 * tags:
 *   name: Balance
 *   description: Resumen financiero del usuario
 */

/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Obtener resumen financiero del usuario (ingresos, gastos y balance)
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen financiero
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Resumen financiero
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 5000
 *                     totalExpenses:
 *                       type: number
 *                       example: 3000
 *                     balance:
 *                       type: number
 *                       example: 2000
 *                     incomes:
 *                       type: array
 *                       items:
 *                         type: object
 *                     expenses:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Error interno del servidor
 */
exports.getBalance = async (req, res) => {
  try {
    const incomes = await Incomes.findAll({ where: { user_id: req.user.id } });
    const expenses = await Expenses.findAll({ where: { user_id: req.user.id }, include: [Category] });

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
