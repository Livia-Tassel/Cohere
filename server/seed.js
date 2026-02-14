const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Question = require('./models/Question');
const Answer = require('./models/Answer');

const sampleUsers = [
  {
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123',
    reputation: 150
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    password: 'password123',
    reputation: 85
  },
  {
    username: 'charlie',
    email: 'charlie@example.com',
    password: 'password123',
    reputation: 220
  }
];

const sampleQuestions = [
  {
    title: '如何在 React 中使用 Hooks？',
    body: `我是 React 新手，想了解如何正确使用 Hooks。

## 我的问题

1. useState 和 useEffect 的最佳实践是什么？
2. 什么时候应该使用自定义 Hooks？
3. 有哪些常见的陷阱需要避免？

感谢任何建议！`,
    tags: ['react', 'javascript', 'hooks']
  },
  {
    title: 'MongoDB 索引优化技巧',
    body: `我的 MongoDB 查询性能很慢，想了解如何优化索引。

## 当前情况

- 数据库有 100 万条记录
- 查询时间超过 5 秒
- 使用了基本的 find() 查询

有什么优化建议吗？`,
    tags: ['mongodb', 'database', 'performance']
  },
  {
    title: 'Node.js 异步编程最佳实践',
    body: `## 问题描述

我在处理多个异步操作时遇到了回调地狱的问题。

\`\`\`javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      // 太深了...
    });
  });
});
\`\`\`

有更好的方法吗？`,
    tags: ['nodejs', 'javascript', 'async']
  },
  {
    title: 'Tailwind CSS vs Bootstrap 该如何选择？',
    body: `我正在开始一个新项目，不确定应该使用 Tailwind CSS 还是 Bootstrap。

## 项目需求

- 需要快速开发
- 要求高度定制化
- 团队对 CSS 比较熟悉

请分享你们的经验和建议！`,
    tags: ['css', 'tailwindcss', 'bootstrap']
  },
  {
    title: 'JWT 认证的安全性问题',
    body: `## 问题

我在实现 JWT 认证时有一些安全方面的疑问：

1. Token 应该存储在哪里？localStorage 还是 Cookie？
2. 如何处理 Token 过期？
3. 如何防止 XSS 和 CSRF 攻击？

希望得到专业的建议。`,
    tags: ['jwt', 'security', 'authentication']
  }
];

const sampleAnswers = [
  {
    body: `## React Hooks 最佳实践

### 1. useState
- 不要在循环、条件或嵌套函数中调用 Hooks
- 使用函数式更新避免闭包陷阱

\`\`\`javascript
// ✅ 好的做法
setCount(prevCount => prevCount + 1);

// ❌ 避免
setCount(count + 1);
\`\`\`

### 2. useEffect
- 始终声明依赖项
- 清理副作用

\`\`\`javascript
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, [dependency]);
\`\`\`

### 3. 自定义 Hooks
当你发现多个组件有相同的逻辑时，就应该提取为自定义 Hook。

希望这些建议有帮助！`
  },
  {
    body: `关于 MongoDB 索引优化，这里有几个关键点：

## 1. 创建合适的索引

\`\`\`javascript
// 单字段索引
db.collection.createIndex({ field: 1 });

// 复合索引
db.collection.createIndex({ field1: 1, field2: -1 });

// 文本索引
db.collection.createIndex({ title: "text", body: "text" });
\`\`\`

## 2. 使用 explain() 分析查询

\`\`\`javascript
db.collection.find({ field: value }).explain("executionStats");
\`\`\`

## 3. 避免的陷阱

- 不要创建太多索引（影响写入性能）
- 注意索引的选择性
- 定期监控慢查询

建议使用 MongoDB Atlas 的性能监控工具！`
  }
];

async function seedDatabase() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 已连接到 MongoDB');

    // 清空现有数据
    console.log('🗑️  清空现有数据...');
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});

    // 创建用户
    console.log('👥 创建示例用户...');
    const users = await User.create(sampleUsers);
    console.log(`✅ 创建了 ${users.length} 个用户`);

    // 创建问题
    console.log('❓ 创建示例问题...');
    const questions = [];
    for (let i = 0; i < sampleQuestions.length; i++) {
      const question = await Question.create({
        ...sampleQuestions[i],
        author: users[i % users.length]._id,
        views: Math.floor(Math.random() * 500),
        votes: Math.floor(Math.random() * 50) - 10
      });
      questions.push(question);
    }
    console.log(`✅ 创建了 ${questions.length} 个问题`);

    // 创建回答
    console.log('💬 创建示例回答...');
    const answers = [];
    for (let i = 0; i < Math.min(sampleAnswers.length, questions.length); i++) {
      const answer = await Answer.create({
        ...sampleAnswers[i],
        author: users[(i + 1) % users.length]._id,
        question: questions[i]._id,
        votes: Math.floor(Math.random() * 30)
      });
      answers.push(answer);

      // 更新问题的回答数
      await Question.findByIdAndUpdate(questions[i]._id, {
        $inc: { answerCount: 1 }
      });
    }
    console.log(`✅ 创建了 ${answers.length} 个回答`);

    // 采纳第一个问题的答案
    if (answers.length > 0) {
      await Question.findByIdAndUpdate(questions[0]._id, {
        acceptedAnswer: answers[0]._id
      });
      await Answer.findByIdAndUpdate(answers[0]._id, {
        isAccepted: true
      });
      console.log('✅ 设置了一个已采纳的答案');
    }

    console.log('\n🎉 数据库填充完成！\n');
    console.log('📊 统计信息:');
    console.log(`   用户: ${users.length}`);
    console.log(`   问题: ${questions.length}`);
    console.log(`   回答: ${answers.length}`);
    console.log('\n🔐 测试账户:');
    console.log('   邮箱: alice@example.com');
    console.log('   密码: password123');
    console.log('\n   邮箱: bob@example.com');
    console.log('   密码: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

seedDatabase();
