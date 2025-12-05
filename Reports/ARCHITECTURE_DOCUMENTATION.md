# Campus Marketplace (Campify)

## Additional Architecture & Design Documentation

---

## Architecture Deep Dive

### Database Schema Diagram

```
┌──────────────────────────────────────┐
│              USER                    │
├──────────────────────────────────────┤
│ id (UUID, PK)                        │
│ email (String, UNIQUE)               │
│ password_hash (String)               │
│ full_name (String)                   │
│ role (Enum: buyer/seller/admin)      │
│ profile_picture (String, NULL)       │
│ bio (Text, NULL)                     │
│ college_name (String)                │
│ created_at (DateTime)                │
│ updated_at (DateTime)                │
└──────────────────────────────────────┘
         ▲              ▲           ▲
         │              │           │
         │ (seller_id)  │           │
         │              │           │
    ┌────────────────────────────────────────────┐
    │           LISTING                          │
    ├────────────────────────────────────────────┤
    │ id (UUID, PK)                              │
    │ seller_id (FK -> User)                     │
    │ title (String)                             │
    │ description (Text)                         │
    │ category (String)                          │
    │ price (Decimal)                            │
    │ status (Enum: available/sold/pending)      │
    │ images (JSON Array of file paths)          │
    │ created_at (DateTime)                      │
    │ updated_at (DateTime)                      │
    └────────────────────────────────────────────┘
         │                    │
         │(listing_id)        │(listing_id)
         │                    │
    ┌────────────────────┐   ┌─────────────────┐
    │   CHAT_ROOM        │   │     REPORT      │
    ├────────────────────┤   ├─────────────────┤
    │ id (UUID, PK)      │   │ id (UUID, PK)   │
    │ buyer_id (FK)      │   │ reporter_id (FK)│
    │ seller_id (FK)     │   │ listing_id (FK) │
    │ listing_id (FK)    │   │ reason (String) │
    │ created_at         │   │ description     │
    │ updated_at         │   │ status (Enum)   │
    └────────────────────┘   │ admin_notes     │
            │                │ created_at      │
            │                │ resolved_at     │
            │ (chat_room_id)  └─────────────────┘
            │
    ┌────────────────────┐
    │     MESSAGE        │
    ├────────────────────┤
    │ id (UUID, PK)      │
    │ chat_room_id (FK)  │
    │ sender_id (FK)     │
    │ content (Text)     │
    │ is_read (Boolean)  │
    │ created_at         │
    └────────────────────┘
```

### API Request/Response Flow Diagram

```
┌─────────────────┐
│   Client App    │
│  (Next.js UI)   │
└────────┬────────┘
         │ HTTP Request (JSON)
         │ Headers: Authorization: Bearer <JWT>
         │
         ▼
┌─────────────────────────────────────────┐
│      API Gateway / Load Balancer        │
│    (AWS ALB or Azure Application Gateway)
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│         FastAPI Server                   │
│  ┌──────────────────────────────────────┐│
│  │ 1. CORS Middleware                   ││
│  │ 2. Authentication Middleware         ││
│  │    - Validate JWT Token              ││
│  │    - Extract User Context            ││
│  │ 3. Route Handler (Endpoint Logic)    ││
│  │    - Validate Input (Pydantic)       ││
│  │    - Execute Business Logic          ││
│  │    - Query Database (SQLAlchemy)     ││
│  │ 4. Response Formatting Middleware    ││
│  └──────────────────────────────────────┘│
└────────┬─────────────────────────────────┘
         │
         ├─────────────────────┬─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
    ┌────────────┐        ┌────────────┐       ┌──────────┐
    │  Database  │        │   S3/File  │       │  OpenAI  │
    │(PostgreSQL)│        │  Storage   │       │   API    │
    └────────────┘        └────────────┘       └──────────┘
         │
         ▼
    ┌──────────────────────────────────────────┐
    │ HTTP Response (JSON)                     │
    │ {                                        │
    │   "status": "success",                   │
    │   "data": { ... },                       │
    │   "message": "..."                       │
    │ }                                        │
    └──────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   Client App    │
│  (Handle Data)  │
└─────────────────┘
```

---

## User Flow Diagrams

### Registration & Authentication Flow

```
Start
 │
 ▼
User clicks "Sign Up"
 │
 ▼
Enter Email + Password + Role
 │
 ▼
Validate College Email (.edu)? ─No──> Error: Invalid Email
 │ Yes
 ▼
Validate Password Strength? ─No──> Error: Weak Password
 │ Yes
 ▼
Check if Email Exists? ─Yes──> Error: Email Already Registered
 │ No
 ▼
Hash Password (bcrypt)
 │
 ▼
Create User in Database
 │
 ▼
Send JWT Token + Redirect
 │
 ▼
User Dashboard
```

### Marketplace Search Flow

```
┌──────────────────────────┐
│  User Enters Query       │
│ "laptop under $500"      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Check OpenAI API Available?              │
└────────────┬──────────────┬──────────────┘
             │ Yes          │ No
             ▼              ▼
    ┌──────────────┐  ┌──────────────────┐
    │ NLP Search   │  │ Keyword Search   │
    │ with ChatGPT │  │ Fallback         │
    │              │  │                  │
    │ Extract:     │  │ Search query in  │
    │ - Category   │  │ - Listing titles │
    │ - Keywords   │  │ - Descriptions   │
    │ - Price      │  │ - Categories     │
    │ - Intent     │  └──────────────────┘
    └──────────────┘         │
             │               │
             └───────┬───────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ Query Database          │
        │ - Filter by category    │
        │ - Filter by price range │
        │ - Filter by status      │
        │ - Rank by relevance     │
        └────────────┬────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ Return Results          │
        │ (up to 50 listings)     │
        └────────────┬────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ Display in UI           │
        │ - Thumbnails            │
        │ - Price                 │
        │ - Seller info           │
        │ - Distance              │
        └─────────────────────────┘
```

### Chat Initiation Flow

```
Buyer Views Listing
 │
 ▼
Clicks "Contact Seller" Button
 │
 ▼
Check Chat Room Exists?
 │
 ├─Yes──> Open Existing Chat Room
 │             │
 │             ▼
 │        Display Message History
 │             │
 │             ▼
 │        Connect WebSocket
 │             │
 │             ▼
 │        Ready for Live Chat
 │
 └─No──> Create New Chat Room
              │
              ▼
         Insert into database:
         - buyer_id
         - seller_id
         - listing_id
         │
         ▼
         Connect WebSocket
         │
         ▼
         Send Initial Message
         │
         ▼
         Ready for Live Chat
```

### Admin Moderation Flow

```
Listing Created
 │
 ▼
Auto-scan for violations?
 │
 ├─Issues Detected──> Flag for Review
 │                        │
 │                        ▼
 │                   Add to Report Queue
 │                        │
 │                        ▼
 │                   Notify Admin
 │
 └─OK──> List Published
            │
            ▼
Buyer reports listing
 │
 ▼
Create Report:
- Reason
- Description
- Reporter info
 │
 ▼
Add to Report Queue
 │
 ▼
Notify Admin
 │
 ▼
Admin Reviews:
├─No Violation──> Dismiss Report
│                       │
│                       ▼
│               Resolve & Notify
│
└─Violation──> Remove Listing
                      │
                      ▼
                  Notify Seller
                      │
                      ▼
               Archive Report
```

---

## WebSocket Chat Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   WebSocket Connection                  │
│                 (Real-time Messaging)                   │
└─────────────────────────────────────────────────────────┘

Client Side                          Server Side
───────────────────────────────────────────────────────

Connect to WS:                  FastAPI WebSocket Handler
/ws/chat/{room_id}          ─────> Manager.connect()
  │                              │
  ├─Send: JWT Token            - Authenticate JWT
  │  │                         - Validate room access
  │  │                         - Add to connection pool
  │  ▼                         - Send "connected" event
  │ Connection Established
  │
Send Message:                 Receive Message:
{"message": "Hi!"}       ───> Parse JSON
  │                          Validate
  │                          Save to DB (Message model)
  │                          Broadcast to room participants
  │                          │
  │                          ├─ Sender gets "sent" status
  │                          ├─ Receiver gets "received"
  │                          └─ Others get nothing
  │
  ▼ (Real-time delivery)
Receive Message:
{"message": "Hi!",
 "sender": "...",
 "timestamp": "..."}
  │
  ▼
Render in Chat UI
Send "read" status
  │
  ▼
Send Read Receipt ────────> Update Message.is_read
                            Notify Sender

Disconnect                  Manager.disconnect()
  │                          │
  └─Close Connection    ─────> Remove from pool
                              Save session state
```

---

## NLP Search Implementation Details

### OpenAI Query Processing

```
User Input: "I need a used laptop for programming, budget $400-600"
        │
        ▼
Query to OpenAI API:
{
  "model": "gpt-3.5-turbo",
  "messages": [{
    "role": "user",
    "content": "Extract from this query: category, keywords, min_price, max_price, condition, type. Query: 'I need a used laptop for programming, budget $400-600'"
  }]
}
        │
        ▼
OpenAI Response:
{
  "category": "electronics",
  "keywords": ["laptop", "programming"],
  "min_price": 400,
  "max_price": 600,
  "condition": "used",
  "type": "laptop"
}
        │
        ▼
Build Database Query:
SELECT * FROM listings
WHERE category = 'electronics'
  AND (title LIKE '%laptop%' OR description LIKE '%laptop%')
  AND (title LIKE '%programming%' OR description LIKE '%programming%')
  AND price BETWEEN 400 AND 600
  AND status = 'available'
LIMIT 50
        │
        ▼
Score & Rank Results:
- Exact title matches: score +10
- Recent postings: score +5
- Seller rating: score +3
- Relevance to keywords: score +2
        │
        ▼
Return Top 20 Results
```

### Fallback Keyword Search

```
If OpenAI API fails or unavailable:

User Query: "laptop for programming"
        │
        ▼
Simple keyword extraction:
keywords = ["laptop", "programming"]
        │
        ▼
Build Query:
SELECT * FROM listings
WHERE status = 'available'
  AND (title LIKE '%laptop%' OR title LIKE '%programming%'
       OR description LIKE '%laptop%' OR description LIKE '%programming%')
LIMIT 50
        │
        ▼
Return Results
```

---

## Frontend Component Architecture

```
├── pages/
│   ├── index.tsx (Homepage)
│   ├── auth/
│   │   ├── signin.tsx
│   │   └── signup.tsx
│   ├── marketplace.tsx
│   ├── listings/
│   │   ├── [id].tsx (Detail)
│   │   └── create.tsx
│   ├── dashboard.tsx
│   ├── chat/
│   │   ├── index.tsx (List)
│   │   └── [id].tsx (Detail)
│   ├── profile/
│   │   ├── view.tsx
│   │   └── edit.tsx
│   └── admin/
│       ├── dashboard.tsx
│       ├── users.tsx
│       ├── products.tsx
│       ├── reports.tsx
│       └── approvals.tsx
│
├── components/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── ListingCard.tsx
│   ├── ChatMessage.tsx
│   ├── SearchBar.tsx
│   └── AdminStats.tsx
│
├── contexts/
│   └── AuthContext.tsx (Global auth state)
│
├── lib/
│   ├── api.ts (API client)
│   ├── validation.ts (Form validation)
│   └── mockData.ts (Test data)
│
└── types/
    ├── auth.ts
    ├── listing.ts
    └── admin.ts
```

---

## Error Handling Strategy

### Common Error Codes

```
Authentication Errors:
- 401: Unauthorized (invalid/expired token)
- 403: Forbidden (insufficient permissions)
- 400: Invalid credentials (login failure)

Validation Errors:
- 400: Bad Request (invalid input)
- 422: Unprocessable Entity (validation failed)

Resource Errors:
- 404: Not Found (resource doesn't exist)
- 409: Conflict (duplicate email, etc.)

Server Errors:
- 500: Internal Server Error
- 503: Service Unavailable

NLP Search Errors:
- 429: Rate Limited (OpenAI quota)
- 503: Service Unavailable (OpenAI down)
```

### Error Response Format

```json
{
  "status": "error",
  "error_code": "INVALID_EMAIL",
  "message": "Email must be a college domain (.edu)",
  "details": {
    "field": "email",
    "provided": "user@gmail.com",
    "expected": "user@college.edu"
  },
  "timestamp": "2025-12-04T10:30:00Z",
  "request_id": "req_12345abcde"
}
```

---

## Security Architecture

### Authentication Flow

```
User enters credentials
        │
        ▼
POST /auth/login
{email, password}
        │
        ▼
Backend:
1. Query user by email
2. Hash provided password (bcrypt)
3. Compare hashes
        │
        ├─Match──> Generate JWT token
        │           │
        │           ├─Header: {alg: "HS256"}
        │           ├─Payload: {user_id, role, exp}
        │           ├─Signature: HMAC(header.payload, secret)
        │           │
        │           ▼
        │         Return JWT + Refresh Token
        │           │
        │           ▼
        │         Client stores in secure storage
        │
        └─No match──> Return error
```

### Authorization Middleware

```
Request with JWT Token
        │
        ▼
Extract token from header
        │
        ▼
Validate signature (using SECRET_KEY)
        │
        ├─Invalid──> 401 Unauthorized
        │
        └─Valid──> Extract claims (user_id, role)
                    │
                    ▼
              Check if token expired
                    │
                    ├─Expired──> 401 Unauthorized
                    │
                    └─Valid──> Get user from DB
                                │
                                ▼
                          Check user role
                                │
                          ┌─────┼─────┐
                          │     │     │
                    ┌─────▼─ ─ ┌─────▼──┐
                    Buyer   Seller   Admin
                    │          │       │
                    ▼          ▼       ▼
              Endpoint-specific
              permission check
                    │
                    ├─Denied──> 403 Forbidden
                    │
                    └─Allowed──> Proceed to handler
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Environment variables configured
- [ ] Secrets secured in Secrets Manager
- [ ] Database migrations prepared
- [ ] Backups created
- [ ] Load testing completed
- [ ] Security scan passed

### Deployment Steps

```bash
# 1. Build Docker images
docker build -t campify-backend:v1.0.0 ./backend
docker build -t campify-frontend:v1.0.0 ./campus-marketplace-frontend

# 2. Push to registry
aws ecr get-login-password | docker login --username AWS --password-stdin <registry>
docker tag campify-backend:v1.0.0 <registry>/campify-backend:v1.0.0
docker push <registry>/campify-backend:v1.0.0
docker push <registry>/campify-frontend:v1.0.0

# 3. Update Launch Templates
aws ec2 describe-launch-templates

# 4. Update Auto Scaling Group
aws autoscaling update-auto-scaling-group \
  --auto-scaling-group-name campify-asg \
  --launch-template LaunchTemplateId=<new_template_id>

# 5. Monitor deployment
aws ec2 describe-instances --filters Name=tag:Environment,Values=production

# 6. Verify endpoints
curl https://api.campify.edu/health
curl https://campify.edu/

# 7. Run smoke tests
pytest tests/smoke_tests.py

# 8. Monitor logs and metrics
aws logs tail /aws/ecs/campify-backend --follow
```

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check response times
- [ ] Verify database connectivity
- [ ] Test all critical user flows
- [ ] Monitor server resources
- [ ] Check API rate limits
- [ ] Verify email notifications
- [ ] Test payment integration (if applicable)

---

## Performance Optimization Tips

### Database Optimization

1. **Add Indexes:**

   ```sql
   CREATE INDEX idx_listings_category ON listings(category);
   CREATE INDEX idx_listings_price ON listings(price);
   CREATE INDEX idx_listings_status ON listings(status);
   CREATE INDEX idx_chat_rooms_buyer ON chat_rooms(buyer_id);
   ```

2. **Query Optimization:**

   - Use SELECT specific columns instead of \*
   - Implement pagination (LIMIT OFFSET)
   - Use joins instead of multiple queries
   - Cache frequently accessed data

3. **Connection Pooling:**
   ```python
   # SQLAlchemy pool configuration
   engine = create_engine(
       DATABASE_URL,
       poolclass=QueuePool,
       pool_size=20,
       max_overflow=0
   )
   ```

### Frontend Optimization

1. **Code Splitting:**

   ```typescript
   // Lazy load components
   const ChatComponent = dynamic(() => import("./Chat"), {
     loading: () => <LoadingSpinner />,
     ssr: false,
   });
   ```

2. **Image Optimization:**

   ```typescript
   import Image from "next/image";

   <Image
     src={url}
     alt="Listing"
     width={400}
     height={300}
     priority={true} // For above-fold images
   />;
   ```

3. **Memoization:**
   ```typescript
   const ListingCard = React.memo(({ listing }) => {
     // Component won't re-render if props haven't changed
     return <div>{listing.title}</div>;
   });
   ```

---

## Monitoring & Observability

### Key Metrics to Monitor

```
Backend API:
- Request latency (p50, p95, p99)
- Error rate (5xx, 4xx)
- Throughput (requests/sec)
- Database query time
- WebSocket connection count
- Cache hit rate

Frontend:
- Page load time (DCP, LCP, FID)
- JavaScript error rate
- API call failures
- User interactions per session
- Bounce rate

Infrastructure:
- CPU usage
- Memory usage
- Disk space
- Network bandwidth
- Database connections
- Auto Scaling Group state
```

### Logging Strategy

```
Backend logs should include:
- Request ID (for tracing)
- User ID
- Endpoint
- Method
- Status code
- Response time
- Errors/exceptions
- Stack traces

Example:
{
  "timestamp": "2025-12-04T10:30:00Z",
  "request_id": "req_12345abcde",
  "user_id": "user_xyz",
  "endpoint": "POST /listings",
  "method": "POST",
  "status": 201,
  "response_time_ms": 145,
  "message": "Listing created successfully"
}
```

---

## Conclusion

This document provides comprehensive architectural details for the Campify platform, including database schema, API flows, user workflows, WebSocket architecture, NLP search implementation, security measures, and deployment procedures.

For implementation questions, refer to the main project report and code documentation.

**Version:** 1.0  
**Last Updated:** December 4, 2025
