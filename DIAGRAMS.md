# Campus Marketplace (Campify) - UML & Sequence Diagrams

---

## 1. Class Diagram - Data Models

```mermaid
classDiagram
    class User {
        +UUID id
        +String email
        +String password_hash
        +String full_name
        +Enum role
        +String profile_picture
        +String bio
        +String college_name
        +DateTime created_at
        +DateTime updated_at
        +register()
        +login()
        +updateProfile()
        +getListings()
    }

    class Listing {
        +UUID id
        +UUID seller_id
        +String title
        +String description
        +String category
        +Decimal price
        +Enum status
        +List images
        +DateTime created_at
        +DateTime updated_at
        +create()
        +update()
        +markAsSold()
        +uploadPhoto()
        +getDetails()
    }

    class ChatRoom {
        +UUID id
        +UUID buyer_id
        +UUID seller_id
        +UUID listing_id
        +DateTime created_at
        +DateTime updated_at
        +getHistory()
        +addMessage()
        +close()
    }

    class Message {
        +UUID id
        +UUID chat_room_id
        +UUID sender_id
        +String content
        +Boolean is_read
        +DateTime created_at
        +sendMessage()
        +markAsRead()
    }

    class Report {
        +UUID id
        +UUID reporter_id
        +UUID listing_id
        +String reason
        +String description
        +Enum status
        +String admin_notes
        +DateTime created_at
        +DateTime resolved_at
        +create()
        +resolve()
        +dismiss()
    }

    class Admin {
        +UUID id
        +String email
        +Enum role
        +getDashboard()
        +approveListing()
        +removeListing()
        +manageUsers()
        +resolveReports()
        +getAnalytics()
    }

    User "1" --> "*" Listing : creates
    User "1" --> "*" ChatRoom : participates_in
    User "1" --> "*" Message : sends
    User "1" --> "*" Report : makes
    Listing "1" --> "*" ChatRoom : discussed_in
    Listing "1" --> "*" Report : reported_in
    ChatRoom "1" --> "*" Message : contains
    Admin "1" --> "*" Report : resolves
    Admin "1" --> "*" Listing : moderates
```

---

## 2. Component Diagram - System Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend Layer"]
        UI["React Components<br/>(Next.js)"]
        Auth["Auth Context<br/>(JWT Management)"]
        API["API Client<br/>(Axios)"]
        Form["Form Validation<br/>(React Hook Form)"]
    end

    subgraph Backend["Backend Layer"]
        Router["API Routers<br/>(FastAPI)"]
        Security["Security Layer<br/>(JWT + RBAC)"]
        Service["Business Services<br/>(Logic)"]
        ORM["ORM Layer<br/>(SQLAlchemy)"]
    end

    subgraph Data["Data Layer"]
        DB["Database<br/>(SQLite/PostgreSQL)"]
        Cache["Session Cache<br/>(In-memory)"]
    end

    subgraph External["External Services"]
        OpenAI["OpenAI API<br/>(NLP Search)"]
        S3["S3 Storage<br/>(Media)"]
    end

    UI -->|HTTP/JSON| Router
    Auth -->|Token| API
    API -->|Requests| Router
    Form -->|Validation| API
    
    Router -->|Auth Check| Security
    Router -->|Business Logic| Service
    
    Service -->|Query| ORM
    Service -->|NL Query| OpenAI
    Service -->|Upload/Retrieve| S3
    
    ORM -->|SQL| DB
    Security -->|Cache| Cache
    
    style Frontend fill:#e1f5ff
    style Backend fill:#fff3e0
    style Data fill:#f3e5f5
    style External fill:#e8f5e9
```

---

## 3. Deployment Diagram - Production Architecture

```mermaid
graph TB
    Internet["Internet<br/>(Users)"]
    
    Route53["AWS Route 53<br/>(DNS)"]
    
    CloudFront["CloudFront<br/>(CDN)"]
    
    ALB["Application<br/>Load Balancer<br/>(Port 80/443)"]
    
    ASG["Auto Scaling Group<br/>(EC2 Instances)"]
    
    EC2A["EC2 Instance A<br/>(Docker: FastAPI)"]
    EC2B["EC2 Instance B<br/>(Docker: FastAPI)"]
    
    RDS["RDS PostgreSQL<br/>(Multi-AZ)"]
    
    S3["S3 Bucket<br/>(Media Storage)"]
    
    Secrets["Secrets Manager<br/>(API Keys)"]
    
    CloudWatch["CloudWatch<br/>(Monitoring)"]
    
    Internet -->|DNS Query| Route53
    Route53 -->|Static Content| CloudFront
    Route53 -->|API Requests| ALB
    
    CloudFront -->|Fallback| ALB
    
    ALB -->|Distribute| ASG
    
    ASG -->|Scale Up/Down| EC2A
    ASG -->|Scale Up/Down| EC2B
    
    EC2A -->|Query| RDS
    EC2B -->|Query| RDS
    
    EC2A -->|Upload/Retrieve| S3
    EC2B -->|Upload/Retrieve| S3
    
    EC2A -->|Get Secrets| Secrets
    EC2B -->|Get Secrets| Secrets
    
    EC2A -->|Logs & Metrics| CloudWatch
    EC2B -->|Logs & Metrics| CloudWatch
    
    style Route53 fill:#ffcdd2
    style ALB fill:#ffcdd2
    style ASG fill:#fff9c4
    style EC2A fill:#c8e6c9
    style EC2B fill:#c8e6c9
    style RDS fill:#bbdefb
    style S3 fill:#bbdefb
    style CloudFront fill:#f8bbd0
```

---

## 4. Sequence Diagram - User Registration & Login

```mermaid
sequenceDiagram
    participant User as User<br/>(Browser)
    participant Frontend as Frontend<br/>(Next.js)
    participant Backend as Backend<br/>(FastAPI)
    participant DB as Database
    participant Email as Email Service

    rect rgb(200, 220, 255)
    Note over User,Email: Registration Flow
    User->>Frontend: Enter email & password
    Frontend->>Frontend: Validate email format
    Frontend->>Frontend: Validate password strength
    Frontend->>Backend: POST /auth/register
    
    Backend->>Backend: Validate .edu domain
    Backend->>DB: Check if email exists
    DB-->>Backend: Email not found ✓
    
    Backend->>Backend: Hash password (bcrypt)
    Backend->>DB: Create user record
    DB-->>Backend: User created
    
    Backend->>Email: Send verification email
    Email-->>Backend: Email sent
    
    Backend-->>Frontend: Success + JWT Token
    Frontend->>Frontend: Store token
    Frontend-->>User: Redirect to dashboard
    end

    rect rgb(220, 240, 220)
    Note over User,Email: Login Flow
    User->>Frontend: Enter email & password
    Frontend->>Backend: POST /auth/login
    
    Backend->>DB: Query user by email
    DB-->>Backend: User found
    
    Backend->>Backend: Hash provided password
    Backend->>Backend: Compare hashes
    
    alt Passwords match
        Backend->>Backend: Generate JWT token
        Backend-->>Frontend: Success + JWT + Role
        Frontend->>Frontend: Store token
        Frontend-->>User: Redirect to dashboard
    else Passwords don't match
        Backend-->>Frontend: Error 401
        Frontend-->>User: Show error message
    end
    end
```

---

## 5. Sequence Diagram - Create Listing

```mermaid
sequenceDiagram
    participant Seller as Seller<br/>(Browser)
    participant Frontend as Frontend<br/>(Next.js)
    participant Backend as Backend<br/>(FastAPI)
    participant DB as Database
    participant S3 as S3 Storage

    rect rgb(255, 240, 200)
    Note over Seller,S3: Create Listing with Photos

    Seller->>Frontend: Fill listing form
    Seller->>Frontend: Upload photos
    
    Frontend->>Frontend: Validate form data
    Frontend->>Frontend: Compress images
    
    Frontend->>Backend: POST /listings + photos
    Note over Frontend,Backend: Include JWT token in header
    
    Backend->>Backend: Validate JWT token
    Backend->>Backend: Check user is seller
    Backend->>Backend: Validate input data
    
    loop For each photo
        Backend->>S3: Upload image
        S3-->>Backend: Return image URL
        Backend->>Backend: Store URL in memory
    end
    
    Backend->>DB: Create listing record
    Backend->>DB: Insert photo URLs
    DB-->>Backend: Listing created with ID
    
    Backend->>DB: Get listing details
    DB-->>Backend: Complete listing data
    
    Backend-->>Frontend: Success + Listing ID
    Frontend-->>Seller: Show confirmation
    Seller->>Frontend: Redirect to listing detail
    end
```

---

## 6. Sequence Diagram - Search with NLP

```mermaid
sequenceDiagram
    participant Buyer as Buyer<br/>(Browser)
    participant Frontend as Frontend<br/>(Next.js)
    participant Backend as Backend<br/>(FastAPI)
    participant OpenAI as OpenAI API
    participant DB as Database

    rect rgb(230, 245, 230)
    Note over Buyer,DB: Natural Language Search

    Buyer->>Frontend: Enter: "laptop for programming $400-600"
    Frontend->>Backend: POST /search/nl?q=query
    
    Backend->>Backend: Check OpenAI API available
    
    alt OpenAI Available
        Backend->>OpenAI: Send query + system prompt
        Note over Backend,OpenAI: Extract: category, keywords, price range
        
        OpenAI-->>Backend: Parsed result
        Backend->>Backend: Extract parameters
        Backend->>DB: Query with filters:
        Note over Backend,DB: category='electronics'<br/>keywords LIKE '%laptop%'<br/>price BETWEEN 400-600
        
    else OpenAI Unavailable/Rate Limited
        Backend->>Backend: Fallback to keyword search
        Backend->>DB: Simple keyword search
        Note over Backend,DB: keywords LIKE '%laptop%'<br/>OR keywords LIKE '%programming%'
    end
    
    DB-->>Backend: Return 50 listings
    Backend->>Backend: Rank results by relevance
    Backend->>Backend: Filter top 20 results
    
    Backend-->>Frontend: Ranked results + metadata
    Frontend->>Frontend: Render listing cards
    Frontend-->>Buyer: Display search results
    
    Buyer->>Frontend: Click on listing
    Frontend->>Buyer: Show listing detail
    end
```

---

## 7. Sequence Diagram - Real-Time Chat

```mermaid
sequenceDiagram
    participant Buyer as Buyer<br/>(Browser)
    participant Frontend_B as Frontend<br/>(Buyer)
    participant Backend as Backend<br/>(FastAPI)
    participant DB as Database
    participant Frontend_S as Frontend<br/>(Seller)
    participant Seller as Seller<br/>(Browser)

    rect rgb(200, 240, 255)
    Note over Buyer,Seller: WebSocket Chat Initialization

    Buyer->>Frontend_B: Click "Contact Seller"
    Frontend_B->>Backend: Check/Create chat room
    Backend->>DB: Query chat room
    DB-->>Backend: Room found/created
    
    Frontend_B->>Backend: WS /ws/chat/room_id
    Note over Frontend_B,Backend: Include JWT token
    
    Backend->>Backend: Authenticate connection
    Backend->>Backend: Add to connection pool
    Backend-->>Frontend_B: Connection established
    
    Seller->>Frontend_S: Open chat (auto-refresh)
    Frontend_S->>Backend: GET /chat/rooms
    DB-->>Frontend_S: Room with unread messages
    
    Frontend_S->>Backend: WS /ws/chat/room_id
    Backend->>Backend: Authenticate + add to pool
    Backend-->>Frontend_S: Connection established
    end

    rect rgb(240, 220, 240)
    Note over Buyer,Seller: Message Exchange

    Buyer->>Frontend_B: Type message: "Is it still available?"
    Frontend_B->>Backend: Send via WebSocket
    
    Backend->>DB: Save message to database
    Backend->>Backend: Get all connections in room
    
    Backend->>Frontend_B: Echo back (sent status)
    Backend->>Frontend_S: Broadcast message
    
    Frontend_B-->>Buyer: Show "sent" status
    Frontend_S-->>Seller: Show new message
    
    Seller->>Frontend_S: Type reply: "Yes, available!"
    Frontend_S->>Backend: Send via WebSocket
    
    Backend->>DB: Save message
    Backend->>Frontend_S: Echo back
    Backend->>Frontend_B: Broadcast message
    
    Frontend_S-->>Seller: Show "sent" status
    Frontend_B-->>Buyer: Show new message
    Buyer->>Frontend_B: Click message (mark read)
    Frontend_B->>Backend: Update read status
    Backend->>DB: Mark message as read
    Backend->>Frontend_S: Send read receipt
    Frontend_S-->>Seller: Show "read" indicator
    end
```

---

## 8. Sequence Diagram - Admin Moderation

```mermaid
sequenceDiagram
    participant Buyer as Buyer<br/>(Browser)
    participant BFrontend as Buyer Frontend
    participant Backend as Backend<br/>(FastAPI)
    participant DB as Database
    participant Admin as Admin<br/>(Browser)
    participant AFrontend as Admin Frontend

    rect rgb(255, 235, 200)
    Note over Buyer,AFrontend: Report & Moderation Flow

    Buyer->>BFrontend: View problematic listing
    Buyer->>BFrontend: Click "Report"
    BFrontend->>BFrontend: Show report form
    
    Buyer->>BFrontend: Select reason: "Inappropriate content"
    Buyer->>BFrontend: Add description
    Buyer->>Backend: POST /reports
    
    Backend->>Backend: Validate input
    Backend->>DB: Create report record
    DB-->>Backend: Report created
    
    Backend->>Backend: Notify admin
    Backend-->>BFrontend: Report submitted
    BFrontend-->>Buyer: Show confirmation
    
    Note over Admin,AFrontend: Admin Reviews Report
    
    Admin->>AFrontend: Open admin dashboard
    AFrontend->>Backend: GET /admin/dashboard
    Backend->>DB: Get statistics
    DB-->>AFrontend: Dashboard data with pending reports
    
    AFrontend-->>Admin: Show 5 pending reports
    Admin->>AFrontend: Click on report
    
    AFrontend->>Backend: GET /reports/{id}
    Backend->>DB: Get report details + listing
    DB-->>AFrontend: Report details with listing preview
    
    AFrontend-->>Admin: Show report details
    Admin->>AFrontend: Choose action: "Remove listing"
    
    AFrontend->>Backend: PATCH /reports/{id}/resolve
    Note over AFrontend,Backend: action: remove_listing<br/>reason: "Violates policy"
    
    Backend->>DB: Update report status
    Backend->>DB: Update listing status to removed
    DB-->>Backend: Changes saved
    
    Backend->>Backend: Send notification to seller
    Backend-->>AFrontend: Report resolved
    AFrontend-->>Admin: Show confirmation
    
    Note over Admin,AFrontend: Update UI
    AFrontend->>Backend: GET /admin/dashboard
    DB-->>AFrontend: Updated stats (4 pending)
    AFrontend-->>Admin: Refresh dashboard
    end
```

---

## 9. Activity Diagram - Marketplace Search Flow

```mermaid
graph TD
    A["User Opens Marketplace"] --> B["Select Search Type"]
    
    B -->|Keyword Search| C["Enter Keywords"]
    B -->|NLP Search| D["Ask Natural Language Query"]
    
    C --> E["Apply Filters<br/>Category, Price Range"]
    D --> F["Submit Query to Backend"]
    
    E --> G["Query Database"]
    F --> H["OpenAI API Available?"]
    
    H -->|Yes| I["Parse Query with ChatGPT"]
    H -->|No| J["Fallback: Keyword Search"]
    
    I --> K["Extract Parameters"]
    J --> K
    
    K --> L["Build SQL Query"]
    L --> G
    
    G --> M["Results Found?"]
    
    M -->|Yes| N["Rank Results"]
    M -->|No| O["Show 'No Results' Message"]
    
    N --> P["Return Top 20 Results"]
    O --> Q["Suggest Alternative Searches"]
    
    P --> R["Display Results in UI"]
    Q --> R
    
    R --> S["User Clicks Listing"]
    S --> T["Show Listing Detail Page"]
    T --> U["Option: Chat with Seller"]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style E fill:#f3e5f5
    style G fill:#e8f5e9
    style R fill:#fce4ec
    style U fill:#c8e6c9
```

---

## 10. State Diagram - Listing Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Create new listing

    Draft --> Published: Click Publish<br/>(Form validated)
    
    Draft --> [*]: Discard
    
    Published --> Active: Admin approval<br/>(if required)
    Published --> Rejected: Admin rejects<br/>(doesn't meet requirements)
    
    Rejected --> [*]: Archived
    
    Active --> Available: Listing goes live
    
    Available --> Pending_Sale: Buyer interested<br/>Chat initiated
    
    Pending_Sale --> Available: Deal fell through
    
    Pending_Sale --> Sold: Mark as sold<br/>Price negotiated
    
    Sold --> [*]: Archived
    
    Available --> Reported: Buyer reports listing
    
    Reported --> Under_Review: Admin reviews report
    
    Under_Review --> Available: Report dismissed
    Under_Review --> Removed: Report confirmed<br/>List violates policy
    
    Removed --> [*]: Archived
    
    Available --> Expired: 30 days passed<br/>Auto-archive
    
    Expired --> [*]: Archived
    
    note right of Active
        Waiting for admin
        approval to go live
    end note
    
    note right of Pending_Sale
        Price negotiation
        in progress via chat
    end note
    
    note right of Under_Review
        Admin determines if
        listing violates policy
    end note
```

---

## 11. Sequence Diagram - Authentication & Authorization

```mermaid
sequenceDiagram
    participant Client as Client<br/>(Browser)
    participant Server as Server<br/>(FastAPI)
    participant DB as Database
    participant Secret as Secret Store

    rect rgb(200, 220, 255)
    Note over Client,Secret: JWT Authentication Flow

    Client->>Server: Request with JWT in header
    Note over Client,Server: Authorization: Bearer <token>

    Server->>Secret: Get SECRET_KEY
    Secret-->>Server: SECRET_KEY loaded

    Server->>Server: Decode JWT
    Note over Server: Verify signature using SECRET_KEY

    alt Signature Valid
        Server->>Server: Extract user_id, role, exp
        Server->>DB: Get user record
        DB-->>Server: User data
        
        Server->>Server: Check token expiration
        alt Token Not Expired
            Server->>Server: Create request context
            Note over Server: user_id, role in context
            Server->>Server: Execute handler
            Server-->>Client: Response with data
        else Token Expired
            Server-->>Client: 401 Unauthorized
            Note over Client: Token expired
            Client->>Server: POST /auth/refresh (with refresh token)
            Server->>Server: Validate refresh token
            Server->>Server: Generate new access token
            Server-->>Client: New JWT token
        end
    else Signature Invalid
        Server-->>Client: 401 Unauthorized
        Note over Client: Invalid token
    else No Token
        Server-->>Client: 401 Unauthorized
        Note over Client: Missing token
    end
    end

    rect rgb(220, 240, 220)
    Note over Client,DB: Role-Based Access Control (RBAC)

    Client->>Server: POST /listings (Create listing)
    Note over Client,Server: JWT contains role

    Server->>Server: Extract role from JWT
    
    alt Role == seller OR admin
        Server->>Server: Allow operation
        Server->>DB: Create listing
        DB-->>Server: Success
        Server-->>Client: 201 Created
    else Role == buyer
        Server-->>Client: 403 Forbidden
        Note over Client: Only sellers can create listings
    end
    end
```

---

## 12. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ LISTING : creates
    USER ||--o{ CHATROOM : participates_in
    USER ||--o{ MESSAGE : sends
    USER ||--o{ REPORT : makes
    LISTING ||--o{ CHATROOM : discussed_in
    LISTING ||--o{ REPORT : gets_reported_in
    LISTING ||--o{ LISTING_PHOTO : contains
    CHATROOM ||--o{ MESSAGE : contains

    USER {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        enum role
        string profile_picture
        text bio
        string college_name
        datetime created_at
        datetime updated_at
    }

    LISTING {
        uuid id PK
        uuid seller_id FK
        string title
        text description
        string category
        decimal price
        enum status
        datetime created_at
        datetime updated_at
    }

    LISTING_PHOTO {
        uuid id PK
        uuid listing_id FK
        string photo_url
        int display_order
        datetime created_at
    }

    CHATROOM {
        uuid id PK
        uuid buyer_id FK
        uuid seller_id FK
        uuid listing_id FK
        datetime created_at
        datetime updated_at
    }

    MESSAGE {
        uuid id PK
        uuid chat_room_id FK
        uuid sender_id FK
        text content
        boolean is_read
        datetime created_at
    }

    REPORT {
        uuid id PK
        uuid reporter_id FK
        uuid listing_id FK
        string reason
        text description
        enum status
        text admin_notes
        datetime created_at
        datetime resolved_at
    }
```

---

## 13. Use Case Diagram

```mermaid
graph TB
    subgraph Actors
        B["👤 Buyer"]
        S["👤 Seller"]
        A["👤 Admin"]
        System["Campus<br/>Marketplace<br/>System"]
    end

    subgraph BuyerUseCases["Buyer Use Cases"]
        B1["Register/Login"]
        B2["Browse Listings"]
        B3["Search Listings<br/>Keyword + NLP"]
        B4["View Listing Detail"]
        B5["Contact Seller<br/>Chat"]
        B6["Report Listing"]
        B7["View Profile"]
        B8["View Chat History"]
    end

    subgraph SellerUseCases["Seller Use Cases"]
        S1["Register/Login"]
        S2["Create Listing"]
        S3["Upload Photos"]
        S4["Edit Listing"]
        S5["Mark as Sold"]
        S6["Chat with Buyer"]
        S7["View Dashboard<br/>Stats"]
    end

    subgraph AdminUseCases["Admin Use Cases"]
        A1["Login"]
        A2["View Dashboard"]
        A3["Review Reports"]
        A4["Approve/Reject<br/>Listing"]
        A5["Manage Users"]
        A6["Remove Listing"]
        A7["View Analytics"]
    end

    B --> B1
    B --> B2
    B --> B3
    B --> B4
    B --> B5
    B --> B6
    B --> B7
    B --> B8

    S --> S1
    S --> S2
    S --> S3
    S --> S4
    S --> S5
    S --> S6
    S --> S7

    A --> A1
    A --> A2
    A --> A3
    A --> A4
    A --> A5
    A --> A6
    A --> A7

    B1 -.->|extends| System
    S1 -.->|extends| System
    A1 -.->|extends| System

    B2 -.->|extends| System
    B3 -.->|extends| System
    B4 -.->|extends| System
    B5 -.->|extends| System
    B6 -.->|extends| System
    B7 -.->|extends| System
    B8 -.->|extends| System

    S2 -.->|extends| System
    S3 -.->|extends| System
    S4 -.->|extends| System
    S5 -.->|extends| System
    S6 -.->|extends| System
    S7 -.->|extends| System

    A2 -.->|extends| System
    A3 -.->|extends| System
    A4 -.->|extends| System
    A5 -.->|extends| System
    A6 -.->|extends| System
    A7 -.->|extends| System

    style B fill:#c8e6c9
    style S fill:#bbdefb
    style A fill:#ffe0b2
    style System fill:#f0f0f0
```

---

## 14. Sequence Diagram - File Upload & Storage

```mermaid
sequenceDiagram
    participant User as User<br/>(Browser)
    participant Frontend as Frontend<br/>(Next.js)
    participant Backend as Backend<br/>(FastAPI)
    participant S3 as AWS S3<br/>(or Local)
    participant DB as Database

    rect rgb(240, 200, 240)
    Note over User,DB: Photo Upload Process

    User->>Frontend: Select photo from computer
    Frontend->>Frontend: Validate file<br/>- Size < 10MB<br/>- Format: jpg, png, gif
    
    Frontend->>Frontend: Show preview
    User->>Frontend: Confirm upload
    
    Frontend->>Frontend: Compress image<br/>Reduce size
    
    Frontend->>Backend: Send file as multipart/form-data
    Note over Frontend,Backend: POST /listings/{id}/photos
    
    Backend->>Backend: Validate JWT
    Backend->>Backend: Validate file again
    
    alt Local Storage (Development)
        Backend->>Backend: Generate unique filename
        Backend->>Backend: Save to ./media/ directory
        Backend->>Backend: Get file path
    else S3 Storage (Production)
        Backend->>S3: Upload file with presigned URL
        S3-->>Backend: Return S3 URL
        Backend->>Backend: Get S3 URL
    end
    
    Backend->>DB: Insert photo record
    Note over Backend,DB: table: listing_photo<br/>- listing_id<br/>- photo_url<br/>- display_order
    
    DB-->>Backend: Photo record created
    Backend-->>Frontend: Success + Photo URL
    
    Frontend->>Frontend: Add photo to gallery
    Frontend-->>User: Show uploaded photo
    
    User->>Frontend: Publish listing
    Frontend->>Backend: POST /listings with photo IDs
    Backend->>DB: Create listing record
    DB-->>Backend: Listing created
    Backend-->>Frontend: Success
    end
```

---

## 15. State Diagram - User Authentication States

```mermaid
stateDiagram-v2
    [*] --> Not_Authenticated

    Not_Authenticated --> Registering: Click "Sign Up"
    Not_Authenticated --> Authenticating: Click "Sign In"

    Registering --> Validate_Email: Enter email
    Validate_Email --> Email_Invalid: Invalid .edu domain
    Email_Invalid --> Registering: Retry

    Validate_Email --> Email_Valid: Valid college email
    Email_Valid --> Validate_Password: Enter password
    
    Validate_Password --> Password_Weak: < 8 chars, no numbers
    Password_Weak --> Validate_Password: Retry
    
    Validate_Password --> Password_Strong: Valid password
    Password_Strong --> Check_Email_Exists: Query database
    
    Check_Email_Exists --> Email_Already_Exists: Email found
    Email_Already_Exists --> Registering: Retry
    
    Check_Email_Exists --> Email_Available: Email available
    Email_Available --> Creating_Account: Hash password + save
    Creating_Account --> Authenticated: JWT token generated

    Authenticating --> Check_Credentials: Submit email & password
    Check_Credentials --> Invalid_Credentials: Mismatch or user not found
    Invalid_Credentials --> Authenticating: Retry
    
    Check_Credentials --> Valid_Credentials: Match found
    Valid_Credentials --> Authenticated: JWT token generated

    Authenticated --> Token_Valid: Token in memory
    Token_Valid --> Authenticated: Token expires in 60 min
    Authenticated --> Token_Refresh: Request new token
    Token_Refresh --> Authenticated: New token issued

    Token_Valid --> Session_Active: Making API requests
    Session_Active --> Token_Valid: Update timestamp
    
    Authenticated --> Logout: User clicks logout
    Logout --> Not_Authenticated: Clear token

    Authenticated --> Token_Expired: 60 minutes passed
    Token_Expired --> Not_Authenticated: Redirect to login

    note right of Registering
        Email must be .edu domain
        (college student only)
    end note

    note right of Validate_Password
        Min 8 chars, 1 number,
        1 uppercase, 1 special char
    end note

    note right of Authenticated
        JWT token stored
        in memory/secure storage
    end note
```

---

## Summary of Diagrams

| Diagram | Type | Purpose |
|---------|------|---------|
| 1. Class Diagram | Static | Shows data models and relationships |
| 2. Component Diagram | Static | Shows system components and layers |
| 3. Deployment Diagram | Static | Shows cloud infrastructure |
| 4. Registration/Login Sequence | Dynamic | User onboarding flow |
| 5. Create Listing Sequence | Dynamic | Seller creates marketplace item |
| 6. NLP Search Sequence | Dynamic | AI-powered search process |
| 7. Chat Sequence | Dynamic | Real-time WebSocket messaging |
| 8. Admin Moderation Sequence | Dynamic | Content moderation workflow |
| 9. Search Activity Diagram | Dynamic | Marketplace search logic |
| 10. Listing State Diagram | State | Lifecycle of a listing |
| 11. Authentication Sequence | Dynamic | JWT token validation |
| 12. Entity Relationship Diagram | Static | Database schema visualization |
| 13. Use Case Diagram | Static | User interactions |
| 14. File Upload Sequence | Dynamic | Photo upload process |
| 15. Auth State Diagram | State | User authentication states |

---

**Document Version:** 1.0  
**Date:** December 4, 2025  
**Project:** Campus Marketplace (Campify) - CMPE 202
