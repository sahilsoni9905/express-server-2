import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Password = mongoose.model('Password', passwordSchema);

export default Password;