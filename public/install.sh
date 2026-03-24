#!/bin/bash
#
# CodeSkills CLI 安装脚本
# 用法:
#   curl -fsSL https://codeskills.cn/install.sh | bash          # 自动
#   curl -fsSL https://codeskills.cn/install.sh | bash -s -- github   # GitHub
#   curl -fsSL https://codeskills.cn/install.sh | bash -s -- gitcode  # GitCode
#

set -e

CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; RESET='\033[0m'

SOURCE=""
for arg in "$@"; do
    case $arg in github) SOURCE="github" ;; gitcode) SOURCE="gitcode" ;;
        --source=*) SOURCE="${arg#*=}" ;;
    esac
done
[ -z "$SOURCE" ] && SOURCE="github"

INSTALL_DIR="${HOME}/.local/bin"
CLI_NAME="codeskills"

if [ "$SOURCE" = "gitcode" ]; then
    GH_RAW="https://gitcode.com/codeskills/codeskills/raw/develop/packages/skills-cli/bin/skills.js"
    GH_REPO="https://gitcode.com/codeskills/codeskills.git"
    LABEL="GitCode"
else
    GH_RAW="https://raw.githubusercontent.com/bigooio/codeskills/develop/packages/skills-cli/bin/skills.js"
    GH_REPO="https://github.com/bigooio/codeskills.git"
    LABEL="GitHub"
fi

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════╗"
echo "║         CodeSkills CLI Installer         ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${RESET}"
echo -e "  镜像: ${GREEN}${LABEL}${RESET}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ 需要安装 Node.js${RESET}"
    echo "  https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓${RESET} Node.js $(node -v)"

mkdir -p "$INSTALL_DIR"
CLI_PATH="${INSTALL_DIR}/${CLI_NAME}"
echo -e "\n${YELLOW}▸ 下载 CLI from ${LABEL}...${RESET}"

if command -v curl &> /dev/null; then
    curl -fsSL "$GH_RAW" -o "$CLI_PATH" || true
elif command -v wget &> /dev/null; then
    wget -q "$GH_RAW" -O "$CLI_PATH" || true
fi

if [ ! -f "$CLI_PATH" ] || [ ! -s "$CLI_PATH" ]; then
    echo -e "${RED}✗ 下载失败，请检查网络${RESET}"
    exit 1
fi
chmod +x "$CLI_PATH"

for rc in "${HOME}/.zshrc" "${HOME}/.bashrc"; do
    [ -f "$rc" ] && ! grep -q ".local/bin" "$rc" && echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$rc"
done

echo -e "${GREEN}✓${RESET} 安装完成！"
echo ""
echo "  ${GREEN}codeskills list${RESET}       # 列出所有 Skills"
echo "  ${GREEN}codeskills search python${RESET} # 搜索"
echo "  ${GREEN}codeskills install git${RESET}   # 安装"
echo "  ${GREEN}source ~/.zshrc 2>/dev/null; codeskills help${RESET}"
