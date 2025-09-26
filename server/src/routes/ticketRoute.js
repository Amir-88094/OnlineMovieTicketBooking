const express = require("express");
const router = express.Router();
const {viewTicket, cancelTicket} = require("../controllers/ticketController");
const { authMiddleware } = require("../middlewares/authMiddlewares.js");

router.get("/tickets/:reservationId", authMiddleware, viewTicket);
router.post("/cancelTicket", authMiddleware, cancelTicket);

module.exports = router;
