import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  shopId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search
customerSchema.index({ name: 'text', phone: 'text' });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;