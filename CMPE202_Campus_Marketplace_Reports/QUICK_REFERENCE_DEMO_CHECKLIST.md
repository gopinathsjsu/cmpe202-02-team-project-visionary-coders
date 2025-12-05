# Campus Marketplace (Campify)
## Quick Reference Guide & Demo Day Checklist

---

## Document Overview

This project report package includes:

1. **CMPE202_PROJECT_REPORT.md** (Main Report)
   - Executive summary
   - Complete project overview
   - All team member contributions
   - Architecture details
   - Compliance checklist

2. **ARCHITECTURE_DOCUMENTATION.md** (Technical Details)
   - Database schema diagrams
   - API flows
   - WebSocket architecture
   - NLP search details
   - Security diagrams
   - Deployment procedures

3. **TEAM_CONTRIBUTIONS_XP_VALUES.md** (Team Details)
   - Individual team member breakdown
   - Specific features by person
   - XP core values implementation
   - GitHub contribution analysis

4. **This Document** (Quick Reference)
   - Quick start commands
   - Demo day checklist
   - Key URLs and endpoints
   - Troubleshooting guide

---

## Quick Start Commands

### Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate
source .venv/bin/activate  # Linux/Mac
# or
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
SECRET_KEY=dev-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=60
MEDIA_DIR=./media
DATABASE_URL=sqlite:///./db.sqlite3
OPENAI_API_KEY=sk-your-key-here
EOF

# Seed mock data
python -m app.db.seed_data

# Start server
uvicorn app.main:app --reload
```

**Backend running on:** `http://localhost:8000`  
**Swagger UI:** `http://localhost:8000/docs`

### Frontend Setup (5 minutes)

```bash
# Navigate to frontend
cd campus-marketplace-frontend/modified-frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
EOF

# Start development server
npm run dev
```

**Frontend running on:** `http://localhost:3000`

---

## Test Credentials

### Sample Users (from seed data)

**Admin User:**
```
Email: admin@college.edu
Password: AdminPass123!
Role: Admin
```

**Seller User:**
```
Email: seller@college.edu
Password: SellerPass123!
Role: Seller
```

**Buyer User:**
```
Email: buyer@college.edu
Password: BuyerPass123!
Role: Buyer
```

---

## Key API Endpoints

### Authentication
```
POST   /auth/register          Register new user
POST   /auth/login             Login (returns JWT)
POST   /auth/refresh           Refresh token
GET    /auth/me                Get current user
```

### Marketplace
```
GET    /listings               Get all listings
GET    /listings/{id}          Get listing detail
POST   /listings               Create listing (seller)
PATCH  /listings/{id}          Update listing
PATCH  /listings/{id}/sold     Mark as sold
```

### Search
```
GET    /search?q=query         Keyword search
GET    /search?q=query&category=electronics&min_price=100&max_price=500
POST   /search/nl              NL search with ChatGPT
```

### Chat
```
GET    /chat/rooms             Get chat rooms
GET    /chat/rooms/{id}/history   Get message history
WS     /ws/chat/{room_id}      WebSocket connection
```

### Admin
```
GET    /admin/dashboard        Get statistics
GET    /admin/users            List users
GET    /admin/listings         List all listings
GET    /reports                Get reports
PATCH  /reports/{id}/resolve   Resolve report
```

---

## Demo Day Checklist

### Before Demo (30 mins before)

**System Checks:**
- [ ] Both backend and frontend running
- [ ] Database has mock data loaded
- [ ] OpenAI API key configured (or test fallback search)
- [ ] All ports accessible (8000, 3000)
- [ ] No compilation errors

**Test Data Ready:**
- [ ] At least 10 listings created
- [ ] Multiple categories represented
- [ ] Price ranges varied ($20 - $500+)
- [ ] Sample photos uploaded
- [ ] Multiple users registered

**Demo Devices:**
- [ ] Projector/screen working
- [ ] Internet connection stable
- [ ] Backup internet (mobile hotspot)
- [ ] Demo laptop fully charged
- [ ] Browser tabs pre-opened and ready

### Demo Flow (15 minutes total)

**1. Introduction (1 min)**
- Project name: Campify
- Team: Visionary Coders
- Brief overview of features

**2. Authentication (2 mins)**
- [ ] Show registration with college email validation
- [ ] Show login with different roles
- [ ] Show role-based access (seller vs buyer vs admin)

**3. Marketplace (2 mins)**
- [ ] Browse marketplace
- [ ] Show featured listings
- [ ] Demonstrate search with filters (category, price)
- [ ] Show listing detail page

**4. NLP Search (2 mins)**
- [ ] Enter natural language query: "laptop for programming under 500"
- [ ] Show results
- [ ] Fallback: Show keyword search if API unavailable

**5. Seller Features (2 mins)**
- [ ] Create new listing with title, description, photos, price
- [ ] Show listing appears in marketplace
- [ ] Show seller dashboard

**6. Chat (2 mins)**
- [ ] From buyer account, contact seller
- [ ] Send message to seller
- [ ] Switch to seller account
- [ ] Show real-time message received
- [ ] Reply to buyer

**7. Admin Features (2 mins)**
- [ ] Show admin dashboard with statistics
- [ ] Show user management
- [ ] Show report system
- [ ] Demonstrate moderation action

**8. Technical (1 min)**
- [ ] Show Swagger documentation (/docs)
- [ ] Quick architecture overview
- [ ] Show GitHub repository

### Key Demo Phrases

**Opening:**
> "Campify is a campus-exclusive marketplace where students can buy and sell items. It's similar to Facebook Marketplace but designed specifically for college communities with college email verification."

**Feature Highlight:**
> "Our search includes AI-powered natural language search. You can ask 'Do you have a textbook for CMPE 202?' and our system will intelligently find matching listings."

**Technical Highlight:**
> "The platform is built with Next.js on frontend and FastAPI on backend, with real-time chat using WebSocket technology and role-based access control for security."

---

## Common Issues & Fixes

### Backend Won't Start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Error:** `Address already in use`
```bash
# Solution: Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8000   # Windows (find PID then taskkill /PID <id>)

# Or use different port
uvicorn app.main:app --reload --port 8001
```

**Error:** `Database file not found`
```bash
# Solution: Reset database
python reset_schema.py
python -m app.db.seed_data
```

### Frontend Won't Start

**Error:** `Port 3000 already in use`
```bash
# Use different port
npm run dev -- -p 3001
```

**Error:** `Cannot find module`
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

**Error:** `CORS error in browser console`
```
Solution: Backend CORS is configured but check:
1. Frontend URL in backend CORS config
2. Backend is actually running
3. Correct API URL in .env.local
```

**Error:** `JWT token invalid`
```bash
# Solution: Check token expiration and refresh
- Ensure SECRET_KEY is same in backend .env
- Try logging in again to get new token
- Check token format in API requests
```

### Chat Not Working

**WebSocket Error:** `Failed to establish connection`
```
Check:
1. Both services running
2. Firewall not blocking WebSocket
3. Browser console for specific error
4. Backend logs for connection issues
```

---

## Performance Tips for Demo

### Database Query Performance
- Pre-load 50+ listings in development database
- Index key columns (category, price, seller_id)
- Use pagination to avoid loading all items

### Frontend Performance
- Pre-build frontend before demo
- Close unnecessary browser tabs
- Clear browser cache if needed
- Use incognito mode for clean session

### Network Considerations
- Both services on same machine = no network delay
- For remote demo, ensure stable connection
- Have screenshots/video backup if internet fails

---

## File Structure for Demo

```
project-root/
├── backend/                              # FastAPI
│   ├── app/
│   │   ├── routers/ → [API endpoints]
│   │   ├── models/ → [Data models]
│   │   └── services/ → [Business logic]
│   ├── Dockerfile
│   ├── requirements.txt
│   └── db.sqlite3 → [Local database]
│
├── campus-marketplace-frontend/
│   └── modified-frontend/               # Next.js
│       ├── src/app/ → [Pages]
│       ├── src/components/ → [React components]
│       ├── package.json
│       └── .env.local
│
└── README.md                             # Overview
```

---

## Deployment Verification

### Verify Backend Deployment
```bash
# Check if service is running
curl http://localhost:8000/docs

# Check API health
curl http://localhost:8000/health

# List available endpoints
curl http://localhost:8000/openapi.json | jq
```

### Verify Frontend Deployment
```bash
# Check if service is running
curl http://localhost:3000

# Check specific page
curl http://localhost:3000/marketplace
```

---

## Post-Demo

### Questions to Prepare For

**Architecture Questions:**
> "Why did you choose FastAPI and Next.js?"
- **Answer:** FastAPI is modern Python framework with async support and automatic API docs. Next.js provides SSR, SSG, and excellent React tooling.

**Scalability Questions:**
> "How would this handle 10,000 concurrent users?"
- **Answer:** Auto-scaling EC2 group, load balancer, database read replicas, CDN for static assets, WebSocket connection pooling.

**Security Questions:**
> "How do you prevent unauthorized access?"
- **Answer:** JWT tokens, role-based middleware, college email validation, bcrypt password hashing, CORS configuration, SQL injection prevention via ORM.

**NLP Search Questions:**
> "What if OpenAI API fails?"
- **Answer:** Automatic fallback to keyword search, error logging, user notification, caching to reduce API calls.

---

## GitHub Repository Links

**Main Repository:**
- Link: [GitHub Classroom Link]
- Project Journal: In repository wiki or docs/
- Sprint Artifacts: Google Sheets (linked in README)

**Key Files to Show:**
- `README.md` - Project overview
- `backend/app/main.py` - API structure
- `backend/app/routers/` - Endpoint implementations
- `campus-marketplace-frontend/modified-frontend/src/` - Frontend pages
- `backend/docs/diagrams.md` - Architecture diagrams
- `docs/` - Additional documentation

---

## Video/Screenshots for Backup

If demo fails, have ready:
- [ ] Screenshots of each user role dashboard
- [ ] Screen recording of NLP search demo
- [ ] Chat interaction screenshots
- [ ] Architecture diagram images
- [ ] API documentation screenshots

---

## Contact Information

**For Technical Issues:**
- Backend/DevOps: Girith (girith@college.edu)
- Frontend/NLP: Krishna (krishna@college.edu)
- Dashboard: Tej (tej@college.edu)
- UI/Chat: Manasa (manasa@college.edu)

---

## Success Criteria

✅ **Demo is Successful if:**
1. Application loads without errors
2. Can register and login with multiple roles
3. Search functionality works (with or without ChatGPT)
4. Can create listing with photos
5. Real-time chat works between users
6. Admin can see dashboard and reports
7. All 3 roles have appropriate permissions

✅ **Expected Outcome:**
- Fully functioning marketplace prototype
- Clear demonstration of all key features
- Professional presentation of technical implementation

---

## Additional Resources

**Official Documentation:**
- FastAPI: https://fastapi.tiangolo.com
- Next.js: https://nextjs.org
- SQLAlchemy: https://www.sqlalchemy.org
- OpenAI: https://platform.openai.com/docs

**Project Documentation:**
- See main project report for detailed information
- Architecture documentation for technical deep dive
- Team contributions document for individual work

---

## Submission Checklist

### For GitHub
- [x] All code committed to repository
- [x] README.md with team info and links
- [x] Project journal with weekly reports
- [x] Sprint backlogs and burndown charts
- [x] Architecture diagrams
- [x] Wireframes in documentation

### For Demo Day
- [x] Live demo of working application
- [x] All team members present or represented
- [x] Prepared talking points
- [x] Technical documentation ready
- [x] Git history showing contributions

### For Grading
- [x] 70% - Implementation of working features
- [x] 30% - Agile process, diagrams, documentation

---

## Final Notes

1. **Keep it Simple:** Focus on core features during demo, not edge cases
2. **Practice:** Run through demo at least 2-3 times before Demo Day
3. **Backup Plan:** Have screenshots and explain features if tech fails
4. **Be Confident:** You built a complete system - be proud of the work!
5. **Answer Honestly:** If asked about limitations, be honest and explain trade-offs

---

**Good Luck with Demo Day!**

**Prepared by:** Visionary Coders  
**Date:** December 4, 2025

---

## Quick Links Reference

| What | Where | How to Access |
|---|---|---|
| Backend API | `http://localhost:8000` | Running `uvicorn app.main:app --reload` |
| API Docs | `http://localhost:8000/docs` | Automatic Swagger UI |
| Frontend | `http://localhost:3000` | Running `npm run dev` |
| Database | `backend/db.sqlite3` | SQLite file (SQL Studio or CLI) |
| Code | GitHub | Repository link in README |
| Diagrams | `backend/docs/` | Markdown files with Mermaid |
| Tests | `pytest -q` | From backend directory |

---

**Document Version:** 1.0  
**Last Updated:** December 4, 2025
