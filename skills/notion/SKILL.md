---
name: notion
description: Notion API，用于创建和管理页面、数据库及区块。支持笔记整理、知识库构建、任务管理等工作流。
compatibility: 需要 Notion API 密钥
tags:
  - javascript
  - database
  - api
  - backend
  - bash
---

# Notion 集成

通过 api 操作 Notion 页面、数据库和区块。

## 基础配置

```Bash
# 设置 api 密钥
notion auth --令牌 ntn_xxxxx

# 验证连接
notion 状态
```

## 页面操作

```Bash
# 创建页面
notion page create --parent "database_id" --title "新页面"

# 获取页面
notion page GET "page_id"

# 更新页面
notion page 更新 "page_id" --title "新标题" --content "内容"

# 删除页面
notion page DELETE "page_id"
```

## 数据库操作

```Bash
# 创建数据库
notion 数据库 create --parent "page_id" --title "我的数据库"

# 添加属性
notion 数据库 add-属性 "database_id" --name "状态" --类型 "select"

# 插入记录
notion 数据库 insert "database_id" --properties '{"标题": "任务1", "状态": "进行中"}'

# 查询记录
notion 数据库 query "database_id" --过滤 '{"属性": "状态", "select": {"equals": "进行中"}}'
```

## 区块操作

```Bash
# 添加文本区块
notion block append "page_id" --text "Hello World"

# 添加待办事项
notion block append "page_id" --todo "完成任务" --checked false

# 添加代码块
notion block append "page_id" --code "console.日志('hi')" --language "JavaScript"

# 嵌套区块
notion block append "parent_id" --child "child_block_id"
```

## 搜索

```Bash
# 搜索页面
notion 搜索 "关键词"

# 限定数据库搜索
notion 搜索 "关键词" --类型 数据库
```

## 最佳实践

1. 使用数据库组织结构化数据
2. 页面用于非结构化内容
3. 利用模板快速创建常见页面
4. 定期备份重要数据
