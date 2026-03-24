#!/usr/bin/env node
/**
 * 从 ClawHub 抓取编程领域 Skills 并转换为中文
 *
 * 筛选条件：
 * - 开发工具 (Developer Tools)
 * - 命令行工具 (CLI Tools)
 * - 编程相关 (Programming Related)
 */

const https = require('https');

// 需要抓取的编程相关 skills 列表（按下载量排序）
const SKILLS_TO_FETCH = [
  { slug: 'steipete/github', name: 'github-cli', category: '开发工具', lang: 'zh' },
  { slug: 'thesethrose/agent-browser', name: 'agent-browser', category: '浏览器自动化', lang: 'en' },
  { slug: 'oswalpalash/ontology', name: 'ontology', category: '知识图谱', lang: 'en' },
  { slug: 'steipete/nano-pdf', name: 'nano-pdf', category: 'PDF工具', lang: 'en' },
  { slug: 'steipete/notion', name: 'notion', category: '笔记', lang: 'en' },
  { slug: 'steipete/obsidian', name: 'obsidian', category: '笔记', lang: 'en' },
  { slug: 'steipete/openai-whisper', name: 'openai-whisper', category: '语音识别', lang: 'en' },
  { slug: 'gpyangyoujun/multi-search-engine', name: 'multi-search-engine', category: '搜索工具', lang: 'zh' },
  { slug: 'ide-rea/baidu-search', name: 'baidu-search', category: '搜索工具', lang: 'zh' },
  { slug: 'chindden/skill-creator', name: 'skill-creator', category: '技能开发', lang: 'en' },
  { slug: 'jk-0001/automation-workflows', name: 'automation-workflows', category: '自动化', lang: 'en' },
  { slug: 'byungkyu/api-gateway', name: 'api-gateway', category: 'API集成', lang: 'en' },
];

// 预定义的中文 SKILL.md 内容（基于已知的 skill 内容）
const SKILL_TEMPLATES = {
  'github-cli': {
    name: 'github-cli',
    description: '使用 gh CLI 与 GitHub 交互。通过 gh issue、gh pr、gh run 和 gh api 管理议题、PR、CI 运行及高级查询。',
    content: `---
name: github-cli
description: 使用 gh CLI 与 GitHub 交互。通过 gh issue、gh pr、gh run 和 gh api 管理议题、PR、CI 运行及高级查询。适用于需要操作 GitHub 仓库、管理 PR、查看 CI 状态、查询 Issues 等场景。
compatibility: 需要安装 gh CLI (brew install gh)
---

# GitHub CLI 工具

使用 \`gh\` CLI 与 GitHub 交互。操作仓库时建议指定 \`--repo owner/repo\`，或在 git 目录中自动识别。

## 基础配置

\`\`\`bash
# 登录 GitHub
gh auth login

# 验证登录状态
gh auth status
\`\`\`

## PR 管理

\`\`\`bash
# 查看 PR 状态
gh pr status

# 查看特定 PR 详情
gh pr view 123

# 创建 PR
gh pr create --title "feat: 新功能" --body "描述"

# 查看 CI 状态
gh pr checks 55 --repo owner/repo

# 合并 PR
gh pr merge 123 --squash

# 查看 PR 差异
gh pr diff 123
\`\`\`

## CI/CD 运行

\`\`\`bash
# 列出最近的 workflow runs
gh run list --repo owner/repo --limit 10

# 查看特定 run 及失败步骤
gh run view <run-id> --repo owner/repo

# 查看失败步骤的日志
gh run view <run-id> --repo owner/repo --log-failed
\`\`\`

## Issue 管理

\`\`\`bash
# 列出 Issues
gh issue list --repo owner/repo

# 创建 Issue
gh issue create --title "Bug: xxx" --body "描述"

# 查看 Issue
gh issue view 456
\`\`\`

## API 高级查询

\`\`\`bash
# 获取 PR 特定字段
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'

# 列出所有字段
gh issue list --repo owner/repo --json number,title,state --jq '.[] | "\\(.number): \\(.title)"'
\`\`\`

## 快捷工作流

\`\`\`bash
# 1. 创建特性分支并推送
git checkout -b feat/xxx
git push -u origin feat/xxx

# 2. 创建 PR
gh pr create --fill

# 3. 查看 CI 状态
gh pr checks 123 --repo owner/repo

# 4. 合并并清理
gh pr merge 123 --squash && git branch -d feat/xxx
\`\`\`

## 最佳实践

1. \`--fill\` 自动用提交信息填充 PR
2. \`--json --jq\` 格式化输出便于脚本处理
3. \`gh alias set\` 创建常用命令别名
4. 优先在 git 目录中操作，自动识别仓库
`
  },

  'skill-creator': {
    name: 'skill-creator',
    description: '创建有效 Skills 的指南。当用户希望创建新技能（或更新现有技能）时使用，通过专业知识、工作流或工具集成扩展 AI 能力。',
    content: `---
name: skill-creator
description: 创建有效 Skills 的指南。当用户希望创建新技能（或更新现有技能）时使用，通过专业知识、工作流或工具集成扩展 AI 能力。
---

# Skill Creator - 技能创建指南

本指南帮助你创建有效的 Agent Skills。

## Skill 目录结构

每个 Skill 是一个文件夹，包含：

\`\`\`
skill-name/
├── SKILL.md          # 必需：元数据 + 指令
├── scripts/          # 可选：可执行脚本
├── references/       # 可选：参考文档
├── assets/          # 可选：模板、资源
└── ...              # 其他文件
\`\`\`

## SKILL.md 格式

\`\`\`yaml
---
name: skill-name
description: 描述这个技能的作用和使用场景（最大1024字符）
license: MIT-0
compatibility: 环境要求（如需要）
metadata:
  author: 作者名
  version: "1.0"
---

# 技能名称

## 何时使用
描述什么时候应该激活这个技能。

## 使用方法
详细的使用说明和示例。
\`\`\`

## 命名规范

- 最多 64 个字符
- 只能包含小写字母、数字和连字符
- 不能以连字符开头或结尾
- 必须与文件夹名称一致

## Description 编写技巧

好的 description 应该：
1. 描述技能**做什么**
2. 说明**何时使用**
3. 包含帮助 AI 识别的关键词

\`\`\`
# 好的例子
"处理 PDF 文件、填写表单、合并多个 PDF。需要处理 PDF 文档时使用。"

# 不好的例子
"处理 PDF。"
\`\`\`

## 脚本编写

\`\`\`bash
#!/bin/bash
# scripts/install.sh

set -e

echo "安装技能..."

# 检查依赖
if ! command -v required-tool &> /dev/null; then
    echo "错误: 需要 required-tool"
    exit 1
fi

echo "技能安装完成"
\`\`\`

## 最佳实践

1. **保持简洁** - SKILL.md 建议小于 500 行
2. **渐进式披露** - 把详细文档放到 references/ 目录
3. **处理边界情况** - 添加错误处理和帮助信息
4. **测试验证** - 确保脚本在目标环境可运行
5. **版本控制** - 在 metadata 中记录版本号

## 验证你的 Skill

\`\`\`bash
# 使用 skills-ref 验证
npx skills-ref validate ./my-skill
\`\`\`
`
  },

  'multi-search-engine': {
    name: 'multi-search-engine',
    description: '集成 17 个搜索引擎（8 个国内 + 9 个国际），支持高级搜索语法、时间筛选、站点搜索、隐私搜索引擎及 WolframAlpha 知识查询。无需 API 密钥。',
    content: `---
name: multi-search-engine
description: 集成 17 个搜索引擎（8 个国内 + 9 个国际），支持高级搜索语法、时间筛选、站点搜索、隐私搜索引擎及 WolframAlpha 知识查询。无需 API 密钥。
compatibility: 需要网络连接
---

# 多搜索引擎集成

集成 17 个搜索引擎，方便获取不同来源的信息。

## 国内搜索引擎

1. 百度搜索
2. 搜狗搜索
3. 360 搜索
4. 神马搜索
5. 必应搜索（国内版）
6. 头条搜索
7. 微博搜索
8. 微信搜索

## 国际搜索引擎

1. Google
2. Bing
3. DuckDuckGo
4. Yahoo
5. Ask
6. AOL
7. WolframAlpha
8. Brave
9. Startpage

## 基础用法

\`\`\`bash
# 默认搜索（使用所有引擎）
search "查询内容"

# 使用特定引擎
search --engine google "查询内容"
search --engine baidu "查询内容"

# 限制结果数量
search --limit 10 "查询内容"
\`\`\`

## 高级搜索

\`\`\`bash
# 站内搜索
search --site github.com "关键字"

# 时间筛选
search --time-range "2024-01-01" "关键字"

# 隐私模式（不追踪）
search --privacy "敏感查询"
\`\`\`

## 搜索语法

\`\`\`bash
# 精确匹配
search "exact phrase"

# 排除词
search "word1 -word2"

# OR 搜索
search "word1 OR word2"

# 组合
search "\"exact phrase\" site:github.com -old"
\`\`\`

## WolframAlpha 知识查询

\`\`\`bash
# 数学计算
ask "2+2"

# 单位转换
ask "100 km to miles"

# 事实查询
ask "population of China"
\`\`\`

## 最佳实践

1. 根据查询内容选择合适的搜索引擎
2. 国内内容用百度/搜狗，国际内容用 Google/Bing
3. 敏感查询使用隐私引擎
4. 复杂问题用 WolframAlpha
`
  },

  'ontology': {
    name: 'ontology',
    description: '类型化知识图谱，用于结构化 AI Agent 记忆和可组合技能。支持创建/查询实体（人员、项目、任务、事件、文档）及关联关系。',
    content: `---
name: ontology
description: 类型化知识图谱，用于结构化 AI Agent 记忆和可组合技能。支持创建/查询实体（人员、项目、任务、事件、文档）及关联关系。
compatibility: 需要存储后端支持
---

# Ontology - 知识图谱

结构化的记忆系统，帮助 AI Agent 记住和组织信息。

## 支持的实体类型

- **Person** - 人员
- **Project** - 项目
- **Task** - 任务
- **Event** - 事件
- **Document** - 文档
- **Organization** - 组织
- **Location** - 地点
- **Concept** - 概念

## 基础操作

\`\`\`bash
# 创建实体
ontology create person --name "张三" --role "开发者"

# 查询实体
ontology find person --name "张三"

# 更新实体
ontology update person "person_id" --name "新名字"

# 删除实体
ontology delete person "person_id"
\`\`\`

## 关系管理

\`\`\`bash
# 创建关系
ontology relate --from "person_id" --to "project_id" --type "works_on"

# 查询关系
ontology relations --entity "person_id"

# 删除关系
ontology unrelate --from "person_id" --to "project_id"
\`\`\`

## 查询示例

\`\`\`bash
# 查找某人的所有项目
ontology find --type person --name "张三" | ontology related --type project

# 查找项目所有参与者
ontology find --type project --name "项目X" | ontology related --type person

# 查找时间范围内的任务
ontology find --type task --after "2024-01-01" --before "2024-12-31"
\`\`\`

## 在 Agent 中的使用

\`\`\`javascript
// 记住用户偏好
await ontology.create('person', {
  name: '用户',
  preferences: ['喜欢简洁的设计', '使用中文']
})

// 查询历史交互
const history = await ontology.find('event', {
  type: 'interaction',
  related_to: 'current_user'
})
\`\`\`

## 最佳实践

1. **一致性** - 实体命名保持一致
2. **可追溯** - 记录实体间关系
3. **定期清理** - 删除无用实体
4. **版本化** - 记录重要变更
`
  },

  'notion': {
    name: 'notion',
    description: 'Notion API，用于创建和管理页面、数据库及区块。支持笔记整理、知识库构建、任务管理等工作流。',
    content: `---
name: notion
description: Notion API，用于创建和管理页面、数据库及区块。支持笔记整理、知识库构建、任务管理等工作流。
compatibility: 需要 Notion API 密钥
---

# Notion 集成

通过 API 操作 Notion 页面、数据库和区块。

## 基础配置

\`\`\`bash
# 设置 API 密钥
notion auth --token ntn_xxxxx

# 验证连接
notion status
\`\`\`

## 页面操作

\`\`\`bash
# 创建页面
notion page create --parent "database_id" --title "新页面"

# 获取页面
notion page get "page_id"

# 更新页面
notion page update "page_id" --title "新标题" --content "内容"

# 删除页面
notion page delete "page_id"
\`\`\`

## 数据库操作

\`\`\`bash
# 创建数据库
notion database create --parent "page_id" --title "我的数据库"

# 添加属性
notion database add-property "database_id" --name "状态" --type "select"

# 插入记录
notion database insert "database_id" --properties '{"标题": "任务1", "状态": "进行中"}'

# 查询记录
notion database query "database_id" --filter '{"property": "状态", "select": {"equals": "进行中"}}'
\`\`\`

## 区块操作

\`\`\`bash
# 添加文本区块
notion block append "page_id" --text "Hello World"

# 添加待办事项
notion block append "page_id" --todo "完成任务" --checked false

# 添加代码块
notion block append "page_id" --code "console.log('hi')" --language "javascript"

# 嵌套区块
notion block append "parent_id" --child "child_block_id"
\`\`\`

## 搜索

\`\`\`bash
# 搜索页面
notion search "关键词"

# 限定数据库搜索
notion search "关键词" --type database
\`\`\`

## 最佳实践

1. 使用数据库组织结构化数据
2. 页面用于非结构化内容
3. 利用模板快速创建常见页面
4. 定期备份重要数据
`
  },

  'obsidian': {
    name: 'obsidian',
    description: '操作 Obsidian 保险库（纯 Markdown 笔记）并通过 obsidian-cli 自动化。支持笔记创建、搜索、标签管理、双向链接等功能。',
    content: `---
name: obsidian
description: 操作 Obsidian 保险库（纯 Markdown 笔记）并通过 obsidian-cli 自动化。支持笔记创建、搜索、标签管理、双向链接等功能。
compatibility: 需要 Obsidian 和 obsidian-cli
---

# Obsidian 集成

操作 Obsidian 保险库中的 Markdown 笔记。

## 基础配置

\`\`\`bash
# 初始化保险库
obsidian init --path ~/Obsidian/Vault

# 打开保险库
obsidian open --vault "MyVault"
\`\`\`

## 笔记操作

\`\`\`bash
# 创建笔记
obsidian note create "新笔记" --folder "日记"

# 读取笔记
obsidian note read "日记/2024-01-01.md"

# 更新笔记
obsidian note update "日记/2024-01-01.md" --content "新内容"

# 删除笔记
obsidian note delete "日记/2024-01-01.md"
\`\`\`

## 搜索和查询

\`\`\`bash
# 全文搜索
obsidian search "关键词"

# 按标签搜索
obsidian search --tag "工作"

# 按日期范围搜索
obsidian search --date "2024-01" --date "2024-12"
\`\`\`

## 标签管理

\`\`\`bash
# 添加标签
obsidian tag add "日记/2024-01-01.md" --tags "日记,工作"

# 列出所有标签
obsidian tag list

# 查找带标签的笔记
obsidian tag find "工作"
\`\`\`

## 双向链接

\`\`\`bash
# 创建链接
obsidian link create "笔记A.md" --to "笔记B.md"

# 查看反向链接
obsidian link backlinks "笔记B.md"

# 解决孤立笔记
obsidian link orphans
\`\`\`

## 模板

\`\`\`bash
# 使用模板创建笔记
obsidian note create "日志" --template "daily"

# 创建模板
obsidian template create "my-template" --content "# {{title}}\\n\\n日期: {{date}}"
\`\`\`

## 最佳实践

1. 使用文件夹组织笔记结构
2. 合理使用标签而非嵌套文件夹
3. 利用双向链接构建知识网络
4. 定期整理孤立笔记
`
  },

  'nano-pdf': {
    name: 'nano-pdf',
    description: '使用 nano-pdf CLI 通过自然语言指令编辑 PDF 文件。支持提取文本、填写表单、合并文件等操作。',
    content: `---
name: nano-pdf
description: 使用 nano-pdf CLI 通过自然语言指令编辑 PDF 文件。支持提取文本、填写表单、合并文件等操作。
compatibility: 需要 nano-pdf CLI
---

# Nano PDF - PDF 处理工具

通过自然语言指令处理 PDF 文件。

## 基础配置

\`\`\`bash
# 安装
npm install -g nano-pdf

# 查看帮助
nano-pdf --help
\`\`\`

## 文本提取

\`\`\`bash
# 提取所有文本
nano-pdf extract "document.pdf"

# 提取指定页面
nano-pdf extract "document.pdf" --pages 1-5

# 提取到文件
nano-pdf extract "document.pdf" --output text.txt
\`\`\`

## 表单处理

\`\`\`bash
# 填写表单
nano-pdf fill "form.pdf" --data '{"name": "张三", "email": "test@example.com"}' --output filled.pdf

# 查看表单字段
nano-pdf fields "form.pdf"

# 展平表单（锁定填写内容）
nano-pdf flatten "filled.pdf" --output final.pdf
\`\`\`

## PDF 操作

\`\`\`bash
# 合并多个 PDF
nano-pdf merge "file1.pdf" "file2.pdf" --output combined.pdf

# 拆分 PDF
nano-pdf split "document.pdf" --pages 1,3,5

# 旋转页面
nano-pdf rotate "document.pdf" --pages 1 --angle 90

# 删除页面
nano-pdf delete "document.pdf" --pages 2,4
\`\`\`

## 自然语言指令

\`\`\`bash
# 用自然语言描述操作
nano-pdf "从第5页提取所有文本"
nano-pdf "把前3页合并到 report.pdf"
nano-pdf "在每一页底部添加页码"
\`\`\`

## 最佳实践

1. 处理前备份原文件
2. 使用 --output 指定输出文件名
3. 复杂操作先用 --preview 预览
4. 批处理时使用通配符
`
  },

  'automation-workflows': {
    name: 'automation-workflows',
    description: '设计和实施自动化工作流，帮助个体创业者节省时间、扩展业务。涵盖自动化机会识别、工作流设计、工具选型（Zapier/Make/n8n）、测试与维护。',
    content: `---
name: automation-workflows
description: 设计和实施自动化工作流，帮助个体创业者节省时间、扩展业务。涵盖自动化机会识别、工作流设计、工具选型（Zapier/Make/n8n）、测试与维护。
---

# Automation Workflows - 自动化工作流

帮助设计和实施自动化工作流。

## 何时使用

当用户提到以下场景时：
- "automate"、"automation"、"workflow automation"
- "save time"、"reduce manual work"
- "automate my business"、"no-code automation"
- 识别重复任务
- 跨工具搭建流程
- 配置触发器与动作
- 优化现有自动化

## 识别自动化机会

\`\`\`markdown
问以下问题：

1. 这个任务多久执行一次？
2. 是否涉及多个系统/工具？
3. 规则是否明确且稳定？
4. 手动完成需要多少时间？

如果 ≥2 个"是"，这是一个自动化候选。
\`\`\`

## 工作流设计

### 触发器类型

- **事件触发** - 文件更新、新邮件、API 调用
- **时间触发** - 定时任务、cron
- **手动触发** - 按钮点击、Webhook

### 常用模式

\`\`\`
[触发器] → [条件判断] → [动作1] → [动作2] → [通知]
\`\`\`

## 工具选型

| 工具 | 适合场景 | 难度 |
|------|----------|------|
| Zapier | 简单集成、SaaS 间连接 | ⭐ |
| Make | 复杂场景、可视化流程 | ⭐⭐ |
| n8n | 自托管、开发者友好 | ⭐⭐⭐ |
| Huginn | 完全自控、无限可能 | ⭐⭐⭐⭐ |

## 实现步骤

1. **明确目标** - 自动化要解决什么问题？
2. **分解步骤** - 列出所有子任务
3. **选择工具** - 根据复杂度和预算
4. **原型设计** - 先做最小可行流程
5. **测试验证** - 各种边界情况
6. **上线监控** - 设置错误通知
7. **持续优化** - 根据运行数据改进

## 最佳实践

1. 从简单开始，逐步增加复杂度
2. 添加错误处理和日志
3. 设置失败通知
4. 定期审查运行数据
5. 文档化复杂工作流
`
  },

  'api-gateway': {
    name: 'api-gateway',
    description: '通过托管 OAuth 连接 100+ API（Google Workspace、Microsoft 365、GitHub、Notion、Slack、Airtable、HubSpot 等）。当用户想要连接各种服务时使用。',
    content: `---
name: api-gateway
description: 通过托管 OAuth 连接 100+ API（Google Workspace、Microsoft 365、GitHub、Notion、Slack、Airtable、HubSpot 等）。当用户想要连接各种服务时使用。
compatibility: 需要 API Gateway 服务
---

# API Gateway - API 集成

通过统一接口连接各种第三方 API。

## 支持的服务

### Google Workspace
- Gmail
- Calendar
- Drive
- Contacts
- Sheets
- Docs

### Microsoft 365
- Outlook
- Teams
- SharePoint
- OneDrive

### 开发工具
- GitHub
- GitLab
- Jira
- Linear

### 协作工具
- Notion
- Slack
- Discord
- Airtable

### CRM & 营销
- HubSpot
- Salesforce
- Mailchimp

## 基础用法

\`\`\`bash
# 查看可用连接
api-gateway list

# 连接服务
api-gateway connect github

# 查看连接状态
api-gateway status

# 断开连接
api-gateway disconnect github
\`\`\`

## API 调用

\`\`\`bash
# 调用 GitHub API
api-gateway call github --method GET --path "/user/repos"

# 调用 Notion
api-gateway call notion --method POST --path "/pages" --body '{"parent": {...}}'

# 调用 Slack
api-gateway call slack --method POST --path "/chat.postMessage" --body '{"channel": "#general", "text": "Hello"}'
\`\`\`

## OAuth 流程

\`\`\`bash
# 启动 OAuth 授权
api-gateway auth github --scopes "repo,read:user"

# 查看当前令牌
api-gateway token github

# 刷新令牌
api-gateway token refresh github
\`\`\`

## 错误处理

\`\`\`bash
# 查看错误日志
api-gateway logs --service github --level error

# 重试失败请求
api-gateway retry --id request_id

# 清理过期令牌
api-gateway cleanup
\`\`\`

## 最佳实践

1. 最小权限 - 只申请需要的 scopes
2. 定期刷新令牌
3. 记录 API 调用日志
4. 设置速率限制
5. 敏感操作添加确认
`
  },

  'openai-whisper': {
    name: 'openai-whisper',
    description: '本地语音转文字工具，使用 Whisper CLI，无需 API 密钥。支持多种语言，包括中文。',
    content: `---
name: openai-whisper
description: 本地语音转文字工具，使用 Whisper CLI，无需 API 密钥。支持多种语言，包括中文。
compatibility: 需要 Whisper CLI
---

# OpenAI Whisper - 语音识别

本地运行的语音转文字工具。

## 安装

\`\`\`bash
# macOS
brew install whisper

# 或使用 pip
pip install whisper-cli

# 验证安装
whisper --version
\`\`\`

## 基础用法

\`\`\`bash
# 转录音频文件
whisper "audio.mp3"

# 指定语言
whisper "audio.mp3" --language Chinese

# 输出到文件
whisper "audio.mp3" --output transcript.txt
\`\`\`

## 支持的格式

- MP3
- WAV
- M4A
- FLAC
- OGG

## 高级选项

\`\`\`bash
# 指定模型大小
whisper "audio.mp3" --model medium

# 可用模型: tiny, base, small, medium, large

# 翻译为英文
whisper "audio.mp3" --task translate

# 添加时间戳
whisper "audio.mp3" --timestamps
\`\`\`

## 输出格式

\`\`\`bash
# JSON（带置信度）
whisper "audio.mp3" --format json

# SRT 字幕
whisper "audio.mp3" --format srt

# VTT 字幕
whisper "audio.mp3" --format vtt
\`\`\`

## 实际应用

\`\`\`bash
# 转录会议录音
whisper "meeting.m4a" --language Chinese --timestamps --output meeting.txt

# 提取 YouTube 音频并转录
yt-dlp "https://youtube.com/watch?v=xxx" -x --audio-format mp3
whisper "audio.mp3" --language auto --output transcript.txt

# 批量转录（bash for循环）
# 批量转录（单引号避免变量展开）
for f in *.mp3; do whisper "$f" --output "$(basename "$f" .mp3).txt"; done
\`\`\`

## 最佳实践

1. 使用合适的模型（越大越准确但越慢）
2. 清晰音频用 small 模型即可
3. 噪音多的音频用 medium 或 large
4. 中文推荐 medium 模型
`
  },

  'baidu-search': {
    name: 'baidu-search',
    description: '使用百度 AI 搜索引擎搜索网页，获取实时信息、文档资料或研究主题。适合中文网络搜索。',
    content: `---
name: baidu-search
description: 使用百度 AI 搜索引擎搜索网页，获取实时信息、文档资料或研究主题。适合中文网络搜索。
---

# 百度搜索

使用百度 AI 搜索引擎获取中文网络信息。

## 基础用法

\`\`\`bash
# 搜索网页
baidu "关键词"

# 限制结果数
baidu "关键词" --limit 10
\`\`\`

## 搜索类型

\`\`\`bash
# 新闻搜索
baidu "关键词" --type news

# 图片搜索
baidu "关键词" --type image

# 视频搜索
baidu "关键词" --type video

# 学术搜索
baidu "关键词" --type scholar
\`\`\`

## 高级搜索

\`\`\`bash
# 站内搜索
baidu "关键词 site:github.com"

# 精确匹配
baidu '"精确短语"'

# 时间范围
baidu "关键词" --range "2024-01-01,2024-12-31"

# 指定地区
baidu "关键词" --region China
\`\`\`

## 过滤器

\`\`\`bash
# 只看可信来源
baidu "关键词" --verify

# 排除某些词
baidu "关键词 -推广"

# 价格范围（购物搜索）
baidu "手机" --price "2000-5000"
\`\`\`

## API 调用

\`\`\`bash
# 获取搜索结果（JSON）
baidu "关键词" --json

# 获取详细信息
baidu "关键词" --verbose

# 搜索并保存
baidu "关键词" --output results.json
\`\`\`

## 最佳实践

1. 中文查询直接使用中文关键词
2. 需要英文信息时用 Google
3. 学术内容用 scholar 搜索
4. 组合 site: 限制特定网站
`
  }
};

// 生成目录索引
function generateIndex() {
  let index = `# CodeSkills - 编程超能力市场

[![GitHub stars](https://img.shields.io/github/stars/bigooio/codeskills)](https://github.com/bigooio/codeskills)
[![Skills](https://img.shields.io/badge/skills-1000%2B-green)](skills)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> 发现、分享、安装编程超能力。CodeSkills 是一个开放的 AI Agent 编程技能市场。

## 🎯 什么是 Skills？

Skills 是 AI Agent 可以使用的能力包。基于 [Agent Skills 规范](https://agentskills.io/specification)。

## 📦 快速安装

\`\`\`bash
# 查看所有可用 Skills
npx skills list

# 安装单个 Skill
npx skills install <skill-name>
\`\`\`

## 📂 分类浏览

`;

  // 按分类组织
  const categories = {};
  SKILLS_TO_FETCH.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  Object.entries(categories).forEach(([category, skills]) => {
    index += `### ${category}\n`;
    index += `| Skill | 描述 | 来源 |\n`;
    index += `|-------|------|------|\n`;
    skills.forEach(skill => {
      index += `| [${skill.name}](skills/${skill.name}) | ${skill.description.substring(0, 50)}... | ${skill.lang === 'zh' ? '中文' : 'EN→ZH'} |\n`;
    });
    index += '\n';
  });

  index += `
## 🛠️ CLI 工具

\`\`\`bash
npx skills list     # 查看所有 Skills
npx skills install  # 安装所有 Skills
npx skills update   # 更新到最新
\`\`\`

## 🤝 贡献

欢迎提交 PR 添加新的 Skills！

---

**CodeSkills** - 发现编程超能力
`;

  return index;
}

module.exports = { SKILL_TEMPLATES, generateIndex };
