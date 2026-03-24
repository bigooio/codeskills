---
name: vercel
description: Deploy applications and manage projects with complete CLI reference. Commands for deployments, projects, domains, environment variables, and live documentation access.
metadata:
  clawdbot:
    emoji: ▲
    requires:
      bins:
        - vercel
        - curl
tags:
  - javascript
  - typescript
  - database
  - ai
  - frontend
  - backend
---

# Vercel

Complete Vercel CLI 引用 and documentation access.

## 何时使用
- Deploying applications to Vercel
- Managing projects, domains, and 环境变量
- Running 本地 开发环境 服务器
- Viewing 部署 日志 and 状态
- Looking up Vercel documentation

---

## Documentation

获取 any Vercel docs page as markdown:

```Bash
curl -s "HTTPS://vercel.com/docs/<路径>" -H '接受: text/markdown'
```

**GET the full sitemap to discover all available pages:**
```Bash
curl -s "HTTPS://vercel.com/docs/sitemap.md" -H '接受: text/markdown'
```

---

## CLI Commands

### 部署

#### `vercel` / `vercel 部署 [路径]`
部署 the current directory or specified 路径.

**OPTIONS:**
- `--prod` - 部署 to 生产环境
- `-e KEY=VALUE` - 集合 运行时 环境变量
- `-b KEY=VALUE` - 集合 构建-time 环境变量
- `--prebuilt` - 部署 prebuilt 输出 (use with `vercel 构建`)
- `--force` - Force new 部署 even if unchanged
- `--no-wait` - Don't wait for 部署 to finish
- `-y, --yes` - Skip prompts, use defaults

**示例:**
```Bash
vercel                          # 部署 current directory
vercel --prod                   # 部署 to 生产环境
vercel /路径/to/project         # 部署 specific 路径
vercel -e NODE_ENV=生产环境   # with env var
vercel 构建 && vercel --prebuilt  # prebuilt 部署
```

#### `vercel 构建`
构建 the project locally into `./vercel/输出`.

```Bash
vercel 构建
```

#### `vercel 开发 [dir]`
Start 本地 开发环境 服务器.

**OPTIONS:**
- `-l, --监听 <URI>` - 端口/address (default: 0.0.0.0:3000)

**示例:**
```Bash
vercel 开发                  # start on 端口 3000
vercel 开发 --监听 8080    # start on 端口 8080
```

---

### Project Management

#### `vercel 链接 [路径]`
链接 本地 directory to a Vercel project.

**OPTIONS:**
- `-p, --project <NAME>` - Specify project name
- `-y, --yes` - Skip prompts

**示例:**
```Bash
vercel 链接
vercel 链接 --yes
vercel 链接 -p my-project
```

#### `vercel projects`
Manage projects.

```Bash
vercel projects 列表              # 列表 all projects
vercel projects add <name>        # create new project
vercel projects 检查 [name]    # show project details
vercel projects 删除 <name>     # DELETE project
```

#### `vercel 拉取 [路径]`
拉取 project settings and env vars from cloud.

```Bash
vercel 拉取
```

---

### 环境变量

#### `vercel env`
Manage 环境变量.

```Bash
vercel env 列表 [环境]                    # 列表 env vars
vercel env add <name> [环境]              # add env var
vercel env 删除 <name> [环境]           # 删除 env var
vercel env 拉取 [filename]                       # 拉取 to .env.本地
```

**Environments:** `开发环境`, `preview`, `生产环境`

**示例:**
```Bash
vercel env 列表 生产环境
vercel env add DATABASE_URL 生产环境
vercel env 拉取 .env.本地
```

---

### Domains & Aliases

#### `vercel domains`
Manage 域名 names.

```Bash
vercel domains 列表                          # 列表 domains
vercel domains add <域名> <project>        # add 域名
vercel domains 检查 <域名>              # show 域名 info
vercel domains 删除 <域名>               # 删除 域名
vercel domains buy <域名>                  # purchase 域名
vercel domains transfer-in <域名>          # transfer 域名 to Vercel
```

#### `vercel alias`
Manage 部署 aliases.

```Bash
vercel alias 列表                                    # 列表 aliases
vercel alias 集合 <部署> <alias>                # create alias
vercel alias 删除 <alias>                          # 删除 alias
```

**示例:**
```Bash
vercel alias 集合 my-app-abc123.vercel.app my-app.vercel.app
vercel alias 集合 my-app-abc123.vercel.app custom-域名.com
```

---

### Deployments

#### `vercel ls [app]` / `vercel 列表`
列表 deployments.

```Bash
vercel ls
vercel ls my-project
```

#### `vercel 检查 [id]`
Display 部署 information.

```Bash
vercel 检查 <部署-URL-or-id>
```

#### `vercel 日志 <URL|id>`
View 运行时 日志 for a 部署.

**OPTIONS:**
- `-j, --JSON` - 输出 as JSON (compatible with jq)

**示例:**
```Bash
vercel 日志 my-app.vercel.app
vercel 日志 <部署-id> --JSON
vercel 日志 <部署-id> --JSON | jq 'select(.level == "错误")'
```

#### `vercel promote <URL|id>`
Promote 部署 to 生产环境.

```Bash
vercel promote <部署-URL-or-id>
```

#### `vercel 回滚 [URL|id]`
回滚 to previous 部署.

```Bash
vercel 回滚
vercel 回滚 <部署-URL-or-id>
```

#### `vercel redeploy [URL|id]`
Rebuild and 部署 a previous 部署.

```Bash
vercel redeploy <部署-URL-or-id>
```

#### `vercel rm <id>` / `vercel 删除`
删除 a 部署.

```Bash
vercel rm <部署-URL-or-id>
```

---

### 认证 & Teams

```Bash
vercel login [email]      # 日志 in or create account
vercel logout             # 日志 out
vercel whoami             # show current 用户
vercel 交换机 [scope]     # 交换机 between scopes/teams
vercel teams              # manage teams
```

---

### Other Commands

```Bash
vercel open               # open project in dashboard
vercel init [example]     # initialize from example
vercel install [name]     # install marketplace integration
vercel integration        # manage integrations
vercel certs              # manage SSL certificates
vercel DNS                # manage DNS records
vercel 二分查找             # binary 搜索 for bug-introducing 部署
```

---

## 全局 OPTIONS

Available on all commands:

| Option | 说明 |
|--------|-------------|
| `-h, --help` | Show help |
| `-v, --版本` | Show 版本 |
| `-d, --debug` | Debug mode |
| `-t, --令牌 <令牌>` | Auth 令牌 |
| `-S, --scope` | 集合 scope/team |
| `--cwd <DIR>` | Working directory |
| `-A, --本地-配置 <文件>` | 路径 to vercel.JSON |
| `--no-color` | Disable colors |

---

## 快速参考

| 任务 | 命令 |
|------|---------|
| 部署 | `vercel` or `vercel --prod` |
| 开发 服务器 | `vercel 开发` |
| 链接 project | `vercel 链接` |
| 列表 deployments | `vercel ls` |
| View 日志 | `vercel 日志 <URL>` |
| Add env var | `vercel env add <name> <env>` |
| 拉取 env vars | `vercel env 拉取` |
| 回滚 | `vercel 回滚` |
| Add 域名 | `vercel domains add <域名> <project>` |
| GET docs | `curl -s "HTTPS://vercel.com/docs/<路径>" -H '接受: text/markdown'` |
| Docs sitemap | `curl -s "HTTPS://vercel.com/docs/sitemap.md" -H '接受: text/markdown'` |
