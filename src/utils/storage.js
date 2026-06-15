// LocalStorage Helpers for Mock Authentication & Data Persistence

const USERS_KEY = 'petcare_users';
const CURRENT_USER_KEY = 'petcare_current_user';
const BOOKINGS_KEY = 'petcare_bookings';
const ADOPTIONS_KEY = 'petcare_adoptions';

// Get list of all registered users
export function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Get logged-in user
export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Register a new user
export function registerUser(name, email, phone, password) {
  const users = getUsers();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (exists) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = { name, email, phone, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Auto login
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name, email, phone }));
  return newUser;
}

// Login user
export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const sessionUser = { name: user.name, email: user.email, phone: user.phone };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

// Logout user
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Get all bookings
export function getBookings() {
  const bookings = localStorage.getItem(BOOKINGS_KEY);
  return bookings ? JSON.parse(bookings) : [];
}

// Get bookings for a specific user email
export function getUserBookings(email) {
  const allBookings = getBookings();
  return allBookings.filter(b => b.userEmail.toLowerCase() === email.toLowerCase());
}

// Add a booking
export function addUserBooking(email, booking) {
  const allBookings = getBookings();
  const newBooking = {
    id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
    userEmail: email,
    status: 'Confirmed', // Default confirmed for premium feel
    createdAt: new Date().toLocaleDateString(),
    ...booking
  };
  allBookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(allBookings));
  return newBooking;
}

// Cancel a booking
export function cancelUserBooking(bookingId) {
  const allBookings = getBookings();
  const updatedBookings = allBookings.map(b => {
    if (b.id === bookingId) {
      return { ...b, status: 'Cancelled' };
    }
    return b;
  });
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
}

// Get all adoptions
export function getAdoptions() {
  const adoptions = localStorage.getItem(ADOPTIONS_KEY);
  return adoptions ? JSON.parse(adoptions) : [];
}

// Get adoptions for a user
export function getUserAdoptions(email) {
  const allAdoptions = getAdoptions();
  return allAdoptions.filter(a => a.userEmail.toLowerCase() === email.toLowerCase());
}

// Add an adoption application
export function addUserAdoption(email, adoption) {
  const allAdoptions = getAdoptions();
  const newAdoption = {
    id: 'AD-' + Math.floor(100000 + Math.random() * 900000),
    userEmail: email,
    status: 'Under Review',
    createdAt: new Date().toLocaleDateString(),
    ...adoption
  };
  allAdoptions.push(newAdoption);
  localStorage.setItem(ADOPTIONS_KEY, JSON.stringify(allAdoptions));
  return newAdoption;
}
