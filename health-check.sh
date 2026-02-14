#!/bin/bash

# 健康检查脚本

echo "🏥 Q&A Community 健康检查"
echo "================================"
echo ""

# 检查后端
echo "📡 检查后端服务..."
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)

if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "✅ 后端服务正常 (HTTP $BACKEND_RESPONSE)"
else
    echo "❌ 后端服务异常 (HTTP $BACKEND_RESPONSE)"
    echo "   请检查后端是否运行: cd server && npm run dev"
fi

echo ""

# 检查前端
echo "🎨 检查前端服务..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ 前端服务正常 (HTTP $FRONTEND_RESPONSE)"
else
    echo "❌ 前端服务异常 (HTTP $FRONTEND_RESPONSE)"
    echo "   请检查前端是否运行: cd client && npm run dev"
fi

echo ""

# 检查 MongoDB
echo "🗄️  检查 MongoDB 连接..."
if command -v mongosh &> /dev/null; then
    MONGO_CHECK=$(mongosh --quiet --eval "db.adminCommand('ping').ok" 2>&1)
    if [ "$MONGO_CHECK" = "1" ]; then
        echo "✅ MongoDB 连接正常"
    else
        echo "⚠️  MongoDB 连接失败"
        echo "   请检查 MongoDB 是否运行或 MongoDB Atlas 配置"
    fi
elif command -v mongo &> /dev/null; then
    MONGO_CHECK=$(mongo --quiet --eval "db.adminCommand('ping').ok" 2>&1)
    if [ "$MONGO_CHECK" = "1" ]; then
        echo "✅ MongoDB 连接正常"
    else
        echo "⚠️  MongoDB 连接失败"
        echo "   请检查 MongoDB 是否运行或 MongoDB Atlas 配置"
    fi
else
    echo "⚠️  未安装 MongoDB 客户端，跳过检查"
    echo "   如果使用 MongoDB Atlas，请确保 server/.env 配置正确"
fi

echo ""

# 检查环境变量
echo "🔧 检查环境变量..."
if [ -f "server/.env" ]; then
    echo "✅ server/.env 存在"
else
    echo "❌ server/.env 不存在"
    echo "   请从 server/.env.example 复制并配置"
fi

if [ -f "client/.env" ]; then
    echo "✅ client/.env 存在"
else
    echo "❌ client/.env 不存在"
    echo "   请从 client/.env.example 复制并配置"
fi

echo ""

# 检查依赖
echo "📦 检查依赖..."
if [ -d "server/node_modules" ]; then
    echo "✅ 后端依赖已安装"
else
    echo "❌ 后端依赖未安装"
    echo "   运行: cd server && npm install"
fi

if [ -d "client/node_modules" ]; then
    echo "✅ 前端依赖已安装"
else
    echo "❌ 前端依赖未安装"
    echo "   运行: cd client && npm install"
fi

echo ""
echo "================================"
echo "健康检查完成！"
