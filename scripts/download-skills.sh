#!/bin/bash

# CodeSkills 下载脚本 - 快速下载所有 Skills
# 使用方法: bash <(curl -sL https://raw.githubusercontent.com/bigooio/codeskills/main/scripts/download-skills.sh)

set -e

# 配置
REPO_URL="https://github.com/bigooio/codeskills"
BRANCH="develop"
OUTPUT_DIR="codeskills-data"

# 或者从 API 获取（站点部署后可用）
# API_URL="https://codeskills.cn/api/skills"

echo "📦 CodeSkills 下载工具"
echo "======================"

# 如果本地已有代码，只更新数据
if [ -d ".git" ]; then
    echo "📁 检测到已有仓库，拉取最新数据..."
    git pull origin develop
    if [ -f "data/skills.json" ]; then
        echo "✅ 数据已更新到 data/skills.json"
        cat data/skills.json | head -c 500
        echo "..."
    fi
else
    # 完整克隆
    echo "🚀 首次使用，克隆仓库..."
    git clone --depth 1 -b $BRANCH $REPO_URL $OUTPUT_DIR
    cd $OUTPUT_DIR
    echo "✅ Skills 已下载到 $OUTPUT_DIR"
    echo ""
    echo "📂 结构:"
    echo "  - data/skills.json  # 所有 Skills 数据"
    echo "  - app/             # 网站源码（可选）"
fi

echo ""
echo "================================"
echo "共 $(cat data/skills.json | grep -c '"id"') 个 Skills"
