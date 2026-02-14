# 项目测试指南

## 测试前准备

### 1. 确认依赖已安装
```bash
# 检查后端依赖
cd server && npm list --depth=0

# 检查前端依赖
cd client && npm list --depth=0
```

### 2. 启动 MongoDB
```bash
# 如果使用本地 MongoDB
brew services start mongodb-community

# 或使用 MongoDB Atlas（推荐）
# 确保 server/.env 中的 MONGODB_URI 已配置
```

## 测试步骤

### 阶段 1：后端 API 测试

1. **启动后端服务器**
   ```bash
   cd server
   npm run dev
   ```
   
   应该看到：
   ```
   Server running on port 5000
   MongoDB connected successfully
   ```

2. **测试健康检查**
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   预期响应：
   ```json
   {"status":"ok","message":"Server is running"}
   ```

3. **测试用户注册**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```
   
   预期响应：包含 token 和 user 信息

4. **测试用户登录**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

### 阶段 2：前端测试

1. **启动前端开发服务器**（新终端）
   ```bash
   cd client
   npm run dev
   ```
   
   应该看到：
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

2. **浏览器测试流程**

   a. **访问首页**
   - 打开 http://localhost:3000
   - 应该看到导航栏和"所有问题"页面
   - 初始状态应该显示"暂无问题"

   b. **用户注册**
   - 点击右上角"注册"按钮
   - 填写：
     - 用户名: testuser1
     - 邮箱: user1@test.com
     - 密码: 123456
     - 确认密码: 123456
   - 点击"注册"
   - 应该自动跳转到首页，右上角显示用户名

   c. **发布问题**
   - 点击"提问"按钮
   - 填写：
     - 标题: "如何学习 React Hooks？"
     - 详细描述: "我是 React 新手，想了解 Hooks 的最佳实践。请问有什么推荐的学习资源吗？"
     - 选择标签: react, javascript
   - 点击"提交问题"
   - 应该跳转到问题详情页

   d. **注册第二个用户**
   - 点击右上角"退出"
   - 点击"注册"
   - 填写：
     - 用户名: testuser2
     - 邮箱: user2@test.com
     - 密码: 123456
   - 注册成功

   e. **回答问题**
   - 在首页点击刚才创建的问题
   - 在"你的回答"区域输入：
     ```
     ## 推荐学习资源
     
     1. **官方文档**: React 官方文档是最好的起点
     2. **实践项目**: 通过实际项目学习效果最好
     3. **视频教程**: YouTube 上有很多优质教程
     
     祝学习顺利！
     ```
   - 点击"提交回答"
   - 应该看到回答出现在页面上

   f. **投票功能**
   - 对问题点击向上箭头（点赞）
   - 对回答点击向上箭头（点赞）
   - 数字应该增加

   g. **采纳答案**
   - 退出当前用户
   - 用 user1@test.com 登录
   - 进入问题详情页
   - 点击回答下方的"采纳答案"按钮
   - 回答应该显示绿色边框和"已采纳的答案"标记

   h. **标签筛选**
   - 返回首页
   - 点击侧边栏的 "react" 标签
   - 应该只显示带有 react 标签的问题

   i. **搜索功能**
   - 在首页搜索框输入 "React"
   - 点击"搜索"
   - 应该显示包含 "React" 的问题

   j. **用户个人主页**
   - 点击问题作者的用户名
   - 应该看到用户的问题和回答列表
   - 显示用户的声望值

### 阶段 3：功能验证清单

- [ ] 用户注册成功
- [ ] 用户登录成功
- [ ] 发布问题成功
- [ ] 问题列表显示正确
- [ ] 问题详情页显示正确
- [ ] 提交回答成功
- [ ] 投票功能正常（点赞/点踩）
- [ ] 采纳答案功能正常
- [ ] 标签筛选功能正常
- [ ] 搜索功能正常
- [ ] 用户个人主页显示正确
- [ ] 编辑问题功能正常
- [ ] 删除问题功能正常
- [ ] 编辑回答功能正常
- [ ] 删除回答功能正常
- [ ] 声望值计算正确
- [ ] 响应式布局正常（手机端）

## 常见问题排查

### 后端问题

1. **MongoDB 连接失败**
   - 检查 MongoDB 是否运行
   - 检查 .env 中的 MONGODB_URI
   - 查看终端错误信息

2. **端口被占用**
   - 修改 server/.env 中的 PORT
   - 或关闭占用端口的进程

3. **JWT 错误**
   - 确认 .env 中的 JWT_SECRET 已设置
   - 清除浏览器 localStorage

### 前端问题

1. **无法连接后端**
   - 确认后端已启动
   - 检查 client/.env 中的 VITE_API_URL
   - 打开浏览器控制台查看网络请求

2. **样式不显示**
   - 确认 Tailwind CSS 已正确配置
   - 检查 index.css 是否导入
   - 清除浏览器缓存

3. **路由不工作**
   - 检查 React Router 配置
   - 确认所有页面组件已创建

## 性能测试

### 创建测试数据

可以使用以下脚本创建多个测试问题：

```bash
# 创建 10 个测试问题
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/questions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -d "{
      \"title\": \"测试问题 $i\",
      \"body\": \"这是测试问题 $i 的详细描述\",
      \"tags\": [\"javascript\", \"test\"]
    }"
done
```

### 测试分页

- 创建 20+ 个问题
- 验证首页分页功能
- 验证每页显示 20 个问题

## 下一步

测试通过后，可以：
1. 添加更多功能（评论、通知等）
2. 优化性能（添加缓存、懒加载）
3. 部署到生产环境
4. 添加单元测试和集成测试
