import express from 'express';
import Shop from '../models/Shop.js';

const router = express.Router();

// Get all shops
router.get('/', async (req, res) => {
  console.log('Fetching all shops');
  
  try {
    // We'll use fixed shops for this application
    const shops = [
      { _id: 'shop1', name: 'Prakash' },
      { _id: 'shop2', name: 'Vikash' }
    ];
    
    res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop by id
router.get('/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    // Fixed shops
    const shops = {
      'shop1': { _id: 'shop1', name: 'Prakash' },
      'shop2': { _id: 'shop2', name: 'Vikash' }
    };
    
    const shop = shops[shopId];
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    res.status(200).json(shop);
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;