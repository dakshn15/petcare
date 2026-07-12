import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  serviceLabel: {
    type: String,
    required: true
  },
  petName: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  petType: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['dog', 'cat', 'other']
  },
  petSize: {
    type: String,
    enum: ['small', 'medium', 'large', 'xlarge', ''],
    default: ''
  },
  date: {
    type: String,
    required: [true, 'Booking date is required']
  },
  time: {
    type: String,
    enum: ['morning', 'afternoon', 'flexible', ''],
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  addons: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
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

// Auto-generate bookingId
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ isDeleted: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
