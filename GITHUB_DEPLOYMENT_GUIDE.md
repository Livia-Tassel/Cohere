# GitHub 部署完整指南

## 📊 项目分析

### 当前项目状态

**前端 (Client)**
- 框架：React 18 + Vite
- 端口：3000
- 当前 API 地址：`http://localhost:5001/api`
- 构建命令：`npm run build`
- 输出目录：`dist/`

**后端 (Server)**
- 框架：Node.js + Express
- 端口：5001（注意：不是默认的 5000）
- 数据库：MongoDB Atlas（已配置）
- 启动命令：`npm run dev` (开发) / `npm start` (生产)

**数据库**
- MongoDB Atlas 集群已配置
- 连接字符串：`mongodb+srv://livia:***@cohere.i32mvls.mongodb.net/`

### 需要修复的问题

1. ⚠️ **端口不一致**：服务器使用 5001 端口，但很多配置文件默认是 5000
2. ⚠️ **JWT_SECRET 需要更改**：当前使用的是示例密钥
3. ⚠️ **不是 Git 仓库**：需要初始化 Git

---

## 🚀 部署步骤

### 第一步：初始化 Git 仓库

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 创建第一次提交
git commit -m "Initial commit: DevQuery Q&A Platform"
```

### 第二步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `devquery` 或 `qa-community`
   - Description: `A modern Q&A community platform built with MERN stack`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize with README"（我们已经有了）
3. 点击 "Create repository"

### 第三步：推送代码到 GitHub

```bash
# 1. 添加远程仓库（替换成你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/devquery.git

# 2. 推送代码
git branch -M main
git push -u origin main
```

---

## 🌐 部署到线上

### 方案一：Vercel (前端) + Render (后端) - 推荐

#### A. 部署后端到 Render

1. **访问 Render**
   - 打开 https://render.com
   - 使用 GitHub 账号登录

2. **创建 Web Service**
   - 点击 "New +" → "Web Service"
   - 选择你的 GitHub 仓库
   - 点击 "Connect"

3. **配置服务**
   ```
   Name: devquery-api
   Region: Singapore (或选择离你最近的)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **添加环境变量**
   点击 "Environment" 标签，添加：
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://livia:20041014@cohere.i32mvls.mongodb.net/?appName=Cohere
   JWT_SECRET=your_super_secret_key_change_this_to_random_string_12345
   NODE_ENV=production
   ```

5. **部署**
   - 点击 "Create Web Service"
   - 等待部署完成（约 3-5 分钟）
   - 记录你的 API URL，例如：`https://devquery-api.onrender.com`

#### B. 部署前端到 Vercel

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **添加环境变量**
   点击 "Environment Variables"，添加：
   ```
   Name: VITE_API_URL
   Value: https://devquery-api.onrender.com/api
   ```
   （使用你在 Render 获得的 API URL）

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成（约 2-3 分钟）
   - 你会得到一个 URL，例如：`https://devquery.vercel.app`

#### C. 配置 CORS

部署完成后，需要更新后端的 CORS 配置：

1. 在本地修改 `server/server.js`：
```javascript
// 修改 CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

2. 在 Render 的环境变量中添加：
```
CORS_ORIGIN=https://devquery.vercel.app
```
（使用你的 Vercel URL）

3. 提交并推送代码：
```bash
git add .
git commit -m "Update CORS configuration for production"
git push
```

Render 会自动重新部署。

---

### 方案二：全部部署到 Vercel

Vercel 也支持部署 Node.js 后端，但有一些限制。

#### 项目结构调整

1. 在根目录创建 `vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ]
}
```

2. 修改 `server/server.js`，添加导出：
```javascript
// 在文件末尾添加
module.exports = app;
```

3. 在 Vercel 部署时：
   - Root Directory: 留空（使用根目录）
   - 添加所有环境变量（MONGODB_URI, JWT_SECRET 等）

---

### 方案三：Railway - 最简单的方案

Railway 可以自动检测并部署前后端。

1. **访问 Railway**
   - 打开 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库

3. **Railway 会自动检测到两个服务**
   - 它会为 client 和 server 分别创建服务

4. **配置环境变量**
   - 点击 server 服务
   - 添加环境变量（MONGODB_URI, JWT_SECRET 等）
   - 点击 client 服务
   - 添加 VITE_API_URL（使用 server 的 URL）

5. **部署**
   - Railway 会自动部署
   - 每次推送代码都会自动重新部署

---

## 🔧 部署前的准备工作

### 1. 更新 .gitignore

确保 `.gitignore` 包含：
```
node_modules/
.env
.DS_Store
*.log
dist/
.vercel
.railway
```

### 2. 生成强密钥

在终端运行：
```bash
# 生成随机密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

将生成的密钥用作 JWT_SECRET。

### 3. 更新 MongoDB Atlas 网络访问

1. 登录 MongoDB Atlas
2. 进入 "Network Access"
3. 点击 "Add IP Address"
4. 选择 "Allow Access from Anywhere" (0.0.0.0/0)
5. 点击 "Confirm"

### 4. 创建生产环境配置文件

**server/.env.example** (已存在，确保内容正确)：
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/qa-community
JWT_SECRET=your_random_secret_key_here_change_this_in_production
NODE_ENV=production
```

**client/.env.example** (已存在，确保内容正确)：
```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## ✅ 部署后检查清单

- [ ] 前端可以正常访问
- [ ] 可以注册新用户
- [ ] 可以登录
- [ ] 可以创建问题
- [ ] 可以回答问题
- [ ] 可以投票
- [ ] 搜索功能正常
- [ ] 标签功能正常
- [ ] 用户个人主页正常

---

## 🐛 常见问题解决

### 1. CORS 错误
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**解决方案**：
- 检查后端 CORS 配置
- 确保 CORS_ORIGIN 环境变量设置正确
- 确保前端 VITE_API_URL 正确

### 2. 502 Bad Gateway

**解决方案**：
- 检查后端是否成功启动
- 查看 Render/Railway 的日志
- 检查环境变量是否正确

### 3. MongoDB 连接失败

**解决方案**：
- 检查 MONGODB_URI 是否正确
- 确保 MongoDB Atlas 允许从任何 IP 访问
- 检查数据库用户权限

### 4. 环境变量不生效

**解决方案**：
- Vercel: 添加环境变量后需要重新部署
- Render: 修改环境变量会自动重新部署
- 确保变量名拼写正确（VITE_ 前缀很重要）

---

## 🔄 持续部署

### 自动部署设置

Vercel 和 Render 都支持自动部署：

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "Update feature"
git push
```

2. **自动触发部署**
   - Vercel 和 Render 会自动检测到推送
   - 自动开始构建和部署
   - 约 3-5 分钟后完成

### 查看部署状态

- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com
- **Railway**: https://railway.app/dashboard

---

## 📊 监控和日志

### Vercel 日志
```bash
# 安装 Vercel CLI
npm install -g vercel

# 查看日志
vercel logs
```

### Render 日志
- 在 Render Dashboard 中点击你的服务
- 点击 "Logs" 标签
- 实时查看日志

---

## 💰 成本估算

### 免费方案（推荐新手）
- **Vercel**: 免费（个人项目）
- **Render**: 免费 750 小时/月（足够个人项目）
- **MongoDB Atlas**: 免费 512MB
- **总成本**: $0/月

### 注意事项
- Render 免费版在 15 分钟无活动后会休眠
- 第一次访问可能需要 30 秒唤醒
- 如需 24/7 运行，考虑升级到付费版（$7/月）

---

## 🎉 完成！

部署完成后，你的应用将在以下地址可访问：
- 前端：`https://your-project.vercel.app`
- 后端：`https://your-project.onrender.com`

记得分享你的项目链接！🚀
