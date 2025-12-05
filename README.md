# Campify 

**Team: Visionary Coders**

## Project Overview
Campus Marketplace is a comprehensive platform designed exclusively for college students to buy and sell items within their campus community. It functions similarly to Facebook Marketplace but with enhanced security and features tailored for students, including .edu email verification.

The platform supports three distinct user roles:
- **Buyer**: Browse listings, search for items, and chat with sellers.
- **Seller**: Create and manage listings, upload photos, and negotiate with buyers.
- **Admin**: Moderate listings, manage users, and view platform statistics.

## Architecture
The application follows a modern decoupled architecture:

- **Frontend**: Built with **Next.js 15** (React 19) and **TypeScript**, utilizing **Tailwind CSS** for styling. It handles the user interface, client-side routing, and interacts with the backend via REST APIs.
- **Backend**: Powered by **FastAPI** (Python), providing a high-performance REST API. It handles business logic, authentication (JWT), data persistence, and integrates with external services like OpenAI for natural language search.
- **Database**: Uses **SQLite** for local development and is configured to use **PostgreSQL** for production environments.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State/Validation**: React Hook Form, Zod
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ORM**: SQLAlchemy
- **Database**: SQLite (Local), PostgreSQL (Production)
- **Server**: Uvicorn

## Getting Started

### Prerequisites
- Node.js 18+ (JavaScript & TypeScript)
- Python 3.11+
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file (copy from example or set manually):

   ```bash
   # security
   SECRET_KEY=dev-secret-change-me
   ACCESS_TOKEN_EXPIRE_MINUTES=60

   # storage

   MEDIA_DIR=./media

   # optional OpenAI for NL search

   OPENAI_API_KEY=sk..

   # database (defaults to SQLite file db.sqlite3 if omitted)

   DATABASE_URL=sqlite:///./db.sqlite3
   ```
   
5. Seed the database with mock data (optional):
   ```bash
   python -m app.db.seed_data
   ```
6. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`. API docs are at `/docs`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd campus-marketplace-frontend/modified-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   # OpenAI API Key (for AI search)
   NEXT_PUBLIC_OPENAI_API_KEY=sk...
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Deployment

### Backend
The backend is configured for deployment on **Microsoft Azure**.
- **Database**: Azure Database for PostgreSQL.
- **Compute**: Azure App Service or Virtual Machine.
- **CI/CD**: GitHub Actions (configured in `.github/workflows`).

### Frontend
The frontend is optimized for deployment on **Vercel** or **Railway**.
- Connect the repository to Vercel/Railway.
- Configure the `NEXT_PUBLIC_API_URL` environment variable to point to the deployed backend URL.

## Team Members

### Team: Visionary Coders

| Member | Primary Contributions | Secondary Contributions |
|--------|----------------------|------------------------|
| **Manasa Sadhu** | Buyer & Seller UI (Browse, Search, Filters), Product Details Page, Sign-In & Sign-Up Pages, Real-time Chat System, Database Design & Seeding, Mock Data Generation | API Integration, Authentication & Authorization, Input Validation, Database Optimization |
| **Krishna Panjiyar** | Natural Language Processing (NLP) Search Engine, Chatbot Integration with GPT API, Search Optimization, Query Processing | Backend API Endpoints for Search, Database Query Optimization, AI Integration |
| **Tejkiran Yenugunti** | Admin Dashboard & Moderation Panel, Listing Approval Workflow, User Management Interface, Report Handling System | Backend Admin API Endpoints, Role-Based Access Control, Analytics, User Moderation |
| **Girith Choudhary** | Cloud Deployment (Azure/AWS), CI/CD Pipeline Setup, Infrastructure as Code, Auto-Scaling Configuration, Load Balancer Setup, Chat system to make offer, FastAPI endpoints, Buyer Report Listing | Database Migration, Environment Configuration, Monitoring & Logging, DevOps,  |

## Key Features Implemented

- **Buyer Features**: Browse listings, advanced search with NLP, price/category filters, real-time chat with sellers
- **Seller Features**: Create/edit/delete listings, upload product photos, mark items as sold, negotiate with buyers
- **Admin Features**: Approve/reject listings, manage users, handle reports, view platform statistics
- **Search System**: Natural language based search using GPT API (e.g., "Do you have a textbook for CMPE202?")
- **Real-time Chat**: In-app messaging between buyers and sellers for price negotiation
- **Authentication**: JWT-based secure authentication with .edu email verification
- **Cloud Deployment**: Auto-scaled infrastructure with load balancing

## Demo Features

### 1. **Web-Based UI - Fully Integrated with API & Database**
- Responsive web application running on Next.js
- Real-time integration with backend API
- Live database connectivity showing persistent data

### 2. **Seller Role Features**
- **Create & Manage Listings**: Form to add new items with title, description, price, category
- **Photo Upload**: Upload product photos with preview
- **View Listings**: Dashboard showing all seller's active listings
- **Listing Details**: View complete information for each listing
- **Mark as Sold**: Toggle listing status to mark items as sold
- **In-App Chat**: Receive and respond to buyer messages for each listing

### 3. **Buyer Role Features**
- **Browse Listings**: View all available products across campus
- **Listing Details**: Click on items to see full details including photos, price, location, seller info
- **Search & Filter**: 
  - Filter by category (textbooks, gadgets, furniture, clothing, sports, essentials)
  - Filter by price range (min/max)
  - Standard keyword search
- **AI-Powered Natural Language Search**: 
  - Ask questions like "Do you have a textbook for CMPE202?"
  - "Show me gaming laptops under $800"
  - GPT-powered query understanding and results
- **In-App Chat**: Send messages to sellers for price negotiation
- **Report Listings**: Report incomplete or suspicious listings to admin

### 4. **Admin Role Features**
- **Admin Dashboard**: View platform statistics and pending items
- **Listing Moderation**: Approve or reject seller listings
- **Delete Listings**: Remove inappropriate or duplicate listings
- **Manage Users**: View registered users and their roles
- **Handle Reports**: View and process buyer reports

### 5. **Real-Time Chat System (All Users)**
- **Buyer → Seller**: Send inquiries about products
- **Seller → Buyer**: Respond to buyer messages
- **Chat History**: View conversation thread for each listing
- **Real-time Updates**: Live message delivery

### 6. **Cloud Deployment & Infrastructure**
- **API Hosting**: Running on AWS EC2 or Azure with auto-scaling
- **Database Hosting**: PostgreSQL on managed cloud database service
- **Load Balancer**: Distributes traffic across instances
- **Auto-Scaling**: Infrastructure scales based on demand
- **Configuration Display**: Show cloud setup details and architecture

### 7. **Network Activity Visualization**
- **Browser Console**: Display Network tab showing all API calls
- **API Endpoints Demonstrated**:
  - `GET /listings` - Fetch all listings
  - `POST /listings` - Create new listing
  - `GET /listings/{id}` - Get listing details
  - `PUT /listings/{id}` - Update listing
  - `DELETE /listings/{id}` - Delete listing
  - `POST /chat` - Send message
  - `GET /chat/{listing_id}` - Get conversation
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `POST /search/nlp` - NLP-powered search
  - `GET /admin/listings` - Admin approval panel
- **Request/Response Headers**: Show authentication tokens (JWT)
- **Response Times**: Demonstrate API performance

### Demo Flow (15-20 minutes)
1. **Login** - Show sign-in with different user roles (buyer, seller, admin)
2. **Seller Demo** - Create a listing, upload photo, view dashboard
3. **Buyer Demo** - Search listings, use NLP search, view details
4. **Chat Demo** - Send/receive messages between buyer and seller
5. **Admin Demo** - Approve listings, delete inappropriate content, view reports
6. **Search Features** - Show standard search, filters, and AI-powered NL search
7. **Network Console** - Open browser Network tab and show API calls in real-time
8. **Cloud Infrastructure** - Display deployment diagram and infrastructure details

### Technology Stack Demonstrated
- **Frontend**: Next.js 15.5.4 with React 19, Tailwind CSS, TypeScript
- **Backend**: FastAPI with Python, SQLAlchemy ORM
- **Database**: PostgreSQL (Cloud-hosted)
- **Authentication**: JWT-based secure authentication
- **AI/NLP**: GPT API integration for natural language search
- **Cloud**: AWS EC2 with Auto-Scaling & Load Balancer (or Azure equivalent)
- **Real-time**: WebSocket for live chat updates 
