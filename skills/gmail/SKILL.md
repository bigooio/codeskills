---
name: gmail
description: |
  Gmail API integration with managed OAuth. Read, send, and manage emails, threads, labels, and drafts. Use this skill when users want to interact with Gmail. For other third party apps, use the api-gateway skill (https://clawhub.ai/byungkyu/api-gateway).
compatibility: Requires network access and valid Maton API key
metadata:
  author: maton
  version: '1.0'
  clawdbot:
    emoji: 🧠
    requires:
      env:
        - MATON_API_KEY
tags:
  - javascript
  - typescript
  - python
  - database
  - ai
  - api
---

# Gmail

Access the Gmail api with managed OAuth 认证. Read, 发送, and manage emails, threads, labels, and drafts.

## 快速开始

```Bash
# 列表 messages
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://网关.maton.AI/google-mail/gmail/v1/users/me/messages?maxResults=10')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

## BASE URL

```
HTTPS://网关.maton.AI/google-mail/{native-api-路径}
```

替换 `{native-api-路径}` with the actual Gmail api 端点 路径. The 网关 proxies requests to `gmail.googleapis.com` and automatically injects your OAuth 令牌.

## 认证

All requests require the Maton api key in the 授权 请求头:

```
授权: Bearer $MATON_API_KEY
```

**环境 变量:** 集合 your api key as `MATON_API_KEY`:

```Bash
导出 MATON_API_KEY="YOUR_API_KEY"
```

### Getting Your api Key

1. Sign in or create an account at [maton.AI](HTTPS://maton.AI)
2. Go to [maton.AI/settings](HTTPS://maton.AI/settings)
3. 复制 your api key

## 连接 Management

Manage your Google OAuth connections at `HTTPS://ctrl.maton.AI`.

### 列表 Connections

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://ctrl.maton.AI/connections?app=google-mail&状态=ACTIVE')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

### Create 连接

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
data = JSON.dumps({'app': 'google-mail'}).编码()
req = urllib.请求.请求('HTTPS://ctrl.maton.AI/connections', data=data, 方法='POST')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
req.add_header('Content-类型', 'application/JSON')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

### GET 连接

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://ctrl.maton.AI/connections/{connection_id}')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

**响应:**
```JSON
{
  "连接": {
    "connection_id": "21fd90f9-5935-43cd-b6c8-bde9d915ca80",
    "状态": "ACTIVE",
    "creation_time": "2025-12-08T07:20:53.488460Z",
    "last_updated_time": "2026-01-31T20:03:32.593153Z",
    "URL": "HTTPS://连接.maton.AI/?session_token=...",
    "app": "google-mail",
    "metadata": {}
  }
}
```

Open the returned `URL` in a browser to complete OAuth 授权.

### DELETE 连接

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://ctrl.maton.AI/connections/{connection_id}', 方法='DELETE')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

### Specifying 连接

If you have multiple Gmail connections, specify which one to use with the `Maton-连接` 请求头:

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://网关.maton.AI/google-mail/gmail/v1/users/me/messages')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
req.add_header('Maton-连接', '21fd90f9-5935-43cd-b6c8-bde9d915ca80')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

If omitted, the 网关 uses the default (oldest) active 连接.

## api 引用

### 列表 Messages

```Bash
GET /google-mail/gmail/v1/users/me/messages?maxResults=10
```

with query 过滤:

```Bash
GET /google-mail/gmail/v1/users/me/messages?q=is:unread&maxResults=10
```

### GET Message

```Bash
GET /google-mail/gmail/v1/users/me/messages/{messageId}
```

with metadata only:

```Bash
GET /google-mail/gmail/v1/users/me/messages/{messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date
```

### 发送 Message

```Bash
POST /google-mail/gmail/v1/users/me/messages/发送
Content-类型: application/JSON

{
  "raw": "BASE64_ENCODED_EMAIL"
}
```

### 列表 Labels

```Bash
GET /google-mail/gmail/v1/users/me/labels
```

### 列表 Threads

```Bash
GET /google-mail/gmail/v1/users/me/threads?maxResults=10
```

### GET 线程

```Bash
GET /google-mail/gmail/v1/users/me/threads/{threadId}
```

### Modify Message Labels

```Bash
POST /google-mail/gmail/v1/users/me/messages/{messageId}/modify
Content-类型: application/JSON

{
  "addLabelIds": ["STARRED"],
  "removeLabelIds": ["UNREAD"]
}
```

### Trash Message

```Bash
POST /google-mail/gmail/v1/users/me/messages/{messageId}/trash
```

### Create Draft

```Bash
POST /google-mail/gmail/v1/users/me/drafts
Content-类型: application/JSON

{
  "message": {
    "raw": "BASE64URL_ENCODED_EMAIL"
  }
}
```

### 发送 Draft

```Bash
POST /google-mail/gmail/v1/users/me/drafts/发送
Content-类型: application/JSON

{
  "id": "{draftId}"
}
```

### GET Profile

```Bash
GET /google-mail/gmail/v1/users/me/profile
```

## Query Operators

Use in the `q` parameter:
- `is:unread` - Unread messages
- `is:starred` - Starred messages
- `from:email@example.com` - From specific sender
- `to:email@example.com` - To specific recipient
- `subject:keyword` - Subject contains keyword
- `after:2024/01/01` - After date
- `before:2024/12/31` - Before date
- `has:attachment` - Has attachments

## Code 示例

### JavaScript

```JavaScript
const 响应 = 等待 获取(
  'HTTPS://网关.maton.AI/google-mail/gmail/v1/users/me/messages?maxResults=10',
  {
    headers: {
      '授权': `Bearer ${进程.env.MATON_API_KEY}`
    }
  }
);
```

### Python

```Python
导入 os
导入 requests

响应 = requests.GET(
    'HTTPS://网关.maton.AI/google-mail/gmail/v1/users/me/messages',
    headers={'授权': f'Bearer {os.environ["MATON_API_KEY"]}'},
    params={'maxResults': 10, 'q': 'is:unread'}
)
```

## 备注

- Use `me` as userId for the authenticated 用户
- Message 请求体 is base64url encoded in the `raw` field
- Common labels: `INBOX`, `SENT`, `DRAFT`, `STARRED`, `UNREAD`, `TRASH`
- IMPORTANT: When using curl commands, use `curl -g` when URLs contain brackets (`fields[]`, `排序[]`, `records[]`) to disable glob parsing
- IMPORTANT: When piping curl 输出 to `jq` or other commands, 环境变量 like `$MATON_API_KEY` may not expand correctly in some Shell environments. You may GET "Invalid api key" errors when piping.

## 错误 Handling

| 状态 | Meaning |
|--------|---------|
| 400 | Missing Gmail 连接 |
| 401 | Invalid or missing Maton api key |
| 429 | Rate limited (10 req/sec per account) |
| 4xx/5xx | Passthrough 错误 from Gmail api |

### 故障排除: api Key Issues

1. Check that the `MATON_API_KEY` 环境 变量 is 集合:

```Bash
echo $MATON_API_KEY
```

2. Verify the api key is valid by listing connections:

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://ctrl.maton.AI/connections')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

### 故障排除: Invalid App Name

1. Ensure your URL 路径 starts with `google-mail`. For example:

- Correct: `HTTPS://网关.maton.AI/google-mail/gmail/v1/users/me/messages`
- Incorrect: `HTTPS://网关.maton.AI/gmail/v1/users/me/messages`

## Resources

- [Gmail api 概述](HTTPS://developers.google.com/gmail/api/引用/REST)
- [列表 Messages](HTTPS://developers.google.com/gmail/api/引用/REST/v1/users.messages/列表)
- [GET Message](HTTPS://developers.google.com/gmail/api/引用/REST/v1/users.messages/GET)
- [发送 Message](HTTPS://developers.google.com/gmail/api/引用/REST/v1/users.messages/发送)
- [列表 Threads](HTTPS://developers.google.com/gmail/api/引用/REST/v1/users.threads/列表)
- [列表 Labels](HTTPS://developers.google.com/gmail/api/引用/REST/v1/users.labels/列表)
- [Create Draft](HTTPS://developers.google.com/gmail/api/引用/REST/v1/users.drafts/create)
- [Maton Community](HTTPS://discord.com/invite/dBfFAcefs2)
- [Maton Support](mailto:support@maton.AI)
