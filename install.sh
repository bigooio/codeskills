#!/bin/bash
#
# CodeSkills CLI 安装脚本
# 用法: curl -fsSL https://codeskills.cn/install.sh | bash
#

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

GH_RAW="https://raw.githubusercontent.com/bigooio/codeskills/main/packages/skills-cli/bin/skills.js"
GH_REPO="https://github.com/bigooio/codeskills.git"
INSTALL_DIR="${HOME}/.local/bin"
CLI_NAME="codeskills"

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════╗"
echo "║         CodeSkills CLI Installer         ║"
echo "║      发现编程超能力 - AI Agent 技能工具   ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${RESET}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ 需要安装 Node.js 才能使用 CodeSkills CLI${RESET}"
    echo "  访问 https://nodejs.org 安装"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}✗ Node.js 版本过低，需要 >= 16${RESET}"
    exit 1
fi

echo -e "${GREEN}✓${RESET} Node.js $(node -v) 检测到"

# 创建安装目录
mkdir -p "$INSTALL_DIR"

# 下载 CLI
CLI_PATH="${INSTALL_DIR}/${CLI_NAME}"
echo -e "\n${YELLOW}▸ 下载 CodeSkills CLI...${RESET}"

if command -v curl &> /dev/null; then
    curl -fsSL "$GH_RAW" -o "$CLI_PATH" 2>/dev/null || {
        # 尝试 main 分支
        GH_RAW="https://raw.githubusercontent.com/bigooio/codeskills/develop/packages/skills-cli/bin/skills.js"
        curl -fsSL "$GH_RAW" -o "$CLI_PATH" 2>/dev/null
    }
elif command -v wget &> /dev/null; then
    wget -q "$GH_RAW" -O "$CLI_PATH" 2>/dev/null || {
        GH_RAW="https://raw.githubusercontent.com/bigooio/codeskills/develop/packages/skills-cli/bin/skills.js"
        wget -q "$GH_RAW" -O "$CLI_PATH"
    }
else
    echo -e "${RED}✗ 需要 curl 或 wget${RESET}"
    exit 1
fi

if [ ! -f "$CLI_PATH" ]; then
    echo -e "${RED}✗ 下载失败${RESET}"
    echo "  请检查网络连接，或手动安装:"
    echo "  1. git clone $GH_REPO"
    echo "  2. node packages/skills-cli/bin/skills.js"
    exit 1
fi

chmod +x "$CLI_PATH"

# 添加到 PATH（如果需要）
SHELL_RC="${HOME}/.zshrc"
if [ -f "${SHELL_RC}" ]; then
    if ! grep -q ".local/bin" "${SHELL_RC}"; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "${SHELL_RC}"
        echo -e "${YELLOW}▸ 已添加 ~/.local/bin 到 PATH（重新加载: source ~/.zshrc）${RESET}"
    fi
fi

echo -e "${GREEN}✓${RESET} CodeSkills CLI 已安装到 ${CLI_PATH}"

echo -e "\n${CYAN}═══════════════════════════════════════════${RESET}"
echo -e "${GREEN}安装成功！${RESET}"
echo ""
echo "  ${GREEN}codeskills list${RESET}              # 列出所有 Skills"
echo "  ${GREEN}codeskills search <关键词>${RESET}  # 搜索 Skills"
echo "  ${GREEN}codeskills install <名称>${RESET}   # 安装指定 Skill"
echo "  ${GREEN}codeskills install${RESET}           # 安装所有 Skills"
echo ""
echo "  立即使用: ${GREEN}source ~/.zshrc 2>/dev/null; codeskills help${RESET}"
echo -e "${CYAN}═══════════════════════════════════════════${RESET}"
