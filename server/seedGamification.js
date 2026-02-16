const Achievement = require('./models/Achievement');
const DailyTask = require('./models/DailyTask');

async function seedGamificationData() {
  try {
    // Seed Achievements
    const achievementsCount = await Achievement.countDocuments();
    if (achievementsCount === 0) {
      const achievements = [
        // Questions Category
        {
          name: 'First Steps',
          description: 'Ask your first question',
          icon: '🎯',
          category: 'questions',
          tier: 'bronze',
          xpReward: 10,
          criteria: { type: 'count', target: 1, metric: 'questions_asked' }
        },
        {
          name: 'Curious Mind',
          description: 'Ask 10 questions',
          icon: '🤔',
          category: 'questions',
          tier: 'silver',
          xpReward: 50,
          criteria: { type: 'count', target: 10, metric: 'questions_asked' }
        },
        {
          name: 'Question Master',
          description: 'Ask 50 questions',
          icon: '🎓',
          category: 'questions',
          tier: 'gold',
          xpReward: 200,
          criteria: { type: 'count', target: 50, metric: 'questions_asked' }
        },
        {
          name: 'Inquisitor',
          description: 'Ask 100 questions',
          icon: '👑',
          category: 'questions',
          tier: 'platinum',
          xpReward: 500,
          criteria: { type: 'count', target: 100, metric: 'questions_asked' }
        },

        // Answers Category
        {
          name: 'Helpful',
          description: 'Provide your first answer',
          icon: '💡',
          category: 'answers',
          tier: 'bronze',
          xpReward: 10,
          criteria: { type: 'count', target: 1, metric: 'answers_given' }
        },
        {
          name: 'Problem Solver',
          description: 'Provide 25 answers',
          icon: '🔧',
          category: 'answers',
          tier: 'silver',
          xpReward: 100,
          criteria: { type: 'count', target: 25, metric: 'answers_given' }
        },
        {
          name: 'Expert',
          description: 'Provide 100 answers',
          icon: '⭐',
          category: 'answers',
          tier: 'gold',
          xpReward: 300,
          criteria: { type: 'count', target: 100, metric: 'answers_given' }
        },
        {
          name: 'Guru',
          description: 'Provide 500 answers',
          icon: '🏆',
          category: 'answers',
          tier: 'platinum',
          xpReward: 1000,
          criteria: { type: 'count', target: 500, metric: 'answers_given' }
        },
        {
          name: 'Accepted Answer',
          description: 'Get your first answer accepted',
          icon: '✅',
          category: 'answers',
          tier: 'bronze',
          xpReward: 20,
          criteria: { type: 'count', target: 1, metric: 'accepted_answers' }
        },
        {
          name: 'Solution Provider',
          description: 'Get 10 answers accepted',
          icon: '🎖️',
          category: 'answers',
          tier: 'silver',
          xpReward: 150,
          criteria: { type: 'count', target: 10, metric: 'accepted_answers' }
        },

        // Social Category
        {
          name: 'Friendly',
          description: 'Make your first friend',
          icon: '👋',
          category: 'social',
          tier: 'bronze',
          xpReward: 15,
          criteria: { type: 'count', target: 1, metric: 'friends_count' }
        },
        {
          name: 'Social Butterfly',
          description: 'Make 10 friends',
          icon: '🦋',
          category: 'social',
          tier: 'silver',
          xpReward: 75,
          criteria: { type: 'count', target: 10, metric: 'friends_count' }
        },
        {
          name: 'Popular',
          description: 'Make 50 friends',
          icon: '🌟',
          category: 'social',
          tier: 'gold',
          xpReward: 250,
          criteria: { type: 'count', target: 50, metric: 'friends_count' }
        },

        // Engagement Category
        {
          name: 'Voter',
          description: 'Cast your first vote',
          icon: '👍',
          category: 'engagement',
          tier: 'bronze',
          xpReward: 5,
          criteria: { type: 'count', target: 1, metric: 'votes_cast' }
        },
        {
          name: 'Active Voter',
          description: 'Cast 100 votes',
          icon: '🗳️',
          category: 'engagement',
          tier: 'silver',
          xpReward: 50,
          criteria: { type: 'count', target: 100, metric: 'votes_cast' }
        },
        {
          name: 'Commentator',
          description: 'Leave 50 comments',
          icon: '💬',
          category: 'engagement',
          tier: 'silver',
          xpReward: 60,
          criteria: { type: 'count', target: 50, metric: 'comments_made' }
        },
        {
          name: 'Bookworm',
          description: 'Bookmark 25 questions',
          icon: '📚',
          category: 'engagement',
          tier: 'bronze',
          xpReward: 30,
          criteria: { type: 'count', target: 25, metric: 'bookmarks_count' }
        },

        // Special Category
        {
          name: 'Early Adopter',
          description: 'Join during the first month',
          icon: '🚀',
          category: 'special',
          tier: 'gold',
          xpReward: 100,
          criteria: { type: 'special', metric: 'early_adopter' },
          isSecret: false
        },
        {
          name: 'Dedicated',
          description: 'Maintain a 7-day login streak',
          icon: '🔥',
          category: 'special',
          tier: 'silver',
          xpReward: 80,
          criteria: { type: 'streak', target: 7, metric: 'login_streak' }
        },
        {
          name: 'Unstoppable',
          description: 'Maintain a 30-day login streak',
          icon: '⚡',
          category: 'special',
          tier: 'gold',
          xpReward: 300,
          criteria: { type: 'streak', target: 30, metric: 'login_streak' }
        },
        {
          name: 'Legend',
          description: 'Maintain a 100-day login streak',
          icon: '💎',
          category: 'special',
          tier: 'diamond',
          xpReward: 1000,
          criteria: { type: 'streak', target: 100, metric: 'login_streak' }
        },
        {
          name: 'Influencer',
          description: 'Reach 1000 reputation',
          icon: '🌠',
          category: 'special',
          tier: 'gold',
          xpReward: 200,
          criteria: { type: 'threshold', target: 1000, metric: 'reputation' }
        },
        {
          name: 'Celebrity',
          description: 'Reach 5000 reputation',
          icon: '🎭',
          category: 'special',
          tier: 'platinum',
          xpReward: 500,
          criteria: { type: 'threshold', target: 5000, metric: 'reputation' }
        }
      ];

      await Achievement.insertMany(achievements);
      console.log('✅ Achievements seeded successfully');
    }

    // Seed Daily Tasks
    const tasksCount = await DailyTask.countDocuments();
    if (tasksCount === 0) {
      const dailyTasks = [
        {
          name: 'Daily Login',
          description: 'Log in to Cohere',
          icon: '🌅',
          xpReward: 10,
          taskType: 'login',
          target: 1
        },
        {
          name: 'Ask a Question',
          description: 'Ask at least one question today',
          icon: '❓',
          xpReward: 25,
          taskType: 'ask_question',
          target: 1
        },
        {
          name: 'Provide an Answer',
          description: 'Answer at least one question today',
          icon: '💡',
          xpReward: 30,
          taskType: 'answer_question',
          target: 1
        },
        {
          name: 'Cast 5 Votes',
          description: 'Vote on 5 questions or answers',
          icon: '👍',
          xpReward: 15,
          taskType: 'vote',
          target: 5
        },
        {
          name: 'Leave 3 Comments',
          description: 'Comment on 3 posts',
          icon: '💬',
          xpReward: 20,
          taskType: 'comment',
          target: 3
        },
        {
          name: 'Browse Questions',
          description: 'View at least 10 questions',
          icon: '👀',
          xpReward: 5,
          taskType: 'view_questions',
          target: 10
        }
      ];

      await DailyTask.insertMany(dailyTasks);
      console.log('✅ Daily tasks seeded successfully');
    }

    console.log('✅ Gamification data seeding complete');
  } catch (error) {
    console.error('❌ Error seeding gamification data:', error);
  }
}

module.exports = seedGamificationData;
