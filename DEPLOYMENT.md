# 部署指南

## 前端部署 (Vercel)

### 1. 准备工作

确保 `client/package.json` 中有构建脚本：
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 2. 部署到 Vercel

#### 方式一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd client
vercel

# 生产环境部署
vercel --prod
```

#### 方式二：通过 GitHub

1. 将代码推送到 GitHub
2. 访问 https://vercel.com
3. 点击 "New Project"
4. 导入 GitHub 仓库
5. 配置：
   - Framework Preset: Vite
   - Root Directory: client
   - Build Command: `npm run build`
   - Output Directory: dist
6. 添加环境变量：
   - `VITE_API_URL`: 你的后端 API 地址

### 3. 自定义域名（可选）

在 Vercel 项目设置中添加自定义域名。

---

## 后端部署 (Render)

### 1. 准备工作

确保 `server/package.json` 中有启动脚本：
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 2. 部署到 Render

1. 访问 https://render.com
2. 注册/登录账户
3. 点击 "New +" → "Web Service"
4. 连接 GitHub 仓库
5. 配置：
   - Name: cohere-api
   - Environment: Node
   - Region: 选择最近的区域
   - Branch: main
   - Root Directory: server
   - Build Command: `npm install`
   - Start Command: `npm start`
6. 添加环境变量：
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_random_secret_key
   NODE_ENV=production
   ```
7. 点击 "Create Web Service"

### 3. 获取 API URL

部署完成后，Render 会提供一个 URL，例如：
```
https://cohere-api.onrender.com
```

将此 URL 更新到前端的环境变量中。

---

## 后端部署 (Railway) - 替代方案

### 1. 部署到 Railway

1. 访问 https://railway.app
2. 注册/登录账户
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择仓库
5. 配置：
   - Root Directory: server
   - Start Command: `npm start`
6. 添加环境变量（同上）
7. 部署

---

## 使用 Docker 部署

### 1. 创建 Dockerfile (后端)

在 `server/` 目录创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### 2. 创建 Dockerfile (前端)

在 `client/` 目录创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. 创建 nginx.conf (前端)

在 `client/` 目录创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. 创建 docker-compose.yml

在项目根目录创建：

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: qa-mongodb
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123

  backend:
    build: ./server
    container_name: qa-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/cohere?authSource=admin
      JWT_SECRET: your_random_secret_key
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./client
    container_name: qa-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### 5. 启动 Docker 容器

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 停止并删除数据
docker-compose down -v
```

---

## 使用 PM2 部署（VPS）

### 1. 安装 PM2

```bash
npm install -g pm2
```

### 2. 启动后端

```bash
cd server
pm2 start server.js --name qa-backend
```

或使用 ecosystem.config.js：

```bash
pm2 start ecosystem.config.js
```

### 3. 构建前端

```bash
cd client
npm run build
```

### 4. 使用 Nginx 服务前端

安装 Nginx：
```bash
# Ubuntu/Debian
sudo apt install nginx

# macOS
brew install nginx
```

配置 Nginx (`/etc/nginx/sites-available/cohere`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/cohere /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. PM2 常用命令

```bash
# 查看所有进程
pm2 list

# 查看日志
pm2 logs qa-backend

# 重启
pm2 restart qa-backend

# 停止
pm2 stop qa-backend

# 删除
pm2 delete qa-backend

# 开机自启
pm2 startup
pm2 save
```

---

## SSL 证书配置 (Let's Encrypt)

### 使用 Certbot

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 环境变量管理

### 生产环境变量

**后端 (.env.production)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cohere
JWT_SECRET=very_long_random_secret_key_for_production
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

**前端 (.env.production)**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 监控和日志

### 1. 使用 PM2 监控

```bash
pm2 monit
```

### 2. 日志管理

```bash
# 查看日志
pm2 logs

# 清空日志
pm2 flush

# 日志轮转
pm2 install pm2-logrotate
```

### 3. 错误追踪

推荐使用：
- Sentry (错误追踪)
- LogRocket (用户会话记录)
- New Relic (性能监控)

---

## 数据库备份

### MongoDB Atlas 自动备份

MongoDB Atlas 免费版提供自动备份功能。

### 手动备份

```bash
# 导出数据
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/cohere" --out=/backup/$(date +%Y%m%d)

# 导入数据
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/cohere" /backup/20240213
```

---

## 性能优化

### 1. 启用 Gzip 压缩

在 Express 中：
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. 添加缓存头

```javascript
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### 3. 使用 CDN

将静态资源上传到 CDN（如 Cloudflare、AWS CloudFront）。

### 4. 数据库索引

确保常用查询字段有索引：
```javascript
questionSchema.index({ title: 'text', body: 'text' });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdAt: -1 });
```

---

## 安全检查清单

- [ ] 环境变量不包含在代码仓库中
- [ ] JWT_SECRET 使用强随机字符串
- [ ] MongoDB 使用强密码
- [ ] 启用 HTTPS
- [ ] 配置 CORS 白名单
- [ ] 添加速率限制
- [ ] 输入验证和消毒
- [ ] 定期更新依赖包
- [ ] 配置防火墙规则
- [ ] 定期备份数据库

---

## 故障排查

### 常见问题

1. **502 Bad Gateway**
   - 检查后端是否运行
   - 检查端口配置
   - 查看后端日志

2. **CORS 错误**
   - 检查后端 CORS 配置
   - 确认前端 API URL 正确

3. **数据库连接失败**
   - 检查 MongoDB URI
   - 确认网络访问权限
   - 检查数据库用户权限

4. **构建失败**
   - 清除 node_modules 重新安装
   - 检查 Node.js 版本
   - 查看构建日志

---

## 成本估算

### 免费方案
- **前端**: Vercel (免费)
- **后端**: Render 免费版 (750 小时/月)
- **数据库**: MongoDB Atlas M0 (512MB)
- **总成本**: $0/月

### 付费方案
- **前端**: Vercel Pro ($20/月)
- **后端**: Render Standard ($7/月)
- **数据库**: MongoDB Atlas M10 ($57/月)
- **CDN**: Cloudflare Pro ($20/月)
- **总成本**: ~$104/月

---

## 下一步

部署完成后：
1. 测试所有功能
2. 配置域名
3. 设置监控和告警
4. 编写运维文档
5. 制定备份策略
