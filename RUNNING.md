# Cohere - Quick Reference

## 🚀 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## 🔐 Test Accounts

```
Email: alice@example.com
Password: password123

Email: bob@example.com
Password: password123

Email: charlie@example.com
Password: password123
```

## 📊 Current Status

✅ Backend: Running on port 5001
✅ Frontend: Running on port 3000
✅ MongoDB: Connected to Atlas
✅ Database: Seeded with 3 users, 5 questions, 2 answers

## 🛠️ Server Commands

### Check if servers are running
```bash
ps aux | grep -E "(nodemon|vite)" | grep -v grep
```

### Stop servers
```bash
pkill -f "nodemon server.js"
pkill -f "vite"
```

### Start servers
```bash
# Backend (from project root)
cd server && npm run dev

# Frontend (in another terminal)
cd client && npm run dev
```

### View logs
```bash
# Backend logs
tail -f /private/tmp/claude-501/-Users-tassel-Documents-Project-idea/tasks/b5c7f43.output

# Frontend logs
tail -f /private/tmp/claude-501/-Users-tassel-Documents-Project-idea/tasks/b19b0fe.output
```

## 🎯 Key Features to Try

1. **Browse Questions** - Home page shows all questions
2. **Login** - Use test accounts above
3. **Ask Question** - Rich text editor with Markdown support
4. **Answer Questions** - Provide helpful answers
5. **Vote** - Upvote/downvote (affects reputation)
6. **Accept Answer** - Mark best answer on your questions
7. **Filter by Tags** - 19 tags available (JavaScript, Python, React, etc.)
8. **Search** - Full-text search across questions
9. **User Profiles** - View reputation and activity

## 🔧 Configuration Files

- Backend env: `server/.env`
- Frontend env: `client/.env`
- MongoDB URI: Already configured
- JWT Secret: Already configured

## 📝 Important Notes

- **Port 5001**: Backend runs on 5001 (not 5000) due to macOS ControlCenter conflict
- **MongoDB Atlas**: IP 0.0.0.0/0 is whitelisted for access
- **Tailwind CSS v4**: Using @tailwindcss/postcss plugin
- **Auto-reload**: Both servers watch for file changes

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill process if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

### MongoDB connection error
- Verify IP is whitelisted in MongoDB Atlas
- Check MONGODB_URI in server/.env
- Ensure internet connection is active

### Tailwind CSS not working
- Ensure @tailwindcss/postcss is installed
- Check postcss.config.js uses '@tailwindcss/postcss'
- Restart frontend server

## 📚 Documentation

- Full API docs: `API.md`
- Deployment guide: `DEPLOYMENT.md`
- Project summary: `PROJECT_SUMMARY.md`
- Quick start: `QUICKSTART.md`

---

**Last Updated**: 2026-02-14
**Status**: ✅ Fully Operational
