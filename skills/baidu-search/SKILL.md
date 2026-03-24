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

```Bash
# 搜索网页
baidu "关键词"

# 限制结果数
baidu "关键词" --限制 10
```

## 搜索类型

```Bash
# 新闻搜索
baidu "关键词" --类型 news

# 图片搜索
baidu "关键词" --类型 镜像

# 视频搜索
baidu "关键词" --类型 video

# 学术搜索
baidu "关键词" --类型 scholar
```

## 高级搜索

```Bash
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

```Bash
# 只看可信来源
baidu "关键词" --verify

# 排除某些词
baidu "关键词 -推广"

# 价格范围（购物搜索）
baidu "手机" --price "2000-5000"
```

## api 调用

```Bash
# 获取搜索结果（JSON）
baidu "关键词" --JSON

# 获取详细信息
baidu "关键词" --verbose

# 搜索并保存
baidu "关键词" --输出 results.JSON
```

## 最佳实践

1. 中文查询直接使用中文关键词
2. 需要英文信息时用 Google
3. 学术内容用 scholar 搜索
4. 组合 site: 限制特定网站
