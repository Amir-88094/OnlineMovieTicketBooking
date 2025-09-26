const express = require("express");
const router = express.Router();
const { makePayment, checkStatus } = require("../controllers/paymentController.js");
const { authMiddleware } = require("../middlewares/authMiddlewares.js");

router.post("/makePayment", authMiddleware, makePayment);
router.post('/status/:txnId', authMiddleware, checkStatus);

module.exports = router;