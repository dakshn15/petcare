import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['dog', 'cat', 'rabbit', 'bird', 'other']
  },
  breed: {
    type: String,
    trim: true,
    default: ''
  },
  age: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female', ''],
    default: ''
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra-large', ''],
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Available', 'Adopted', 'Pending'],
    default: 'Available'
  },
  price: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

petSchema.index({ status: 1, isDeleted: 1 });
petSchema.index({ type: 1 });

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
