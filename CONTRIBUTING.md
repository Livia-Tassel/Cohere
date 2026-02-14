# 贡献指南

感谢你对 Q&A Community 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告 Bug

如果你发现了 bug，请创建一个 Issue，包含以下信息：

- Bug 的详细描述
- 复现步骤
- 预期行为
- 实际行为
- 截图（如果适用）
- 环境信息（操作系统、浏览器、Node.js 版本等）

### 提出新功能

如果你有新功能的想法：

1. 先检查 Issues 中是否已有类似建议
2. 创建一个新的 Issue，描述：
   - 功能的目的和用例
   - 预期的实现方式
   - 可能的替代方案

### 提交代码

#### 1. Fork 项目

点击右上角的 "Fork" 按钮，将项目 fork 到你的账户。

#### 2. 克隆仓库

```bash
git clone https://github.com/your-username/qa-community.git
cd qa-community
```

#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

分支命名规范：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关

#### 4. 安装依赖

```bash
# 后端
cd server
npm install

# 前端
cd ../client
npm install
```

#### 5. 进行修改

- 遵循现有的代码风格
- 添加必要的注释
- 确保代码通过 ESLint 检查
- 添加或更新测试（如果适用）

#### 6. 测试你的修改

```bash
# 启动开发服务器
./start-dev.sh

# 手动测试所有相关功能
```

#### 7. 提交代码

```bash
git add .
git commit -m "feat: 添加用户关注功能"
```

提交信息规范（遵循 Conventional Commits）：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式（不影响功能）
- `refactor:` - 重构
- `test:` - 测试
- `chore:` - 构建过程或辅助工具的变动

示例：
```
feat: 添加用户关注功能
fix: 修复投票按钮重复点击问题
docs: 更新 API 文档
refactor: 优化问题列表查询性能
```

#### 8. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

#### 9. 创建 Pull Request

1. 访问你 fork 的仓库
2. 点击 "New Pull Request"
3. 填写 PR 描述：
   - 修改的内容
   - 相关的 Issue（如果有）
   - 测试情况
   - 截图（如果适用）

## 代码规范

### JavaScript/React

- 使用 ES6+ 语法
- 使用函数式组件和 Hooks
- 组件名使用 PascalCase
- 文件名使用 PascalCase（组件）或 camelCase（工具函数）
- 使用有意义的变量名

```javascript
// ✅ 好的
const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  // ...
};

// ❌ 避免
const up = ({ id }) => {
  const [d, setD] = useState(null);
  // ...
};
```

### CSS/Tailwind

- 优先使用 Tailwind 工具类
- 复杂样式可以提取为组件
- 保持响应式设计

```jsx
// ✅ 好的
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// ❌ 避免内联样式
<div style={{ display: 'flex', padding: '16px' }}>
```

### API 设计

- 使用 RESTful 风格
- 返回统一的响应格式
- 适当的 HTTP 状态码
- 详细的错误信息

```javascript
// ✅ 好的
res.status(200).json({
  success: true,
  data: questions
});

res.status(400).json({
  success: false,
  message: 'Invalid input',
  errors: validationErrors
});
```

## 项目结构

```
idea/
├── client/              # 前端
│   ├── src/
│   │   ├── components/  # 可复用组件
│   │   ├── pages/       # 页面组件
│   │   ├── services/    # API 调用
│   │   ├── context/     # 全局状态
│   │   └── utils/       # 工具函数
│   └── public/          # 静态资源
│
└── server/              # 后端
    ├── models/          # 数据模型
    ├── routes/          # API 路由
    ├── middleware/      # 中间件
    ├── config/          # 配置
    └── utils/           # 工具函数
```

## 开发流程

### 添加新功能

1. **规划**
   - 明确功能需求
   - 设计 API 接口
   - 设计数据模型
   - 设计 UI 界面

2. **后端开发**
   - 创建/修改数据模型
   - 实现 API 路由
   - 添加验证和错误处理
   - 测试 API

3. **前端开发**
   - 创建/修改组件
   - 实现 API 调用
   - 添加状态管理
   - 实现 UI 交互

4. **测试**
   - 单元测试
   - 集成测试
   - 手动测试
   - 浏览器兼容性测试

5. **文档**
   - 更新 API 文档
   - 更新用户文档
   - 添加代码注释

### 修复 Bug

1. **重现问题**
   - 理解 bug 的表现
   - 找到触发条件
   - 定位问题代码

2. **修复**
   - 最小化修改范围
   - 确保不引入新问题
   - 添加防御性代码

3. **测试**
   - 验证 bug 已修复
   - 测试相关功能
   - 回归测试

4. **文档**
   - 更新 CHANGELOG
   - 添加注释说明

## 测试指南

### 手动测试清单

- [ ] 用户注册和登录
- [ ] 发布、编辑、删除问题
- [ ] 发布、编辑、删除回答
- [ ] 投票功能
- [ ] 采纳答案
- [ ] 搜索功能
- [ ] 标签筛选
- [ ] 用户个人主页
- [ ] 响应式布局

### 测试环境

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- 移动端浏览器

## 发布流程

1. 更新版本号（package.json）
2. 更新 CHANGELOG.md
3. 创建 Git tag
4. 推送到 GitHub
5. 创建 Release
6. 部署到生产环境

## 社区准则

- 尊重他人
- 保持友好和专业
- 接受建设性批评
- 关注项目目标
- 帮助新贡献者

## 获取帮助

如果你有任何问题：

- 查看文档（README.md, QUICKSTART.md）
- 搜索现有的 Issues
- 创建新的 Issue
- 加入讨论区

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献！🎉
