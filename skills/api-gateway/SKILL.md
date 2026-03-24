---
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

```bash
# 查看可用连接
api-gateway list

# 连接服务
api-gateway connect github

# 查看连接状态
api-gateway status

# 断开连接
api-gateway disconnect github
```

## API 调用

```bash
# 调用 GitHub API
api-gateway call github --method GET --path "/user/repos"

# 调用 Notion
api-gateway call notion --method POST --path "/pages" --body '{"parent": {...}}'

# 调用 Slack
api-gateway call slack --method POST --path "/chat.postMessage" --body '{"channel": "#general", "text": "Hello"}'
```

## OAuth 流程

```bash
# 启动 OAuth 授权
api-gateway auth github --scopes "repo,read:user"

# 查看当前令牌
api-gateway token github

# 刷新令牌
api-gateway token refresh github
```

## 错误处理

```bash
# 查看错误日志
api-gateway logs --service github --level error

# 重试失败请求
api-gateway retry --id request_id

# 清理过期令牌
api-gateway cleanup
```

## 最佳实践

1. 最小权限 - 只申请需要的 scopes
2. 定期刷新令牌
3. 记录 API 调用日志
4. 设置速率限制
5. 敏感操作添加确认
