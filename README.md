# CodeSkills - 编程超能力市场

[![GitHub stars](https://img.shields.io/github/stars/bigooio/codeskills)](https://github.com/bigooio/codeskills)
[![Skills](https://img.shields.io/badge/skills-124-green)](skills)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> 发现、分享、安装编程超能力。CodeSkills 是一个开放的 AI Agent 编程技能市场。

## Features

- **124+ 精选技能** - 涵盖 Git/Docker/Python/React/Vue/AI 等热门领域
- **CLI 工具** - 一行命令安装和管理技能
- **双源加速** - GitHub + GitCode CDN，中国用户享高速体验
- **开放分享** - 欢迎贡献自己的技能包

## Quick Install

```bash
curl -fsSL https://codeskills.cn/install.sh | bash
```

或者指定源：

```bash
# 从 GitHub 安装（国际用户）
curl -fsSL https://codeskills.cn/install.sh | bash -s -- github

# 从 GitCode 安装（国内用户，推荐）
curl -fsSL https://codeskills.cn/install.sh | bash -s -- gitcode
```

安装完成后重启终端即可使用 `codeskills` 或 `skills` 命令。

## Usage

```bash
# 浏览所有技能
codeskills list

# 搜索技能
codeskills search python
codeskills search docker

# 安装技能
codeskills install git
codeskills install python
codeskills install docker

# 更新已安装的技能
codeskills update

# 查看帮助
codeskills help
```

## Available Skills

| Category | Skills |
|----------|--------|
| **版本控制** | git, github, github-cli-tool, git-interactive-rebase |
| **前端开发** | react, vue, nextjs, nuxt, typescript, javascript |
| **后端开发** | python, fastapi, flask, django, nodejs |
| **DevOps** | docker, kubernetes, aws, gcp, azure, nginx, redis, postgresql, mongodb |
| **AI 工具** | ai-image-generation, ai-video-script, agent-memory, agent-orchestrator, raglite, ragflow |
| **测试工具** | playwright, scraper, pdf |
| **效率工具** | security-auditor, code-auditor |

完整列表请访问 [codeskills.cn/discover](https://codeskills.cn/discover)

## CLI Commands

| Command | Description |
|---------|-------------|
| `codeskills list` | 列出所有可用技能 |
| `codeskills search <keyword>` | 搜索技能 |
| `codeskills install <name>` | 安装指定技能 |
| `codeskills update` | 更新已安装技能 |
| `codeskills help` | 显示帮助信息 |

## Skill Format

每个技能包含：

- `SKILL.md` - 技能定义和使用说明
- `_meta.json` - 元数据
- 相关的参考文档和示例

基于 [Agent Skills 规范](https://agentskills.io/specification)。

## Stats

- **Skills 总数**: 124+
- **分类**: 10+
- **支持语言**: Python, JavaScript, TypeScript, Bash 等

## Contributing

欢迎提交 PR 添加新的 Skills！

### 添加新 Skill

1. 在 `skills/` 目录下创建文件夹
2. 添加 `SKILL.md` 文件
3. 遵循 Agent Skills 规范

```markdown
---
name: my-awesome-skill
description: 描述这个技能的作用和使用场景
tags: [python, ai]
---

# 技能名称

详细说明...
```

## License

MIT License - see [LICENSE](LICENSE)

---

<p align="center">
  <strong>CodeSkills</strong> - 发现编程超能力<br>
  <a href="https://codeskills.cn">codeskills.cn</a>
</p>
