const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  trxId: {
    type: String,
    required: true,
    unique: true // Ensure trxId is always unique
  },
  type: {
    type: String,
    required: true,
    enum: ["deposit", "withdraw", "transfer", "referral", "purchase"], // Optional: Restrict to specific types
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  gateway: {
    type: String,
    required: true // optional, can be bank, PayPal, etc.
  },
  amount: {
    type: String,
    required: true // optional, can be bank, PayPal, etc.
  },
  status: {
    type: String,
    required: true // optional, can be bank, PayPal, etc.
  },
  fees: {
    type: String,
    required: true // optional, can be bank, PayPal, etc.
  },
}, { timestamps: true }); // includes createdAt

const Transactions = mongoose.model('Transactions', TransactionSchema);

module.exports = Transactions;
