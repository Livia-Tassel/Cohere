import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');

// Questions
export const getQuestions = (params) => api.get('/questions', { params });
export const getQuestion = (id) => api.get(`/questions/${id}`);
export const createQuestion = (data) => api.post('/questions', data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);
export const acceptAnswer = (questionId, answerId) =>
  api.post(`/questions/${questionId}/accept/${answerId}`);
export const getTrendingQuestions = (params) => api.get('/questions/trending', { params });
export const getRelatedQuestions = (id) => api.get(`/questions/${id}/related`);

// Answers
export const getAnswers = (questionId) => api.get(`/answers/question/${questionId}`);
export const createAnswer = (data) => api.post('/answers', data);
export const updateAnswer = (id, data) => api.put(`/answers/${id}`, data);
export const deleteAnswer = (id) => api.delete(`/answers/${id}`);

// Votes
export const vote = (data) => api.post('/vote', data);
export const checkVotes = (targets) => api.post('/vote/check', { targets });

// Users
export const getUser = (id) => api.get(`/users/${id}`);
export const getUserQuestions = (id, params) => api.get(`/users/${id}/questions`, { params });
export const getUserAnswers = (id, params) => api.get(`/users/${id}/answers`, { params });
export const getLeaderboard = (params) => api.get('/users/leaderboard', { params });

// Tags
export const getTags = () => api.get('/tags');
export const getTagQuestions = (name, params) => api.get(`/tags/${name}`, { params });

// Bookmarks
export const createBookmark = (questionId) => api.post('/bookmarks', { questionId });
export const getBookmarks = (params) => api.get('/bookmarks', { params });
export const deleteBookmark = (questionId) => api.delete(`/bookmarks/${questionId}`);
export const checkBookmarks = (questionIds) => api.post('/bookmarks/check', { questionIds });

// Comments
export const createComment = (data) => api.post('/comments', data);
export const getComments = (targetType, targetId, params) => api.get(`/comments/${targetType}/${targetId}`, { params });
export const updateComment = (id, data) => api.put(`/comments/${id}`, data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
export const voteComment = (id) => api.post(`/comments/${id}/vote`);

// Badges
export const getBadges = () => api.get('/badges');
export const getUserBadges = (userId) => api.get(`/badges/user/${userId}`);
export const getBadgeStats = (userId) => api.get(`/badges/stats/${userId}`);

// Notifications
export const getNotifications = (params) => api.get('/notifications', { params });
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const deleteReadNotifications = () => api.delete('/notifications');

// Friends
export const sendFriendRequest = (recipientId) => api.post('/friends', { recipientId });
export const getFriends = (params) => api.get('/friends/friends', { params });
export const getReceivedFriendRequests = () => api.get('/friends/requests/received');
export const getSentFriendRequests = () => api.get('/friends/requests/sent');
export const acceptFriendRequest = (friendshipId) => api.put(`/friends/${friendshipId}/accept`);
export const rejectFriendRequest = (friendshipId) => api.put(`/friends/${friendshipId}/reject`);
export const removeFriend = (friendshipId) => api.delete(`/friends/${friendshipId}`);
export const getFriendshipStatus = (userId) => api.get(`/friends/status/${userId}`);
export const getFriendCount = () => api.get('/friends/count');

// Messages
export const sendMessage = (data) => api.post('/messages', data);
export const getConversation = (friendId, params) => api.get(`/messages/conversation/${friendId}`, { params });
export const getConversations = () => api.get('/messages/conversations');
export const getUnreadMessageCount = () => api.get('/messages/unread-count');
export const markConversationRead = (friendId) => api.put(`/messages/conversation/${friendId}/read`);
export const deleteMessage = (messageId) => api.delete(`/messages/${messageId}`);
export const deleteConversation = (friendId) => api.delete(`/messages/conversation/${friendId}`);

export default api;
