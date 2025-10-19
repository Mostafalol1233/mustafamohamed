# Portfolio Website Project

## Project Overview
A professional portfolio website for Mustafa Mohamed showcasing personal achievements, projects, and professional credentials.

## Stack
- React.js frontend with TypeScript
- Express.js backend
- PostgreSQL database (Neon)
- Drizzle ORM
- Vite for development
- Tailwind CSS & shadcn/ui for styling
- Tanstack React Query for data management

## User Preferences
- Language: Arabic interface with English content for projects
- Focus on real, professional projects with live demos
- Clean, modern design with dark theme support

## Project Architecture
### Frontend Structure
- `/client/src/pages` - Main page components
  - `Home.tsx` - Main portfolio page
  - `Landing.tsx` - Landing page
  - `AdminLogin.tsx` - Admin authentication page
  - `AdminDashboard.tsx` - Comprehensive admin control panel
- `/client/src/components` - Reusable UI components
- `/client/src/lib` - Utilities and configurations

### Backend Structure
- `/server/routes.ts` - API endpoints
- `/server/storage.ts` - Database operations
- `/server/adminAuth.ts` - Admin authentication logic
- `/shared/schema.ts` - Database schema and types

### Database Schema
- `users` - User accounts (for future expansion)
- `sessions` - Session management
- `reviews` - User reviews with approval system
- `contactMessages` - Contact form submissions
- `projects` - Portfolio projects with visibility control
- `certificates` - Professional certificates
- `notifications` - Site-wide notifications

### Key Features
- Portfolio project showcase with live demos
- Contact form with admin notification
- Reviews section with approval workflow
- Admin authentication with session management
- Comprehensive admin dashboard
- Project management (CRUD operations)
- Certificate management
- Notification system

## Admin Dashboard Features
### Overview Tab
- Real-time statistics for all content types
- Quick action buttons for pending items
- Engagement metrics and approval rates
- Visual cards showing total counts

### Reviews Management
- View all reviews (approved and pending)
- Approve/reject reviews
- Delete reviews
- Rating display with stars
- Timestamps and user information

### Contact Messages
- View all contact form submissions
- Mark messages as read/unread
- Delete messages
- Subject and timestamp display

### Projects Management
- View all portfolio projects
- Show/hide project visibility status
- Delete projects
- Display technologies, live URLs, and GitHub links
- Visual indicators for visible/hidden projects

### Certificates Management
- View all professional certificates
- Delete certificates
- Show/hide visibility status
- Display issue dates and images

### Notifications Management
- Create and manage site-wide notifications
- Toggle active/inactive status
- Delete notifications
- Notification type badges (info, warning, success, error)

### Technical Features
- Authentication guard with automatic redirect
- Proper query invalidation after mutations
- Loading states for all operations
- Toast notifications for user feedback
- Responsive tabbed interface
- Comprehensive data-testid attributes for testing
- Secure session-based authentication

## Recent Changes
### Major Feature Update - Full Database Integration & Analytics (October 19, 2025)
- **Moved all static data to database**:
  - Reviews section now uses real database queries with approval system
  - Portfolio section fetches projects from database
  - All data can be managed through admin dashboard
- **Added Advanced Search & Filtering**:
  - Portfolio search by project title/description
  - Technology-based filtering with dynamic filter buttons
  - Real-time filter updates with smooth UX
- **Implemented Complete Analytics System**:
  - New analytics database table for visitor tracking
  - Analytics API endpoints for event tracking
  - Admin Analytics tab showing:
    * Total page views
    * Active projects count
    * Approved reviews count
    * Contact form submissions
    * Recent activity log with timestamps
- **Enhanced Reviews Section**:
  - Real-time database queries and mutations
  - Working review submission form
  - Dynamic statistics calculation (avg rating, satisfaction rate)
  - Proper cache invalidation after mutations
- **Updated browserslist database** to latest version
- **Image upload infrastructure** ready for use (multer configured)

### Database & Infrastructure (October 19, 2025)
- Fixed DATABASE_URL environment variable setup using Replit Secrets
- Successfully connected to Neon PostgreSQL database
- Pushed database schema with all tables
- Application now running on port 5000

### Admin Dashboard Enhancement (October 19, 2025)
- **Complete dashboard overhaul with 6 major sections:**
  1. Overview - Statistics and quick actions
  2. Reviews - Full review management with approve/delete
  3. Messages - Contact message management
  4. Projects - Portfolio project management
  5. Certificates - Certificate management
  6. Notifications - Notification system management

- **New Features:**
  - Authentication guard redirects to login when not authenticated
  - Tabbed interface for better organization
  - Real-time statistics dashboard
  - Quick action buttons for pending items
  - Engagement metrics display
  - Comprehensive CRUD operations for all content types
  - Visual status badges (approved/pending, read/unread, visible/hidden, active/inactive)
  - Proper data-testid attributes on all interactive elements
  - Toast notifications for all operations
  - Loading states for mutations
  - Proper query cache invalidation

### Previous Updates
- Fixed database connection issues and got application running properly
- Restored original projects: BRAVEZM Gaming, BestyBoy Gaming, Ahmed Helly Academy
- Added new projects:
  * Eco Eats - Food waste awareness campaign
  * BMO Tools - Arabic calculator tools with RTL support  
  * Updated OneTeam link to oneteamss.vercel.app
  * Updated Bemora link to bemora.netlify.app
  * Renamed "MRMO Business" to "MR Mohammed" with new image
  * Updated Diaa Elden Shop with gaming platform image
  * Updated Bemora with new BMO Tools-style image
- Updated certificates section with modern card design
- Updated contact section image to jordwalke-style GitHub avatar
- Portfolio now displays 9 total projects with proper images and descriptions
- Created interactive skeletal dragon console with advanced mystical design
- Implemented admin authentication system with email/password
- Admin credentials: admin@portfolio.com / admin123 (changeable in server/adminAuth.ts)
- Added keyboard shortcut Alt+Shift+A for admin access

## Current Status
- **Application fully functional and running**
- **Database connected and operational** (Neon PostgreSQL)
- **Admin dashboard complete** with all management features
- Authentication system working with session management
- All API endpoints secured with admin authentication
- Portfolio displays 9 projects with proper styling
- Modern certificate design implemented
- Interactive dragon console with realistic design
- All features tested and verified by architect
- Ready for production deployment

## Admin Access
- URL: `/admin` (redirects to `/admin/login` if not authenticated)
- Credentials: admin@portfolio.com / admin123
- Keyboard shortcut: Alt + Shift + A
- Session duration: 24 hours

## Next Steps / Future Enhancements
- Add project creation form in admin dashboard
- Add certificate creation form in admin dashboard
- Add notification creation form in admin dashboard
- Implement image upload for projects and certificates
- Add user management if needed
- Add analytics dashboard
- Implement email notifications for contact messages
- Add export functionality for contact messages and reviews

## Technical Notes
- Uses Neon serverless PostgreSQL (sleeps after 5 minutes of inactivity)
- Session-based authentication with express-session
- Database migrations handled via `npm run db:push`
- All secrets managed via Replit Secrets
- Vite HMR enabled for fast development
- Port 5000 for both frontend and backend (unified server)

Last Updated: October 19, 2025
