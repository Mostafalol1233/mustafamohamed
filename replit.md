# Portfolio Website Project

## Project Overview
A professional portfolio website for Mustafa Mohamed showcasing personal achievements, projects, and professional credentials.

## Stack
- React.js frontend with TypeScript
- Express.js backend
- PostgreSQL database
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
- `/client/src/components` - Reusable UI components
- `/client/src/lib` - Utilities and configurations

### Backend Structure
- `/server/routes.ts` - API endpoints
- `/server/storage.ts` - Database operations
- `/shared/schema.ts` - Database schema and types

### Key Features
- Portfolio project showcase
- Contact form
- Reviews section
- Admin authentication
- Project management (CRUD operations)

## Recent Changes
- Fixed database connection issues and got application running properly
- Restored original projects: BRAVEZM Gaming, BestyBoy Gaming, Ahmed Helly Academy
- Added new projects as requested:
  * Eco Eats - Food waste awareness campaign
  * BMO Tools - Arabic calculator tools with RTL support  
  * Updated OneTeam link to oneteamss.vercel.app (fixed)
  * Updated Bemora link to bemora.netlify.app
  * Renamed "MRMO Business" to "MR Mohammed" with new image
  * Updated Diaa Elden Shop with gaming platform image
  * Updated Bemora with new BMO Tools-style image
- Updated certificates section with modern card design matching user reference image
- Updated contact section image to jordwalke-style GitHub avatar
- Preserved all original certificates and content
- Portfolio now displays 9 total projects with proper images and descriptions
- Fixed color scheme issues - restored proper blue/green colors instead of white text
- Created interactive skeletal dragon console with:
  * Advanced mystical dragon design with golden wireframe bones
  * Full-body rotation towards mouse position with realistic head tracking
  * Articulated spine, ribs, wings, arms, claws, and serpentine tail
  * All body parts move independently with proper animation delays
  * Enhanced fire breath effects with multiple particles
  * Ancient mystical background with golden pattern overlay
  * Larger, more detailed dragon matching user's reference image
- Fixed authentication system for proper login functionality
- Made reviews system globally persistent for all users
- Implemented new admin authentication system with email/password instead of Replit OAuth
- Admin credentials: admin@portfolio.com / admin123 (changeable in server/adminAuth.ts)
- Added keyboard shortcut Alt+Shift+A for admin access
- Admin dashboard accessible via /admin URL
- Improved dragon design to be larger, more realistic with detailed wings and body parts

## Current Status
- Application is fully functional and running
- Database connected and working with persistent reviews
- Interactive skeletal dragon console enhanced with realistic design and wing membranes
- Portfolio displays both original and new projects with proper styling
- Modern certificate design implemented to match reference
- All color scheme issues resolved
- Admin system fully functional with email/password authentication
- Dragon design significantly improved with larger size and realistic wings
- Date: August 8, 2025