
import mongoose from "mongoose";
const creditCardDetailsSchema = new mongoose.Schema({
  creditCardNumber: {
    type: Number,
    required: true,
    unique: true
  },
  validFrom: {
    type: Date,
  },
  validTo: {
    type: Date,
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  }
}, {
  timestamps: true
});

const CreditCardDetails = mongoose.model("CreditCardDetails", creditCardDetailsSchema);

export default CreditCardDetails;
