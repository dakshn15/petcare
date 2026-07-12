import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Service from '../models/Service.js';
import FAQ from '../models/FAQ.js';
import WebsiteSettings from '../models/WebsiteSettings.js';
import Pet from '../models/Pet.js';
import Review from '../models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petcare';

// Admin seed data
const adminUser = {
  name: 'Admin',
  email: 'admin@petcare.com',
  phone: '5551234567',
  password: 'Admin@123',
  role: 'admin'
};

// Services data (matching existing frontend hardcoded data)
const servicesData = [
  {
    name: 'Full Service Bath', value: 'full-bath', price: 45, icon: 'fas fa-bath', tag: 'Premium Service', duration: '45-60',
    description: 'Give your pet the ultimate spa experience with our comprehensive bathing service. We use only the finest, pet-safe products and techniques to ensure your furry friend leaves feeling clean, fresh, and pampered.',
    included: [
      { name: 'Premium Shampoo', desc: "High-quality, pet-safe shampoo selected based on your pet's coat type and skin sensitivity.", icon: 'fas fa-flask' },
      { name: 'Conditioning Treatment', desc: "Moisturizing conditioner to keep your pet's coat soft, shiny, and tangle-free.", icon: 'fas fa-cut' },
      { name: 'Nail Trimming', desc: "Professional nail trimming and filing to keep your pet's nails at the perfect length.", icon: 'fas fa-cut' },
      { name: 'Ear Cleaning', desc: 'Gentle ear cleaning and inspection to prevent infections and maintain ear health.', icon: 'fas fa-ear-listen' },
      { name: 'Thorough Brushing', desc: 'Complete brushing to remove loose fur, prevent matting, and distribute natural oils.', icon: 'fas fa-brush' },
      { name: 'Professional Drying', desc: 'Complete drying with professional equipment to ensure your pet is comfortable and warm.', icon: 'fas fa-sun' }
    ],
    process: [
      { step: 1, name: 'Health Check', desc: 'We start with a gentle health and temperament assessment to ensure your pet is comfortable.' },
      { step: 2, name: 'Pre-Bath Prep', desc: 'Nail trimming, ear cleaning, and thorough brushing to prepare for the bath.' },
      { step: 3, name: 'Luxurious Bath', desc: 'Warm water bath with premium shampoo and conditioning treatment.' },
      { step: 4, name: 'Professional Drying', desc: 'Complete drying and final brushing to leave your pet looking and feeling their best.' }
    ],
    addons: [
      { addonId: 'aromatherapy', name: 'Aromatherapy Treatment', price: 10, desc: 'Relaxing lavender-scented bath for anxious or stressed pets.', icon: 'fas fa-spa' },
      { addonId: 'deshedding', name: 'De-Shedding Treatment', price: 15, desc: 'Special treatment to reduce shedding for heavy-shedding breeds.', icon: 'fas fa-heart' },
      { addonId: 'teeth', name: 'Teeth Cleaning', price: 20, desc: "Professional teeth cleaning to maintain oral health.", icon: 'fas fa-tooth' }
    ]
  },
  {
    name: 'Professional Haircut', value: 'haircut', price: 35, icon: 'fas fa-cut', tag: 'Styling Service', duration: '30-45',
    description: 'Our expert groomers provide precision haircuts tailored to your pet\'s breed and your preferences.',
    included: [
      { name: 'Breed-Appropriate Cut', desc: 'Precision cutting tailored to your pet\'s breed standards.', icon: 'fas fa-cut' },
      { name: 'Face & Paw Trimming', desc: 'Detailed trimming around the face, ears, and paws.', icon: 'fas fa-paw' },
      { name: 'Pre-Cut Brushing', desc: 'Thorough brushing to remove tangles and mats.', icon: 'fas fa-brush' },
      { name: 'Sanitary Trim', desc: 'Hygienic trimming for cleanliness and comfort.', icon: 'fas fa-shield-alt' },
      { name: 'Finishing Spray', desc: 'Light conditioning spray to add shine.', icon: 'fas fa-spray-can' },
      { name: 'Style Consultation', desc: 'Expert recommendations for your pet\'s coat type.', icon: 'fas fa-comments' }
    ],
    process: [
      { step: 1, name: 'Consultation', desc: 'Discuss the desired style and assess coat condition.' },
      { step: 2, name: 'Prep & Brush', desc: 'Thorough brushing to detangle and prepare.' },
      { step: 3, name: 'Precision Cut', desc: 'Expert cutting using professional tools.' },
      { step: 4, name: 'Final Touches', desc: 'Detail work on face, paws, and tail.' }
    ],
    addons: [
      { addonId: 'color-chalk', name: 'Creative Color Chalk', price: 10, desc: 'Fun, pet-safe color chalk accents.', icon: 'fas fa-palette' },
      { addonId: 'deep-condition', name: 'Deep Conditioning', price: 12, desc: 'Intensive conditioning treatment.', icon: 'fas fa-tint' },
      { addonId: 'bandana', name: 'Bandana & Bow', price: 5, desc: 'Adorable finishing touch.', icon: 'fas fa-gift' }
    ]
  },
  {
    name: 'Nail Care', value: 'nail-care', price: 20, icon: 'fas fa-paw', tag: 'Essential Service', duration: '15-25',
    description: 'Keep your pet comfortable and healthy with our professional nail care service.',
    included: [
      { name: 'Nail Trimming', desc: 'Precise trimming to the ideal length.', icon: 'fas fa-cut' },
      { name: 'Nail Filing', desc: 'Smooth filing to eliminate sharp edges.', icon: 'fas fa-file' },
      { name: 'Paw Inspection', desc: 'Careful examination of paw pads.', icon: 'fas fa-search' },
      { name: 'Paw Pad Moisturizing', desc: 'Pet-safe moisturizer application.', icon: 'fas fa-tint' }
    ],
    process: [
      { step: 1, name: 'Paw Assessment', desc: 'Inspect nails and paw pads.' },
      { step: 2, name: 'Gentle Trimming', desc: 'Careful trimming using professional clippers.' },
      { step: 3, name: 'Filing & Smoothing', desc: 'Filing nails smooth.' },
      { step: 4, name: 'Paw Care', desc: 'Moisturize paw pads.' }
    ],
    addons: [
      { addonId: 'nail-polish', name: 'Pet-Safe Nail Polish', price: 8, desc: 'Fun, non-toxic nail polish.', icon: 'fas fa-paint-brush' },
      { addonId: 'paw-massage', name: 'Paw Massage', price: 10, desc: 'Relaxing massage for your pet\'s paws.', icon: 'fas fa-hand-holding-heart' }
    ]
  },
  {
    name: 'Luxury Aromatherapy Bath', value: 'aromatherapy', price: 55, icon: 'fas fa-spa', tag: 'Spa Experience', duration: '60-75',
    description: 'Indulge your pet in a calming aromatherapy bath experience with essential oils and premium products.',
    included: [
      { name: 'Essential Oil Selection', desc: 'Custom blend of pet-safe essential oils.', icon: 'fas fa-flask' },
      { name: 'Warm Towel Wrap', desc: 'Soothing warm towel wrap.', icon: 'fas fa-blanket' },
      { name: 'Deep Conditioning', desc: 'Intensive conditioning with essential oils.', icon: 'fas fa-tint' },
      { name: 'Calming Massage', desc: 'Gentle massage to reduce stress.', icon: 'fas fa-hand-holding-heart' },
      { name: 'Premium Rinse', desc: 'Thorough rinse with temperature-controlled water.', icon: 'fas fa-shower' },
      { name: 'Finishing Touch', desc: 'Light finishing spray with calming scent.', icon: 'fas fa-spray-can' }
    ],
    process: [
      { step: 1, name: 'Mood Assessment', desc: 'Evaluate stress level and select oils.' },
      { step: 2, name: 'Warm Soak', desc: 'Gentle warm water soak with calming oils.' },
      { step: 3, name: 'Aromatherapy Wash', desc: 'Premium shampoo and deep conditioning.' },
      { step: 4, name: 'Relaxation Finish', desc: 'Warm towel wrap, massage, and drying.' }
    ],
    addons: [
      { addonId: 'extended-massage', name: 'Extended Massage', price: 15, desc: 'Additional 15-minute massage.', icon: 'fas fa-spa' },
      { addonId: 'coat-perfume', name: 'Coat Perfume', price: 8, desc: 'Long-lasting, pet-safe fragrance.', icon: 'fas fa-wind' }
    ]
  },
  {
    name: 'Breed-Specific Styling', value: 'breed-styling', price: 65, icon: 'fas fa-star', tag: 'Specialist Service', duration: '60-90',
    description: 'Specialized grooming tailored to your pet\'s breed standards with expert styling techniques.',
    included: [
      { name: 'Breed Standard Cut', desc: 'Precise cutting following breed standards.', icon: 'fas fa-star' },
      { name: 'Coat Analysis', desc: 'In-depth coat analysis.', icon: 'fas fa-search' },
      { name: 'Hand Stripping', desc: 'Traditional hand-stripping for wire-coated breeds.', icon: 'fas fa-hand-paper' },
      { name: 'Finishing Products', desc: 'Premium breed-specific finishing products.', icon: 'fas fa-spray-can' },
      { name: 'Full Bath & Dry', desc: 'Complete bathing and drying.', icon: 'fas fa-bath' },
      { name: 'Photo Documentation', desc: 'Before and after photos.', icon: 'fas fa-camera' }
    ],
    process: [
      { step: 1, name: 'Breed Assessment', desc: 'Evaluate coat and discuss options.' },
      { step: 2, name: 'Bath & Prep', desc: 'Full bath with breed-appropriate products.' },
      { step: 3, name: 'Expert Styling', desc: 'Precision cutting following breed standards.' },
      { step: 4, name: 'Final Review', desc: 'Quality check and finishing touches.' }
    ],
    addons: [
      { addonId: 'show-prep', name: 'Show Preparation', price: 25, desc: 'Competition-grade finishing.', icon: 'fas fa-trophy' },
      { addonId: 'coat-treatment', name: 'Coat Enhancement', price: 15, desc: 'Coat texture and shine treatment.', icon: 'fas fa-magic' }
    ]
  },
  {
    name: 'Paw & Nail Spa', value: 'paw-spa', price: 30, icon: 'fas fa-paw', tag: 'Relaxation Service', duration: '25-35',
    description: 'Complete paw pampering including soak, moisturizing, and expert nail care.',
    included: [
      { name: 'Paw Soak', desc: 'Warm, soothing paw soak.', icon: 'fas fa-water' },
      { name: 'Nail Trimming & Filing', desc: 'Expert nail trimming and filing.', icon: 'fas fa-cut' },
      { name: 'Pad Treatment', desc: 'Moisturizing treatment for paw pads.', icon: 'fas fa-paw' },
      { name: 'Between-Toe Grooming', desc: 'Careful trimming of fur between toes.', icon: 'fas fa-brush' }
    ],
    process: [
      { step: 1, name: 'Inspection', desc: 'Thorough inspection of paws.' },
      { step: 2, name: 'Warm Soak', desc: 'Relaxing warm water soak.' },
      { step: 3, name: 'Nail Care', desc: 'Professional trimming and filing.' },
      { step: 4, name: 'Moisturize', desc: 'Paw pad moisturizing.' }
    ],
    addons: [
      { addonId: 'paw-wax', name: 'Paw Wax Protection', price: 10, desc: 'Protective wax application.', icon: 'fas fa-shield-alt' },
      { addonId: 'nail-art', name: 'Nail Art', price: 12, desc: 'Creative, pet-safe nail art.', icon: 'fas fa-palette' }
    ]
  },
  {
    name: 'Dental Care Package', value: 'dental', price: 40, icon: 'fas fa-shield-alt', tag: 'Health Service', duration: '30-45',
    description: 'Comprehensive dental care package for your pet\'s oral health.',
    included: [
      { name: 'Teeth Brushing', desc: 'Thorough brushing with enzymatic toothpaste.', icon: 'fas fa-tooth' },
      { name: 'Gum Inspection', desc: 'Careful gum examination.', icon: 'fas fa-search' },
      { name: 'Breath Freshening', desc: 'Natural breath freshening treatment.', icon: 'fas fa-wind' },
      { name: 'Dental Report', desc: 'Detailed dental findings report.', icon: 'fas fa-clipboard-list' }
    ],
    process: [
      { step: 1, name: 'Oral Exam', desc: 'Comprehensive oral examination.' },
      { step: 2, name: 'Gentle Cleaning', desc: 'Careful teeth brushing.' },
      { step: 3, name: 'Freshening', desc: 'Breath freshening and oral rinse.' },
      { step: 4, name: 'Report & Tips', desc: 'Dental health report and recommendations.' }
    ],
    addons: [
      { addonId: 'dental-chew', name: 'Dental Chew Pack', price: 8, desc: 'Take-home dental chews.', icon: 'fas fa-bone' },
      { addonId: 'oral-spray', name: 'Oral Health Spray', price: 12, desc: 'Pet-safe oral health spray.', icon: 'fas fa-spray-can' }
    ]
  },
  {
    name: 'De-shedding Treatment', value: 'deshedding', price: 50, icon: 'fas fa-play-circle', tag: 'Coat Care', duration: '45-60',
    description: 'Specialized de-shedding treatment reduces loose fur by up to 90%.',
    included: [
      { name: 'De-shedding Shampoo', desc: 'Specialized shampoo to loosen dead undercoat.', icon: 'fas fa-flask' },
      { name: 'Undercoat Removal', desc: 'Professional de-shedding tools.', icon: 'fas fa-brush' },
      { name: 'Conditioning Treatment', desc: 'Moisturizing conditioner to reduce future shedding.', icon: 'fas fa-tint' },
      { name: 'High-Velocity Drying', desc: 'Professional drying to remove additional loose fur.', icon: 'fas fa-wind' },
      { name: 'Final Brushout', desc: 'Thorough final brushing.', icon: 'fas fa-check-circle' }
    ],
    process: [
      { step: 1, name: 'Coat Assessment', desc: 'Evaluate coat type and shedding level.' },
      { step: 2, name: 'De-shed Bath', desc: 'Specialized shampoo bath.' },
      { step: 3, name: 'Professional Removal', desc: 'Expert de-shedding with specialized tools.' },
      { step: 4, name: 'Finish & Condition', desc: 'Conditioning and final brushout.' }
    ],
    addons: [
      { addonId: 'omega-treatment', name: 'Omega Oil Treatment', price: 12, desc: 'Omega oil treatment for healthy coat.', icon: 'fas fa-fish' },
      { addonId: 'lint-roller', name: 'Take-Home Lint Roller', price: 5, desc: 'Professional-grade lint roller.', icon: 'fas fa-gift' }
    ]
  },
  {
    name: 'Flea & Tick Treatment', value: 'flea-tick', price: 45, icon: 'fas fa-bug', tag: 'Preventive Care', duration: '45-60',
    description: 'Comprehensive parasite control treatment including medicated bath and preventative application.',
    included: [
      { name: 'Medicated Bath', desc: 'Anti-parasitic shampoo bath.', icon: 'fas fa-bath' },
      { name: 'Full Body Inspection', desc: 'Thorough head-to-tail inspection.', icon: 'fas fa-search' },
      { name: 'Preventative Application', desc: 'Veterinarian-approved preventative treatment.', icon: 'fas fa-shield-alt' },
      { name: 'Skin Soothing', desc: 'Calming treatment for skin irritation.', icon: 'fas fa-hand-holding-heart' },
      { name: 'Environmental Tips', desc: 'Home environment treatment guidance.', icon: 'fas fa-home' }
    ],
    process: [
      { step: 1, name: 'Inspection', desc: 'Assess infestation level.' },
      { step: 2, name: 'Medicated Bath', desc: 'Anti-parasitic shampoo treatment.' },
      { step: 3, name: 'Manual Removal', desc: 'Careful manual removal of parasites.' },
      { step: 4, name: 'Prevention', desc: 'Apply preventative treatment.' }
    ],
    addons: [
      { addonId: 'flea-collar', name: 'Flea & Tick Collar', price: 20, desc: 'Long-lasting flea and tick collar.', icon: 'fas fa-ring' },
      { addonId: 'home-spray', name: 'Home Treatment Spray', price: 15, desc: 'Pet-safe home spray.', icon: 'fas fa-spray-can' }
    ]
  }
];

// FAQ data matching existing frontend
const faqsData = [
  { question: 'How long does a full grooming session take?', answer: 'A full grooming session typically takes 2-3 hours depending on your pet\'s size, coat condition, and the services requested. We take our time to ensure your pet is comfortable and receives the best possible care. For anxious pets, we may need additional time to help them relax.', category: 'Grooming Services', categoryIcon: 'fas fa-cut', order: 1 },
  { question: 'What grooming services do you offer for dogs?', answer: 'Our dog grooming services include bath and brush, full haircuts, nail trimming, ear cleaning, teeth brushing, de-shedding treatments, and specialized skin treatments. We also offer breed-specific styling and can accommodate special needs for senior dogs or those with skin sensitivities.', category: 'Grooming Services', categoryIcon: 'fas fa-cut', order: 2 },
  { question: 'Do you offer grooming services for cats?', answer: 'Yes, we offer specialized cat grooming services including bathing, nail trimming, ear cleaning, lion cuts, and de-shedding treatments. Our groomers are trained to handle cats with care and patience, and we use cat-specific products that are gentle on their sensitive skin.', category: 'Grooming Services', categoryIcon: 'fas fa-cut', order: 3 },
  { question: 'What are your boarding facilities like?', answer: 'Our boarding facilities feature spacious, climate-controlled kennels with comfortable bedding. Dogs get multiple outdoor play sessions daily in our secure play yards, while cats enjoy multi-level condos with climbing spaces. We provide 24/7 supervision.', category: 'Boarding & Daycare', categoryIcon: 'fas fa-home', order: 1 },
  { question: 'What does pet daycare include?', answer: 'Our pet daycare includes supervised play sessions in groups matched by size, temperament, and energy level. Your pet will enjoy indoor and outdoor play areas with agility equipment, toys, and water features. We provide rest periods, fresh water, and optional lunch.', category: 'Boarding & Daycare', categoryIcon: 'fas fa-home', order: 2 },
  { question: 'What vaccinations are required for boarding and daycare?', answer: 'For dogs, we require current vaccinations for Rabies, Distemper/Parvo (DHPP), and Bordetella. For cats, we require Rabies and FVRCP. All pets must be free of fleas, ticks, and contagious conditions.', category: 'Boarding & Daycare', categoryIcon: 'fas fa-home', order: 3 },
  { question: 'How do I book an appointment?', answer: 'You can book an appointment through our website\'s online booking system, by calling our customer service line, or by visiting our location in person. We recommend booking at least 1-2 weeks in advance for grooming services.', category: 'Policies & Booking', categoryIcon: 'fas fa-clipboard-list', order: 1 },
  { question: 'What is your cancellation policy?', answer: 'We require at least 24 hours\' notice for cancellation of grooming appointments and 48 hours for daycare or boarding reservations. Late cancellations or no-shows may result in a cancellation fee of 50%.', category: 'Policies & Booking', categoryIcon: 'fas fa-clipboard-list', order: 2 },
  { question: 'Do you accept pet insurance?', answer: 'While we don\'t directly bill pet insurance companies, we provide detailed receipts and service documentation that you can submit to your pet insurance provider for reimbursement.', category: 'Policies & Booking', categoryIcon: 'fas fa-clipboard-list', order: 3 }
];

// Sample pets
const petsData = [
  { name: 'Buddy', type: 'dog', breed: 'Golden Retriever', age: '2 years', gender: 'male', size: 'large', description: 'Friendly and playful, loves fetch!', status: 'Available', image: '/assets/images/pet-1.png', price: 800 },
  { name: 'Whiskers', type: 'cat', breed: 'Persian', age: '1 year', gender: 'female', size: 'medium', description: 'Calm and cuddly, perfect lap cat.', status: 'Available', image: '/assets/images/pet-2.png', price: 600 },
  { name: 'Max', type: 'dog', breed: 'Labrador', age: '3 years', gender: 'male', size: 'large', description: 'Energetic and loyal companion.', status: 'Available', image: '/assets/images/pet-3.png', price: 700 },
  { name: 'Luna', type: 'cat', breed: 'Siamese', age: '8 months', gender: 'female', size: 'small', description: 'Curious and vocal, loves attention.', status: 'Available', image: '/assets/images/pet-2.png', price: 800 },
  { name: 'Rocky', type: 'dog', breed: 'German Shepherd', age: '4 years', gender: 'male', size: 'large', description: 'Intelligent and protective.', status: 'Available', image: '/assets/images/pet-1.png', price: 600 },
  { name: 'Coco', type: 'rabbit', breed: 'Holland Lop', age: '1 year', gender: 'female', size: 'small', description: 'Gentle and loves to hop around.', status: 'Available', image: '/assets/images/pet-3.png', price: 1200 }
];

// Sample reviews
const reviewsData = [
  { name: 'Sarah Johnson', email: 'sarah@example.com', rating: 5, text: 'Amazing service! My dog Bella came out looking and smelling wonderful. The staff was incredibly gentle and professional.', isApproved: true },
  { name: 'Michael Chen', email: 'michael@example.com', rating: 5, text: 'Best grooming service in town! They really take their time with each pet and the results are always outstanding.', isApproved: true },
  { name: 'Emily Rodriguez', email: 'emily@example.com', rating: 4, text: 'Great experience overall. My cat was treated with so much care. Will definitely be coming back!', isApproved: true },
  { name: 'David Wilson', email: 'david@example.com', rating: 5, text: 'The aromatherapy bath was a game-changer for my anxious pup. He came out so relaxed and happy!', isApproved: true },
  { name: 'Jessica Taylor', email: 'jessica@example.com', rating: 5, text: 'Professional, caring, and thorough. My Golden Retriever loves going there now!', isApproved: true }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      FAQ.deleteMany({}),
      WebsiteSettings.deleteMany({}),
      Pet.deleteMany({}),
      Review.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed admin user
    await User.create(adminUser);
    console.log('👤 Admin user created (admin@petcare.com / Admin@123)');

    // Seed services
    await Service.insertMany(servicesData);
    console.log(`🛠️  ${servicesData.length} services created`);

    // Seed FAQs
    await FAQ.insertMany(faqsData);
    console.log(`❓ ${faqsData.length} FAQs created`);

    // Seed settings
    await WebsiteSettings.create({});
    console.log('⚙️  Default website settings created');

    // Seed pets
    await Pet.insertMany(petsData);
    console.log(`🐾 ${petsData.length} pets created`);

    // Seed reviews
    await Review.insertMany(reviewsData);
    console.log(`⭐ ${reviewsData.length} reviews created`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:  admin@petcare.com / Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
