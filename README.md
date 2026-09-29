# Exploria – Smart Tourism & Adventure Platform

> **Tagline:** *"Explore More. Travel Smarter."*

Exploria is a modern, fully functional, production-style full-stack tourism and adventure web application built from scratch to modernize travel discovery, real-time climate monitoring, guide matching, travel inquiries, and tour bookings.

---

## 🌟 Key Features

1. **Destinations & Adventure Packages**
   - Discover top travel hubs with estimated budget breakdowns, best seasons, and difficulty filters.
   - Handcrafted multi-day packages with day-by-day itineraries, included/excluded services, and reviews.

2. **Intelligent Guide Matching System**
   - Matches travelers with certified local mountain guides and scuba dive masters based on destination familiarity, activity specializations, budget, and traveler ratings.

3. **Real-Time Weather Integration**
   - Integrated OpenWeatherMap API with an intelligent climate fallback engine for live temperature, humidity, wind speeds, and visibility.

4. **Authentic Inquiry Management System**
   - Submits travel inquiries and generates unique backend reference IDs (`EXP-XXXXXXXX`).
   - Admin management panel for searching, filtering, and resolving inquiries.

5. **Integrated Tourism Chatbot**
   - Floating assistant across the platform providing tourism FAQ answers, package suggestions, and AI provider integration readiness (`.env` AI key support).

6. **Interactive Demo Booking Flow**
   - Dynamic total calculation (`price * travelers_count`), optional guide selection, special host notes, and instant test payment checkout generating unique booking codes (`BK-XXXXXXXX`).

7. **Role-Based Authentication & Dashboards**
   - **USER:** Personal profile, active bookings, inquiry tracking, saved favorite packages.
   - **GUIDE:** Guide profile setup, location & hourly rates, incoming request approval, assigned bookings, availability toggling (`AVAILABLE` / `BUSY` / `UNAVAILABLE`).
   - **ADMIN:** Comprehensive analytics dashboard, revenue metrics, full CRUD for Users, Guides, Destinations, Adventures, Packages, Inquiries, Bookings, and Reviews.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Vanilla CSS utilities & custom glassmorphism)
- **Routing:** React Router v6
- **Icons & Animations:** Lucide React icons & Framer Motion

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js REST API
- **Authentication:** JWT (JSON Web Tokens) & BCrypt password hashing
- **Middleware:** CORS, Error Handler, Role-Based Access Control (RBAC)

### Database
- **Relational Schema:** Standard MySQL relational structure with Foreign Key constraints (`database/schema.sql`).
- **Zero-Friction Fallback:** Built-in MySQL driver (`mysql2`) with automatic local SQLite database initialization if MySQL is offline.

---

## 📂 Project Architecture

```
Tourism/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable Cards, Modals, Navbar, Footer, ChatWidget
│   │   ├── context/            # AuthContext, ToastContext, SavedContext
│   │   ├── layouts/            # MainLayout, DashboardLayout
│   │   ├── pages/              # Public, User, Guide & Admin pages
│   │   ├── services/           # REST API client services
│   │   ├── App.jsx             # App Routing
│   │   ├── main.jsx            # React Entry Point
│   │   └── index.css           # Tailwind & Custom CSS
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/             # DB connector & Environment config
│   │   ├── controllers/        # Auth, Destination, Package, Guide, Booking, Inquiry, Weather, Chat, Review, Stats
│   │   ├── middleware/         # Auth JWT, RBAC & Error handlers
│   │   ├── models/             # Schema & Seed data initializer
│   │   ├── routes/             # REST Route definitions
│   │   ├── services/           # Weather, Chatbot & Guide Matching algorithms
│   │   └── server.js           # Main Express server entry point
├── database/                   # Database Scripts
│   ├── schema.sql              # MySQL / Relational schema definition
│   └── seed.sql                # Seed data SQL script
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Monorepo runner
└── README.md                   # Documentation
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@exploria.com` | `password123` |
| **GUIDE** | `aarav.guide@exploria.com` | `password123` |
| **USER** | `maya.user@exploria.com` | `password123` |

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 2. Installation
Clone the repository and run setup from the root directory:

```bash
# Install all dependencies across monorepo
npm run setup
```

### 3. Environment Setup
Copy `.env.example` to `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=exploria_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=exploria_db
WEATHER_API_KEY=your_openweather_api_key
```

### 4. Running the Project Locally

Run both frontend and backend concurrently in development mode:

```bash
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 Key REST API Endpoints

### Auth
- `POST /api/auth/register` - Create user or guide account
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Fetch authenticated user profile

### Core Travel APIs
- `GET /api/destinations` - List destinations with search & budget filter
- `GET /api/packages` - List tour packages with difficulty & sorting
- `GET /api/adventures` - List thrill activities by category
- `GET /api/guides` - List verified guides
- `POST /api/guides/match` - Run guide matching algorithm

### Inquiries, Weather & Chat
- `POST /api/inquiries` - Submit travel inquiry (`EXP-XXXXXXXX`)
- `GET /api/weather?city=...` - Fetch live weather forecast
- `POST /api/chat` - Interact with AI & FAQ chatbot

### Bookings & Admin
- `POST /api/bookings` - Create tour reservation (`BK-XXXXXXXX`)
- `GET /api/stats/admin` - Fetch admin KPI metrics & analytics

---

## 🛡️ Security & GitHub Readiness
- Secrets and API keys stored exclusively in `.env` (excluded via `.gitignore`).
- Password hashing powered by **bcryptjs**.
- Role-based route authorization guards on both API middleware and React frontend layouts.
