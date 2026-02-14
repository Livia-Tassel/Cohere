# API 文档

## 基础信息

- **Base URL**: `http://localhost:5000/api`
- **认证方式**: JWT Bearer Token
- **Content-Type**: `application/json`

## 认证

### 注册

```http
POST /api/auth/register
```

**请求体**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**响应** (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "reputation": 0
  }
}
```

**错误响应** (400):
```json
{
  "message": "User already exists"
}
```

---

### 登录

```http
POST /api/auth/login
```

**请求体**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**响应** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "reputation": 150
  }
}
```

---

### 获取当前用户

```http
GET /api/auth/me
Authorization: Bearer {token}
```

**响应** (200):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "testuser",
  "email": "test@example.com",
  "reputation": 150,
  "avatar": ""
}
```

---

## 问题

### 获取问题列表

```http
GET /api/questions?sort=newest&tag=react&search=hooks&page=1&limit=20
```

**查询参数**:
- `sort` (可选): `newest` | `votes` | `unanswered` (默认: `newest`)
- `tag` (可选): 标签名称
- `search` (可选): 搜索关键词
- `page` (可选): 页码 (默认: 1)
- `limit` (可选): 每页数量 (默认: 20)

**响应** (200):
```json
{
  "questions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "如何学习 React Hooks？",
      "body": "我是 React 新手...",
      "author": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "alice",
        "reputation": 150
      },
      "tags": ["react", "javascript"],
      "views": 245,
      "votes": 15,
      "answerCount": 3,
      "acceptedAnswer": null,
      "createdAt": "2024-02-13T10:30:00.000Z",
      "updatedAt": "2024-02-13T10:30:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 95
}
```

---

### 获取问题详情

```http
GET /api/questions/:id
```

**响应** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "如何学习 React Hooks？",
  "body": "我是 React 新手，想了解 Hooks 的最佳实践...",
  "author": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "alice",
    "reputation": 150,
    "avatar": ""
  },
  "tags": ["react", "javascript"],
  "views": 246,
  "votes": 15,
  "answerCount": 3,
  "acceptedAnswer": "507f1f77bcf86cd799439013",
  "createdAt": "2024-02-13T10:30:00.000Z",
  "updatedAt": "2024-02-13T10:30:00.000Z"
}
```

---

### 创建问题

```http
POST /api/questions
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "title": "如何优化 MongoDB 查询？",
  "body": "我的查询很慢，有什么优化建议吗？",
  "tags": ["mongodb", "performance"]
}
```

**验证规则**:
- `title`: 10-200 字符
- `body`: 至少 20 字符
- `tags`: 1-5 个标签

**响应** (201):
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "title": "如何优化 MongoDB 查询？",
  "body": "我的查询很慢，有什么优化建议吗？",
  "author": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "alice",
    "reputation": 150
  },
  "tags": ["mongodb", "performance"],
  "views": 0,
  "votes": 0,
  "answerCount": 0,
  "acceptedAnswer": null,
  "createdAt": "2024-02-13T11:00:00.000Z",
  "updatedAt": "2024-02-13T11:00:00.000Z"
}
```

---

### 更新问题

```http
PUT /api/questions/:id
Authorization: Bearer {token}
```

**请求体** (所有字段可选):
```json
{
  "title": "如何优化 MongoDB 查询性能？",
  "body": "更新后的内容...",
  "tags": ["mongodb", "performance", "indexing"]
}
```

**权限**: 仅问题作者可以更新

**响应** (200): 返回更新后的问题对象

---

### 删除问题

```http
DELETE /api/questions/:id
Authorization: Bearer {token}
```

**权限**: 仅问题作者可以删除

**响应** (200):
```json
{
  "message": "Question deleted"
}
```

**注意**: 删除问题会级联删除所有相关回答

---

### 采纳答案

```http
POST /api/questions/:id/accept/:answerId
Authorization: Bearer {token}
```

**权限**: 仅问题作者可以采纳答案

**响应** (200):
```json
{
  "message": "Answer accepted"
}
```

**效果**:
- 答案的 `isAccepted` 设为 `true`
- 问题的 `acceptedAnswer` 指向该答案
- 回答者声望 +15

---

## 回答

### 获取问题的回答

```http
GET /api/answers/question/:questionId
```

**响应** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "body": "你可以从官方文档开始学习...",
    "author": {
      "_id": "507f1f77bcf86cd799439015",
      "username": "bob",
      "reputation": 85,
      "avatar": ""
    },
    "question": "507f1f77bcf86cd799439011",
    "votes": 12,
    "isAccepted": true,
    "createdAt": "2024-02-13T10:45:00.000Z",
    "updatedAt": "2024-02-13T10:45:00.000Z"
  }
]
```

**排序**: 已采纳答案 > 投票数 > 创建时间

---

### 创建回答

```http
POST /api/answers
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "body": "这是我的回答内容...",
  "questionId": "507f1f77bcf86cd799439011"
}
```

**验证规则**:
- `body`: 至少 10 字符
- `questionId`: 必须是有效的问题 ID

**响应** (201):
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "body": "这是我的回答内容...",
  "author": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "alice",
    "reputation": 150,
    "avatar": ""
  },
  "question": "507f1f77bcf86cd799439011",
  "votes": 0,
  "isAccepted": false,
  "createdAt": "2024-02-13T11:15:00.000Z",
  "updatedAt": "2024-02-13T11:15:00.000Z"
}
```

---

### 更新回答

```http
PUT /api/answers/:id
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "body": "更新后的回答内容..."
}
```

**权限**: 仅回答作者可以更新

**响应** (200): 返回更新后的回答对象

---

### 删除回答

```http
DELETE /api/answers/:id
Authorization: Bearer {token}
```

**权限**: 仅回答作者可以删除

**响应** (200):
```json
{
  "message": "Answer deleted"
}
```

---

## 投票

### 投票

```http
POST /api/vote
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "targetType": "question",
  "targetId": "507f1f77bcf86cd799439011",
  "value": 1
}
```

**参数**:
- `targetType`: `question` | `answer`
- `targetId`: 目标 ID
- `value`: `1` (点赞) | `-1` (点踩)

**投票逻辑**:
- 首次投票: 创建投票记录
- 相同投票: 取消投票
- 不同投票: 切换投票方向

**响应** (200):
```json
{
  "message": "Vote recorded",
  "voteChange": 1
}
```

**声望变化**:
- 点赞: 作者 +5
- 点踩: 作者 -2

**限制**:
- 不能给自己的内容投票
- 每个用户对同一内容只能有一个投票状态

---

### 检查投票状态

```http
POST /api/vote/check
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "targets": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439013"
  ]
}
```

**响应** (200):
```json
{
  "507f1f77bcf86cd799439011": 1,
  "507f1f77bcf86cd799439013": -1
}
```

---

## 用户

### 获取用户信息

```http
GET /api/users/:id
```

**响应** (200):
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "username": "alice",
  "reputation": 150,
  "avatar": "",
  "createdAt": "2024-01-15T08:00:00.000Z"
}
```

**注意**: 不返回邮箱和密码

---

### 获取用户的问题

```http
GET /api/users/:id/questions?page=1&limit=10
```

**响应** (200):
```json
{
  "questions": [...],
  "totalPages": 3,
  "currentPage": 1,
  "total": 25
}
```

---

### 获取用户的回答

```http
GET /api/users/:id/answers?page=1&limit=10
```

**响应** (200):
```json
{
  "answers": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "body": "回答内容...",
      "author": {...},
      "question": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "问题标题"
      },
      "votes": 12,
      "isAccepted": true,
      "createdAt": "2024-02-13T10:45:00.000Z"
    }
  ],
  "totalPages": 2,
  "currentPage": 1,
  "total": 18
}
```

---

## 标签

### 获取所有标签

```http
GET /api/tags
```

**响应** (200):
```json
[
  {
    "name": "javascript",
    "count": 245
  },
  {
    "name": "react",
    "count": 189
  },
  {
    "name": "nodejs",
    "count": 156
  }
]
```

**排序**: 按问题数量降序
**限制**: 返回前 50 个标签

---

### 获取标签的问题

```http
GET /api/tags/:name?page=1&limit=20
```

**响应** (200):
```json
{
  "questions": [...],
  "totalPages": 8,
  "currentPage": 1,
  "total": 156,
  "tag": "react"
}
```

---

## 错误响应

### 400 Bad Request

```json
{
  "message": "Invalid input",
  "errors": [
    {
      "field": "title",
      "message": "Title must be 10-200 characters"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "message": "No authentication token, access denied"
}
```

### 403 Forbidden

```json
{
  "message": "Not authorized"
}
```

### 404 Not Found

```json
{
  "message": "Question not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

---

## 使用示例

### JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加认证 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 注册
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// 获取问题列表
const getQuestions = async (params) => {
  const response = await api.get('/questions', { params });
  return response.data;
};

// 创建问题
const createQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

// 投票
const vote = async (voteData) => {
  const response = await api.post('/vote', voteData);
  return response.data;
};
```

### cURL

```bash
# 注册
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# 登录
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 获取问题列表
curl http://localhost:5000/api/questions?sort=newest&page=1

# 创建问题（需要 token）
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"问题标题","body":"问题内容","tags":["javascript"]}'

# 投票
curl -X POST http://localhost:5000/api/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"targetType":"question","targetId":"QUESTION_ID","value":1}'
```

---

## 速率限制

目前未实现速率限制。生产环境建议添加：

- 注册/登录: 5 次/分钟
- 创建问题: 10 次/小时
- 创建回答: 20 次/小时
- 投票: 100 次/小时

---

## 版本历史

- **v1.0.0** (2024-02-13) - 初始版本
