---
name: baidu-search
description: 使用百度 AI 搜索引擎搜索网页，获取实时信息、文档资料或研究主题。适合中文网络搜索。
tags:
  - javascript
  - typescript
  - git
  - ai
  - api
  - backend
---

# 百度搜索

使用百度 AI 搜索引擎获取中文网络信息。

## 基础用法

```bash
# 搜索网页
baidu "关键词"

# 限制结果数
baidu "关键词" --limit 10
```

## 搜索类型

```bash
# 新闻搜索
baidu "关键词" --type news

# 图片搜索
baidu "关键词" --type image

# 视频搜索
baidu "关键词" --type video

# 学术搜索
baidu "关键词" --type scholar
```

## 高级搜索

```bash
# 站内搜索
baidu "关键词 site:github.com"

# 精确匹配
baidu '"精确短语"'

# 时间范围
baidu "关键词" --range "2024-01-01,2024-12-31"

# 指定地区
baidu "关键词" --region China
```

## 过滤器

```bash
# 只看可信来源
baidu "关键词" --verify

# 排除某些词
baidu "关键词 -推广"

# 价格范围（购物搜索）
baidu "手机" --price "2000-5000"
```

## API 调用

```bash
# 获取搜索结果（JSON）
baidu "关键词" --json

# 获取详细信息
baidu "关键词" --verbose

# 搜索并保存
baidu "关键词" --output results.json
```

## 最佳实践

1. 中文查询直接使用中文关键词
2. 需要英文信息时用 Google
3. 学术内容用 scholar 搜索
4. 组合 site: 限制特定网站
