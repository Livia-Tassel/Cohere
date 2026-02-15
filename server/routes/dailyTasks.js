const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DailyTask = require('../models/DailyTask');
const UserTaskProgress = require('../models/UserTaskProgress');
const User = require('../models/User');

// Get all daily tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await DailyTask.find({ isActive: true });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's daily task progress
router.get('/progress', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await DailyTask.find({ isActive: true });
    const userProgress = await UserTaskProgress.find({
      user: req.userId,
      date: { $gte: today }
    }).populate('task');

    const progressMap = {};
    userProgress.forEach(up => {
      progressMap[up.task._id.toString()] = up;
    });

    const tasksWithProgress = tasks.map(task => {
      const progress = progressMap[task._id.toString()];
      return {
        task,
        progress: progress ? progress.progress : 0,
        completed: progress ? progress.completed : false,
        completedAt: progress ? progress.completedAt : null
      };
    });

    res.json(tasksWithProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task progress (internal use)
async function updateTaskProgress(userId, taskType, increment = 1) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const task = await DailyTask.findOne({ taskType, isActive: true });
    if (!task) return null;

    let progress = await UserTaskProgress.findOne({
      user: userId,
      task: task._id,
      date: { $gte: today }
    });

    if (!progress) {
      progress = await UserTaskProgress.create({
        user: userId,
        task: task._id,
        progress: increment,
        date: today
      });
    } else {
      progress.progress += increment;
    }

    if (progress.progress >= task.target && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();

      // Award XP
      await User.findByIdAndUpdate(userId, {
        $inc: { xp: task.xpReward }
      });

      await progress.save();
      return task;
    }

    await progress.save();
    return null;
  } catch (error) {
    console.error('Error updating task progress:', error);
    return null;
  }
}

// Complete a task manually (for testing)
router.post('/:taskId/complete', auth, async (req, res) => {
  try {
    const task = await DailyTask.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await UserTaskProgress.findOne({
      user: req.userId,
      task: task._id,
      date: { $gte: today }
    });

    if (!progress) {
      progress = await UserTaskProgress.create({
        user: req.userId,
        task: task._id,
        progress: task.target,
        completed: true,
        completedAt: new Date(),
        date: today
      });
    } else if (!progress.completed) {
      progress.progress = task.target;
      progress.completed = true;
      progress.completedAt = new Date();
      await progress.save();
    } else {
      return res.status(400).json({ message: 'Task already completed today' });
    }

    // Award XP
    await User.findByIdAndUpdate(req.userId, {
      $inc: { xp: task.xpReward }
    });

    res.json({ message: 'Task completed', progress, xpAwarded: task.xpReward });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
module.exports.updateTaskProgress = updateTaskProgress;
