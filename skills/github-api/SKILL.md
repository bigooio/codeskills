---
name: github
description: |
  GitHub API integration with managed OAuth. Access repositories, issues, pull requests, commits, branches, and users.
  Use this skill when users want to interact with GitHub repositories, manage issues and PRs, search code, or automate workflows.
  For other third party apps, use the api-gateway skill (https://clawhub.ai/byungkyu/api-gateway).
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
  - react
  - git
  - database
---

# GitHub

Access the GitHub REST api with managed OAuth 认证. Manage repositories, issues, 拉取 requests, 提交, 分支, users, and more.

## 快速开始

```Bash
# GET authenticated 用户
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://网关.maton.AI/github/用户')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

## BASE URL

```
HTTPS://网关.maton.AI/github/{native-api-路径}
```

替换 `{native-api-路径}` with the actual GitHub api 端点 路径. The 网关 proxies requests to `api.github.com` and automatically injects your OAuth 令牌.

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

Manage your GitHub OAuth connections at `HTTPS://ctrl.maton.AI`.

### 列表 Connections

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://ctrl.maton.AI/connections?app=github&状态=ACTIVE')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

### Create 连接

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
data = JSON.dumps({'app': 'github'}).编码()
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
    "connection_id": "83e7c665-60f6-4a64-816c-5e287ea8982f",
    "状态": "ACTIVE",
    "creation_time": "2026-02-06T03:00:43.860014Z",
    "last_updated_time": "2026-02-06T03:01:06.027323Z",
    "URL": "HTTPS://连接.maton.AI/?session_token=...",
    "app": "github",
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

If you have multiple GitHub connections, specify which one to use with the `Maton-连接` 请求头:

```Bash
Python <<'EOF'
导入 urllib.请求, os, JSON
req = urllib.请求.请求('HTTPS://网关.maton.AI/github/用户')
req.add_header('授权', f'Bearer {os.environ["MATON_API_KEY"]}')
req.add_header('Maton-连接', '83e7c665-60f6-4a64-816c-5e287ea8982f')
print(JSON.dumps(JSON.加载(urllib.请求.urlopen(req)), indent=2))
EOF
```

If omitted, the 网关 uses the default (oldest) active 连接.

## api 引用

### Users

#### GET Authenticated 用户

```Bash
GET /github/用户
```

#### GET 用户 by Username

```Bash
GET /github/users/{username}
```

#### 列表 Users

```Bash
GET /github/users?since={user_id}&per_page=30
```

### Repositories

#### 列表 用户 Repositories

```Bash
GET /github/用户/repos?per_page=30&排序=updated
```

Query 参数: `类型` (all, owner, public, private, member), `排序` (created, updated, pushed, full_name), `direction` (asc, desc), `per_page`, `page`

#### 列表 Organization Repositories

```Bash
GET /github/orgs/{org}/repos?per_page=30
```

#### GET 仓库

```Bash
GET /github/repos/{owner}/{repo}
```

#### Create 仓库 (用户)

```Bash
POST /github/用户/repos
Content-类型: application/JSON

{
  "name": "my-new-repo",
  "说明": "A new 仓库",
  "private": true,
  "auto_init": true
}
```

#### Create 仓库 (Organization)

```Bash
POST /github/orgs/{org}/repos
Content-类型: application/JSON

{
  "name": "my-new-repo",
  "说明": "A new 仓库",
  "private": true
}
```

#### 更新 仓库

```Bash
补丁 /github/repos/{owner}/{repo}
Content-类型: application/JSON

{
  "说明": "Updated 说明",
  "has_issues": true,
  "has_wiki": false
}
```

#### DELETE 仓库

```Bash
DELETE /github/repos/{owner}/{repo}
```

### 仓库 Contents

#### 列表 Contents

```Bash
GET /github/repos/{owner}/{repo}/contents/{路径}
```

#### GET 文件 Contents

```Bash
GET /github/repos/{owner}/{repo}/contents/{路径}?ref={分支}
```

#### Create or 更新 文件

```Bash
PUT /github/repos/{owner}/{repo}/contents/{路径}
Content-类型: application/JSON

{
  "message": "Create new 文件",
  "content": "SGVsbG8gV29ybGQh",
  "分支": "主分支"
}
```

Note: `content` must be Base64 encoded.

#### DELETE 文件

```Bash
DELETE /github/repos/{owner}/{repo}/contents/{路径}
Content-类型: application/JSON

{
  "message": "DELETE 文件",
  "sha": "{file_sha}",
  "分支": "主分支"
}
```

### 分支

#### 列表 分支

```Bash
GET /github/repos/{owner}/{repo}/分支?per_page=30
```

#### GET 分支

```Bash
GET /github/repos/{owner}/{repo}/分支/{分支}
```

#### Rename 分支

```Bash
POST /github/repos/{owner}/{repo}/分支/{分支}/rename
Content-类型: application/JSON

{
  "new_name": "new-分支-name"
}
```

#### 合并 分支

```Bash
POST /github/repos/{owner}/{repo}/merges
Content-类型: application/JSON

{
  "BASE": "主分支",
  "HEAD": "feature-分支",
  "commit_message": "合并 功能分支"
}
```

### 提交

#### 列表 提交

```Bash
GET /github/repos/{owner}/{repo}/提交?per_page=30
```

Query 参数: `sha` (分支 name or 提交 SHA), `路径` (文件 路径), `author`, `committer`, `since`, `until`, `per_page`, `page`

#### GET 提交

```Bash
GET /github/repos/{owner}/{repo}/提交/{ref}
```

#### Compare Two 提交

```Bash
GET /github/repos/{owner}/{repo}/compare/{BASE}...{HEAD}
```

### Issues

#### 列表 仓库 Issues

```Bash
GET /github/repos/{owner}/{repo}/issues?状态=open&per_page=30
```

Query 参数: `状态` (open, closed, all), `labels`, `assignee`, `creator`, `mentioned`, `排序`, `direction`, `since`, `per_page`, `page`

#### GET Issue

```Bash
GET /github/repos/{owner}/{repo}/issues/{issue_number}
```

#### Create Issue

```Bash
POST /github/repos/{owner}/{repo}/issues
Content-类型: application/JSON

{
  "title": "Found a bug",
  "请求体": "Bug 说明 here",
  "labels": ["bug"],
  "assignees": ["username"]
}
```

#### 更新 Issue

```Bash
补丁 /github/repos/{owner}/{repo}/issues/{issue_number}
Content-类型: application/JSON

{
  "状态": "closed",
  "state_reason": "completed"
}
```

#### 锁 Issue

```Bash
PUT /github/repos/{owner}/{repo}/issues/{issue_number}/锁
Content-类型: application/JSON

{
  "lock_reason": "resolved"
}
```

#### Unlock Issue

```Bash
DELETE /github/repos/{owner}/{repo}/issues/{issue_number}/锁
```

### Issue Comments

#### 列表 Issue Comments

```Bash
GET /github/repos/{owner}/{repo}/issues/{issue_number}/comments?per_page=30
```

#### Create Issue Comment

```Bash
POST /github/repos/{owner}/{repo}/issues/{issue_number}/comments
Content-类型: application/JSON

{
  "请求体": "This is a comment"
}
```

#### 更新 Issue Comment

```Bash
补丁 /github/repos/{owner}/{repo}/issues/comments/{comment_id}
Content-类型: application/JSON

{
  "请求体": "Updated comment"
}
```

#### DELETE Issue Comment

```Bash
DELETE /github/repos/{owner}/{repo}/issues/comments/{comment_id}
```

### Labels

#### 列表 Labels

```Bash
GET /github/repos/{owner}/{repo}/labels?per_page=30
```

#### Create Label

```Bash
POST /github/repos/{owner}/{repo}/labels
Content-类型: application/JSON

{
  "name": "priority:high",
  "color": "ff0000",
  "说明": "High priority issues"
}
```

### Milestones

#### 列表 Milestones

```Bash
GET /github/repos/{owner}/{repo}/milestones?状态=open&per_page=30
```

#### Create Milestone

```Bash
POST /github/repos/{owner}/{repo}/milestones
Content-类型: application/JSON

{
  "title": "v1.0",
  "状态": "open",
  "说明": "First 发布",
  "due_on": "2026-03-01T00:00:00Z"
}
```

### 拉取 Requests

#### 列表 拉取 Requests

```Bash
GET /github/repos/{owner}/{repo}/pulls?状态=open&per_page=30
```

Query 参数: `状态` (open, closed, all), `HEAD`, `BASE`, `排序`, `direction`, `per_page`, `page`

#### GET 拉取请求

```Bash
GET /github/repos/{owner}/{repo}/pulls/{pull_number}
```

#### Create 拉取请求

```Bash
POST /github/repos/{owner}/{repo}/pulls
Content-类型: application/JSON

{
  "title": "New feature",
  "请求体": "说明 of changes",
  "HEAD": "feature-分支",
  "BASE": "主分支",
  "draft": false
}
```

#### 更新 拉取请求

```Bash
补丁 /github/repos/{owner}/{repo}/pulls/{pull_number}
Content-类型: application/JSON

{
  "title": "Updated title",
  "状态": "closed"
}
```

#### 列表 拉取请求 提交

```Bash
GET /github/repos/{owner}/{repo}/pulls/{pull_number}/提交?per_page=30
```

#### 列表 拉取请求 Files

```Bash
GET /github/repos/{owner}/{repo}/pulls/{pull_number}/files?per_page=30
```

#### Check If Merged

```Bash
GET /github/repos/{owner}/{repo}/pulls/{pull_number}/合并
```

#### 合并 拉取请求

```Bash
PUT /github/repos/{owner}/{repo}/pulls/{pull_number}/合并
Content-类型: application/JSON

{
  "commit_title": "合并 拉取请求",
  "merge_method": "压缩"
}
```

合并 methods: `合并`, `压缩`, `变基`

### 拉取请求 Reviews

#### 列表 Reviews

```Bash
GET /github/repos/{owner}/{repo}/pulls/{pull_number}/reviews?per_page=30
```

#### Create Review

```Bash
POST /github/repos/{owner}/{repo}/pulls/{pull_number}/reviews
Content-类型: application/JSON

{
  "请求体": "Looks good!",
  "事件": "APPROVE"
}
```

Events: `APPROVE`, `REQUEST_CHANGES`, `COMMENT`

### 搜索

#### 搜索 Repositories

```Bash
GET /github/搜索/repositories?q={query}&per_page=30
```

Example queries:
- `tetris+language:Python` - Repositories with "tetris" in Python
- `React+stars:>10000` - Repositories with "React" and 10k+ stars

#### 搜索 Issues

```Bash
GET /github/搜索/issues?q={query}&per_page=30
```

Example queries:
- `bug+is:open+is:issue` - Open issues containing "bug"
- `author:username+is:pr` - 拉取 requests by author

#### 搜索 Code

```Bash
GET /github/搜索/code?q={query}&per_page=30
```

Example queries:
- `addClass+repo:facebook/React` - 搜索 for "addClass" in a specific repo
- `函数+扩展:js` - JavaScript functions

Note: Code 搜索 may 超时 on broad queries.

#### 搜索 Users

```Bash
GET /github/搜索/users?q={query}&per_page=30
```

### Organizations

#### 列表 用户 Organizations

```Bash
GET /github/用户/orgs?per_page=30
```

Note: Requires `read:org` scope.

#### GET Organization

```Bash
GET /github/orgs/{org}
```

#### 列表 Organization Members

```Bash
GET /github/orgs/{org}/members?per_page=30
```

### Rate 限制

#### GET Rate 限制

```Bash
GET /github/rate_limit
```

响应:
```JSON
{
  "rate": {
    "限制": 5000,
    "remaining": 4979,
    "重置": 1707200000
  },
  "resources": {
    "core": { "限制": 5000, "remaining": 4979 },
    "搜索": { "限制": 30, "remaining": 28 }
  }
}
```

## 分页

GitHub uses page-based and 链接-based 分页:

```Bash
GET /github/repos/{owner}/{repo}/issues?per_page=30&page=2
```

响应 headers include 分页 links:
- `链接: <URL>; rel="next", <URL>; rel="last"`

Common 分页 参数:
- `per_page`: Results per page (max 100, default 30)
- `page`: Page number (default 1)

Some endpoints use 游标-based 分页 with `since` parameter (e.g., listing users).

## Code 示例

### JavaScript

```JavaScript
const 响应 = 等待 获取(
  'HTTPS://网关.maton.AI/github/repos/owner/repo/issues?状态=open&per_page=10',
  {
    headers: {
      '授权': `Bearer ${进程.env.MATON_API_KEY}`
    }
  }
);
const issues = 等待 响应.JSON();
```

### Python

```Python
导入 os
导入 requests

响应 = requests.GET(
    'HTTPS://网关.maton.AI/github/repos/owner/repo/issues',
    headers={'授权': f'Bearer {os.environ["MATON_API_KEY"]}'},
    params={'状态': 'open', 'per_page': 10}
)
issues = 响应.JSON()
```

## 备注

- 仓库 names are case-insensitive but the api preserves case
- Issue numbers and PR numbers share the same sequence per 仓库
- Content must be Base64 encoded when creating/updating files
- Rate limits: 5000 requests/hour for authenticated users, 30 searches/minute
- 搜索 queries may 超时 on very broad patterns
- Some endpoints require specific OAuth scopes (e.g., `read:org` for organization operations). If you 接收 a scope 错误, contact Maton support at support@maton.AI with the specific operations/APIs you need and your use-case
- IMPORTANT: When using curl commands, use `curl -g` when URLs contain brackets to disable glob parsing
- IMPORTANT: When piping curl 输出 to `jq` or other commands, 环境变量 like `$MATON_API_KEY` may not expand correctly in some Shell environments

## 错误 Handling

| 状态 | Meaning |
|--------|---------|
| 400 | Missing GitHub 连接 |
| 401 | Invalid or missing Maton api key |
| 403 | Forbidden - insufficient permissions or scope |
| 404 | Resource not found |
| 408 | 请求 超时 (common for complex searches) |
| 422 | Validation failed |
| 429 | Rate limited |
| 4xx/5xx | Passthrough 错误 from GitHub api |

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

1. Ensure your URL 路径 starts with `github`. For example:

- Correct: `HTTPS://网关.maton.AI/github/用户`
- Incorrect: `HTTPS://网关.maton.AI/api.github.com/用户`

## Resources

- [GitHub REST api Documentation](HTTPS://docs.github.com/en/REST)
- [Repositories api](HTTPS://docs.github.com/en/REST/repos/repos)
- [Issues api](HTTPS://docs.github.com/en/REST/issues/issues)
- [拉取 Requests api](HTTPS://docs.github.com/en/REST/pulls/pulls)
- [搜索 api](HTTPS://docs.github.com/en/REST/搜索/搜索)
- [Rate Limits](HTTPS://docs.github.com/en/REST/概述/resources-in-the-REST-api#rate-limiting)
- [Maton Community](HTTPS://discord.com/invite/dBfFAcefs2)
- [Maton Support](mailto:support@maton.AI)
