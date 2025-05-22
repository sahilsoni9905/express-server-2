import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router({ mergeParams: true });

// Get all customers for a shop
router.get('/', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    const customers = await Customer.find({ shopId }).sort({ name: 1 });
    
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search customers
router.get('/search', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Search by name or phone
    const customers = await Customer.find({
      shopId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).sort({ name: 1 });
    
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer by id
router.get('/:customerId', async (req, res) => {
  try {
    const { shopId, customerId } = req.params;
    
    const customer = await Customer.findOne({
      _id: customerId,
      shopId
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { name, phone } = req.body;
    
    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }
    
    // Check if customer with same phone already exists
    const existingCustomer = await Customer.findOne({
      shopId,
      phone
    });
    
    if (existingCustomer) {
      return res.status(400).json({ message: 'A customer with this phone number already exists' });
    }
    
    // Create new customer
    const newCustomer = new Customer({
      shopId,
      name,
      phone,
      balance: 0
    });
    
    await newCustomer.save();
    
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;