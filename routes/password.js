import express from 'express';
import Password from '../models/Password.js';

const router = express.Router();

// Match password
router.post('/match', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    // Get the latest password from database
    const latestPassword = await Password.findOne().sort({ createdAt: -1 });
    
    if (!latestPassword) {
      return res.status(404).json({ message: 'No password set' });
    }
    
    // Check if password matches
    const isMatch = password === latestPassword.password;
    
    res.status(200).json({ isMatch });
  } catch (error) {
    console.error('Error matching password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.post('/change', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }
    
    // Get the latest password
    const latestPassword = await Password.findOne().sort({ createdAt: -1 });
    
    if (!latestPassword) {
      return res.status(404).json({ message: 'No password set' });
    }
    
    // Check if old password matches
    if (oldPassword !== latestPassword.password) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    
    // Create new password
    const password = new Password({
      password: newPassword
    });
    
    await password.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;