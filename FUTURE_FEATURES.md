# CollegeHub — Future Features Roadmap

> Prioritized features for the CollegeHub platform, organized by importance and impact.

---

## 🔴 Critical Priority (Must-Have)

### 1. Supabase Backend Integration
**Current State:** All data (events, settings, notices) uses `localStorage`.  
**Goal:** Migrate to Supabase tables with Row Level Security (RLS) for multi-tenant, multi-device data sync.  
**Impact:** Without this, data is lost on browser clear and cannot sync across devices.  
**Scope:**
- User authentication flow (email/password + OAuth)
- Database tables for notices, events, calendar entries, marketplace items
- RLS policies scoped to `college_id` and `auth.uid()`

### 2. Authentication & Authorization
**Current State:** Mock role switching via Zustand store.  
**Goal:** Real login/signup with Supabase Auth. Role assignment by college admins.  
**Impact:** Security foundation — blocks unauthorized access to admin panels and faculty tools.  
**Scope:**
- Login / Signup pages with email verification
- Protected route middleware
- Role-based access enforcement (student / teacher / admin)

### 3. Push Notifications
**Goal:** Real-time alerts for urgent notices, assignment deadlines, and event reminders.  
**Impact:** Critical for student engagement — ensures time-sensitive info reaches users.  
**Scope:**
- Service Worker registration for PWA push
- Supabase Realtime subscriptions for live updates
- Notification preferences in profile settings

---

## 🟡 High Priority (Should-Have)

### 4. Assignment Submission System
**Current State:** Assignments page shows static placeholder data.  
**Goal:** Full CRUD for teachers to create assignments; students upload submissions.  
**Impact:** Core academic feature — replaces paper/email-based workflows.  
**Scope:**
- File upload (PDF, images) to Supabase Storage
- Submission tracking with timestamps
- Teacher grading interface with feedback
- Late submission detection and warnings

### 5. Notes Repository (PDF Upload/Download)
**Current State:** Static placeholder notes page.  
**Goal:** Faculty and students can upload study materials organized by subject/semester.  
**Impact:** Centralizes academic resources — high daily usage feature.  
**Scope:**
- PDF upload with metadata (subject, semester, topic)
- Full-text search across notes
- Download tracking and "most downloaded" rankings
- Preview capability (in-browser PDF viewer)

### 6. Attendance System
**Current State:** Placeholder UI with mock data.  
**Goal:** QR-code or location-based attendance marking.  
**Impact:** Eliminates manual attendance sheets — saves 5-10 min per class.  
**Scope:**
- Teacher generates time-limited QR code per session
- Student scans to mark attendance (with geofencing optional)
- Attendance analytics dashboard for students and faculty
- Low-attendance alerts

### 7. Real-Time Chat / Discussion Boards
**Goal:** Course-specific discussion threads and direct messaging.  
**Impact:** Reduces WhatsApp group dependency for academic discussions.  
**Scope:**
- Supabase Realtime channels per course/section
- Thread-based discussions with replies
- File/image sharing within threads
- Mention system (@student, @faculty)

---

## 🟢 Medium Priority (Nice-to-Have)

### 8. College Banner Upload (Image Upload)
**Current State:** Admin can set banner via URL input only.  
**Goal:** Allow direct image upload from device to Supabase Storage.  
**Impact:** Better UX for admins who don't have publicly hosted image URLs.  
**Scope:**
- Drag-and-drop image uploader in Admin panel
- Image cropping/resizing before upload
- Auto-generated CDN URL stored in college settings

### 9. Marketplace Enhancements
**Current State:** Static product listings.  
**Goal:** Full buy/sell workflow with listing creation, image uploads, and in-app messaging between buyer/seller.  
**Impact:** Creates a self-sustaining student economy within the platform.  
**Scope:**
- Create listing with photos and pricing
- Search/filter by category, price range
- "Interested" / contact seller flow
- Sold/expired listing management

### 10. Polls & Surveys (Enhanced)
**Current State:** Basic poll display.  
**Goal:** Create polls with multiple question types (MCQ, rating, open-ended).  
**Impact:** Useful for student council elections, feedback collection, event planning.  
**Scope:**
- Poll creation UI with multiple question types
- Anonymous voting option
- Results visualization (bar charts, pie charts)
- Export results to CSV

### 11. Events RSVP & Check-in
**Current State:** Events page shows static event cards.  
**Goal:** Students can RSVP to events; organizers can track attendance.  
**Impact:** Better event planning and capacity management.  
**Scope:**
- RSVP button on event cards
- Attendee cap and waitlist
- QR-based event check-in
- Post-event feedback collection

---

## 🔵 Low Priority (Future Enhancements)

### 12. Multi-Language Support (i18n)
**Goal:** Support Hindi, regional languages alongside English.  
**Impact:** Accessibility for students in regional-medium colleges.

### 13. Analytics Dashboard (Admin)
**Goal:** Platform usage metrics — active users, popular features, engagement trends.  
**Impact:** Helps admins understand platform adoption and make data-driven decisions.

### 14. Timetable Generator
**Goal:** Auto-generate conflict-free timetables from course/faculty data.  
**Impact:** Saves hours of manual scheduling at the start of each semester.

### 15. Alumni Network
**Goal:** Graduate directory with mentorship matching and job postings.  
**Impact:** Long-term value — creates career pathways for current students.

### 16. Library Management Integration
**Goal:** Book search, availability checking, and reservation from within the app.  
**Impact:** Convenience feature — reduces trips to the library counter.

### 17. Campus Map (Interactive)
**Goal:** Interactive map with building labels, room search, and navigation.  
**Impact:** Essential for freshers and visitors navigating large campuses.

---

## 🛠️ Technical Debt & Maintenance

| Item | Description |
|------|-------------|
| **TypeScript Strictness** | Enable `strict: true` in tsconfig and fix all type errors |
| **Error Boundaries** | Add React Error Boundaries to prevent full-page crashes |
| **Loading States** | Add skeleton loaders to all data-fetching components |
| **SEO Meta Tags** | Add per-page `<title>` and `<meta>` descriptions |
| **Accessibility (a11y)** | ARIA labels, keyboard navigation, screen reader testing |
| **Performance** | Image optimization, code splitting, lazy loading |
| **Testing** | Unit tests for core logic, E2E tests for critical flows |
| **CI/CD Pipeline** | GitHub Actions for lint, test, build, and deploy |

---

*Last updated: April 23, 2026*
