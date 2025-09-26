const crypto = require("crypto");
const axios = require("axios");
const CreditCardDetails = require("../models/creditCardDetails.js");

const makePayment = async (req, res) => {
    try{
        const {creditCardNumber, totalCharges} = req.body;

        let card = await CreditCardDetails.findOne({creditCardNumber});
        if(!card){
            return res.status(404).json({msg: "Card not found"});
        }

         if (card.balance < totalCharges) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

     card.balance -= totalCharges;
    await card.save();
    res.json({ message: "Payment successful", updatedBalance: card.balance });

    }catch(err){
        res.status(500).json({ error: err.message });

    }
}

module.exports = { newPayment, checkStatus };



