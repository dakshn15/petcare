import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Petcare'
  },
  businessName: {
    type: String,
    default: 'Petcare'
  },
  tagline: {
    type: String,
    default: 'Caring for your furry friends with love and professional expertise'
  },
  logo: {
    type: String,
    default: '/assets/images/logo.png'
  },
  favicon: {
    type: String,
    default: '/assets/images/favicon.png'
  },
  phone: {
    type: String,
    default: '(555) 123-4567'
  },
  email: {
    type: String,
    default: 'info@petcare.com'
  },
  address: {
    type: String,
    default: '168/170, Avenue 01, Mirpur DOHS, India'
  },
  workingHours: {
    type: String,
    default: 'Mon - Sat: 9:00 AM - 7:00 PM'
  },
  socialLinks: {
    facebook: { type: String, default: 'https://www.facebook.com/' },
    instagram: { type: String, default: 'https://www.instagram.com/' },
    twitter: { type: String, default: 'https://x.com/' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  heroText: {
    type: String,
    default: 'Provide Attention and Care for all the Pets.'
  },
  aboutText: {
    type: String,
    default: 'Ensure every pet receives proper attention and care for their well-being and happiness.'
  },
  metaTitle: {
    type: String,
    default: 'Petcare - Premium Pet Care & Grooming Services'
  },
  metaDescription: {
    type: String,
    default: 'Best pet care, grooming, and adoption platform for dogs, cats, and pets.'
  },
  metaKeywords: {
    type: String,
    default: 'petcare, grooming, pet adoption, dog wash, cat styling, pet care services'
  },
  packages: {
    type: Array,
    default: [
      {
        name: 'Basic Package',
        desc: 'Perfect for routine care',
        price: 65,
        icon: 'fas fa-plus',
        features: [
          'Bath & Organic Shampoo',
          'Gentle Blow Dry',
          'Nail Trimming',
          'Ear Cleaning'
        ],
        popular: false
      },
      {
        name: 'Premium Package',
        desc: 'Enhanced grooming experience',
        price: 95,
        icon: 'fas fa-dollar-sign',
        features: [
          'Everything in Basic',
          'Full Haircut & Styling',
          'Teeth Brushing',
          'Paw Pad Treatment'
        ],
        popular: true
      },
      {
        name: 'Deluxe Package',
        desc: 'Ultimate luxury experience',
        price: 135,
        icon: 'fas fa-star',
        features: [
          'Everything in Premium',
          'Aromatherapy Treatment',
          'Luxury Fur Conditioning',
          'Complimentary Pet Toy'
        ],
        popular: false
      },
      {
        name: 'Senior Care',
        desc: 'Gentle care for older pets',
        price: 110,
        icon: 'fas fa-heart',
        features: [
          'Gentle Bathing',
          'Joint-Friendly Handling',
          'Mobility Assessment',
          'Skin & Coat Evaluation'
        ],
        popular: false
      },
      {
        name: 'Show Ready',
        desc: 'Competition & show preparation',
        price: 175,
        icon: 'fas fa-bolt',
        features: [
          'Breed-Specific Styling',
          'Show-Quality Products',
          'Coat Volumizing',
          'Competition Consultation'
        ],
        popular: false
      }
    ]
  }
}, {
  timestamps: true
});

const WebsiteSettings = mongoose.model('WebsiteSettings', websiteSettingsSchema);
export default WebsiteSettings;
