import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  value: {
    type: String,
    required: [true, 'Service slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  icon: {
    type: String,
    default: 'fas fa-paw'
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  tag: {
    type: String,
    default: 'Service'
  },
  duration: {
    type: String,
    default: '30-60'
  },
  included: [{
    name: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, default: 'fas fa-check' }
  }],
  process: [{
    step: { type: Number, required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true }
  }],
  addons: [{
    addonId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    icon: { type: String, default: 'fas fa-plus' }
  }],
  isActive: {
    type: Boolean,
    default: true
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

serviceSchema.index({ value: 1 });
serviceSchema.index({ isActive: 1, isDeleted: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
