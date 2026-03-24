---
name: api-gateway
description: 通过托管 OAuth 连接 100+ API（Google Workspace、Microsoft 365、GitHub、Notion、Slack、Airtable、HubSpot 等）。当用户想要连接各种服务时使用。
compatibility: 需要 API Gateway 服务
tags:
  - typescript
  - git
  - azure
  - ai
  - api
  - backend
---

# api 网关 - api 集成

通过统一接口连接各种第三方 api。

## 支持的服务

### Google 工作空间
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

```Bash
# 查看可用连接
api-网关 列表

# 连接服务
api-网关 连接 github

# 查看连接状态
api-网关 状态

# 断开连接
api-网关 disconnect github
```

## api 调用

```Bash
# 调用 GitHub api
api-网关 call github --方法 GET --路径 "/用户/repos"

# 调用 Notion
api-网关 call notion --方法 POST --路径 "/pages" --请求体 '{"parent": {...}}'

# 调用 Slack
api-网关 call slack --方法 POST --路径 "/chat.postMessage" --请求体 '{"通道": "#general", "text": "Hello"}'
```

## OAuth 流程

```Bash
# 启动 OAuth 授权
api-网关 auth github --scopes "repo,read:用户"

# 查看当前令牌
api-网关 令牌 github

# 刷新令牌
api-网关 令牌 refresh github
```

## 错误处理

```Bash
# 查看错误日志
api-网关 日志 --服务 github --level 错误

# 重试失败请求
api-网关 重试 --id request_id

# 清理过期令牌
api-网关 cleanup
```

## 最佳实践

1. 最小权限 - 只申请需要的 scopes
2. 定期刷新令牌
3. 记录 api 调用日志
4. 设置速率限制
5. 敏感操作添加确认
