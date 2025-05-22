import express from 'express';
import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import mongoose from 'mongoose';

const router = express.Router({ mergeParams: true });

// Get all transactions for a customer
router.get('/', async (req, res) => {
  try {
    const { shopId, customerId } = req.params;
    
    // Validate customer belongs to shop
    const customer = await Customer.findOne({
      _id: customerId,
      shopId
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Get transactions sorted by date (newest first)
    const transactions = await Transaction.find({
      shopId,
      customerId
    }).sort({ date: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new transaction
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { shopId, customerId } = req.params;
    const { amount, type, description, date } = req.body;
    
    // Validate inputs
    if (!amount || !type || !description || !date) {
      return res.status(400).json({ message: 'Amount, type, description, and date are required' });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    
    if (!['DEBIT', 'CREDIT'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either DEBIT or CREDIT' });
    }
    
    // Find customer
    const customer = await Customer.findOne({
      _id: customerId,
      shopId
    }).session(session);
    
    if (!customer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Create transaction
    const newTransaction = new Transaction({
      shopId,
      customerId,
      amount,
      type,
      description,
      date: new Date(date)
    });
    
    await newTransaction.save({ session });
    
    // Update customer balance
    // For DEBIT: increase balance (customer takes money)
    // For CREDIT: decrease balance (customer gives money)
    const balanceChange = type === 'DEBIT' ? amount : -amount;
    
    customer.balance += balanceChange;
    await customer.save({ session });
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json(newTransaction);
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;