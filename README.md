# 🌍 Aurelian Travels

> **Explore the world from your screen — then go live it.**

Aurelian Travels is a full-stack travel booking web application that lets users discover, review, and book curated travel destinations across Kenya and internationally. From safari packages in the Maasai Mara to beach retreats in Zanzibar, the platform makes trip planning seamless and enjoyable.

🔗 **Live Demo:** [https://aurelian-travels-frontend.onrender.com](https://aurelian-travels-frontend.onrender.com)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Authors](#-authors)
- [License](#-license)

---

## 🗺 Overview

Aurelian Travels bridges the gap between travel inspiration and booking action. Users can:

- Browse rich destination cards for Kenyan and international holidays
- Add destinations to their cart and fill in booking details
- Review past trips and rate destinations
- Suggest new destinations for the community
- Authenticate securely via Google OAuth or Apple Sign-In

The backend is a RESTful Flask API connected to a PostgreSQL database, while the frontend is a React SPA with SCSS styling and React Context for state management.

---

## ✨ Features

### 🏖 Destination Browsing
- Separate pages for **Kenyan Holidays** and **International Holidays**
- Horizontal carousels with scroll controls and dot indicators for destinations and packages
- Each card displays: image, title, location, star rating, price, description, and an Add to Cart button

### 🔍 Search & Filter
- Search destinations by **title**, **location**, or **maximum price**
- Results update in real time on the home page

### 🛒 Cart & Booking
- Add destinations to a persistent cart
- Fill in traveller details (name, email, travel dates, number of guests, special requests) per item
- Proceed to a **Summary** page showing all bookings with a total amount
- Edit or remove bookings before finalising
- Pay via **M-Pesa** or **Card** (payment UI included)

### ⭐ Reviews
- Submit star ratings (1–5) and written reviews per destination
- View aggregated ratings and review counts on destination cards

### 💡 Destination Suggestions
- Community-driven suggestion form on both Kenyan and International holiday pages
- Submitted suggestions are saved and surfaced immediately

### 🔐 Authentication
- **Google OAuth 2.0** (auth-code flow via popup)
- **Apple Sign-In**
- **JWT** access + refresh token management
- Persistent login via token storage in context
- Protected routes (Summary page requires login)

### 📱 Responsive Design
- Fully responsive across mobile, tablet, and desktop
- Mobile navigation drawer with smooth slide-in animation

---


> Visit the live site: [aurelian-travels-frontend.onrender.com](https://aurelian-travels-frontend.onrender.com)

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Flask** (Python 3.11) | Web framework & REST API |
| **Flask-SQLAlchemy** | ORM for database models |
| **Flask-Migrate** | Database schema migrations (Alembic) |
| **Flask-JWT-Extended** | JWT access & refresh token auth |
| **Flask-Bcrypt** | Password hashing |
| **Flask-CORS** | Cross-Origin Resource Sharing |
| **Psycopg2** | PostgreSQL adapter |
| **Gunicorn** | WSGI server for production |
| **Python-dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI component library |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **SCSS (Sass)** | Component-level styling |
| **React Context API** | Global state (cart, auth) |
| **@react-oauth/google** | Google OAuth integration |
| **React Icons** | Icon library |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| **PostgreSQL** | Relational database |
| **Render** | Hosting for backend, frontend & database |

---

## 📁 Project Structure

```
aurelian-travels/
├── server/                         # Flask backend
│   ├── app.py                      # App factory, routes, CORS config
│   ├── models.py                   # SQLAlchemy models (User, Destination, Booking, Review)
│   ├── extensions.py               # db, migrate, jwt, bcrypt instances
│   ├── config.py                   # Config classes (Development, Production)
│   ├── seed.py                     # Database seeding script
│   ├── requirements.txt            # Python dependencies
│   ├── migrations/                 # Alembic migration files
│   └── .env                        # Backend environment variables (not committed)
│
├── client/                         # React frontend
│   ├── public/                     # Static assets & index.html
│   └── src/
│       ├── Components/
│       │   ├── Navbar/             # Navbar, AuthPromptModal, AppleLogin
│       │   ├── Home/               # Hero section, search, destination grid
│       │   ├── KenyanHolidays/     # Kenyan destinations & packages carousel
│       │   ├── InternationalHolidays/ # International carousel & suggestion form
│       │   ├── MyCart/             # Cart items & booking forms
│       │   ├── Summary/            # Booking summary & payment section
│       │   ├── Footer/             # Footer with subscribe form & links
│       │   └── context/
│       │       └── CartContext.jsx # Global cart & auth state
│       ├── utils/
│       │   └── api.js              # Axios instance (reads REACT_APP_API_URL)
│       ├── config/
│       │   └── auth.js             # Google/Apple client IDs
│       ├── App.js                  # Route definitions
│       └── index.js                # React entry point
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Python **3.11+**
- Node.js **18+**
- PostgreSQL **14+**
- Git

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/aurelian-travels.git
cd aurelian-travels/server

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your .env file (see Environment Variables section below)

# 5. Run the development server
python app.py
# Backend runs at http://localhost:5000
```

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd ../client

# 2. Install dependencies
npm install

# 3. Create your .env file (see Environment Variables section below)

# 4. Start the development server
npm start
# Frontend runs at http://localhost:3000
```

---

### Database Setup

```bash
# 1. Create the PostgreSQL database
psql -U your_username -c "CREATE DATABASE aurelian_travels;"

# 2. Run migrations from the server/ directory
flask db init        # only needed on first run
flask db migrate -m "initial migration"
flask db upgrade

# 3. Seed the database with sample destinations
python seed.py
```

---

## 🔑 Environment Variables

### Backend (`server/.env`)

```env
SECRET_KEY=your-flask-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=postgresql://username:password@localhost:5432/aurelian_travels
FLASK_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=postmessage

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Apple Sign-In
APPLE_CLIENT_ID=com.yourapp.id
```

### Frontend (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register with email & password | No |
| `POST` | `/api/auth/login` | Login with email & password | No |
| `POST` | `/api/auth/google` | Login with Google OAuth code | No |
| `POST` | `/api/auth/apple` | Login with Apple Sign-In | No |
| `POST` | `/api/auth/logout` | Logout & invalidate token | Yes |
| `POST` | `/api/auth/refresh` | Refresh access token | Yes (refresh token) |

### Destinations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/destinations` | Get all destinations (supports `?search=`, `?type=`, `?max_price=`) | No |
| `GET` | `/api/destinations/<id>` | Get single destination | No |
| `POST` | `/api/destinations/suggest` | Submit a destination suggestion | No |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/destinations/<id>/reviews` | Submit a review | Yes |
| `GET` | `/api/destinations/<id>/reviews` | Get all reviews for a destination | No |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/bookings` | Get current user's bookings | Yes |
| `POST` | `/api/bookings` | Create a booking | Yes |
| `PUT` | `/api/bookings/<id>` | Update booking details | Yes |
| `DELETE` | `/api/bookings/<id>` | Cancel a booking | Yes |

### Subscriptions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/subscribe` | Subscribe to newsletter | No |

---

## ☁️ Deployment

The application is deployed on **Render** (free tier):

| Service | Type | URL |
|---------|------|-----|
| Frontend | Static Site | [aurelian-travels-frontend.onrender.com](https://aurelian-travels-frontend.onrender.com) |
| Backend | Web Service | `https://aurelian-travels.onrender.com` |
| Database | PostgreSQL | Render managed DB (Oregon region) |

### Deployment Notes

- The backend uses **Gunicorn** as the WSGI server: `gunicorn app:app`
- The database connection uses `sslmode=require` for secure connections on Render
- The frontend reads `REACT_APP_API_URL` at build time — ensure this is set in Render's environment variables before deploying
- Google OAuth requires the frontend URL to be added to **Authorized JavaScript Origins** in Google Cloud Console

### Render Build Commands

**Backend:**
```
Build: pip install -r requirements.txt
Start: gunicorn app:app
Root Directory: server
```

**Frontend:**
```
Build: npm install && npm run build
Publish Directory: client/build
Root Directory: client
```

---

## 🔮 Future Enhancements

- [ ] Favorites list with personal notes per destination
- [ ] Full CRUD for user-submitted destinations (with admin approval)
- [ ] Formik + Yup for robust form validation
- [ ] Map-based destination discovery (Google Maps / Leaflet)
- [ ] Rating and price filters on browse pages
- [ ] User profile management page
- [ ] Email confirmation on booking
- [ ] Real payment gateway integration (Stripe / M-Pesa Daraja API)
- [ ] Multilingual support (Swahili / English)

---

## 👥 Authors

This project was built with ❤️ by:

| Name | Email |
|------|-------|
| **Edith Gatwiri** | edithgatwiri70@gmail.com |
| **Elly James** | ellykomunga@gmail.com |
| **Helen Wairagu** | hwangari3@gmail.com |
| **Ian Gathua** | gathuambui@gmail.com |
| **Edwin Ngigi** | edwinngigi313@gmail.com |

Stuck or experiencing an issue? Reach out via any of the emails above — we're happy to help.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with passion for travel and great code ✈️</p>
  <a href="https://aurelian-travels-frontend.onrender.com">🌐 Visit Aurelian Travels</a>
</div>