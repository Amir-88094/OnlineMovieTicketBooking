const Ticket = require("../models/ticket.js");


const viewTicket = async (req, res) => {
    try{
        const { reservationId } = req.params;
    const ticket = await db.Tickets.findOne({ where: { reservationId } });

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json(ticket);

    }catch(err){
        res.status(500).json({ error: err.message });
    }
};


const cancelTicket = async (req, res) => {
    try {
    const { reservationId, noOfSeats } = req.body;

    const ticket = await db.Tickets.findOne({ where: { reservationId } });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const refundAmount = ticket.pricePerSeat * noOfSeats;

    const card = await db.CreditCardDetails.findOne({
      where: { creditCardNumber: ticket.creditCardNumber },
    });

    card.balance += refundAmount;
    await card.save();

    ticket.noOfSeats -= noOfSeats;
    await ticket.save();

    res.json({ message: "Ticket cancelled", refundAmount, updatedBalance: card.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}