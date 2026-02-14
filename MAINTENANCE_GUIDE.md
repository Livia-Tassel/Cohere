# 🔧 网站维护指南

## 日常维护任务

### 每天检查

#### 1. 网站可用性
```bash
# 检查前端
curl https://你的域名.vercel.app

# 检查后端
curl https://你的后端.onrender.com/api/health
```

#### 2. 查看错误日志

**Render 后端日志：**
1. 登录 Render Dashboard
2. 选择你的服务
3. 点击 "Logs" 标签
4. 查找 ERROR 或 WARN 关键词

**Vercel 前端日志：**
1. 登录 Vercel Dashboard
2. 选择你的项目
3. 点击 "Deployments"
4. 查看最新部署的日志

#### 3. 数据库监控

**MongoDB Atlas：**
1. 登录 Atlas Dashboard
2. 查看 "Metrics" 标签
3. 检查：
   - 连接数（不应超过 500）
   - 存储使用量（不应超过 512MB）
   - 查询性能

---

## 每周维护

### 1. 数据库清理

#### 删除测试数据
```javascript
// 连接到 MongoDB
use devquery

// 删除测试用户（如果有）
db.users.deleteMany({ email: /test@/ })

// 删除垃圾问题
db.questions.deleteMany({ title: /test/i })
```

#### 检查数据库大小
```javascript
// 查看集合大小
db.stats()

// 查看各集合文档数
db.users.countDocuments()
db.questions.countDocuments()
db.answers.countDocuments()
db.votes.countDocuments()
```

### 2. 性能优化

#### 检查慢查询
1. MongoDB Atlas → Performance Advisor
2. 查看建议的索引
3. 如果需要，添加新索引

#### 清理未使用的索引
```javascript
// 查看索引使用情况
db.questions.aggregate([{ $indexStats: {} }])

// 删除未使用的索引（谨慎操作）
db.questions.dropIndex("索引名称")
```

### 3. 备份数据

#### 自动备份（MongoDB Atlas）
- 免费版有基本快照
- 每天自动备份
- 保留 2 天

#### 手动备份
```bash
# 导出所有数据
mongodump --uri="你的连接字符串" --out=backup-$(date +%Y%m%d)

# 压缩备份
tar -czf backup-$(date +%Y%m%d).tar.gz backup-$(date +%Y%m%d)

# 上传到云存储（可选）
# 使用 Google Drive、Dropbox 等
```

---

## 每月维护

### 1. 安全更新

#### 更新依赖包

**后端：**
```bash
cd server

# 检查过期包
npm outdated

# 更新所有包
npm update

# 检查安全漏洞
npm audit

# 修复安全问题
npm audit fix

# 测试
npm start

# 提交更新
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**前端：**
```bash
cd client

# 同样的步骤
npm outdated
npm update
npm audit
npm audit fix

# 测试构建
npm run build

# 提交
git add package.json package-lock.json
git commit -m "Update frontend dependencies"
git push
```

### 2. 性能报告

#### 使用 Lighthouse
```bash
# 安装 Lighthouse
npm install -g lighthouse

# 运行测试
lighthouse https://你的域名.vercel.app --output html --output-path ./report.html

# 查看报告
open report.html
```

#### 关注指标
- Performance（性能）> 90
- Accessibility（可访问性）> 90
- Best Practices（最佳实践）> 90
- SEO > 90

### 3. 用户反馈处理

#### 收集反馈
1. 查看用户报告的问题
2. 记录常见问题
3. 优先修复影响大的 bug

#### 功能请求
1. 整理用户建议
2. 评估实现难度
3. 规划下个版本

---

## 故障处理

### 常见问题及解决方案

#### 问题 1：网站无法访问

**症状：**
- 前端显示 "Cannot connect to server"
- 或者完全打不开

**排查步骤：**

1. **检查 Render 服务状态**
   ```bash
   curl https://你的后端.onrender.com/api/health
   ```
   
   如果返回错误：
   - 登录 Render Dashboard
   - 查看服务是否在运行
   - 查看日志找错误
   - 如果休眠了，访问一次唤醒

2. **检查 Vercel 部署**
   ```bash
   curl https://你的域名.vercel.app
   ```
   
   如果返回错误：
   - 登录 Vercel Dashboard
   - 查看最新部署状态
   - 如果部署失败，查看构建日志

3. **检查 MongoDB 连接**
   - 登录 Atlas Dashboard
   - 确认集群在运行
   - 检查网络访问设置（0.0.0.0/0）
   - 确认数据库用户密码正确

**解决方案：**
- 如果是 Render 休眠：等待 30 秒自动唤醒
- 如果是部署失败：回滚到上一个版本
- 如果是数据库问题：检查连接字符串

#### 问题 2：用户无法登录

**症状：**
- 登录后立即退出
- 显示 "Token invalid"

**排查步骤：**

1. **检查 JWT_SECRET**
   - Render Dashboard → Environment
   - 确认 JWT_SECRET 存在且未改变

2. **检查 CORS 配置**
   - 确认 CORS_ORIGIN 设置正确
   - 应该是前端的完整 URL

3. **清除浏览器缓存**
   - 让用户清除 localStorage
   - 或者使用无痕模式测试

**解决方案：**
```javascript
// 在浏览器控制台运行
localStorage.clear()
location.reload()
```

#### 问题 3：图片无法显示

**症状：**
- 用户上传的图片不显示
- 显示破损图标

**原因：**
- 当前版本只支持图片 URL
- 不支持直接上传文件

**解决方案：**
1. 告知用户使用图床服务：
   - imgur.com
   - imgbb.com
   - cloudinary.com

2. 或者实现图片上传功能（见下文）

#### 问题 4：数据库满了

**症状：**
- MongoDB Atlas 显示存储接近 512MB
- 无法创建新内容

**解决方案：**

**方案一：清理数据**
```javascript
// 删除旧的、无用的数据
db.questions.deleteMany({ 
  createdAt: { $lt: new Date('2024-01-01') },
  votes: { $lt: 0 },
  answerCount: 0
})

// 删除未激活的用户
db.users.deleteMany({
  createdAt: { $lt: new Date('2024-01-01') },
  reputation: 0
})
```

**方案二：升级计划**
- MongoDB Atlas M2: $9/月（2GB）
- MongoDB Atlas M5: $25/月（5GB）

#### 问题 5：网站很慢

**症状：**
- 页面加载超过 5 秒
- API 响应慢

**排查步骤：**

1. **检查 Render 性能**
   - Dashboard → Metrics
   - 查看 CPU 和内存使用
   - 如果接近 100%，考虑升级

2. **检查数据库查询**
   - Atlas → Performance Advisor
   - 查看慢查询
   - 添加建议的索引

3. **检查前端包大小**
   ```bash
   cd client
   npm run build
   # 查看 dist 文件夹大小
   du -sh dist
   ```

**解决方案：**
- 添加数据库索引
- 优化查询（添加 limit）
- 升级 Render 到付费版
- 前端添加懒加载

---

## 性能优化

### 数据库优化

#### 1. 添加索引
```javascript
// 常用查询的索引
db.questions.createIndex({ createdAt: -1 })
db.questions.createIndex({ votes: -1 })
db.questions.createIndex({ tags: 1 })
db.questions.createIndex({ "author._id": 1 })

// 文本搜索索引
db.questions.createIndex({ 
  title: "text", 
  body: "text" 
})

// 复合索引
db.votes.createIndex({ 
  user: 1, 
  targetType: 1, 
  targetId: 1 
}, { unique: true })
```

#### 2. 查询优化
```javascript
// 使用 projection 只返回需要的字段
db.questions.find(
  {},
  { title: 1, votes: 1, answerCount: 1 }
)

// 使用 limit 限制返回数量
db.questions.find().limit(20)

// 使用 lean() 返回普通对象（Mongoose）
Question.find().lean()
```

### 前端优化

#### 1. 代码分割
```javascript
// 使用 React.lazy 懒加载页面
const QuestionDetail = lazy(() => import('./pages/QuestionDetail'))
const Profile = lazy(() => import('./pages/Profile'))
```

#### 2. 图片优化
```javascript
// 使用 loading="lazy"
<img src="..." loading="lazy" alt="..." />

// 使用 WebP 格式
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

#### 3. 缓存策略
```javascript
// 在 vite.config.js 添加
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    }
  }
}
```

---

## 监控和告警

### 1. 设置 UptimeRobot（免费）

**步骤：**
1. 访问 https://uptimerobot.com
2. 注册账户
3. 添加监控：
   - Monitor Type: HTTP(s)
   - URL: 你的网站 URL
   - Monitoring Interval: 5 minutes
4. 设置告警：
   - Email 通知
   - 当网站宕机时发送邮件

### 2. 设置 Google Analytics（免费）

**步骤：**
1. 创建 GA4 账户
2. 获取跟踪 ID
3. 在 `client/index.html` 添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. 错误追踪（可选）

**使用 Sentry（免费版）：**

```bash
# 安装
npm install @sentry/react

# 配置
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "你的 Sentry DSN",
  environment: "production",
});
```

---

## 扩展功能

### 1. 添加图片上传功能

**使用 Cloudinary（免费 25GB）：**

```bash
# 安装
npm install cloudinary multer

# 后端配置
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
```

### 2. 添加邮件通知

**使用 SendGrid（免费 100 封/天）：**

```bash
# 安装
npm install @sendgrid/mail

# 配置
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 发送邮件
await sgMail.send({
  to: user.email,
  from: 'noreply@yoursite.com',
  subject: '有人回答了你的问题',
  text: '...'
});
```

### 3. 添加评论功能

**数据库模型：**
```javascript
const commentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 成本优化

### 免费额度最大化

#### MongoDB Atlas
- 定期清理旧数据
- 使用 TTL 索引自动删除
- 压缩存储的文本

#### Render
- 使用 UptimeRobot 保持唤醒
- 或者接受休眠（30 秒唤醒）
- 优化代码减少内存使用

#### Vercel
- 免费版完全够用
- 注意带宽限制（100GB/月）
- 优化图片和资源大小

### 何时升级付费版

**考虑升级的情况：**
1. 用户超过 100 人
2. 每天访问超过 1000 次
3. 数据库接近 512MB
4. Render 经常休眠影响体验
5. 需要更快的响应速度

**推荐升级顺序：**
1. 先升级 Render（$7/月）- 最大改善
2. 再升级 MongoDB（$9/月）- 如果存储不够
3. Vercel 保持免费 - 通常够用

---

## 安全检查清单

### 每月检查

- [ ] 更新所有依赖包
- [ ] 运行 `npm audit` 检查漏洞
- [ ] 检查 MongoDB 访问日志
- [ ] 确认 CORS 配置正确
- [ ] 检查环境变量未泄露
- [ ] 测试登录和注册功能
- [ ] 检查用户权限控制
- [ ] 备份数据库

### 安全最佳实践

1. **永远不要提交 .env 文件**
2. **定期更换 JWT_SECRET**（每 3-6 个月）
3. **使用强密码策略**
4. **启用 MongoDB IP 白名单**（如果可能）
5. **监控异常登录活动**
6. **定期审查用户权限**

---

## 故障恢复

### 数据库恢复

**从备份恢复：**
```bash
# 解压备份
tar -xzf backup-20240214.tar.gz

# 恢复数据
mongorestore --uri="你的连接字符串" backup-20240214/
```

### 回滚部署

**Vercel 回滚：**
1. Dashboard → Deployments
2. 找到上一个正常的部署
3. 点击 "..." → "Promote to Production"

**Render 回滚：**
1. Dashboard → 你的服务
2. 点击 "Manual Deploy"
3. 选择之前的 commit
4. 点击 "Deploy"

---

## 维护时间表

### 每天（5 分钟）
- 检查网站是否正常运行
- 查看错误日志

### 每周（30 分钟）
- 清理测试数据
- 检查数据库大小
- 查看性能指标
- 备份数据

### 每月（2 小时）
- 更新依赖包
- 运行安全审计
- 性能优化
- 用户反馈处理
- 规划新功能

### 每季度（半天）
- 全面性能测试
- 安全审计
- 代码重构
- 文档更新
- 用户调研

---

## 联系支持

### 遇到问题时

1. **查看文档**
   - TROUBLESHOOTING.md
   - DEPLOYMENT_FREE.md
   - 本文档

2. **搜索已知问题**
   - GitHub Issues
   - Stack Overflow
   - 官方文档

3. **寻求帮助**
   - 创建 GitHub Issue
   - 社区论坛
   - Discord/Slack 群组

---

**维护愉快！🛠️**

记住：定期维护比出问题后修复要容易得多！
