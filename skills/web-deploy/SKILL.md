---
name: web-deploy
description: Build, preview, and deploy websites, web apps, and APIs using Vercel, Railway, GitHub Pages, or local Canvas environments.
tags:
  - DevOps
  - Deploy
---
# web-部署

构建 and 部署 websites, web apps, and APIs to 生产环境.

## 本地 Preview 工作流

```Bash
# 静态 site
npx HTTP-服务器 ./dist -p 8080 -c-1

# Next.js
npm 运行 开发          # 开发环境 (热重载)
npm 运行 构建 && npm 运行 start  # 生产环境 preview

# FastAPI
uvicorn app.主分支:app --reload --端口 8000

# Vite-based
npm 运行 开发          # 开发 服务器
npm 运行 构建 && npx serve dist  # 生产环境 preview
```

## 部署 Targets

### Vercel (前端 / Next.js / 静态)

```Bash
# First time 设置
npx vercel 链接

# Preview 部署
npx vercel

# 生产环境 部署
npx vercel --prod

# 环境变量
npx vercel env add SECRET_KEY
```

**Best for:** Next.js apps, React SPAs, 静态 sites, 无服务器 functions.

**配置:** `vercel.JSON` (usually not needed for Next.js)
```JSON
{
  "buildCommand": "npm 运行 构建",
  "outputDirectory": "dist",
  "框架": "NextJS"
}
```

### Railway (后端 / APIs / Databases)

```Bash
# First time 设置
railway login
railway init

# 部署
railway up

# Add 数据库
railway add --插件 PostgreSQL

# 环境变量
railway variables 集合 SECRET_KEY=value

# View 日志
railway 日志
```

**Best for:** 后端 APIs, databases, long-running processes, Docker 容器.

### GitHub Pages (静态 Sites)

```Bash
# Using gh-pages 包
npm install -D gh-pages
# Add to 包.JSON scripts: "部署": "gh-pages -d dist"
npm 运行 构建 && npm 运行 部署
```

**Best for:** Documentation, simple 静态 sites, project pages.

### Canvas (Clawdbot 工作空间)

部署 to `~/clawd/canvas/` for 本地 serving through the clawdbot 网关.
```Bash
cp -r ./dist/* ~/clawd/canvas/my-project/
```

## Pre-部署 Checklist

- [ ] 构建 succeeds locally (`npm 运行 构建` / `Python -m 构建`)
- [ ] No TypeScript/lint errors
- [ ] Tests pass
- [ ] 环境变量 集合 on target platform
- [ ] `.env` / secrets NOT in git
- [ ] `robots.txt` and `sitemap.XML` if public site
- [ ] Favicon and meta tags 集合
- [ ] HTTPS configured (automatic on Vercel/Railway)
- [ ] 错误 pages (404, 500) configured
- [ ] Performance: 镜像 optimized, code split, no huge bundles

## 回滚

```Bash
# Vercel — redeploy previous
npx vercel 回滚

# Railway — redeploy previous
railway 回滚

# Git-based — 撤销 and 推送
git 撤销 HEAD && git 推送
```

## 域名 设置

```Bash
# Vercel
npx vercel domains add mydomain.com

# DNS: Point CNAME to cname.vercel-DNS.com
# Or A 记录 to 76.76.21.21
```
