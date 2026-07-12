# PetCare | Professional Pet Care & Grooming Services

A premium, modern, and interactive full-stack web application for **PetCare**, featuring a Node.js/Express backend API, a Mongoose/MongoDB database model, a client-facing React SPA frontend rebuilt from scratch with React 19, Tailwind CSS, and Vite, and a backoffice Admin Control Panel.

---

## 🚀 Key Features

### 1. Client Features (React SPA)
*   **Booking System**: Dynamic grooming services booking forms with reactive date/time picking and auto-calculated service add-on pricing.
*   **Adoption Applications**: Dynamic pet adoption listing gallery and form submission page to request pet adoptions.
*   **FAQ Accordions**: Dynamic FAQ catalog, fetched and grouped from backend FAQ collections.
*   **Confetti Review Engine**: Interactive testimonial submission with rating selection and instant canvas-confetti bursts.
*   **Toast Notifications**: Global error and success notifications powered by React contexts.

### 2. Backoffice Admin Panel (`/admin`)
*   **Dashboard Analytics**: Dynamic aggregated KPIs (total revenue, active services, pending bookings, pets) and a monthly booking chart.
*   **Services CRUD**: Control panel to create, read, update, and soft-delete grooming packages and add-ons.
*   **Bookings Moderation**: Real-time management to confirm, cancel, or complete customer reservations.
*   **Pet Inventory & Adoptions**: Complete management to listing new pets for adoption (with file uploads) and approving/rejecting adoption requests.
*   **User Management**: Administrators can view, search, filter, edit user contact details, promote/demote user access roles, create new users directly, and soft-delete accounts.
*   **Reviews & Messages**: Panels to moderate customer reviews before publication, and manage contact form submissions.
*   **Dynamic Site Settings**: Business contacts, address, phone number, and social profiles settings.

### 3. Backend API Core
*   **Role-Based Security**: Custom JWT authentication middleware with Http-Only cookie transport.
*   **Security Standards**: Helmet HTTP header protection, CORS configuration, Express rate limiters, and input validations.
*   **Activity Logs**: Automated logger capturing system actions for auditing.
*   **SMTP Mail Notifications**: Integration with Nodemailer for customer transaction notifications.

---

## 🛠️ Technology Stack

*   **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose ODM)
*   **Backend**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
*   **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vite.dev/), [Tailwind CSS v3](https://tailwindcss.com/)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **Carousels**: [Swiper v12](https://swiperjs.com/)
*   **Email Client**: [Nodemailer](https://nodemailer.com/)

---

## 📂 Project Structure

```text
petcare/
├── backend/                # Node.js/Express Backend API
│   ├── config/             # Database connection configuration
│   ├── controllers/        # Route controllers (Auth, Bookings, Services, etc.)
│   ├── middleware/         # Auth verification, rate limiters, upload utilities
│   ├── models/             # Mongoose database schemas & indexes
│   ├── routes/             # REST API routes definition
│   ├── seed/               # Database seeder scripts and mock collections
│   ├── services/           # Activity logging & Mail services
│   ├── uploads/            # Local directory for uploaded pet pictures
│   ├── validators/         # Input sanitization using express-validator
│   └── server.js           # Express main server entrance
├── frontend/               # Vite/React SPA Frontend
│   ├── public/             # Static files (PWA icons, robots.txt, sitemap.xml)
│   ├── src/                # React source files
│   │   ├── api/            # Axios API endpoint calls (auth, bookings, reviews)
│   │   ├── components/     # UI, layouts, PWA triggers, and Swiper components
│   │   ├── context/        # React Auth Context Provider
│   │   ├── hooks/          # useAuth and useToast hooks
│   │   ├── pages/          # Pages (Home, Login, Account, AdminPortal, etc.)
│   │   ├── index.css       # Styling & animations
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js      # Vite compilation & proxy setup
│   └── package.json        # Frontend dependency list
├── package.json            # Root dev concurrent scripts
└── .env                    # System-wide configuration variables
```

---

## ⚙️ How to Setup & Run

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed locally.
- A running instance of MongoDB on the default port `mongodb://127.0.0.1:27017`.

### 2. Installation
Install the project dependencies for the root, backend, and frontend directories:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/petcare
JWT_SECRET=super_secure_jwt_secret
JWT_REFRESH_SECRET=super_secure_refresh_secret
JWT_EXPIRE=15m
REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 4. Database Seeding
Seed the database with default configurations, admin profiles, FAQ modules, services, and pets:
```bash
npm run seed
```
> **Default Admin Account**:
> *   **Email**: `admin@petcare.com`
> *   **Password**: `Admin@123`

### 5. Start Development Servers
Run the concurrently script to launch both backend and frontend servers in parallel:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
To access the Admin panel, login as `admin@petcare.com`
