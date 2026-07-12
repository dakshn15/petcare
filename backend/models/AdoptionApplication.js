import mongoose from 'mongoose';

const adoptionApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    default: null
  },
  petType: {
    type: String,
    required: [true, 'Pet type is required']
  },
  breed: {
    type: String,
    default: ''
  },
  ageRange: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason for adoption is required']
  },
  status: {
    type: String,
    enum: ['Under Review', 'Approved', 'Rejected'],
    default: 'Under Review'
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

// Auto-generate applicationId
adoptionApplicationSchema.pre('save', function (next) {
  if (!this.applicationId) {
    this.applicationId = 'AD-' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

adoptionApplicationSchema.index({ user: 1 });
adoptionApplicationSchema.index({ status: 1 });
adoptionApplicationSchema.index({ createdAt: -1 });

const AdoptionApplication = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
export default AdoptionApplication;
