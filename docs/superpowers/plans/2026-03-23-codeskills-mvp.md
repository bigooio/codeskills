# codeskills.cn MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 codeskills.cn MVP 版本，包含首页、发现页（搜索+筛选）、Skill 详情页，数据存储在 JSON 文件，部署到 Vercel。

**Architecture:** Next.js 14 App Router + Tailwind CSS，全站静态生成，数据存储在 `data/skills.json`，通过 fs 读取。

**Tech Stack:** Next.js 14, Tailwind CSS, TypeScript, Vercel

---

## 文件结构

```
codeskills/
├── app/
│   ├── layout.tsx              # 根布局（深色主题）
│   ├── page.tsx                # 首页
│   ├── globals.css             # 全局样式（Tailwind）
│   ├── discover/
│   │   └── page.tsx            # 发现页
│   └── skill/
│       └── [slug]/
│           └── page.tsx       # Skill 详情页
├── components/
│   ├── SkillCard.tsx           # 技能卡片组件
│   ├── SearchBar.tsx           # 搜索组件
│   ├── TagFilter.tsx           # 标签筛选组件
│   └── Header.tsx              # 导航头部
├── data/
│   └── skills.json             # Skills 数据存储
├── lib/
│   └── skills.ts               # Skills 数据操作工具函数
└── docs/
    └── specs/                  # 设计文档
```

---

## 任务清单

### 任务 1: 初始化 Next.js 项目

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "codeskills",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: 创建 next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: 创建 tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        card: '#161b22',
        border: '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        accent: '#58a6ff',
        success: '#3fb950',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: 创建 postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 创建 app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0d1117;
  --card: #161b22;
  --border: #30363d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --accent: #58a6ff;
  --success: #3fb950;
}

body {
  background-color: var(--background);
  color: var(--text-primary);
}
```

- [ ] **Step 7: 创建 app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'codeskills - 发现编程超能力',
  description: '分享编程技能、工具、代码模式',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-text-primary">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 8: 安装依赖并验证项目启动**

Run: `npm install && npm run dev`
Expected: 运行在 http://localhost:3000

- [ ] **Step 9: Commit**

```bash
git init
git add package.json next.config.js tsconfig.json tailwind.config.ts postcss.config.js app/globals.css app/layout.tsx
git commit -m "feat: init Next.js project with Tailwind"
```

---

### 任务 2: 创建 Header 组件

**Files:**
- Create: `components/Header.tsx`

- [ ] **Step 1: 创建 Header 组件**

```tsx
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-accent">
          codeskills
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-text-secondary hover:text-text-primary transition">
            首页
          </Link>
          <Link href="/discover" className="text-text-secondary hover:text-text-primary transition">
            发现
          </Link>
          <Link href="/about" className="text-text-secondary hover:text-text-primary transition">
            关于
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add Header component"
```

---

### 任务 3: 创建数据模型和示例数据

**Files:**
- Create: `lib/skills.ts`
- Create: `data/skills.json`

- [ ] **Step 1: 创建 lib/skills.ts**

```ts
import fs from 'fs'
import path from 'path'

export interface Skill {
  id: string
  slug: string
  title: string
  description: string
  content: string
  tags: string[]
  source: 'github' | 'original'
  sourceUrl?: string
  createdAt: string
}

const dataPath = path.join(process.cwd(), 'data', 'skills.json')

export function getAllSkills(): Skill[] {
  const fileContents = fs.readFileSync(dataPath, 'utf8')
  return JSON.parse(fileContents)
}

export function getSkillBySlug(slug: string): Skill | undefined {
  const skills = getAllSkills()
  return skills.find((skill) => skill.slug === slug)
}

export function searchSkills(query: string, tag?: string): Skill[] {
  let skills = getAllSkills()

  if (tag) {
    skills = skills.filter((skill) => skill.tags.includes(tag))
  }

  if (query) {
    const lowerQuery = query.toLowerCase()
    skills = skills.filter(
      (skill) =>
        skill.title.toLowerCase().includes(lowerQuery) ||
        skill.description.toLowerCase().includes(lowerQuery)
    )
  }

  return skills
}

export function getAllTags(): { language: string[]; category: string[] } {
  const skills = getAllSkills()
  const languages = new Set<string>()
  const categories = new Set<string>()

  const LANGUAGE_TAGS = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'React', 'Vue']
  const CATEGORY_TAGS = ['前端', '后端', 'DevOps', 'AI', '工具', '数据库']

  skills.forEach((skill) => {
    skill.tags.forEach((tag) => {
      if (LANGUAGE_TAGS.includes(tag)) languages.add(tag)
      if (CATEGORY_TAGS.includes(tag)) categories.add(tag)
    })
  })

  return {
    language: Array.from(languages).sort(),
    category: Array.from(categories).sort(),
  }
}
```

- [ ] **Step 2: 创建 data/skills.json 示例数据**

```json
[
  {
    "id": "1",
    "slug": "react-useeffect-cleanup",
    "title": "React useEffect 正确清理副作用",
    "description": "避免 useEffect 内存泄漏和不必要的重复请求",
    "content": "useEffect 的清理函数非常重要，它能确保组件卸载时清理副作用，避免内存泄漏。\n\n```tsx\nuseEffect(() => {\n  const controller = new AbortController();\n  \n  fetch('/api/data', { signal: controller.signal })\n    .then(res => res.json())\n    .then(data => setData(data));\n\n  return () => controller.abort();\n}, []);\n```",
    "tags": ["React", "JavaScript", "前端"],
    "source": "original",
    "createdAt": "2026-03-23"
  },
  {
    "id": "2",
    "slug": "typescript utility-types",
    "title": "TypeScript 内置工具类型",
    "description": "Partial、Required、Pick、Omit 等常用工具类型详解",
    "content": "TypeScript 提供了一系列内置工具类型，能帮我们快速转换类型。\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// 可选类型\ntype PartialUser = Partial<User>;\n\n// 选取部分属性\ntype UserPreview = Pick<User, 'id' | 'name'>;\n\n// 排除部分属性\ntype UserWithoutEmail = Omit<User, 'email'>;\n```",
    "tags": ["TypeScript", "前端"],
    "source": "original",
    "createdAt": "2026-03-22"
  },
  {
    "id": "3",
    "slug": "github-cli-tool",
    "title": "gh CLI - GitHub 命令行工具",
    "description": "告别网页，直接在终端管理 GitHub",
    "content": "gh 是 GitHub 官方命令行工具，可以完成大部分 GitHub 网页操作。\n\n```bash\n# 安装\nbrew install gh\n\n# 登录\ngh auth login\n\n# 创建 PR\ngh pr create --title \"feat: new feature\" --body \"description\"\n\n# 查看 PR 状态\ngh pr status\n```",
    "tags": ["工具", "GitHub"],
    "source": "github",
    "sourceUrl": "https://github.com/cli/cli",
    "createdAt": "2026-03-21"
  },
  {
    "id": "4",
    "slug": "python-fastapi-crud",
    "title": "FastAPI 快速 CRUD 教程",
    "description": "使用 FastAPI 和 SQLAlchemy 构建 RESTful API",
    "content": "FastAPI 是一个现代、快速的 Python Web 框架。\n\n```python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    description: str | None = None\n\nitems = {}\n\n@app.post(\"/items/\")\nasync def create_item(item: Item):\n    items[item.name] = item\n    return item\n```",
    "tags": ["Python", "后端", "API"],
    "source": "original",
    "createdAt": "2026-03-20"
  },
  {
    "id": "5",
    "slug": "docker-debug-container",
    "title": "Docker 容器调试技巧",
    "description": "进入容器、检查日志、排查网络问题",
    "content": "容器化应用出问题怎么办？这些命令帮你快速定位。\n\n```bash\n# 进入运行中的容器\ndocker exec -it <container_id> /bin/bash\n\n# 查看容器日志\ndocker logs -f <container_id>\n\n# 检查容器网络\ndocker network inspect <network_name>\n\n# 查看容器资源使用\ndocker stats\n```",
    "tags": ["Docker", "DevOps", "工具"],
    "source": "original",
    "createdAt": "2026-03-19"
  },
  {
    "id": "6",
    "slug": "git-interactive-rebase",
    "title": "Git 交互式 rebase 整理提交",
    "description": "合并commit、修改message、删除冗余提交",
    "content": "git rebase -i 是整理提交历史的利器。\n\n```bash\n# 整理最近3个提交\ngit rebase -i HEAD~3\n\n# 交互式界面命令：\n# pick - 保留提交\n# squash - 合并到上一个提交\n# reword - 修改提交信息\n# drop - 删除提交\n```",
    "tags": ["Git", "工具"],
    "source": "original",
    "createdAt": "2026-03-18"
  }
]
```

- [ ] **Step 3: Commit**

```bash
git add lib/skills.ts data/skills.json
git commit -m "feat: add data model and sample skills"
```

---

### 任务 4: 创建 SkillCard 组件

**Files:**
- Create: `components/SkillCard.tsx`

- [ ] **Step 1: 创建 SkillCard 组件**

```tsx
import Link from 'next/link'
import { Skill } from '@/lib/skills'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link href={`/skill/${skill.slug}`}>
      <article className="bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5">
        <div className="flex flex-wrap gap-2 mb-3">
          {skill.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded bg-accent/10 text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-text-primary hover:text-accent transition">
          {skill.title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {skill.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
          <span>{skill.source === 'github' ? 'GitHub' : '原创'}</span>
          <span>{skill.createdAt}</span>
        </div>
      </article>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SkillCard.tsx
git commit -m "feat: add SkillCard component"
```

---

### 任务 5: 创建 SearchBar 和 TagFilter 组件

**Files:**
- Create: `components/SearchBar.tsx`
- Create: `components/TagFilter.tsx`

- [ ] **Step 1: 创建 SearchBar.tsx**

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/discover?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索 skills..."
        className="w-full px-4 py-3 bg-card border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition"
      />
    </form>
  )
}
```

- [ ] **Step 2: 创建 TagFilter.tsx**

```tsx
'use client'

import { useRouter } from 'next/navigation'

interface TagFilterProps {
  tags: string[]
  selectedTag?: string
}

export default function TagFilter({ tags, selectedTag }: TagFilterProps) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => router.push('/discover')}
        className={`px-3 py-1.5 rounded-full text-sm transition ${
          !selectedTag
            ? 'bg-accent text-white'
            : 'bg-card border border-border text-text-secondary hover:border-accent/50'
        }`}
      >
        全部
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => router.push(`/discover?tag=${encodeURIComponent(tag)}`)}
          className={`px-3 py-1.5 rounded-full text-sm transition ${
            selectedTag === tag
              ? 'bg-accent text-white'
              : 'bg-card border border-border text-text-secondary hover:border-accent/50'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/SearchBar.tsx components/TagFilter.tsx
git commit -m "feat: add SearchBar and TagFilter components"
```

---

### 任务 6: 创建首页

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: 创建首页 app/page.tsx**

```tsx
import Link from 'next/link'
import { getAllSkills, getAllTags } from '@/lib/skills'
import SkillCard from '@/components/SkillCard'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  const skills = getAllSkills()
  const tags = getAllTags()
  const featuredSkills = skills.slice(0, 6)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          发现编程<span className="text-accent">超能力</span>
        </h1>
        <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
          收集优质编程技能、工具、代码模式，帮助你提升开发效率
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Quick Tags */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">快速筛选</h2>
        <div className="flex flex-wrap gap-2">
          {[...tags.language.slice(0, 4), ...tags.category.slice(0, 3)].map((tag) => (
            <Link
              key={tag}
              href={`/discover?tag=${encodeURIComponent(tag)}`}
              className="px-4 py-2 bg-card border border-border rounded-full text-sm text-text-secondary hover:border-accent/50 hover:text-accent transition"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Skills */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">精选 Skills</h2>
          <Link href="/discover" className="text-accent hover:underline text-sm">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: 运行验证**

Run: `npm run dev`
Expected: 首页显示 Hero、搜索框、标签、精选 skills

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add home page with hero and featured skills"
```

---

### 任务 7: 创建发现页

**Files:**
- Create: `app/discover/page.tsx`

- [ ] **Step 1: 创建发现页 app/discover/page.tsx**

```tsx
import { searchSkills, getAllTags } from '@/lib/skills'
import SkillCard from '@/components/SkillCard'
import TagFilter from '@/components/TagFilter'
import SearchBar from '@/components/SearchBar'

interface DiscoverPageProps {
  searchParams: { q?: string; tag?: string }
}

export function generateMetadata({ searchParams }: DiscoverPageProps) {
  const query = searchParams.q || ''
  const tag = searchParams.tag || ''
  return {
    title: query || tag ? `搜索: ${query || tag}` : '发现',
  }
}

export default function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const query = searchParams.q || ''
  const tag = searchParams.tag || ''
  const skills = searchSkills(query, tag)
  const tags = getAllTags()
  const allTags = [...tags.language, ...tags.category]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">发现 Skills</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="mb-8">
        <TagFilter tags={allTags} selectedTag={tag} />
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-lg">没有找到匹配的 Skills</p>
          <p className="text-sm mt-2">试试其他关键词或标签</p>
        </div>
      ) : (
        <>
          <p className="text-text-secondary mb-4">
            共找到 {skills.length} 个 Skills
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 运行验证并提交**

Run: `npm run dev`，访问 http://localhost:3000/discover
Expected: 显示搜索框、标签筛选、技能列表

```bash
git add app/discover/page.tsx
git commit -m "feat: add discover page with search and filter"
```

---

### 任务 8: 创建 Skill 详情页

**Files:**
- Create: `app/skill/[slug]/page.tsx`

- [ ] **Step 1: 创建详情页 app/skill/[slug]/page.tsx**

```tsx
import { getSkillBySlug, getAllSkills } from '@/lib/skills'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface SkillPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  const skills = getAllSkills()
  return skills.map((skill) => ({ slug: skill.slug }))
}

export function generateMetadata({ params }: SkillPageProps) {
  const skill = getSkillBySlug(params.slug)
  if (!skill) return { title: 'Not Found' }
  return {
    title: `${skill.title} - codeskills`,
    description: skill.description,
  }
}

export default function SkillPage({ params }: SkillPageProps) {
  const skill = getSkillBySlug(params.slug)

  if (!skill) {
    notFound()
  }

  const allSkills = getAllSkills()
  const relatedSkills = allSkills
    .filter((s) => s.id !== skill.id && s.tags.some((t) => skill.tags.includes(t)))
    .slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/discover" className="text-text-secondary hover:text-accent text-sm mb-6 inline-block">
        ← 返回发现
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {skill.tags.map((tag) => (
              <Link
                key={tag}
                href={`/discover?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20 transition"
              >
                {tag}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>
          <p className="text-xl text-text-secondary mb-4">{skill.description}</p>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className={skill.source === 'github' ? 'text-accent' : 'text-success'}>
              {skill.source === 'github' ? '来自 GitHub' : '原创'}
            </span>
            {skill.sourceUrl && (
              <a
                href={skill.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                查看原文 →
              </a>
            )}
            <span>{skill.createdAt}</span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          {skill.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('```')) {
              const match = paragraph.match(/```(\w+)?\n([\s\S]*?)```/)
              if (match) {
                return (
                  <pre key={index} className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-text-primary">{match[2]}</code>
                  </pre>
                )
              }
            }
            return (
              <p key={index} className="text-text-primary mb-4 leading-relaxed">
                {paragraph}
              </p>
            )
          })}
        </div>
      </article>

      {relatedSkills.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-6">相关 Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedSkills.map((s) => (
              <Link key={s.id} href={`/skill/${s.slug}`} className="block">
                <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition">
                  <h3 className="font-medium text-text-primary hover:text-accent">{s.title}</h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 运行验证**

Run: `npm run dev`，访问 http://localhost:3000/skill/react-useeffect-cleanup
Expected: 显示技能详情页，包含标题、标签、内容、相关推荐

- [ ] **Step 3: Commit**

```bash
git add app/skill/[slug]/page.tsx
git commit -m "feat: add skill detail page"
```

---

### 任务 9: 创建关于页

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: 创建关于页**

```tsx
export const metadata = {
  title: '关于 - codeskills',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">关于 codeskills</h1>

      <div className="prose prose-invert max-w-none">
        <p className="text-text-secondary mb-6">
          codeskills 是一个专注于分享编程技能（Skills）的网站。我们收集和整理优质的编程资源，
          帮助开发者发现和学习高质量的工具、代码模式和最佳实践。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">内容来源</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>GitHub Trending 优质项目</li>
          <li>Awesome Lists 精选列表</li>
          <li>原创使用心得和经验总结</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">使用说明</h2>
        <p className="text-text-secondary mb-4">
          网站内容完全免费，你可以：
        </p>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>浏览和搜索感兴趣的 Skills</li>
          <li>通过标签筛选特定语言或分类的内容</li>
          <li>点击查看详细内容和使用示例</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">联系我们</h2>
        <p className="text-text-secondary">
          如果你有优质的编程技能想分享，欢迎联系我们。
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add about page"
```

---

### 任务 10: 部署到 Vercel

**Files:**
- Create: `vercel.json` (可选)

- [ ] **Step 1: 确保项目可以构建**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 2: 部署到 Vercel**

1. 在 vercel.com 创建账号
2. 点击 "New Project"
3. 导入 GitHub 仓库（或直接拖拽代码）
4. 点击 "Deploy"

- [ ] **Step 3: 验证部署**

访问 https://codeskills.vercel.app 确认网站正常运行

- [ ] **Step 4: Commit**

```bash
git add vercel.json 2>/dev/null || true
git commit -m "chore: prepare for Vercel deployment"
```

---

## 验证清单

部署完成后，验证以下功能：

- [ ] 首页正确显示 Hero、搜索框、标签、精选 Skills
- [ ] 发现页搜索功能正常
- [ ] 发现页标签筛选功能正常
- [ ] Skill 详情页正确显示内容和相关推荐
- [ ] 关于页正常显示
- [ ] 移动端适配正常
