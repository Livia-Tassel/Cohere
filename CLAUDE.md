# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cohere is a full-stack Q&A community platform (similar to Stack Overflow) built with the MERN stack. It features a distinctive Neo-Brutalist design with modern animations and a rich text editor.

**Tech Stack:**
- Frontend: React 18 + Vite + Tailwind CSS + Framer Motion + Tiptap
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT with bcrypt password hashing

## Development Commands

### Setup
```bash
# Install all dependencies (both client and server)
npm run install:all

# Seed database with sample data
npm run seed
```

### Development
```bash
# Run both client and server concurrently (from root)
npm run dev

# Run server only (from server/)
cd server && npm run dev

# Run client only (from client/)
cd client && npm run dev
```

### Production
```bash
# Build client for production
cd client && npm run build

# Start production server
cd server && npm start
```

### Health Check
```bash
# Run health check script
npm run health
# Or directly: ./health-check.sh
```

## Architecture

### Backend Structure

**Models** (`server/models/`):
- `User.js` - User accounts with reputation system
- `Question.js` - Questions with tags, votes, views, and accepted answers
- `Answer.js` - Answers with votes and acceptance status
- `Vote.js` - Voting records with unique constraints to prevent duplicate votes

**Routes** (`server/routes/`):
- `auth.js` - Registration, login, and current user endpoint
- `questions.js` - CRUD operations, search, filtering, sorting, and answer acceptance
- `answers.js` - CRUD operations for answers
- `votes.js` - Voting logic with toggle/cancel support
- `users.js` - User profiles and activity (questions/answers)
- `tags.js` - Tag listing and tag-based question filtering

**Middleware** (`server/middleware/`):
- `auth.js` - JWT verification, attaches `req.user` and `req.userId`
- `validation.js` - Express-validator based input validation

**Key Patterns:**
- All protected routes use the `auth` middleware
- Models use Mongoose refs for relationships (author, question, acceptedAnswer)
- Question model has text indexes on title and body for full-text search
- Cascade deletion: deleting a question deletes all its answers

### Frontend Structure

**Pages** (`client/src/pages/`):
- `Home.jsx` - Question list with search, filtering, sorting, and pagination
- `QuestionDetail.jsx` - Full question view with answers and voting
- `AskQuestion.jsx` - Question creation with Tiptap rich text editor
- `Login.jsx` / `Register.jsx` - Authentication forms
- `Profile.jsx` - User profile with questions and answers tabs
- `Tags.jsx` / `TagPage.jsx` - Tag browsing and tag-specific questions

**Components** (`client/src/components/`):
- `Navbar.jsx` - Navigation with auth state
- `QuestionCard.jsx` - Question preview card
- `AnswerCard.jsx` - Answer display with voting and edit/delete
- `VoteButtons.jsx` - Upvote/downvote UI with optimistic updates
- `TagList.jsx` - Tag display with counts
- `RichTextEditor.jsx` - Tiptap-based WYSIWYG editor

**State Management:**
- `AuthContext.jsx` - Global auth state using React Context
  - Provides: `user`, `loading`, `loginUser()`, `logoutUser()`, `loadUser()`
  - Automatically loads user from localStorage token on mount
  - Token stored in localStorage, attached to requests via axios interceptor

**API Layer** (`client/src/services/api.js`):
- Centralized axios instance with base URL configuration
- Request interceptor automatically adds Bearer token from localStorage
- All API calls exported as named functions (e.g., `getQuestions()`, `createAnswer()`)

### Key Features & Logic

**Voting System:**
- Users can upvote (+1) or downvote (-1) questions and answers
- Clicking the same vote again cancels it
- Clicking the opposite vote switches the vote
- Cannot vote on own content
- Reputation changes: upvote +5, downvote -2, accepted answer +15
- Vote model has unique compound index on (user, targetType, targetId)

**Reputation System:**
- Question upvoted: author +5 rep
- Question downvoted: author -2 rep
- Answer upvoted: author +5 rep
- Answer downvoted: author -2 rep
- Answer accepted: author +15 rep

**Search & Filtering:**
- Full-text search uses MongoDB text indexes on Question title and body
- Filter by tags (exact match, case-insensitive)
- Sort options: newest (default), votes (highest first), unanswered (no accepted answer)
- Pagination with configurable page size

**Answer Acceptance:**
- Only question author can accept an answer
- Accepting sets `Answer.isAccepted = true` and `Question.acceptedAnswer = answerId`
- Accepted answers always appear first in answer lists
- Accepting an answer grants +15 reputation to the answer author

**Rich Text Editor:**
- Uses Tiptap with StarterKit extensions
- Supports: bold, italic, headings, lists, code blocks, images (via URL)
- Content stored as HTML in database
- Rendered with react-markdown on display

## Environment Variables

**Server** (`server/.env`):
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
```

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

## API Conventions

- Base URL: `http://localhost:5000/api`
- Authentication: `Authorization: Bearer <token>` header
- Protected routes return 401 if no token or invalid token
- Protected routes return 403 if user lacks permission (e.g., editing others' content)
- Validation errors return 400 with error details
- Server runs on port 5000, client on port 3000 (with proxy to /api)

## Database Seeding

The `server/seed.js` script creates sample data:
- 3 users (alice, bob, charlie)
- Multiple questions with various tags
- Answers with votes and accepted answers
- Vote records

Run with: `cd server && npm run seed`

## Design System

**Colors:**
- Primary: `#FF6B35` (Vibrant Orange)
- Secondary: `#004E89` (Deep Navy)
- Accent: `#F7B801` (Golden Yellow)
- Dark: `#1A1A2E` (Almost Black)

**Typography:**
- Display: Syne (Bold, 700-800)
- Body: Space Mono (Monospace)

**Animations:**
- Framer Motion used for page transitions and interactive elements
- Toast notifications via react-hot-toast

## Common Patterns

**Authorization Checks:**
- Backend: Compare `req.userId` with resource author ID
- Frontend: Compare `user._id` with resource author ID to show/hide edit/delete buttons

**Error Handling:**
- Backend: Try-catch blocks with 500 status on errors
- Frontend: Toast notifications for user feedback

**Data Fetching:**
- Frontend uses async/await with try-catch
- Loading states managed with local component state
- Errors displayed via toast notifications

**Routing:**
- Frontend uses React Router v7
- Protected routes check `user` from AuthContext
- Redirect to login if not authenticated

## Testing

Currently no automated tests are configured. The project includes:
- Manual testing via the UI
- Health check script for deployment verification
- API testing can be done via the provided curl examples in API.md

## Deployment

- Frontend: Vercel (build with `npm run build` from client/)
- Backend: Render or similar Node.js hosting
- Database: MongoDB Atlas (free M0 tier supported)

See DEPLOYMENT.md and DEPLOYMENT_FREE.md for detailed deployment instructions.
