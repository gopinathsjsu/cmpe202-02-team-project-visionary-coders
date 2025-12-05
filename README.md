# Campify 

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
- Node.js 18+
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
- Manasa Sadhu
- Girith Chaudary
- Krishna Panjiyar
- Tejkiran Yenugunti 