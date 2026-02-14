#!/bin/bash

# 项目设置脚本

echo "🎯 Q&A Community 项目设置"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org 安装 Node.js (推荐 v18+)"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 询问是否安装依赖
read -p "是否安装项目依赖？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📦 安装后端依赖..."
    cd server
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 后端依赖安装成功"
    else
        echo "❌ 后端依赖安装失败"
        exit 1
    fi

    echo ""
    echo "📦 安装前端依赖..."
    cd ../client
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 前端依赖安装成功"
    else
        echo "❌ 前端依赖安装失败"
        exit 1
    fi

    cd ..
fi

echo ""
echo "🔧 配置环境变量..."

# 检查并创建后端环境变量
if [ ! -f "server/.env" ]; then
    echo "创建 server/.env..."
    cp server/.env.example server/.env
    echo "✅ 已创建 server/.env"
    echo "⚠️  请编辑 server/.env 配置 MongoDB URI 和 JWT_SECRET"
else
    echo "✅ server/.env 已存在"
fi

# 检查并创建前端环境变量
if [ ! -f "client/.env" ]; then
    echo "创建 client/.env..."
    cp client/.env.example client/.env
    echo "✅ 已创建 client/.env"
else
    echo "✅ client/.env 已存在"
fi

echo ""
echo "🗄️  数据库配置"
echo "================================"
echo ""
echo "你需要配置 MongoDB 数据库。有两种选择："
echo ""
echo "1. 使用 MongoDB Atlas（推荐，免费）"
echo "   - 访问 https://www.mongodb.com/cloud/atlas/register"
echo "   - 创建免费 M0 集群"
echo "   - 获取连接字符串"
echo "   - 更新 server/.env 中的 MONGODB_URI"
echo ""
echo "2. 使用本地 MongoDB"
echo "   - macOS: brew install mongodb-community"
echo "   - 启动: brew services start mongodb-community"
echo "   - server/.env 中使用: mongodb://localhost:27017/qa-community"
echo ""

read -p "是否现在编辑 server/.env？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v nano &> /dev/null; then
        nano server/.env
    elif command -v vim &> /dev/null; then
        vim server/.env
    else
        echo "请手动编辑 server/.env 文件"
    fi
fi

echo ""
echo "🎉 设置完成！"
echo "================================"
echo ""
echo "📝 下一步："
echo ""
echo "1. 确保 MongoDB 已配置（server/.env）"
echo "2. 可选：填充测试数据"
echo "   cd server && npm run seed"
echo ""
echo "3. 启动开发服务器"
echo "   ./start-dev.sh"
echo ""
echo "4. 访问应用"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:5000"
echo ""
echo "📚 查看文档："
echo "   - README.md - 项目介绍"
echo "   - QUICKSTART.md - 快速启动"
echo "   - API.md - API 文档"
echo ""
echo "🆘 需要帮助？"
echo "   - 运行 ./health-check.sh 检查系统状态"
echo "   - 查看 QUICKSTART.md 的常见问题部分"
echo ""
