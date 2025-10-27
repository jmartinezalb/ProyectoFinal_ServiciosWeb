const express = require('express');
const router = express.Router();
const incomesController = require('../controllers/incomesControllers');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/incReg', authMiddleware, incomesController.incReg);
router.get('/getIncomes', authMiddleware, incomesController.getIncomes);

module.exports = router;