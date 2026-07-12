import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Petcare Pro'
  },
  phone: {
    type: String,
    default: '(555) 123-4567'
  },
  email: {
    type: String,
    default: 'info@petcarepro.com'
  },
  address: {
    type: String,
    default: '168/170, Avenue 01, Mirpur DOHS, India'
  },
  socialLinks: {
    facebook: { type: String, default: 'https://www.facebook.com/' },
    instagram: { type: String, default: 'https://www.instagram.com/' },
    twitter: { type: String, default: 'https://x.com/' }
  },
  heroText: {
    type: String,
    default: 'Provide Attention and Care for all the Pets.'
  },
  aboutText: {
    type: String,
    default: 'Ensure every pet receives proper attention and care for their well-being and happiness.'
  }
}, {
  timestamps: true
});

const WebsiteSettings = mongoose.model('WebsiteSettings', websiteSettingsSchema);
export default WebsiteSettings;
