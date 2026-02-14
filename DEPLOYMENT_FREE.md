# 🆓 免费部署指南 - 无需服务器

## 方案一：Vercel + Render + MongoDB Atlas（推荐）

### 优势
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动部署
- ✅ 无需服务器管理

---

## 第一步：部署数据库（MongoDB Atlas）

### 1. 创建 MongoDB Atlas 账户

访问：https://www.mongodb.com/cloud/atlas/register

1. 注册账户（可以用 Google 账户登录）
2. 选择 **FREE** 计划（M0 Sandbox - 512MB 免费）
3. 选择云服务商：AWS
4. 选择区域：Singapore（新加坡，离中国最近）
5. 集群名称：保持默认或改为 `cohere-cluster`
6. 点击 **Create Cluster**（等待 3-5 分钟）

### 2. 配置数据库访问

#### 创建数据库用户
1. 左侧菜单 → **Database Access**
2. 点击 **Add New Database User**
3. 选择 **Password** 认证
4. 用户名：`cohere-admin`
5. 密码：点击 **Autogenerate Secure Password**（复制保存！）
6. 权限：选择 **Read and write to any database**
7. 点击 **Add User**

#### 配置网络访问
1. 左侧菜单 → **Network Access**
2. 点击 **Add IP Address**
3. 选择 **Allow Access from Anywhere**（输入 `0.0.0.0/0`）
4. 点击 **Confirm**

### 3. 获取连接字符串

1. 左侧菜单 → **Database**
2. 点击 **Connect** 按钮
3. 选择 **Connect your application**
4. Driver: **Node.js**，Version: **5.5 or later**
5. 复制连接字符串，格式如下：
   ```
   mongodb+srv://cohere-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. 将 `<password>` 替换为刚才保存的密码
7. 在末尾添加数据库名：`/cohere`
   ```
   mongodb+srv://cohere-admin:你的密码@cluster0.xxxxx.mongodb.net/cohere?retryWrites=true&w=majority
   ```

**保存这个连接字符串！后面会用到。**

---

## 第二步：部署后端（Render）

### 1. 准备代码

首先需要将代码推送到 GitHub：

```bash
# 在项目根目录
cd /Users/tassel/Documents/Project/idea

# 初始化 git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit - Cohere platform"

# 在 GitHub 创建仓库后，添加远程仓库
git remote add origin https://github.com/你的用户名/cohere.git

# 推送代码
git push -u origin main
```

### 2. 部署到 Render

访问：https://render.com

1. 注册账户（可以用 GitHub 账户登录）
2. 点击 **New +** → **Web Service**
3. 连接你的 GitHub 仓库
4. 选择 `cohere` 仓库

#### 配置服务

**Basic Settings:**
- Name: `cohere-backend`
- Region: Singapore（或 Oregon）
- Branch: `main`
- Root Directory: `server`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment:**
- 选择 **Free** 计划（每月 750 小时免费）

**Environment Variables:**（点击 Advanced → Add Environment Variable）

添加以下环境变量：

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `你的 MongoDB 连接字符串` |
| `JWT_SECRET` | `随机生成的密钥（至少 32 字符）` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `*`（先用这个，部署前端后再改） |

**生成 JWT_SECRET：**
```bash
# 在终端运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. 点击 **Create Web Service**
6. 等待部署完成（5-10 分钟）
7. 部署成功后，会得到一个 URL，如：
   ```
   https://cohere-backend.onrender.com
   ```

**保存这个 URL！**

### 3. 测试后端

访问：`https://cohere-backend.onrender.com/api/health`

应该看到：
```json
{"status":"ok","message":"Server is running"}
```

---

## 第三步：部署前端（Vercel）

### 1. 配置前端环境变量

编辑 `client/.env`：

```env
VITE_API_URL=https://cohere-backend.onrender.com/api
```

提交更改：
```bash
git add client/.env
git commit -m "Update API URL for production"
git push
```

### 2. 部署到 Vercel

访问：https://vercel.com

1. 注册账户（用 GitHub 账户登录）
2. 点击 **Add New...** → **Project**
3. 导入你的 GitHub 仓库 `cohere`
4. 配置项目：

**Framework Preset:** Vite
**Root Directory:** `client`
**Build Command:** `npm run build`
**Output Directory:** `dist`

**Environment Variables:**
- Key: `VITE_API_URL`
- Value: `https://cohere-backend.onrender.com/api`

5. 点击 **Deploy**
6. 等待部署完成（2-3 分钟）
7. 部署成功后，会得到一个 URL，如：
   ```
   https://cohere.vercel.app
   ```

### 3. 更新后端 CORS 配置

回到 Render，更新环境变量：

1. 进入你的 Web Service
2. 左侧菜单 → **Environment**
3. 找到 `CORS_ORIGIN`
4. 修改为：`https://cohere.vercel.app`
5. 点击 **Save Changes**
6. 服务会自动重启

---

## 第四步：填充测试数据（可选）

### 方法一：本地填充

```bash
# 在本地项目目录
cd server

# 临时修改 .env 使用线上数据库
# 将 MONGODB_URI 改为 Atlas 的连接字符串

# 运行填充脚本
npm run seed

# 完成后改回本地配置
```

### 方法二：通过 Render Shell

1. Render Dashboard → 你的服务
2. 右上角 → **Shell**
3. 运行：
   ```bash
   npm run seed
   ```

---

## 第五步：测试网站

访问你的 Vercel URL：`https://cohere.vercel.app`

### 测试流程

1. **注册账户**
   - 点击右上角 "注册"
   - 填写用户名、邮箱、密码
   - 提交注册

2. **发布问题**
   - 点击 "提问" 按钮
   - 填写标题和内容
   - 选择标签
   - 提交问题

3. **回答问题**
   - 点击问题进入详情页
   - 在底部输入回答
   - 提交回答

4. **投票**
   - 对问题或回答点击向上/向下箭头
   - 查看投票数变化

5. **查看个人主页**
   - 点击用户名
   - 查看问题和回答列表

---

## 维护指南

### 自动部署

配置好后，每次推送代码到 GitHub，Vercel 和 Render 会自动部署！

```bash
# 修改代码后
git add .
git commit -m "描述你的修改"
git push

# Vercel 和 Render 会自动检测并部署
```

### 查看日志

#### Render 日志
1. Dashboard → 你的服务
2. 点击 **Logs** 标签
3. 实时查看服务器日志

#### Vercel 日志
1. Dashboard → 你的项目
2. 点击最新的部署
3. 查看 **Build Logs** 和 **Function Logs**

### 监控数据库

#### MongoDB Atlas
1. Dashboard → Database
2. 点击 **Browse Collections**
3. 查看数据库内容
4. 可以手动编辑数据

### 性能监控

#### Render
- 免费版有基本的 CPU 和内存监控
- Dashboard → Metrics

#### Vercel
- 免费版有基本的访问统计
- Dashboard → Analytics

---

## 免费额度说明

### MongoDB Atlas（免费永久）
- 存储：512MB
- 连接数：500 个并发
- 适合：小型项目，几千用户

### Render（免费）
- 内存：512MB RAM
- CPU：0.1 CPU
- 限制：15 分钟无活动会休眠
- 适合：个人项目、演示

**注意**：Render 免费版会在 15 分钟无活动后休眠，下次访问需要等待 30 秒唤醒。

### Vercel（免费永久）
- 带宽：100GB/月
- 构建时间：6000 分钟/月
- 无休眠
- 适合：前端应用

---

## 升级到付费版（可选）

### 如果需要更好的性能

#### Render（$7/月）
- 不会休眠
- 更多内存和 CPU
- 更快的响应速度

#### Vercel（免费版足够）
- 免费版对个人项目完全够用

#### MongoDB Atlas（免费版足够）
- 512MB 可以存储几千个问题
- 需要更多可升级到 $9/月（2GB）

---

## 常见问题

### Q1: Render 服务休眠怎么办？

**方案一：使用 UptimeRobot 保持唤醒**

1. 访问：https://uptimerobot.com
2. 注册免费账户
3. 添加监控：
   - Monitor Type: HTTP(s)
   - URL: `https://cohere-backend.onrender.com/api/health`
   - Monitoring Interval: 5 minutes
4. 这样每 5 分钟会自动访问一次，保持服务唤醒

**方案二：升级到付费版（$7/月）**

### Q2: 如何绑定自定义域名？

#### Vercel
1. Dashboard → 你的项目 → Settings → Domains
2. 添加你的域名（如 `cohere.com`）
3. 按照提示配置 DNS

#### Render
1. Dashboard → 你的服务 → Settings → Custom Domain
2. 添加域名
3. 配置 DNS CNAME 记录

### Q3: 数据库满了怎么办？

1. 升级 MongoDB Atlas 计划
2. 或者定期清理旧数据
3. 或者添加数据归档功能

### Q4: 如何备份数据？

#### MongoDB Atlas 自动备份
1. Dashboard → Backup
2. 免费版有基本的快照功能

#### 手动导出
```bash
# 安装 MongoDB 工具
brew install mongodb-database-tools

# 导出数据
mongodump --uri="你的连接字符串"

# 导入数据
mongorestore --uri="你的连接字符串" dump/
```

### Q5: 如何查看访问统计？

#### 使用 Google Analytics（免费）

1. 创建 GA4 账户
2. 在 `client/index.html` 添加跟踪代码
3. 查看实时访问数据

---

## 成本总结

### 完全免费方案
- MongoDB Atlas: $0（512MB）
- Render: $0（有休眠）
- Vercel: $0（无限制）
- **总计：$0/月**

### 推荐付费方案（如果需要）
- MongoDB Atlas: $0（免费版够用）
- Render: $7/月（无休眠）
- Vercel: $0（免费版够用）
- **总计：$7/月**

---

## 部署检查清单

部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] MongoDB Atlas 已配置
- [ ] 获取了数据库连接字符串
- [ ] Render 后端已部署
- [ ] 后端 API 可以访问
- [ ] Vercel 前端已部署
- [ ] 前端可以访问
- [ ] CORS 已正确配置
- [ ] 测试注册登录功能
- [ ] 测试发布问题功能
- [ ] 测试回答和投票功能

---

## 下一步

部署成功后：

1. **分享你的网站**
   - 发送链接给朋友测试
   - 在社交媒体分享

2. **收集反馈**
   - 记录用户反馈
   - 修复 bug
   - 添加新功能

3. **持续改进**
   - 查看日志找问题
   - 优化性能
   - 添加新功能

---

**祝你部署成功！🚀**

如有问题，查看 TROUBLESHOOTING.md 或创建 GitHub Issue。
