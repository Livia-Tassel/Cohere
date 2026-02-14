const Notification = require('../models/Notification');

// Create notification for new answer
const createAnswerNotification = async (question, answer) => {
  try {
    // Don't notify if answering own question
    if (question.author.toString() === answer.author.toString()) {
      return;
    }

    await Notification.create({
      recipient: question.author,
      type: 'answer',
      actor: answer.author,
      targetType: 'Question',
      targetId: question._id,
      message: `answered your question: "${question.title}"`
    });
  } catch (error) {
    console.error('Error creating answer notification:', error);
  }
};

// Create notification for new comment
const createCommentNotification = async (target, comment, targetType) => {
  try {
    // Don't notify if commenting on own content
    if (target.author.toString() === comment.author.toString()) {
      return;
    }

    const targetName = targetType === 'Question' ? 'question' : 'answer';
    const targetTitle = target.title || 'your content';

    await Notification.create({
      recipient: target.author,
      type: 'comment',
      actor: comment.author,
      targetType,
      targetId: target._id,
      message: `commented on your ${targetName}`
    });
  } catch (error) {
    console.error('Error creating comment notification:', error);
  }
};

// Create notification for vote
const createVoteNotification = async (target, voter, voteType, targetType) => {
  try {
    // Don't notify if voting on own content
    if (target.author.toString() === voter.toString()) {
      return;
    }

    // Only notify for upvotes
    if (voteType !== 1) {
      return;
    }

    const targetName = targetType === 'question' ? 'question' : 'answer';

    await Notification.create({
      recipient: target.author,
      type: 'vote',
      actor: voter,
      targetType: targetType === 'question' ? 'Question' : 'Answer',
      targetId: target._id,
      message: `upvoted your ${targetName}`
    });
  } catch (error) {
    console.error('Error creating vote notification:', error);
  }
};

// Create notification for badge earned
const createBadgeNotification = async (userId, badge) => {
  try {
    await Notification.create({
      recipient: userId,
      type: 'badge',
      targetType: 'Badge',
      targetId: badge._id,
      message: `You earned the "${badge.name}" badge! ${badge.icon}`
    });
  } catch (error) {
    console.error('Error creating badge notification:', error);
  }
};

// Create notification for accepted answer
const createAcceptedAnswerNotification = async (answer, question) => {
  try {
    // Don't notify if accepting own answer
    if (answer.author.toString() === question.author.toString()) {
      return;
    }

    await Notification.create({
      recipient: answer.author,
      type: 'accepted_answer',
      actor: question.author,
      targetType: 'Answer',
      targetId: answer._id,
      message: `accepted your answer to: "${question.title}"`
    });
  } catch (error) {
    console.error('Error creating accepted answer notification:', error);
  }
};

module.exports = {
  createAnswerNotification,
  createCommentNotification,
  createVoteNotification,
  createBadgeNotification,
  createAcceptedAnswerNotification
};
