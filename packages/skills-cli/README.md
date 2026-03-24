# CodeSkills CLI

发现和安装编程超能力的命令行工具。

## 安装

```bash
# 全局安装（推荐）
npm install -g codeskills

# 或者使用 npx（无需安装）
npx codeskills install <name>
```

## 命令

```bash
codeskills list              # 列出所有可用 Skills
codeskills search <关键词>    # 搜索 Skills
codeskills install <名称>     # 安装指定 Skill（完整目录）
codeskills install           # 安装所有 Skills
codeskills update            # 更新所有 Skills
```

## 示例

```bash
# 搜索 Python 相关 Skills
codeskills search python

# 安装 git skill
codeskills install git

# 安装所有 Skills
codeskills install
```

## Skills 来源

- **CodeSkills** (codeskills.cn) - 134+ 编程 Skills，涵盖 Git、AI、Python、React 等
- **SkillHub** (skillhub.tencent.com) - 腾讯市场更多 Skills

## 技术栈

代码从 GitHub (bigooio/codeskills) 直接下载，支持完整目录结构（SKILL.md + scripts/ + references/）。
