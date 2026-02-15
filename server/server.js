require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializeBadges } = require('./services/badgeService');
const seedGamification = require('./seedGamification');

const app = express();

// Connect to MongoDB
connectDB();

// Initialize badges and gamification data
initializeBadges();
seedGamification();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answers', require('./routes/answers'));
app.use('/api/vote', require('./routes/votes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/daily-tasks', require('./routes/dailyTasks'));
app.use('/api/achievements', require('./routes/achievements'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
