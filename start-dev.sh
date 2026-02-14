#!/bin/bash

# Q&A Community 开发环境启动脚本

echo "🚀 启动 Q&A Community 开发环境..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  警告: 未检测到本地 MongoDB"
    echo "请确保已配置 MongoDB Atlas 或安装本地 MongoDB"
fi

# 检查依赖
echo ""
echo "📦 检查依赖..."

if [ ! -d "server/node_modules" ]; then
    echo "安装后端依赖..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "安装前端依赖..."
    cd client && npm install && cd ..
fi

# 检查环境变量
echo ""
echo "🔧 检查环境变量..."

if [ ! -f "server/.env" ]; then
    echo "⚠️  警告: server/.env 不存在"
    echo "从 server/.env.example 复制并配置环境变量"
    cp server/.env.example server/.env
    echo "✅ 已创建 server/.env，请编辑配置"
fi

if [ ! -f "client/.env" ]; then
    echo "⚠️  警告: client/.env 不存在"
    echo "从 client/.env.example 复制并配置环境变量"
    cp client/.env.example client/.env
    echo "✅ 已创建 client/.env"
fi

# 启动服务
echo ""
echo "🎯 启动服务..."
echo ""
echo "后端将运行在: http://localhost:5000"
echo "前端将运行在: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 使用 trap 捕获退出信号
trap 'echo ""; echo "🛑 停止所有服务..."; kill 0' EXIT

# 启动后端
cd server
npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端
cd ../client
npm run dev &
FRONTEND_PID=$!

# 等待进程
wait
