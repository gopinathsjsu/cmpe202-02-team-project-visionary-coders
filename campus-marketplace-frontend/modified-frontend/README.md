# Campus Marketplace - Frontend Application

A Next.js frontend application for a campus-exclusive marketplace where students can buy and sell textbooks, gadgets, and essentials. Features AI-powered natural language search, in-app chat, and role-based access for Buyers, Sellers, and Admins.

## Project Description

**Campus Marketplace** is similar to Facebook Marketplace but exclusively for college students. The platform enables:
- Buying and selling textbooks, electronics, furniture, and essentials
- Natural language AI search (e.g., "Do you have a textbook for CMPE 202?")
- In-app chat for negotiation
- Photo uploads for listings
- Admin moderation and reporting

### Roles

1. **Seller** - Create and manage listings with photos
2. **Buyer** - Search, filter, browse, and chat with sellers
3. **Admin** - Moderate listings, handle reports, manage users

## Key Features

### 🛍️ **Marketplace Features**
- Browse listings by category (Textbooks, Electronics, Furniture, etc.)
- Create listings with title, description, price, photos, and condition
- Search and filter by category, price range, and keywords
- Mark items as sold
- Report suspicious or incomplete listings to admin

### 🤖 **AI-Powered Search**
- Natural language search using ChatGPT API
- Ask questions like "Do you have a textbook for CMPE 202?"
- Intelligent results based on item descriptions and categories

### 💬 **In-App Chat**
- Real-time messaging between buyers and sellers
- Negotiate prices and arrange meetups
- Chat history for all conversations

### 🔐 **Authentication**
- College email verification (only .edu domains)
- Sign up/Sign in with role selection
- JWT-based authentication
- Protected routes based on user roles

### 👥 **User Dashboards**
- **Buyer Dashboard**: View saved items, active chats, purchase history
- **Seller Dashboard**: Manage listings, view inquiries, track sales
- **Admin Dashboard**: Moderate content, view reports, manage users

## Supported College Domains

- sjsu.edu (San Jose State University)
- stanford.edu (Stanford University)
- berkeley.edu (UC Berkeley)
- ucla.edu (UCLA)
- usc.edu (USC)

*Add more domains in `src/lib/validation.ts`*

## Technology Stack

- **Next.js 15.5.4** - React framework
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **JWT** - Authentication
- **OpenAI API** - Natural language search (ChatGPT)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API (see Backend API Contract)
- OpenAI API key (for AI search feature)

## Installation

### 1. Install Dependencies

```bash
cd campus-marketplace-frontend
npm install
```

### 2. Environment Configuration

Create `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# OpenAI API Key (for AI search)
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here

# Optional: File upload configuration
NEXT_PUBLIC_MAX_FILE_SIZE=5242880  # 5MB
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
campus-marketplace-frontend/
├── src/
│   ├── app/                          # Next.js pages
│   │   ├── page.tsx                 # Homepage with hero, categories
│   │   ├── marketplace/             # Browse listings (future)
│   │   ├── listings/                # Create/manage listings (future)
│   │   ├── chat/                    # Messaging (future)
│   │   ├── auth/                    # Authentication
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── dashboard/               # User dashboard
│   │   └── admin/                   # Admin panel
│   ├── components/                   # React components
│   │   ├── Header.tsx              # Navigation
│   │   ├── SignInForm.tsx          # Sign in form
│   │   ├── SignUpForm.tsx          # Sign up form
│   │   └── ProtectedRoute.tsx      # Route protection
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.tsx         # Auth state
│   ├── lib/                          # Utilities
│   │   ├── api.ts                  # API client
│   │   └── validation.ts           # Form validation
│   └── types/                        # TypeScript types
│       └── auth.ts                 # Auth types
└── public/                           # Static assets
```

## Features Overview

### Homepage
- Hero section with AI-powered search bar
- Category browsing (Textbooks, Electronics, Furniture, etc.)
- Recent listings showcase
- Feature highlights (Campus Only, AI Search, Chat, Safety)
- Statistics and social proof
- How it works section

### Authentication
- Sign up with college email validation
- Role selection (Buyer/Seller/Admin)
- Password strength requirements
- Persistent sessions with JWT tokens
- Protected routes

### User Roles

#### Seller
- Create listings with photos
- Set price, condition, category
- Manage active/sold listings
- Respond to buyer inquiries
- Mark items as sold

#### Buyer
- Browse and search listings
- Filter by category and price
- Save favorite items
- Chat with sellers
- View purchase history

#### Admin
- View all listings
- Moderate content
- Handle user reports
- Manage users (suspend/delete)
- View platform statistics

## API Integration

### Required Backend Endpoints

#### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user

#### Listings
- `GET /api/listings` - Get all listings (with filters)
- `POST /api/listings` - Create listing
- `GET /api/listings/:id` - Get listing details
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `POST /api/listings/:id/sold` - Mark as sold

#### Search
- `POST /api/search/ai` - AI-powered natural language search
- `GET /api/search` - Traditional keyword search

#### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/send` - Send message
- `GET /api/chat/:conversationId` - Get messages

#### Admin
- `GET /api/admin/reports` - Get reported listings
- `POST /api/admin/moderate/:id` - Moderate listing
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user status

## Usage Guide

### For Students (Buyers/Sellers)

1. **Sign Up**
   - Go to `/auth/signup`
   - Enter college email (e.g., `student@sjsu.edu`)
   - Create secure password
   - Select "User" role

2. **Browse Marketplace**
   - Use AI search: "Do you have a textbook for CMPE 202?"
   - Or browse by category
   - Filter by price range

3. **Create a Listing** (Seller)
   - Click "Sell Something"
   - Upload photos
   - Add title, description, price
   - Set category and condition
   - Publish listing

4. **Chat with Sellers**
   - Click on a listing
   - Start conversation
   - Negotiate price
   - Arrange meetup

### For Admins

1. **Sign Up as Admin**
   - Use college email
   - Select "Admin" role
   - Access admin dashboard

2. **Moderate Content**
   - Review reported listings
   - Approve or remove content
   - Manage user accounts
   - View platform statistics

## AI Search Feature

The platform uses OpenAI's ChatGPT API for natural language search:

```typescript
// Example search query
"Do you have a textbook for CMPE 202?"

// AI processes and searches for:
- Keywords: "textbook", "CMPE 202"
- Category: "Textbooks"
- Course-specific items
```

### Implementing AI Search

1. Set OpenAI API key in `.env.local`
2. Backend processes natural language query
3. Extracts keywords and intent
4. Searches database
5. Returns relevant listings

## Security & Safety

### Email Validation
- Only college email addresses accepted
- Real-time domain verification
- One account per email

### Password Requirements
- Minimum 8 characters
- Uppercase and lowercase letters
- Numbers and special characters

### Content Moderation
- User reporting system
- Admin review process
- Automated flagging (future)

### Safe Trading
- Campus-only meetups encouraged
- User ratings (future)
- Transaction history
- Chat records

## Customization

### Adding College Domains

Edit `src/lib/validation.ts`:

```typescript
const VALID_COLLEGE_DOMAINS = [
  'sjsu.edu',
  'your-college.edu',  // Add here
];
```

### Adding Categories

Update categories in homepage and database schema:

```typescript
const categories = [
  { name: 'Textbooks', icon: '📚' },
  { name: 'Your Category', icon: '🎯' },  // Add here
];
```

## Development

### Running in Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Deployment

### Deploying to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### AWS/Cloud Deployment

1. Build application: `npm run build`
2. Set up EC2 instance with Node.js
3. Configure Load Balancer
4. Set environment variables
5. Start with PM2: `pm2 start npm --name "marketplace" -- start`

## Testing

### Test Accounts

**Regular User:**
- Email: `buyer@sjsu.edu`
- Password: `TestPass123!`

**Seller:**
- Email: `seller@sjsu.edu`
- Password: `TestPass123!`

**Admin:**
- Email: `admin@sjsu.edu`
- Password: `AdminPass123!`

## Troubleshooting

### Common Issues

**Email validation fails:**
- Ensure email ends with approved domain
- Check domain is in `VALID_COLLEGE_DOMAINS`

**API connection errors:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend is running
- Check CORS configuration

**AI search not working:**
- Verify OpenAI API key is set
- Check API rate limits
- Ensure backend has OpenAI integration

## Roadmap

### Phase 1 (Current)
- ✅ Authentication system
- ✅ Homepage with search
- ✅ User/Admin dashboards

### Phase 2 (Sprint 2-3)
- [ ] Marketplace browse page
- [ ] Listing creation with photo upload
- [ ] AI-powered search implementation
- [ ] Basic filtering

### Phase 3 (Sprint 4-5)
- [ ] In-app chat system
- [ ] Advanced search filters
- [ ] User profiles
- [ ] Favorites/saved items

### Phase 4 (Sprint 6)
- [ ] Admin moderation tools
- [ ] Reporting system
- [ ] Analytics dashboard
- [ ] Email notifications

## CMPE 202 Team Requirements

This project follows Scrum practices with:
- Six 2-week sprints
- Team collaboration on all components
- API development with JSON I/O
- Web UI for all user roles
- AWS deployment with auto-scaling
- Mock database with sample data

## Contributing

This is a team project for CMPE 202. All team members contribute to:
- Frontend development
- Backend API design
- Database schema
- Testing and QA
- Documentation
- Deployment

## License

CMPE 202 Team Project by Visionary Coders - San Jose State University

## Support

For issues or questions:
1. Check this README
2. Review SETUP_GUIDE.md
3. See BACKEND_API_CONTRACT.md
4. Contact team members

---

**Built with ❤️ by Visionary Coders for CMPE 202 - Fall 2025**
