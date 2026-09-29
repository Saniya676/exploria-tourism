# Exploria V2 – Smart Tourism & Adventure Platform

> **Tagline:** *"Explore More. Travel Smarter."*

Exploria V2 is a commercial-grade, full-stack smart tourism and adventure platform built to modernize travel discovery, AI itinerary generation, real-time climate monitoring, interactive map navigation, guide matching, travel inquiries, notifications, and tour bookings.

---

## 🌟 Exploria V2 Key Features

1. **🤖 AI Travel Planner (`/travel-planner`)**
   - Personal itinerary generator powered by Google Gemini AI with a deterministic fallback engine.
   - Tailors day-by-day morning/afternoon/evening schedules, budget breakdowns, activities, weather advice, and local guide recommendations based on travel style (Adventure, Family, Couple, Solo, Luxury, Cultural) and budget.

2. **🗺️ Interactive OpenStreetMap Navigation (Leaflet)**
   - Interactive maps embedded across destination discovery and detail pages using Leaflet & OpenStreetMap.
   - View destination geographical pins, popups with photos, and budget estimations without paid map dependencies.

3. **☀️ Advanced Weather Radar & 5-Day Forecast**
   - Live weather monitoring with OpenWeatherMap API integration and fallback weather data.
   - Features 5-day climate forecasts, wind speed, humidity, visibility, and smart travel recommendations (e.g., *"Good day for outdoor activities"*).

4. **⚡ Smart Guide Matching Engine V2**
   - Intelligent guide matching algorithm that calculates actual match percentages (e.g., `92% Match`) based on destination, activity specializations, budget, language, and traveler ratings.

5. **🔔 Real-Time Notification Center**
   - Database-backed notification engine with an interactive navbar notification bell and unread counter badge.
   - Automatically notifies travelers on booking confirmations, trip status changes, guide approvals, and inquiry updates.

6. **🧳 My Trips Portal (`/my-trips`)**
   - Dedicated trip dashboard tracking active, upcoming, completed, and cancelled bookings with unique reference codes (`BK-XXXXXXXX`), total cost calculation, and guide assignment.

7. **🌄 Smart Destination & Adventure Discovery**
   - Filter destinations and adventure packages by search keywords, category, max budget, difficulty level, and best seasons.
   - Seamless toggle between Grid View and Interactive Map View.

8. **💬 AI Tourism Assistant Chatbot**
   - Persistent floating chatbot with quick action buttons ("Plan My Trip", "Find Destinations", "Check Weather", "Find Guides").

9. **🛡️ Role-Based Authentication & Dashboards**
   - **USER:** Personal profile, My Trips portal, saved favorite packages & destinations, inquiry tracking.
   - **GUIDE:** Guide profile setup, availability toggling (`AVAILABLE` / `BUSY` / `UNAVAILABLE`), location rates, assigned trips.
   - **ADMIN:** Commercial analytics dashboard, total revenue KPIs, bookings over time, popular destinations, full CRUD management for all entities.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Maps:** Leaflet & React-Leaflet (OpenStreetMap)
- **Styling:** Tailwind CSS & Custom Design System
- **Routing:** React Router v6
- **Icons & UI:** Lucide React & Framer Motion

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js REST API
- **AI Integration:** Google Gemini AI API (`@google/genai`) with fallback engine
- **Authentication:** JWT (JSON Web Tokens) & BCrypt password hashing
- **Middleware:** CORS, Error Handler, Role-Based Access Control (RBAC)

### Database
- **Relational Schema:** Standard MySQL relational structure with Foreign Key constraints (`database/schema.sql`).
- **Zero-Friction Fallback:** Built-in MySQL driver (`mysql2`) with automatic local SQLite database initialization if MySQL is offline (`database/exploria_local.db`).

---

## 📂 Project Architecture

```
Tourism/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Cards, Maps, NotificationBell, Navbar, Footer, ChatWidget
│   │   ├── context/            # AuthContext, ToastContext, SavedContext
│   │   ├── layouts/            # MainLayout, DashboardLayout
│   │   ├── pages/              # Public (TravelPlanner, Destinations, Weather, Home), User (MyTrips, Favorites), Guide & Admin pages
│   │   ├── services/           # REST API client services (travelPlannerService, notificationService, etc.)
│   │   ├── App.jsx             # App Routing
│   │   ├── main.jsx            # React Entry Point
│   │   └── index.css           # Tailwind & Custom CSS
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/             # DB connector & Environment config
│   │   ├── controllers/        # Auth, TravelPlanner, Notification, Destination, Package, Guide, Booking, Inquiry, Weather, Chat, Review, Stats
│   │   ├── middleware/         # Auth JWT, RBAC & Error handlers
│   │   ├── models/             # Schema & Seed data initializer
│   │   ├── routes/             # REST Route definitions
│   │   ├── services/           # TravelPlanner, Weather, Notification, Chatbot & Guide Matching algorithms
│   │   └── server.js           # Main Express server entry point
├── database/                   # Database Scripts
│   ├── schema.sql              # Relational schema definition (with spatial lat/lng & notifications)
│   └── seed.sql                # Seed data SQL script
├── .env.example                # Environment variables template
├── package.json                # Monorepo runner
└── README.md                   # Exploria V2 Documentation
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
Clone the repository and run setup:

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
GEMINI_API_KEY=your_google_gemini_api_key
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

### AI Travel Planner & Notifications V2
- `POST /api/travel-planner` - Generate AI travel itinerary
- `GET /api/notifications` - Fetch user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

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
- `GET /api/weather?city=...` - Fetch live weather & 5-day forecast
- `POST /api/chat` - Interact with AI & FAQ chatbot

### Bookings & Admin
- `POST /api/bookings` - Create tour reservation (`BK-XXXXXXXX`) with auto-notification
- `GET /api/stats/admin` - Fetch admin KPI metrics & analytics

---

## 🛡️ Security & Production Quality Standards
- Secrets and API keys stored exclusively in `.env` (excluded via `.gitignore`).
- Password hashing powered by **bcryptjs**.
- Role-based route authorization guards on both API middleware and React frontend layouts.
- Zero fake/static placeholders; all views sync with relational backend APIs and SQLite database.

