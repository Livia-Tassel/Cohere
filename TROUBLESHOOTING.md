# 故障排查指南

## 常见问题和解决方案

### 1. 后端问题

#### MongoDB 连接失败

**错误信息**:
```
MongoDB connection error: MongoServerError: bad auth
```

**解决方案**:
1. 检查 `server/.env` 中的 `MONGODB_URI` 是否正确
2. 确认 MongoDB Atlas 用户名和密码正确
3. 检查网络访问设置（允许 0.0.0.0/0）
4. 如果使用本地 MongoDB，确认服务已启动：
   ```bash
   brew services list | grep mongodb
   ```

---

#### 端口被占用

**错误信息**:
```
Error: listen EADDRINUSE: address already in use :::5000
```

**解决方案**:
1. 查找占用端口的进程：
   ```bash
   lsof -i :5000
   ```
2. 终止进程：
   ```bash
   kill -9 <PID>
   ```
3. 或修改端口（`server/.env`）：
   ```env
   PORT=5001
   ```

---

#### JWT 验证失败

**错误信息**:
```
Token is not valid
```

**解决方案**:
1. 清除浏览器 localStorage：
   ```javascript
   localStorage.clear()
   ```
2. 重新登录
3. 确认 `server/.env` 中的 `JWT_SECRET` 已设置

---

#### 依赖安装失败

**错误信息**:
```
npm ERR! code ERESOLVE
```

**解决方案**:
1. 清除缓存：
   ```bash
   npm cache clean --force
   ```
2. 删除 node_modules 和 package-lock.json：
   ```bash
   rm -rf node_modules package-lock.json
   ```
3. 重新安装：
   ```bash
   npm install
   ```

---

### 2. 前端问题

#### 无法连接后端

**错误信息**:
```
Network Error
```

**解决方案**:
1. 确认后端已启动（http://localhost:5000/api/health）
2. 检查 `client/.env` 中的 `VITE_API_URL`
3. 检查浏览器控制台的网络请求
4. 确认 CORS 配置正确

---

#### 样式不显示

**问题**: 页面没有样式，看起来很丑

**解决方案**:
1. 确认 Tailwind CSS 已安装：
   ```bash
   npm list tailwindcss
   ```
2. 检查 `src/index.css` 是否导入：
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. 清除浏览器缓存（Cmd+Shift+R）
4. 重启开发服务器

---

#### 路由不工作

**问题**: 刷新页面后显示 404

**解决方案**:
1. 开发环境：Vite 会自动处理，无需配置
2. 生产环境：配置服务器重定向所有请求到 index.html

   Nginx 配置：
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

---

#### 构建失败

**错误信息**:
```
Build failed with errors
```

**解决方案**:
1. 检查代码语法错误
2. 确认所有导入路径正确
3. 清除构建缓存：
   ```bash
   rm -rf dist .vite
   ```
4. 重新构建：
   ```bash
   npm run build
   ```

---

### 3. 数据库问题

#### 查询很慢

**问题**: 问题列表加载超过 5 秒

**解决方案**:
1. 检查是否创建了索引：
   ```javascript
   // 在 MongoDB Shell 中
   db.questions.getIndexes()
   ```
2. 创建缺失的索引：
   ```javascript
   db.questions.createIndex({ title: "text", body: "text" })
   db.questions.createIndex({ tags: 1 })
   db.questions.createIndex({ createdAt: -1 })
   ```
3. 使用 explain() 分析查询：
   ```javascript
   db.questions.find({}).explain("executionStats")
   ```

---

#### 数据丢失

**问题**: 数据突然消失

**解决方案**:
1. 检查是否误删数据库
2. 恢复备份（如果有）
3. 重新填充测试数据：
   ```bash
   cd server && npm run seed
   ```

---

### 4. 认证问题

#### 无法登录

**问题**: 输入正确的邮箱和密码仍然无法登录

**解决方案**:
1. 检查用户是否存在：
   ```javascript
   // MongoDB Shell
   db.users.findOne({ email: "test@example.com" })
   ```
2. 检查密码是否正确加密
3. 查看后端日志错误信息
4. 尝试重新注册

---

#### Token 过期

**问题**: 操作时提示需要重新登录

**解决方案**:
1. Token 默认有效期 7 天
2. 修改有效期（`server/routes/auth.js`）：
   ```javascript
   jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
     expiresIn: '30d' // 改为 30 天
   })
   ```
3. 实现 Token 刷新机制

---

### 5. 投票问题

#### 无法投票

**问题**: 点击投票按钮没有反应

**解决方案**:
1. 确认已登录
2. 检查是否是自己的内容（不能给自己投票）
3. 查看浏览器控制台错误
4. 检查后端日志

---

#### 投票数不正确

**问题**: 投票数显示异常

**解决方案**:
1. 检查数据库中的 votes 字段
2. 重新计算投票数：
   ```javascript
   // MongoDB Shell
   db.votes.aggregate([
     { $match: { targetId: ObjectId("...") } },
     { $group: { _id: null, total: { $sum: "$value" } } }
   ])
   ```
3. 更新问题/回答的 votes 字段

---

### 6. 部署问题

#### Vercel 部署失败

**错误信息**:
```
Build failed
```

**解决方案**:
1. 检查构建命令是否正确：`npm run build`
2. 检查输出目录是否正确：`dist`
3. 确认环境变量已设置
4. 查看 Vercel 构建日志

---

#### Render 部署失败

**错误信息**:
```
Deploy failed
```

**解决方案**:
1. 检查启动命令：`npm start`
2. 确认所有环境变量已设置
3. 检查 Node.js 版本兼容性
4. 查看 Render 日志

---

#### CORS 错误（生产环境）

**错误信息**:
```
Access to fetch has been blocked by CORS policy
```

**解决方案**:
1. 更新后端 CORS 配置（`server/server.js`）：
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com',
     credentials: true
   }))
   ```
2. 确认前端 API URL 正确

---

### 7. 性能问题

#### 页面加载慢

**解决方案**:
1. 启用 Gzip 压缩
2. 使用 CDN 加速静态资源
3. 实现懒加载
4. 优化图片大小
5. 添加 Redis 缓存

---

#### 内存泄漏

**问题**: 应用运行一段时间后变慢

**解决方案**:
1. 检查是否有未清理的定时器
2. 检查 useEffect 是否正确清理
3. 使用 React DevTools Profiler 分析
4. 重启应用

---

### 8. 开发环境问题

#### 热更新不工作

**问题**: 修改代码后页面不自动刷新

**解决方案**:
1. 重启开发服务器
2. 检查文件监听限制（Linux）：
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```
3. 检查 Vite 配置

---

#### VS Code 提示错误

**问题**: 编辑器显示类型错误

**解决方案**:
1. 安装推荐的扩展（`.vscode/extensions.json`）
2. 重启 VS Code
3. 运行 TypeScript 服务器：Cmd+Shift+P → "Restart TS Server"

---

## 调试技巧

### 后端调试

1. **查看日志**:
   ```bash
   # 开发环境
   cd server && npm run dev

   # 生产环境（PM2）
   pm2 logs qa-backend
   ```

2. **使用 console.log**:
   ```javascript
   console.log('Debug:', variable)
   ```

3. **使用 VS Code 调试器**:
   - 在代码中设置断点
   - 按 F5 启动调试

### 前端调试

1. **浏览器开发者工具**:
   - Console: 查看日志和错误
   - Network: 查看 API 请求
   - React DevTools: 查看组件状态

2. **添加调试信息**:
   ```javascript
   console.log('State:', state)
   console.log('Props:', props)
   ```

3. **使用 React DevTools Profiler**:
   - 分析组件渲染性能
   - 找出性能瓶颈

### 数据库调试

1. **MongoDB Compass**:
   - 可视化查看数据
   - 执行查询
   - 分析性能

2. **MongoDB Shell**:
   ```bash
   mongosh "mongodb+srv://..."
   ```

3. **查看慢查询**:
   ```javascript
   db.setProfilingLevel(1, { slowms: 100 })
   db.system.profile.find().sort({ ts: -1 }).limit(5)
   ```

---

## 获取帮助

如果以上方法都无法解决问题：

1. **运行健康检查**:
   ```bash
   ./health-check.sh
   ```

2. **查看文档**:
   - README.md
   - QUICKSTART.md
   - API.md

3. **搜索 Issues**:
   - 查看是否有类似问题

4. **创建 Issue**:
   - 描述问题
   - 提供错误信息
   - 说明复现步骤
   - 附上环境信息

5. **联系支持**:
   - 查看 CONTRIBUTING.md

---

## 预防措施

### 开发最佳实践

1. **定期备份数据库**
2. **使用版本控制（Git）**
3. **编写测试**
4. **代码审查**
5. **监控日志**
6. **定期更新依赖**

### 安全检查

1. **不要提交敏感信息**（.env 文件）
2. **使用强密码**
3. **定期更新依赖**
4. **启用 HTTPS**
5. **添加速率限制**

---

**最后更新**: 2024-02-13
