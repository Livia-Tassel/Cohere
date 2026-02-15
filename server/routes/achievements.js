const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ tier: 1, category: 1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's achievements
router.get('/user/:userId', async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({
      user: req.params.userId,
      completed: true
    })
      .populate('achievement')
      .sort({ completedAt: -1 });

    res.json(userAchievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's achievement progress
router.get('/progress', auth, async (req, res) => {
  try {
    const allAchievements = await Achievement.find();
    const userAchievements = await UserAchievement.find({ user: req.userId });

    const achievementMap = {};
    userAchievements.forEach(ua => {
      achievementMap[ua.achievement.toString()] = ua;
    });

    const progress = allAchievements.map(achievement => {
      const userProgress = achievementMap[achievement._id.toString()];
      return {
        achievement,
        progress: userProgress ? userProgress.progress : 0,
        completed: userProgress ? userProgress.completed : false,
        completedAt: userProgress ? userProgress.completedAt : null
      };
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check and award achievements (internal use)
async function checkAndAwardAchievement(userId, metric, value) {
  try {
    const achievements = await Achievement.find({
      'criteria.metric': metric,
      'criteria.type': { $in: ['count', 'threshold'] }
    });

    for (const achievement of achievements) {
      const userAchievement = await UserAchievement.findOne({
        user: userId,
        achievement: achievement._id
      });

      if (!userAchievement) {
        // Create new progress entry
        await UserAchievement.create({
          user: userId,
          achievement: achievement._id,
          progress: value,
          completed: value >= achievement.criteria.target,
          completedAt: value >= achievement.criteria.target ? new Date() : null
        });

        if (value >= achievement.criteria.target) {
          // Award XP
          await User.findByIdAndUpdate(userId, {
            $inc: { xp: achievement.xpReward }
          });

          return achievement;
        }
      } else if (!userAchievement.completed) {
        // Update progress
        userAchievement.progress = value;
        if (value >= achievement.criteria.target) {
          userAchievement.completed = true;
          userAchievement.completedAt = new Date();
          await userAchievement.save();

          // Award XP
          await User.findByIdAndUpdate(userId, {
            $inc: { xp: achievement.xpReward }
          });

          return achievement;
        }
        await userAchievement.save();
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return null;
  }
}

module.exports = router;
module.exports.checkAndAwardAchievement = checkAndAwardAchievement;
