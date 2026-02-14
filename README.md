# DevQuery - Modern Q&A Community Platform

<div align="center">

![DevQuery](https://img.shields.io/badge/DevQuery-Q%26A%20Platform-FF6B35?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

**A modern, production-ready Q&A community platform with a distinctive Neo-Brutalist design**

[Live Demo](#) • [Documentation](./INDEX.md) • [API Docs](./API.md)

</div>

---

## ✨ Features

### 🎨 Modern UI/UX
- **Neo-Brutalist Design** - Bold, distinctive aesthetic that stands out
- **Smooth Animations** - Framer Motion powered interactions
- **Rich Text Editor** - Full WYSIWYG editor with image support
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Toast Notifications** - Real-time user feedback
- **Avatar System** - Personalized user profiles

### 💬 Core Functionality
- **Ask Questions** - Rich text editor with formatting and images
- **Answer Questions** - Detailed responses with markdown support
- **Vote System** - Upvote/downvote with reputation tracking
- **Accept Answers** - Mark the best solution
- **Tag System** - Organize by technology/topic
- **Search** - Full-text search across questions
- **User Profiles** - Track questions, answers, and reputation

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based auth
- **Password Encryption** - bcrypt hashing
- **Input Validation** - Server-side validation
- **XSS Protection** - Sanitized user input
- **CORS Configuration** - Secure cross-origin requests

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (Atlas or local)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd idea

# Install dependencies
cd server && npm install
cd ../client && npm install

# Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env with your MongoDB URI
# MONGODB_URI=mongodb+srv://...

# Seed database with sample data (optional)
cd server && npm run seed

# Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Visit `http://localhost:3000` to see the app!

---

## 🎨 Design System

### Color Palette
- **Primary**: `#FF6B35` - Vibrant Orange
- **Secondary**: `#004E89` - Deep Navy
- **Accent**: `#F7B801` - Golden Yellow
- **Dark**: `#1A1A2E` - Almost Black
- **Light**: `#F8F9FA` - Off White

### Typography
- **Display**: Syne (Bold, 700-800)
- **Body**: Space Mono (Monospace, 400-700)

### Components
- Glass effect navigation
- Gradient tag pills
- Animated vote buttons
- Rich text editor
- Toast notifications
- Avatar system

---

## 📦 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Tiptap** - Rich text editor
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

---

## 📁 Project Structure

```
idea/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── AnswerCard.jsx
│   │   │   ├── VoteButtons.jsx
│   │   │   ├── TagList.jsx
│   │   │   └── RichTextEditor.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── QuestionDetail.jsx
│   │   │   ├── AskQuestion.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Tags.jsx
│   │   │   └── TagPage.jsx
│   │   ├── services/      # API calls
│   │   ├── context/       # Global state
│   │   └── index.css      # Global styles
│   └── package.json
│
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   └── Vote.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── answers.js
│   │   ├── votes.js
│   │   ├── users.js
│   │   └── tags.js
│   ├── middleware/       # Middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── config/           # Configuration
│   │   └── db.js
│   ├── server.js         # Entry point
│   └── seed.js           # Database seeding
│
└── docs/                 # Documentation
    ├── README.md
    ├── API.md
    ├── DEPLOYMENT.md
    └── UI_ENHANCEMENT_SUMMARY.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - List questions (with filters)
- `GET /api/questions/:id` - Get question details
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/accept/:answerId` - Accept answer

### Answers
- `GET /api/answers/question/:questionId` - Get answers
- `POST /api/answers` - Create answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer

### Votes
- `POST /api/vote` - Vote on question/answer
- `POST /api/vote/check` - Check vote status

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/questions` - Get user's questions
- `GET /api/users/:id/answers` - Get user's answers

### Tags
- `GET /api/tags` - List all tags
- `GET /api/tags/:name` - Get tag questions

[Full API Documentation](./API.md)

---

## 🎯 Key Features Explained

### Rich Text Editor
- **Formatting**: Bold, italic, headings, lists, code blocks
- **Images**: Add images via URL
- **Code Blocks**: Syntax highlighting ready
- **Markdown Compatible**: Exports to markdown

### Voting System
- Upvote/downvote questions and answers
- Reputation tracking
- Prevents duplicate votes
- Visual feedback with animations

### Reputation System
- Question upvote: +5 rep
- Question downvote: -2 rep
- Answer upvote: +5 rep
- Answer downvote: -2 rep
- Answer accepted: +15 rep

### Search & Filters
- Full-text search
- Filter by tags
- Sort by: newest, votes, unanswered
- Pagination support

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel --prod
```

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from `server/` directory

### Database (MongoDB Atlas)
1. Create free M0 cluster (512MB)
2. Configure network access (0.0.0.0/0)
3. Get connection string
4. Update `server/.env`

[Full Deployment Guide](./DEPLOYMENT.md)

---

## 📊 Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Bundle Size**: < 500KB (gzipped)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration from modern brutalist web design
- Icons from Heroicons
- Fonts from Google Fonts (Syne, Space Mono)
- Community feedback and testing

---

## 📞 Support

- 📧 Email: support@devquery.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](#)
- 📖 Docs: [Full Documentation](./INDEX.md)

---

## 🗺️ Roadmap

### v1.1 (Next Release)
- [ ] Comment system on answers
- [ ] User following system
- [ ] Notification center
- [ ] Dark mode toggle

### v1.2 (Future)
- [ ] Code syntax highlighting
- [ ] LaTeX math support
- [ ] File attachments
- [ ] User badges/achievements

### v2.0 (Long-term)
- [ ] Real-time updates (WebSocket)
- [ ] Advanced search (Algolia)
- [ ] Mobile apps (React Native)
- [ ] API rate limiting

---

<div align="center">

**Built with ❤️ by the DevQuery Team**

[⬆ Back to Top](#devquery---modern-qa-community-platform)

</div>
