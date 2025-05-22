import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  shopId: {
    type: String,
    required: true,
    index: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['DEBIT', 'CREDIT'], // DEBIT: customer takes money, CREDIT: customer gives money
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;