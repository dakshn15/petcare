import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  categoryIcon: {
    type: String,
    default: 'fas fa-question-circle'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isActive: 1 });

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
