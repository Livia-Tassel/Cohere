const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Predefined badges
const BADGES = [
  {
    name: 'First Question',
    description: 'Asked your first question',
    icon: '❓',
    tier: 'bronze',
    criteria: 'first_question'
  },
  {
    name: 'First Answer',
    description: 'Posted your first answer',
    icon: '💡',
    tier: 'bronze',
    criteria: 'first_answer'
  },
  {
    name: 'Popular Question',
    description: 'Question received 10+ votes',
    icon: '🔥',
    tier: 'silver',
    criteria: 'popular_question'
  },
  {
    name: 'Popular Answer',
    description: 'Answer received 10+ votes',
    icon: '⭐',
    tier: 'silver',
    criteria: 'popular_answer'
  },
  {
    name: 'Helpful',
    description: 'Had 5+ answers accepted',
    icon: '🎯',
    tier: 'gold',
    criteria: 'helpful'
  },
  {
    name: 'Scholar',
    description: 'Asked 10+ questions',
    icon: '📚',
    tier: 'silver',
    criteria: 'scholar'
  },
  {
    name: 'Contributor',
    description: 'Posted 25+ answers',
    icon: '🏅',
    tier: 'gold',
    criteria: 'contributor'
  },
  {
    name: 'Reputation 100',
    description: 'Earned 100+ reputation',
    icon: '💯',
    tier: 'bronze',
    criteria: 'reputation_100'
  },
  {
    name: 'Reputation 500',
    description: 'Earned 500+ reputation',
    icon: '🌟',
    tier: 'silver',
    criteria: 'reputation_500'
  },
  {
    name: 'Reputation 1000',
    description: 'Earned 1000+ reputation',
    icon: '👑',
    tier: 'gold',
    criteria: 'reputation_1000'
  }
];

// Initialize badges in database
const initializeBadges = async () => {
  try {
    for (const badgeData of BADGES) {
      await Badge.findOneAndUpdate(
        { criteria: badgeData.criteria },
        badgeData,
        { upsert: true, new: true }
      );
    }
    console.log('Badges initialized successfully');
  } catch (error) {
    console.error('Error initializing badges:', error);
  }
};

// Check and award badges to a user
const checkAndAwardBadges = async (userId) => {
  try {
    const badges = await Badge.find();
    const user = await require('../models/User').findById(userId);

    if (!user) return;

    for (const badge of badges) {
      // Check if user already has this badge
      const existingBadge = await UserBadge.findOne({ user: userId, badge: badge._id });
      if (existingBadge) continue;

      let shouldAward = false;

      switch (badge.criteria) {
        case 'first_question':
          const questionCount = await Question.countDocuments({ author: userId });
          shouldAward = questionCount >= 1;
          break;

        case 'first_answer':
          const answerCount = await Answer.countDocuments({ author: userId });
          shouldAward = answerCount >= 1;
          break;

        case 'popular_question':
          const popularQuestion = await Question.findOne({ author: userId, votes: { $gte: 10 } });
          shouldAward = !!popularQuestion;
          break;

        case 'popular_answer':
          const popularAnswer = await Answer.findOne({ author: userId, votes: { $gte: 10 } });
          shouldAward = !!popularAnswer;
          break;

        case 'helpful':
          const acceptedAnswers = await Answer.countDocuments({ author: userId, isAccepted: true });
          shouldAward = acceptedAnswers >= 5;
          break;

        case 'scholar':
          const totalQuestions = await Question.countDocuments({ author: userId });
          shouldAward = totalQuestions >= 10;
          break;

        case 'contributor':
          const totalAnswers = await Answer.countDocuments({ author: userId });
          shouldAward = totalAnswers >= 25;
          break;

        case 'reputation_100':
          shouldAward = user.reputation >= 100;
          break;

        case 'reputation_500':
          shouldAward = user.reputation >= 500;
          break;

        case 'reputation_1000':
          shouldAward = user.reputation >= 1000;
          break;
      }

      if (shouldAward) {
        await UserBadge.create({ user: userId, badge: badge._id });
        console.log(`Awarded badge "${badge.name}" to user ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
};

module.exports = {
  initializeBadges,
  checkAndAwardBadges
};
