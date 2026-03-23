# codeskills.cn 设计文档

## 1. 概述

**项目目标**：打造一个专注于分享编程技能（Skills）的网站，收集 GitHub 优质项目和自创内容，免费向开发者开放。

**核心价值**：帮助开发者发现和学习高质量的编程技能、工具、代码模式。

---

## 2. 内容策略

### 2.1 内容来源

| 来源 | 说明 |
|------|------|
| AI 采集 GitHub Trending | 按语言筛选，抓取高质量项目简介和链接 |
| Awesome Lists | 抓取精选列表内容 |
| 自创内容 | 平时积累的个人经验和使用心得 |

### 2.2 内容结构

每个 Skill 包含：
- **标题**：简洁明了
- **简介**：1-2 句话描述
- **来源**：GitHub 链接 / 原创
- **标签**：语言（JS/TS/Python）、分类（前端/后端/工具/AI）
- **详细内容**：使用说明、代码示例、最佳实践
- **创建时间**

---

## 3. 技术方案

### 3.1 技术栈

- **框架**：Next.js 14 (App Router)
- **样式**：Tailwind CSS
- **部署**：Vercel（免费）
- **内容管理**：JSON 文件存储（后期可切换数据库）

### 3.2 目录结构

```
codeskills/
├── app/
│   ├── page.tsx              # 首页
│   ├── discover/page.tsx     # 发现页（搜索+筛选）
│   ├── skill/[slug]/page.tsx # Skill 详情页
│   ├── about/page.tsx        # 关于页
│   └── admin/page.tsx        # 管理后台
├── components/
│   ├── SkillCard.tsx         # 技能卡片
│   ├── SearchBar.tsx         # 搜索组件
│   ├── TagFilter.tsx         # 标签筛选
│   └── Layout.tsx            # 布局组件
├── data/
│   └── skills.json           # Skills 数据存储
├── lib/
│   └── github-scraper.ts     # GitHub 采集脚本
└── docs/
    └── specs/                # 设计文档
```

---

## 4. 页面设计

### 4.1 首页

- **Hero 区域**：标题 "发现编程超能力"，副标题，搜索入口
- **精选 Skills**：3-6 个精选技能卡片展示
- **快速筛选**：热门标签入口

### 4.2 发现页

- **搜索框**：支持关键词搜索
- **标签筛选**：
  - 语言：JavaScript / TypeScript / Python / Go / Rust / 其他
  - 分类：前端 / 后端 / DevOps / AI / 工具 / 数据库
- **列表展示**：技能卡片网格，支持加载更多

### 4.3 详情页

- **头部**：标题、标签、来源链接、创建时间
- **正文**：完整描述、代码示例
- **相关推荐**：同标签的其他 Skills

### 4.4 管理后台

- 添加新 Skill
- 编辑现有 Skill
- 标记 Skill 来源（采集/原创）

---

## 5. 视觉风格

### 5.1 配色方案

| 用途 | 颜色 |
|------|------|
| 背景 | `#0d1117`（深黑） |
| 卡片背景 | `#161b22`（深灰） |
| 边框 | `#30363d` |
| 主文字 | `#e6edf3` |
| 次要文字 | `#8b949e` |
| 主色调 | `#58a6ff`（蓝色） |
| 强调色 | `#3fb950`（绿色） |

### 5.2 视觉元素

- 代码高亮风格
- 卡片 hover 微光效果
- 圆角：8px
- 间距：基于 4px 网格

---

## 6. 数据模型

```typescript
interface Skill {
  id: string;           // 唯一标识
  slug: string;         // URL 友好标识
  title: string;        // 标题
  description: string;  // 简介
  content: string;     // 详细内容（Markdown）
  tags: string[];      // 标签
  source: 'github' | 'original';  // 来源
  sourceUrl?: string;   // 原始链接
  createdAt: string;   // 创建时间
}
```

---

## 7. GitHub 采集策略

### 7.1 采集规则

- 定时任务（可配置）抓取 GitHub Trending
- 按语言筛选：JavaScript, TypeScript, Python, Go
- 只采集 star 数 > 100 的项目
- 提取：项目名、描述、语言、链接

### 7.2 数据更新

- 初期手动触发采集
- 后期可设置为每日自动更新
- 去重处理（根据 URL）

---

## 8. 实施计划

### 第一阶段（MVP）
1. 搭建 Next.js 项目基础框架
2. 实现首页和发现页
3. 添加 5-10 个示例 Skills
4. 部署到 Vercel

### 第二阶段（完善）
1. 实现 Skill 详情页
2. 开发 GitHub 采集脚本
3. 添加管理后台
4. 丰富内容

### 第三阶段（可选）
1. 用户提交功能
2. 社区互动
3. 个性化推荐
