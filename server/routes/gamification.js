const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Update user streak
async function updateStreak(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin = user.streak.lastLoginDate ? new Date(user.streak.lastLoginDate) : null;

    if (lastLogin) {
      lastLogin.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, no change
        return;
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        user.streak.currentStreak += 1;
        if (user.streak.currentStreak > user.streak.longestStreak) {
          user.streak.longestStreak = user.streak.currentStreak;
        }
      } else {
        // Streak broken, reset to 1
        user.streak.currentStreak = 1;
      }
    } else {
      // First login
      user.streak.currentStreak = 1;
      user.streak.longestStreak = 1;
    }

    user.streak.lastLoginDate = today;
    await user.save();

    return user.streak;
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

// Get user streak
router.get('/streak', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.streak);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Calculate level from XP
function calculateLevel(xp) {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  // XP needed for level N: (N-1)^2 * 100
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Get XP needed for next level
function getXPForNextLevel(currentLevel) {
  return currentLevel * currentLevel * 100;
}

// Get user gamification stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const level = calculateLevel(user.xp);
    const xpForCurrentLevel = (level - 1) * (level - 1) * 100;
    const xpForNextLevel = level * level * 100;
    const xpProgress = user.xp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;

    res.json({
      xp: user.xp,
      level,
      xpProgress,
      xpNeeded,
      xpForNextLevel,
      streak: user.streak,
      reputation: user.reputation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Award XP (internal use)
async function awardXP(userId, amount, reason) {
  try {
    const user = await User.findById(userId);
    const oldLevel = calculateLevel(user.xp);

    user.xp += amount;
    const newLevel = calculateLevel(user.xp);

    await user.save();

    const leveledUp = newLevel > oldLevel;

    return {
      xpAwarded: amount,
      totalXP: user.xp,
      oldLevel,
      newLevel,
      leveledUp,
      reason
    };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return null;
  }
}

module.exports = router;
module.exports.updateStreak = updateStreak;
module.exports.awardXP = awardXP;
module.exports.calculateLevel = calculateLevel;
