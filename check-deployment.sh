#!/bin/bash

# DevQuery 部署前检查脚本
# 运行此脚本以确保所有配置正确

echo "🔍 DevQuery 部署前检查"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查计数
PASS=0
FAIL=0
WARN=0

# 1. 检查 Git 仓库
echo "📦 检查 Git 仓库..."
if [ -d .git ]; then
    echo -e "${GREEN}✓${NC} Git 仓库已初始化"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} Git 仓库未初始化"
    FAIL=$((FAIL+1))
fi

# 2. 检查是否有提交
if git log -1 > /dev/null 2>&1; then
    COMMIT_COUNT=$(git rev-list --count HEAD)
    echo -e "${GREEN}✓${NC} 已有 $COMMIT_COUNT 个提交"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} 没有提交记录"
    FAIL=$((FAIL+1))
fi

# 3. 检查远程仓库
echo ""
echo "🌐 检查远程仓库..."
if git remote -v | grep -q origin; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✓${NC} 远程仓库已配置: $REMOTE_URL"
    PASS=$((PASS+1))
else
    echo -e "${YELLOW}⚠${NC} 远程仓库未配置（需要手动添加）"
    WARN=$((WARN+1))
fi

# 4. 检查 .gitignore
echo ""
echo "🚫 检查 .gitignore..."
if [ -f .gitignore ]; then
    if grep -q "node_modules" .gitignore && grep -q ".env" .gitignore; then
        echo -e "${GREEN}✓${NC} .gitignore 配置正确"
        PASS=$((PASS+1))
    else
        echo -e "${YELLOW}⚠${NC} .gitignore 可能缺少重要配置"
        WARN=$((WARN+1))
    fi
else
    echo -e "${RED}✗${NC} .gitignore 文件不存在"
    FAIL=$((FAIL+1))
fi

# 5. 检查环境变量示例文件
echo ""
echo "📝 检查环境变量配置..."
if [ -f server/.env.example ]; then
    echo -e "${GREEN}✓${NC} server/.env.example 存在"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} server/.env.example 不存在"
    FAIL=$((FAIL+1))
fi

if [ -f client/.env.example ]; then
    echo -e "${GREEN}✓${NC} client/.env.example 存在"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} client/.env.example 不存在"
    FAIL=$((FAIL+1))
fi

# 6. 检查 .env 文件是否被忽略
echo ""
echo "🔒 检查敏感文件保护..."
if git ls-files | grep -q "\.env$"; then
    echo -e "${RED}✗${NC} 警告：.env 文件已被提交到 Git！"
    echo "   请立即运行: git rm --cached server/.env client/.env"
    FAIL=$((FAIL+1))
else
    echo -e "${GREEN}✓${NC} .env 文件未被提交（安全）"
    PASS=$((PASS+1))
fi

# 7. 检查 package.json
echo ""
echo "📦 检查项目配置..."
if [ -f package.json ]; then
    echo -e "${GREEN}✓${NC} 根目录 package.json 存在"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} 根目录 package.json 不存在"
    FAIL=$((FAIL+1))
fi

if [ -f server/package.json ]; then
    echo -e "${GREEN}✓${NC} server/package.json 存在"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} server/package.json 不存在"
    FAIL=$((FAIL+1))
fi

if [ -f client/package.json ]; then
    echo -e "${GREEN}✓${NC} client/package.json 存在"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} client/package.json 不存在"
    FAIL=$((FAIL+1))
fi

# 8. 检查关键文件
echo ""
echo "📄 检查关键文件..."
REQUIRED_FILES=(
    "README.md"
    "server/server.js"
    "client/vite.config.js"
    "server/models/User.js"
    "server/models/Question.js"
    "client/src/App.jsx"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        PASS=$((PASS+1))
    else
        echo -e "${RED}✗${NC} $file 缺失"
        FAIL=$((FAIL+1))
    fi
done

# 9. 检查 Node.js 和 npm
echo ""
echo "🔧 检查开发环境..."
if command -v node > /dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js 已安装: $NODE_VERSION"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} Node.js 未安装"
    FAIL=$((FAIL+1))
fi

if command -v npm > /dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm 已安装: $NPM_VERSION"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} npm 未安装"
    FAIL=$((FAIL+1))
fi

# 10. 检查依赖是否安装
echo ""
echo "📚 检查依赖安装..."
if [ -d server/node_modules ]; then
    echo -e "${GREEN}✓${NC} 服务器依赖已安装"
    PASS=$((PASS+1))
else
    echo -e "${YELLOW}⚠${NC} 服务器依赖未安装（运行: cd server && npm install）"
    WARN=$((WARN+1))
fi

if [ -d client/node_modules ]; then
    echo -e "${GREEN}✓${NC} 客户端依赖已安装"
    PASS=$((PASS+1))
else
    echo -e "${YELLOW}⚠${NC} 客户端依赖未安装（运行: cd client && npm install）"
    WARN=$((WARN+1))
fi

# 总结
echo ""
echo "================================"
echo "📊 检查结果总结"
echo "================================"
echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${YELLOW}警告: $WARN${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 恭喜！项目已准备好部署！${NC}"
    echo ""
    echo "下一步："
    echo "1. 创建 GitHub 仓库: https://github.com/new"
    echo "2. 推送代码:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/devquery.git"
    echo "   git push -u origin main"
    echo "3. 部署到 Vercel 和 Render（参考 快速部署指南.md）"
    exit 0
else
    echo -e "${RED}⚠️  发现 $FAIL 个问题，请先修复后再部署${NC}"
    exit 1
fi
