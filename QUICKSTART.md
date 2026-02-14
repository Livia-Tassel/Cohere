# 快速启动指南

## 前置要求

1. **安装 MongoDB**（本地开发）
   - macOS: `brew install mongodb-community`
   - 或使用 MongoDB Atlas 云数据库（免费）

2. **Node.js** (v16+)

## 启动步骤

### 方式一：使用本地 MongoDB

1. **启动 MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community

   # 或手动启动
   mongod --config /usr/local/etc/mongod.conf
   ```

2. **启动后端**
   ```bash
   cd server
   npm run dev
   ```
   后端将运行在 http://localhost:5000

3. **启动前端**（新终端）
   ```bash
   cd client
   npm run dev
   ```
   前端将运行在 http://localhost:3000

### 方式二：使用 MongoDB Atlas（推荐）

1. **创建 MongoDB Atlas 账户**
   - 访问 https://www.mongodb.com/cloud/atlas/register
   - 创建免费 M0 集群（512MB）
   - 创建数据库用户
   - 设置网络访问：允许所有 IP (0.0.0.0/0)
   - 获取连接字符串

2. **更新环境变量**
   编辑 `server/.env`：
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cohere
   ```

3. **启动服务**
   ```bash
   # 终端 1 - 后端
   cd server
   npm run dev

   # 终端 2 - 前端
   cd client
   npm run dev
   ```

## 测试账户

首次使用需要注册账户：
1. 访问 http://localhost:3000
2. 点击"注册"
3. 填写用户名、邮箱、密码
4. 登录后即可提问、回答、投票

## 常见问题

### MongoDB 连接失败
- 检查 MongoDB 是否运行：`brew services list`
- 检查连接字符串是否正确
- 如使用 Atlas，确认网络访问设置正确

### 端口被占用
- 修改 `server/.env` 中的 PORT
- 修改 `client/vite.config.js` 中的 server.port

### 前端无法连接后端
- 确认后端已启动
- 检查 `client/.env` 中的 VITE_API_URL
- 检查浏览器控制台错误信息

## 开发提示

- 后端使用 nodemon，修改代码自动重启
- 前端使用 Vite HMR，修改代码自动刷新
- API 文档见 README.md
