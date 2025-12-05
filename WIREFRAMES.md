# Campus Marketplace (Campify) - Wireframes

**CMPE 202 Project | Team: Visionary Coders | December 4, 2025**

---

## Table of Contents

1. [Buyer Wireframes](#buyer-wireframes) - 7 pages
2. [Seller Wireframes](#seller-wireframes) - 4 pages  
3. [Admin Wireframes](#admin-wireframes) - 2 pages
4. [Mobile Wireframes](#mobile-wireframes) - 4 pages
5. [Component Wireframes](#component-wireframes) - 13 components

---

# BUYER WIREFRAMES

## 1. Landing Page

```
HEADER:
+-----------------------------------------------------------------+
| CAMPIFY LOGO              [Login] [Sign Up]                     |
+-----------------------------------------------------------------+

HERO SECTION:
+-----------------------------------------------------------------+
|         CAMPUS MARKETPLACE - CAMPIFY                            |
|                                                                 |
|    Find & Buy Items from Your College Community                |
|                                                                 |
|  +-------------------------------------------------------+     |
|  | Search [____________] [Filters V] [Search]           |     |
|  +-------------------------------------------------------+     |
|                                                                 |
|                  [Browse All Items >]                          |
+-----------------------------------------------------------------+

FEATURED LISTINGS:
+-----------------------------------------------------------------+
| FEATURED                                    [View All >]        |
|                                                                 |
| +--------+  +--------+  +--------+  +--------+                 |
| |[Image] |  |[Image] |  |[Image] |  |[Image] |                 |
| |MacBook |  |Textbook|  |Headpho|  |Backpack|                 |
| |$450    |  |$25     |  |$80     |  |$35     |                 |
| |Rating  |  |Rating  |  |Rating  |  |Rating  |                 |
| +--------+  +--------+  +--------+  +--------+                 |
+-----------------------------------------------------------------+

CATEGORIES:
+-----------------------------------------------------------------+
| CATEGORIES                                                      |
| Books  | Phones | Laptops | Dorm | Sports | Others             |
+-----------------------------------------------------------------+

FOOTER:
+-----------------------------------------------------------------+
| About | Contact | Terms | Privacy | (C) 2025 Campify         |
+-----------------------------------------------------------------+
```

---

## 2. Login Page

```
+-----------------------------------------------------------------+
|                    LOGIN TO CAMPIFY                            |
|                                                                 |
|              +----------------------------------+              |
|              | Email Address                    |              |
|              | [_____________________]          |              |
|              |                                  |              |
|              | Password                         |              |
|              | [_____________________]          |              |
|              |                                  |              |
|              | [*] Remember me                  |              |
|              |                                  |              |
|              |  [   LOGIN BUTTON   ]            |              |
|              |                                  |              |
|              | Don't have account?              |              |
|              |  [Create one here]               |              |
|              |                                  |              |
|              |  [Forgot Password?]              |              |
|              +----------------------------------+              |
+-----------------------------------------------------------------+
```

---

## 3. Browse Listings

```
LEFT SIDEBAR - FILTERS:
+------------------+
| FILTERS          |
+------------------+
| Category   [V]   |
| Price      [V]   |
| Condition  [V]   |
| Rating     [V]   |
|                  |
| [Apply]          |
+------------------+

MAIN CONTENT - LISTINGS GRID:
+------------------------------------------------------------------+
| Search Results: "laptop" (127 results)  [Sort: V]               |
|                                                                  |
| +--------+  +--------+  +--------+  +--------+                  |
| |[Image] |  |[Image] |  |[Image] |  |[Image] |                  |
| |MacBook |  |Dell    |  |ASUS    |  |HP      |                  |
| |$650    |  |$400    |  |$380    |  |$320    |                  |
| |Rating  |  |Rating  |  |Rating  |  |Rating  |                  |
| |Details |  |Details |  |Details |  |Details |                  |
| +--------+  +--------+  +--------+  +--------+                  |
|                                                                  |
| [< Prev] [1] [2] [3] [4] [Next >]                               |
+------------------------------------------------------------------+
```

---

## 4. Listing Detail Page

```
HEADER:
+----------------------------------------------------------+
| [<- Back]              MacBook Pro 16"                   |
+----------------------------------------------------------+

CONTENT:
+----------------------------------------------------------+
|                                                          |
| IMAGES:                      DETAILS:                   |
| +----------+                  PRICE: $650               |
| |          |                  CONDITION: Like New       |
| |Main Image|                  Category: Electronics    |
| |(Large)   |                  Posted: 2 days ago       |
| |          |                                            |
| +----------+                  SELLER INFO               |
| [Thumb1][T2][T3][T4]         +-------------------+     |
|                              | John Smith        |     |
|                              | Rating: 4.8/5     |     |
|                              | Location: Campus  |     |
|                              | [Visit Store]     |     |
|                              +-------------------+     |
|                                                          |
| DESCRIPTION:                                            |
| "Excellent condition! Barely used. Comes with original |
|  box and charger. No scratches or damage..."           |
|                                                          |
| SPECS:                                                 |
| * M1 Pro CPU * 16GB RAM * 512GB SSD * 16" Display     |
|                                                          |
| REVIEWS:                                               |
| Rating: "Great seller! Fast response." - Sarah M.     |
| Rating: "Good condition. Recommended." - Tom P.       |
|                                                          |
| [Save]  [Contact Seller]  [Buy Now]                   |
|                                                          |
+----------------------------------------------------------+
```

---

## 5. Search Bar with NLP

```
+----------------------------------------------------------+
| Search: What are you looking for?           [Search]    |
| [_________________________________________]             |
|                                                          |
| Tips: "Laptop under $500", "iPhone for $300"            |
|                                                          |
| RECENT SEARCHES:                                        |
| * Used textbooks              * Gaming headphones      |
| * Winter jacket size M        * TI-84 calculator       |
|                                                          |
| POPULAR SEARCHES:                                       |
| * MacBook                     * iPhone                  |
| * Dorm furniture              * Used books              |
|                                                          |
| SMART SEARCH: AI-powered natural language processing   |
+----------------------------------------------------------+
```

---

## 6. Chat/Messages Page

```
LEFT SIDEBAR - CONVERSATIONS:    RIGHT SIDE - CHAT WINDOW:
+------------------+            +---------------------+
| CONVERSATIONS    |            | John Smith - MacBook|
| [Search box]     |            | Last seen: 5 min    |
|                  |            +---------------------+
| John S. (NEW)    |            |                     |
| "Is it..." 2min  |            | You: "Is it...?"   |
| Read Status      |            | 10:30 AM            |
| [Select]         |            |                     |
|                  |            | John: "Yes! Can we  |
| Alice J.         |            | meet tomorrow?"     |
| "Interested"     |            | 10:35 AM            |
| Unread           |            |                     |
| [Select]         |            | You: "2pm works"    |
|                  |            | 10:40 AM            |
| Bob W.           |            |                     |
| (Typing...)      |            | John: "Perfect!"    |
| Now              |            | 10:41 AM            |
| [Select]         |            |                     |
|                  |            +---------------------+
| [+ New Chat]     |            | [Type message...]   |
|                  |            | [_____________]     |
+------------------+            +---------------------+
```

---

## 7. Favorites/Wishlist Page

```
+----------------------------------------------------------+
| SAVED ITEMS (12)                    [View All] [Sort]    |
|                                                          |
| +--------+  +--------+  +--------+                      |
| |[Image] |  |[Image] |  |[Image] |                      |
| |MacBook |  |iPhone  |  |Headpho|                      |
| |$650    |  |$800    |  |$120    |                      |
| |Rating  |  |Rating  |  |Rating  |                      |
| |[View]  |  |[View]  |  |[View]  |                      |
| +--------+  +--------+  +--------+                      |
|                                                          |
| +--------+  +--------+  +--------+                      |
| |[Image] |  |[Image] |  |[Image] |                      |
| |Dell    |  |Book    |  |Backpack|                      |
| |$400    |  |$25     |  |$35     |                      |
| |Rating  |  |Rating  |  |Rating  |                      |
| |[View]  |  |[View]  |  |[View]  |                      |
| +--------+  +--------+  +--------+                      |
|                                                          |
+----------------------------------------------------------+
```

---

# SELLER WIREFRAMES

## 8. Create Listing - Step 1: Details

```
PROGRESS:
(o-----------o-----------o)
 Details    Photos     Review

+----------------------------------------------------------+
| CREATE NEW LISTING (Step 1/3)                           |
|                                                          |
| TITLE *                                                  |
| [_________________________________]                     |
| Example: "MacBook Pro 16\" 2021"                        |
|                                                          |
| CATEGORY *                                               |
| [Electronics - Computers V]                             |
|                                                          |
| CONDITION *                                              |
| (o) Like New  (o) Good  (o) Fair  (o) For Parts         |
|                                                          |
| PRICE * ($)                                              |
| [_____________]                                         |
|                                                          |
| DESCRIPTION *                                            |
| [                                                        |
|  _______________________________________                |
|  _______________________________________                |
|                                                  ]        |
| Min 20 characters                                        |
|                                                          |
| SELLER NOTES (Optional)                                 |
| [                                                        |
|  _______________________________________                |
|                                                  ]        |
|                                                          |
|             [CANCEL]  [NEXT >]                          |
|                                                          |
+----------------------------------------------------------+
```

---

## 9. Create Listing - Step 2: Photos

```
PROGRESS:
(o-----------o-----------o)
 Details    Photos     Review

+----------------------------------------------------------+
| CREATE NEW LISTING (Step 2/3)                           |
|                                                          |
| UPLOAD PHOTOS (Max 10 photos)                           |
|                                                          |
| +----------------------------------------------------+  |
| | +------+ +------+ +------+ +---------------+      |  |
| | |Photo1| |Photo2| |Photo3| | Add More      |      |  |
| | |Primary|(Main)| |Remove| | Upload/Drag   |      |  |
| | |[x]   | [A V x]|        |                |      |  |
| | +------+ +------+ +------+ +---------------+      |  |
| |                                                   |  |
| | +------+ +------+                                |  |
| | |Photo4| |Photo5|                                |  |
| | |Remove| |Remove|                                |  |
| | +------+ +------+                                |  |
| |                                                   |  |
| +----------------------------------------------------+  |
|                                                          |
| Tips: Clear photos = better sales                        |
|                                                          |
| PRIMARY PHOTO: Photo 2 -(Main thumbnail)                |
|                                                          |
|             [<- BACK]  [REVIEW >]                       |
|                                                          |
+----------------------------------------------------------+
```

---

## 10. Create Listing - Step 3: Review

```
PROGRESS:
(o-----------o-----------o)
 Details    Photos     Review

+----------------------------------------------------------+
| CREATE NEW LISTING (Step 3/3)                           |
|                                                          |
| REVIEW YOUR LISTING                                     |
|                                                          |
| +----------------------------------------------------+  |
| | TITLE: MacBook Pro 16" 2021                      |  |
| | CATEGORY: Electronics > Computers                |  |
| | CONDITION: Like New                              |  |
| | PRICE: $650                                      |  |
| | PHOTOS: 5 uploaded                               |  |
| | DESCRIPTION: "Excellent condition..."            |  |
| | NOTES: "Pickup only, on campus"                  |  |
| |                                                  |  |
| | [EDIT DETAILS] [EDIT PHOTOS]                    |  |
| +----------------------------------------------------+  |
|                                                          |
| [*] I confirm this is accurate                          |
| [*] I read Community Guidelines                         |
| [*] I agree to Terms of Service                        |
|                                                          |
|         [<- BACK]  [PUBLISH LISTING]                   |
|                                                          |
+----------------------------------------------------------+
```

---

## 11. Seller Dashboard

```
+----------------------------------------------------------+
| MY STORE                          [+ New Listing] [Edit]|
|                                                          |
| STATS                                                   |
| +-------+ +-------+ +-------+ +-------+               |
| |ACTIVE | |SOLD   | |VIEWS  | |RATING |               |
| | 12    | | 28    | | 1,247 | |Rate   |               |
| |Listings|This Mo.|This Mo.|4.9/5  |               |
| +-------+ +-------+ +-------+ +-------+               |
|                                                          |
| MY LISTINGS                      [Filter V] [Sort V]   |
|                                                          |
| +--------+  +--------+  +--------+                     |
| |[Image] |  |[Image] |  |[Image] |                     |
| |MacBook |  |iPhone  |  |Headpho|                     |
| |$650    |  |$800    |  |$120    |                     |
| |Active  |  |Active  |  |Pending |                     |
| |[Edit]  |  |[Edit]  |  |[Edit]  |                     |
| +--------+  +--------+  +--------+                     |
|                                                          |
| [< Previous] [1] [2] [3] [Next >]                       |
|                                                          |
+----------------------------------------------------------+
```

---

# ADMIN WIREFRAMES

## 12. Admin Dashboard

```
+----------------------------------------------------------+
| ADMIN DASHBOARD                                         |
|                                                          |
| STATS                                                   |
| +-------+ +-------+ +-------+ +-------+               |
| |USERS  | |LISTING| |REPORTS| |REVENUE|               |
| | 2,345 | | 1,892 | | 23    | |$45200 |               |
| |Up 12% | |Up 8%  | |Up 3%  | |Up 15% |               |
| +-------+ +-------+ +-------+ +-------+               |
|                                                          |
| PENDING REPORTS (23 Total)                              |
|                                                          |
| +----------------------------------------------------+  |
| | [REPORT #R001]                                   |  |
| | Listing: "iPhone 13 Pro"                        |  |
| | Reason: Suspected Fraud                          |  |
| | Reported by: alice@college.edu                    |  |
| | Status: Pending Review                           |  |
| | [View Details]                                   |  |
| |                                                  |  |
| | [REPORT #R002]                                   |  |
| | Listing: "Used Textbook Set"                    |  |
| | Reason: Inappropriate Content                    |  |
| | Reported by: john@college.edu                     |  |
| | Status: Pending Review                           |  |
| | [View Details]                                   |  |
| |                                                  |  |
| | [View All Reports >]                             |  |
| +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
```

---

## 13. Admin Report Review

```
+----------------------------------------------------------+
| REVIEW REPORT #R001                                      |
|                                                          |
| REPORT INFO:                                             |
| ID: R001 | Status: Pending | Created: 2 hours ago      |
| Reporter: alice@college.edu (Trusted)                   |
|                                                          |
| REPORTED LISTING:                                        |
| +----------------------------------------------------+  |
| | Title: "iPhone 13 Pro - Clearance Price!"       |  |
| | Seller: suspicious_seller@college.edu           |  |
| | Price: $199 (Market: $950)                       |  |
| | Status: Active (1 day ago)                       |  |
| | Reports: 5 for this item                         |  |
| | [View Full Listing]                              |  |
| +----------------------------------------------------+  |
|                                                          |
| REASON: Suspected Fraud                                  |
| COMMENT: "This price is too low. Definitely a scam!"    |
|                                                          |
| SELLER INFO:                                             |
| +----------------------------------------------------+  |
| | Username: suspicious_seller                    |  |
| | Join: 1 month ago | Rating: 1 (1 review)       |  |
| | Total Listings: 15 (8 active, 7 pending)      |  |
| | Warnings: 2 previous                            |  |
| | [View Profile] [View All Listings]             |  |
| +----------------------------------------------------+  |
|                                                          |
| DECISION:                                                |
| (o) Approve  (o) Suspend Seller  (o) Remove Listing    |
|                                                          |
| ADMIN NOTES:                                             |
| [_________________________________]                     |
| e.g., "Fraud confirmed, suspicious pricing"             |
|                                                          |
|      [CANCEL]  [SUBMIT DECISION]                        |
|                                                          |
+----------------------------------------------------------+
```

---

# MOBILE WIREFRAMES

## 14. Mobile Home

```
+---------------------------------+
| CAMPIFY            User  Menu    |
+---------------------------------+
| Search: What are you looking... |
| [_____________________]        |
|                                 |
| FEATURED                        |
| +----------+                    |
| | [Image]  |                    |
| | MacBook  |                    |
| | $650     |                    |
| | Rating   |                    |
| | [Contact]|                    |
| +----------+                    |
|                                 |
| +----------+                    |
| | [Image]  |                    |
| | iPhone   |                    |
| | $800     |                    |
| | Rating   |                    |
| | [Contact]|                    |
| +----------+                    |
|                                 |
+---------------------------------+
| Home | Search | Chat | Saved    |
+---------------------------------+
```

---

## 15. Mobile Chat

```
+---------------------------------+
| John Smith             <  Menu   |
+---------------------------------+
| You: Is it available?           |
| 2:30 PM                         |
|                                 |
|        John: Yes! Still         |
|        available. Meet          |
|        tomorrow?                |
|        2:35 PM                  |
|                                 |
| You: 2pm works?                 |
| 2:40 PM                         |
|                                 |
|        John: Perfect!           |
|        See you then! 2:41 PM    |
|                                 |
+---------------------------------+
| [_____________________]         |
| Attach: Paperclip  Camera      |
+---------------------------------+
| Home | Search | Chat | Saved    |
+---------------------------------+
```

---

## 16. Mobile Listing Detail

```
+---------------------------------+
| <- MacBook Pro           Menu    |
+---------------------------------+
|                                 |
| [Main Image]                    |
| [T1][T2][T3] [>]                |
|                                 |
| MacBook Pro 16"                 |
| $650                            |
| Rating: 4.8/5                   |
|                                 |
| Condition: Like New             |
| Posted: 2 days ago              |
|                                 |
+---------------------------------+
| SELLER                          |
| John Smith                      |
| Rating: 4.8/5 (42)              |
| Location: On Campus             |
| Response: Fast                  |
|                                 |
+---------------------------------+
| DESCRIPTION                     |
| Excellent condition!...         |
| [Read More]                     |
|                                 |
| [Save] [Contact]                |
|                                 |
+---------------------------------+
| Home | Search | Chat | Saved    |
+---------------------------------+
```

---

## 17. Mobile Create Listing

```
+---------------------------------+
| <- Create Listing          [OK]  |
+---------------------------------+
| Step 1/3: Details               |
|                                 |
| TITLE                           |
| [_____________________]         |
|                                 |
| CATEGORY                        |
| [Electronics V]                 |
|                                 |
| CONDITION                       |
| (o) Like (o) Good (o) Fair     |
|                                 |
| PRICE                           |
| $[___________]                  |
|                                 |
| DESCRIPTION                     |
| [                               |
|  ___________________            |
|  ___________________            |
|                         ]       |
|                                 |
|        [NEXT]                   |
|                                 |
+---------------------------------+
| Home | Search | Chat | Saved    |
+---------------------------------+
```

---

# COMPONENT WIREFRAMES

## Components Overview (13 total)

```
18. Header/Navigation
    - Logo (left)
    - Navigation links (center)
    - User profile icon (right)

19. Listing Card
    +----------+
    |[Image]   |
    |Title     |
    |Price     |
    |Rating    |
    |[Details] |
    +----------+

20. Chat Message Bubble
    SENT:    [Message text] Right aligned
    RECEIVED: Left aligned [Message text]

21. Filter Sidebar
    +--------+
    |Filters |
    |Category|
    |Price   |
    |Rating  |
    |[Apply] |
    +--------+

22. User Profile Card
    +--------+
    |Photo   |
    |Name    |
    |Email   |
    |Rating  |
    |[View]  |
    +--------+

23. Pagination
    [< Prev] [1] [2] [3] [Next >]

24. Status Badges
    [Active]  [Pending]  [Sold]  [Reported]

25. Form Inputs
    - Text Input with label
    - Dropdown selector
    - Radio buttons
    - Checkboxes
    - Text area

26. Buttons
    - Primary button
    - Secondary button
    - Danger button
    - Icon button

27. Loading States
    - Spinner
    - Skeleton screen
    - Progress bar

28. Alerts/Notifications
    [SUCCESS]  [ERROR]  [WARNING]  [INFO]

29. Modals
    +---------------------------+
    | Title                  [x] |
    +---------------------------+
    | Modal content           |
    +---------------------------+
    | [Cancel] [Submit]       |
    +---------------------------+

30. Footer
    About | Contact | Terms | Privacy
    Social Links
    Copyright Info
```

---

## Summary

**Total Wireframes: 30 Screens/Components**

- Buyer Wireframes: 7
- Seller Wireframes: 4  
- Admin Wireframes: 2
- Mobile Wireframes: 4
- Component Wireframes: 13

**All key user flows covered:**
[OK] Authentication [OK] Browsing [OK] Search [OK] Listing Details
[OK] Chat [OK] Listing Creation [OK] Seller Dashboard [OK] Admin Tasks
[OK] Mobile Experience [OK] Reusable Components

---

**Document Version:** 1.0
**Date:** December 4, 2025
**Project:** Campus Marketplace (Campify) - CMPE 202
