# CodeSkills - 编程超能力市场

[![GitHub stars](https://img.shields.io/github/stars/bigooio/codeskills)](https://github.com/bigooio/codeskills)
[![Skills](https://img.shields.io/badge/skills-1000%2B-green)](skills)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> 发现、分享、安装编程超能力。CodeSkills 是一个开放的 AI Agent 编程技能市场。

## 🎯 什么是 Skills？

Skills 是 AI Agent 可以使用的能力包。每个 Skill 包含：
- `SKILL.md` - 技能定义和指令
- `scripts/` - 可执行脚本
- `references/` - 参考文档

基于 [Agent Skills 规范](https://agentskills.io/specification)。

## 📦 快速安装

```bash
# 安装所有 Skills
npx skills install

# 安装单个 Skill
npx skills install <skill-name>
```

## 📂 分类浏览

### 开发工具
| Skill | 描述 | 下载 |
|-------|------|------|
| [github-cli-tool](skills/github-cli-tool) | GitHub CLI 交互 | 11.8万 |
| [git-interactive-rebase](skills/git-interactive-rebase) | 交互式 rebase 整理提交 | - |
| [docker-debug-container](skills/docker-debug-container) | Docker 容器调试技巧 | - |

### 前端开发
| Skill | 描述 | 下载 |
|-------|------|------|
| [react-useeffect-cleanup](skills/react-useeffect-cleanup) | React useEffect 清理函数 | - |
| [typescript-utility-types](skills/typescript-utility-types) | TypeScript 内置工具类型 | - |

### 后端开发
| Skill | 描述 | 下载 |
|-------|------|------|
| [python-fastapi-crud](skills/python-fastapi-crud) | FastAPI CRUD 教程 | - |

### 效率工具
| Skill | 描述 | 下载 |
|-------|------|------|
| [cli-productivity](skills/cli-productivity) | 命令行效率工具 | - |
| [vim-mastery](skills/vim-mastery) | Vim 高级技巧 | - |

## 🛠️ CLI 工具

```bash
# 查看所有可用 Skills
npx skills list

# 安装指定 Skill
npx skills install <name>

# 更新 Skills
npx skills update
```

## 📊 统计

- **Skills 总数**: 1000+
- **分类**: 10+
- **编程语言**: 20+

## 🤝 贡献

欢迎提交 PR 添加新的 Skills！

### 添加新 Skill

1. 在 `skills/` 目录下创建文件夹
2. 添加 `SKILL.md` 文件
3. 遵循 Agent Skills 规范

```markdown
---
name: my-awesome-skill
description: 描述这个技能的作用和使用场景
---

# 技能名称

详细说明...
```

## 📄 许可

本仓库内容采用 MIT 许可。

---

<p align="center">
  <strong>CodeSkills</strong> - 发现编程超能力
</p>
