---
name: appdeploy
description: Deploy web apps with backend APIs, database, file storage, AI operations, authentication, realtime, and cron jobs. Use when the user asks to deploy or publish a website or web app and wants a public URL. Uses HTTP API via curl.
allowed-tools:
  - Bash
metadata:
  author: appdeploy
  version: 1.0.7
tags:
  - javascript
  - typescript
  - react
  - nextjs
  - git
  - ai
---

# AppDeploy Skill

部署 web apps to AppDeploy via HTTP api.

## 设置 (First Time Only)

1. **Check for existing api key:**
   - Look for a `.appdeploy` 文件 in the project root
   - If 它 exists and contains a valid `api_key`, skip to 使用方法

2. **If no api key exists, register and GET one:**
   ```Bash
   curl -X POST HTTPS://api-v2.appdeploy.AI/mcp/api-key \
     -H "Content-类型: application/JSON" \
     -d '{"client_name": "claude-code"}'
   ```

   响应:
   ```JSON
   {
     "api_key": "ak_...",
     "user_id": "agent-claude-code-a1b2c3d4",
     "created_at": 1234567890,
     "message": "保存 this key securely - 它 cannot be retrieved later"
   }
   ```

3. **保存 credentials to `.appdeploy`:**
   ```JSON
   {
     "api_key": "ak_...",
     "端点": "HTTPS://api-v2.appdeploy.AI/mcp"
   }
   ```

   Add `.appdeploy` to `.gitignore` if not already present.

## 使用方法

Make JSON-RPC calls to the MCP 端点:

```Bash
curl -X POST {端点} \
  -H "Content-类型: application/JSON" \
  -H "接受: application/JSON, text/事件-流" \
  -H "授权: Bearer {api_key}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "方法": "tools/call",
    "params": {
      "name": "{tool_name}",
      "参数": { ... }
    }
  }'
```

## 工作流

1. **First, GET 部署 instructions:**
   Call `get_deploy_instructions` to understand constraints and 要求.

2. **GET the app 模板:**
   Call `get_app_template` with your chosen `app_type` and `frontend_template`.

3. **部署 the app:**
   Call `deploy_app` with your app files. For new apps, 集合 `app_id` to `null`.

4. **Check 部署 状态:**
   Call `get_app_status` to check if the 构建 succeeded.

5. **View/manage your apps:**
   Use `get_apps` to 列表 your deployed apps.

## Available Tools

### get_deploy_instructions

Use this when you are about to call deploy_app in order to GET the 部署 constraints and hard rules. You must call this tool before starting to generate any code. This tool returns instructions only and does not 部署 anything.

**参数:**


### deploy_app

Use this when the 用户 asks to 部署 or publish a website or web app and wants a public URL.
Before generating files or calling this tool, you must call get_deploy_instructions and follow its constraints.

**参数:**
  - `app_id`: any (必需) - existing app id to 更新, or null for new app
  - `app_type`: 字符串 (必需) - app architecture: 前端-only or 前端+后端
  - `app_name`: 字符串 (必需) - short display name
  - `说明`: 字符串 (可选) - short 说明 of what the app does
  - `frontend_template`: any (可选) - 必需 when app_id is null. One of: 'html-静态' (simple sites), 'React-Vite' (SPAs, games), 'NextJS-静态' (multi-page). 模板 files auto-included.
  - `files`: 数组 (可选) - Files to write. NEW APPS: only custom files + diffs to 模板 files. UPDATES: only changed files using diffs[]. At least one of files[] or deletePaths[] 必需.
  - `deletePaths`: 数组 (可选) - Paths to DELETE. ONLY for updates (app_id 必需). Cannot DELETE 包.JSON or 框架 entry points.
  - `model`: 字符串 (必需) - The coding agent model used for this 部署, to the best of your knowledge. 示例: 'codex-5.3', 'chatgpt', 'opus 4.6', 'claude-sonnet-4-5', 'gemini-2.5-pro'
  - `intent`: 字符串 (必需) - The intent of this 部署. 用户-initiated 示例: 'initial app 部署', 'bugfix - ui is too noisy'. Agent-initiated 示例: 'agent fixing 部署 错误', 'agent 重试 after lint failure'

### get_app_template

Call get_deploy_instructions first. Then call this once you've decided app_type and frontend_template. Returns BASE app 模板 and SDK types.  模板 files auto-included in deploy_app.

**参数:**
  - `app_type`: 字符串 (必需)
  - `frontend_template`: 字符串 (必需) - 前端 框架: 'html-静态' - Simple sites, minimal 框架; 'React-Vite' - React SPAs, dashboards, games; 'NextJS-静态' - Multi-page apps, SSG

### get_app_status

Use this when deploy_app tool call returns or when the 用户 asks to check the 部署 状态 of an app, or reports that the app has errors or is not working as expected. Returns 部署 状态 (in-progress: 'deploying'/'deleting', 终端: 'ready'/'failed'/'deleted'), QA 快照 (前端/网络 errors), and live 前端/后端 错误 日志.

**参数:**
  - `app_id`: 字符串 (必需) - Target app id
  - `since`: 整数 (可选) - 可选 timestamp in epoch milliseconds to 过滤 errors. When provided, returns only errors since that timestamp.
  - `限制`: 整数 (可选) - 可选 shared cap for returned 日志 across 前端 and 后端 combined. Defaults to 50 when omitted.

### delete_app

Use this when you want to permanently DELETE an app. Use only on explicit 用户 请求. This is irreversible; after deletion, 状态 checks will return not found.

**参数:**
  - `app_id`: 字符串 (必需) - Target app id

### get_app_versions

列表 deployable versions for an existing app. Requires app_id. Returns newest-first {name, 版本, timestamp} items. Display 'name' to users. DO NOT display the '版本' value to users. Timestamp Values MUST be converted to 用户's 本地 time

**参数:**
  - `app_id`: 字符串 (必需) - Target app id

### apply_app_version

Start deploying an existing app at a specific 版本. Use the '版本' value (not 'name') from get_app_versions. Returns true if accepted and 部署 started; use get_app_status to observe completion.

**参数:**
  - `app_id`: 字符串 (必需) - Target app id
  - `版本`: 字符串 (必需) - 版本 id to apply

### src_glob

Use this when you need to discover files in an app's source 快照. Returns 文件 paths matching a glob 模式 (no content). Useful for exploring project structure before reading or searching files.

**参数:**
  - `app_id`: 字符串 (必需) - Target app id
  - `版本`: 字符串 (可选) - 版本 to 检查 (defaults to applied 版本)
  - `路径`: 字符串 (可选) - Directory 路径 to 搜索 within
  - `glob`: 字符串 (可选) - Glob 模式 to 匹配 files (default: **/*)
  - `include_dirs`: 布尔值 (可选) - Include directory paths in results
  - `continuation_token`: 字符串 (可选) - 令牌 from previous 响应 for 分页

### src_grep

Use this when you need to 搜索 for patterns in an app's source code. Returns matching lines with 可选 上下文. Supports 正则表达式 patterns, glob filters, and multiple 输出 modes.

**参数:**
  - `app_id`: 字符串 (必需) - Target app id
  - `版本`: 字符串 (可选) - 版本 to 搜索 (defaults to applied 版本)
  - `模式`: 字符串 (必需) - 正则表达式 模式 to 搜索 for (max 500 chars)
  - `路径`: 字符串 (可选) - Directory 路径 to 搜索 within
  - `glob`: 字符串 (可选) - Glob 模式 to 过滤 files (e.g., '*.ts')
  - `case_insensitive`: 布尔值 (可选) - Enable case-insensitive matching
  - `output_mode`: 字符串 (可选) - content=matching lines, files_with_matches=文件 paths only, count=匹配 count per 文件
  - `before_context`: 整数 (可选) - Lines to show before each 匹配 (0-20)
  - `after_context`: 整数 (可选) - Lines to show after each 匹配 (0-20)
  - `上下文`: 整数 (可选) - Lines before and after (overrides before/after_context)
  - `line_numbers`: 布尔值 (可选) - Include line numbers in 输出
  - `max_file_size`: 整数 (可选) - Max 文件 size to 扫描 in bytes (default 10MB)
  - `continuation_token`: 字符串 (可选) - 令牌 from previous 响应 for 分页

### src_read

Use this when you need to read a specific 文件 from an app's source 快照. Returns 文件 content with line-based 分页 (偏移/限制). Handles both text and binary files.

**参数:**
  - `app_id`: 字符串 (必需) - Target app id
  - `版本`: 字符串 (可选) - 版本 to read from (defaults to applied 版本)
  - `file_path`: 字符串 (必需) - 路径 to the 文件 to read
  - `偏移`: 整数 (可选) - Line 偏移 to start reading from (0-indexed)
  - `限制`: 整数 (可选) - Number of lines to return (max 2000)

### get_apps

Use this when you need to 列表 apps owned by the current 用户. Returns app details with display fields for 用户 presentation and data fields for tool chaining.

**参数:**
  - `continuation_token`: 字符串 (可选) - 令牌 for 分页


---
*Generated by `scripts/generate-appdeploy-skill.ts`*
