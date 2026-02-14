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

export default api;
