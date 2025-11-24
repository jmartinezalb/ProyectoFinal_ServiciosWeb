const express = require("express");
const reportsController = require("../controllers/reportsControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Endpoint de balance/resumen
router.get("/balance", authMiddleware, reportsController.getBalance);

module.exports = router;
