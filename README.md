# Aurelian Travels

Aurelian Travels is a full-stack web application that allows users to explore, suggest, and book travel destinations in Kenya and internationally. 
Users can browse single destinations and holiday packages, submit suggestions for new destinations, leave reviews, and manage bookings. 

The application is built with a Flask API backend and a React frontend, providing a seamless user experience for travel enthusiasts.

## Table of Contents
- [Aurelian Travels](#aurelian-travels)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Database](#database)
  - [Project Structure](#project-structure)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Database Setup](#database-setup)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Destinations](#destinations)
    - [Reviews](#reviews)
    - [Bookings](#bookings)
  - [Future Enhancements](#future-enhancements)
    - [Authors](#authors)
  - [License](#license)

## Features
Aurelian Travels offers the following features:

- **Browse Destinations**:
  - View Kenyan and International destinations, categorized into single destinations and holiday packages
  - Each destination includes details like title, location, description, fees, and an image

- **Suggest New Destinations**:
  - Users can suggest new destinations via form submission
  - Suggestions are saved and immediately visible on the frontend

- **User Authentication**:
  - Register and log in with email/password
  - Google and Apple OAuth login support
  - JWT-based authentication with token refresh
  - Logout functionality

- **Reviews**:
  - Submit reviews with ratings (1-5) and optional comments
  - View destination reviews with reviewer details

- **Bookings**:
  - Book destinations with travel details
  - View and cancel bookings

- **Search and Filter**:
  - Search by title, location, or maximum price

- **Responsive Design**:
  - Mobile-friendly interface

## Technologies Used

### Backend
- Flask (Python web framework)
- Flask-SQLAlchemy (ORM)
- Flask-Migrate (Database migrations)
- Flask-JWT-Extended (Authentication)
- Flask-Bcrypt (Password hashing)
- Flask-CORS (Cross-Origin Resource Sharing)
- Psycopg2 (PostgreSQL adapter)
- Python-dotenv (Environment variables)

### Frontend
- React
- React Router
- Axios (HTTP client)
- Sassy SCSS (Styling)
- React Context API (State management)

### Database
- PostgreSQL

## Project Structure

```text
aurelian-travels/
├── server/                        # Backend code
│   ├── app.py                     # Main Flask application
│   ├── models.py                  # Database models
│   ├── extensions.py              # Flask extensions
│   ├── migrations/                # Database migrations
│   ├── seed.py                    # Database seeding script
│   └── .env                       # Environment variables
├── client/                        # Frontend code
│   ├── src/                       # React source
│   │   ├── components/            # React components
│   │   ├── context/               # State management
│   │   ├── App.js                 # Main app
│   │   └── index.js               # Entry point
│   ├── public/                    # Static assets
│   ├── package.json               # Dependencies
│   └── .env                       # Environment variables
├── README.md                      # Documentation
└── .gitignore                     # Git ignore rules

```

##  Setup Instructions

### Prerequisites
Python 3.11+

Node.js 18+

PostgreSQL

Git

### Backend Setup
 * Clone the repository: ``git clone https://github.com/your-username/   aurelian-travels.git``
  
* cd aurelian-travels/server
* Set up virtual environment: ``python -m venv venv``

* Install dependencies: pip install -r requirements.txt
* Configure environment variables (create .env file): ``env``

    * SECRET_KEY=your-secret-key
    * JWT_SECRET_KEY=your-jwt-secret-key
   * DATABASE_URL=postgresql://username:password@localhost:5432/aurelian_travels
  
* Run the backend:

   * python app.py
  
### Frontend Setup

* Navigate to frontend directory: ``cd ../client``

* Install dependencies: ``npm install``
* Configure environment variables (create .env file): ``env``
    * REACT_APP_API_URL=http://localhost:5000
* Run the frontend: ``npm start``


### Database Setup
* Create PostgreSQL database: ``psql -U username -c "CREATE DATABASE aurelian_travels;"``
* Apply migrations:
    * flask db init
    * flask db migrate
    * flask db upgrade
    * Seed database:``python seed.py``

* Start both backend (python app.py) and frontend (npm start)

* Access the application at http://localhost:3000
## API Endpoints

### Authentication
- **POST** `/api/auth/register`  
  User registration
- **POST** `/api/auth/login`  
  User login
- **POST** `/api/auth/logout`  
  User logout
- **POST** `/api/auth/refresh`  
  Refresh token

### Destinations
- **GET** `/api/destinations`  
  Get all destinations
- **GET** `/api/destinations/<id>`  
  Get specific destination
- **POST** `/api/destinations/suggest`  
  Suggest new destination

### Reviews
- **POST** `/api/destinations/<id>/reviews`  
  Submit review
- **GET** `/api/destinations/<id>/reviews`  
  Get destination reviews

### Bookings
- **GET** `/api/bookings`  
  Get user bookings
- **POST** `/api/bookings`  
  Create booking
- **DELETE** `/api/bookings/<id>`  
  Cancel booking

## Future Enhancements
- Implement favorites with user notes
- Full CRUD for all resources
- Formik integration for forms
- Map-based destination search
- Rating filters
- Profile management


### Authors
* Edith Gatwiri  <edithgatwiri70@gmail.com>
* Elly James    <ellykomunga@gmail.com>
* Helen Wairagu  <hwangari3@gmail.com>
* Ian Gathua
* Edwin Ngigi

Incase you are stuck or experiencing any error, reach out to us via our respective emails

## License
This project is licensed under the MIT License.


