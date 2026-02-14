#!/bin/bash

# 批量替换项目名称为 Cohere
# 将 DevQuery 和 qa-community 统一替换为 Cohere

echo "🔄 开始批量替换项目名称为 Cohere..."
echo ""

# 定义要替换的文件列表
FILES=(
    "CLAUDE.md"
    "GITHUB_DEPLOYMENT_GUIDE.md"
    "RUNNING.md"
    "部署成功指南.md"
    "DEPLOYMENT_FREE.md"
    "项目总结.md"
    "PRODUCTION_READY.md"
    "QUICK_DEPLOY_GUIDE.md"
    "FINAL_LAUNCH_CHECKLIST.md"
    "COMPLETE_FEATURE_LIST.md"
    "DEPLOYMENT.md"
    "QUICKSTART.md"
    "快速部署指南.md"
    "部署指南.md"
)

# 替换 DevQuery 为 Cohere
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 更新 $file..."
        sed -i '' 's/DevQuery/Cohere/g' "$file"
        sed -i '' 's/devquery/cohere/g' "$file"
    fi
done

# 替换 qa-community 为 cohere
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        sed -i '' 's/qa-community/cohere/g' "$file"
        sed -i '' 's/qa_community/cohere/g' "$file"
    fi
done

echo ""
echo "✅ 批量替换完成！"
echo ""
echo "已更新的文件："
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    fi
done
