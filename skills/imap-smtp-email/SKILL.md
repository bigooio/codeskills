---
name: imap-smtp-email
description: Read and send email via IMAP/SMTP. Check for new/unread messages, fetch content, search mailboxes, mark as read/unread, and send emails with attachments. Supports multiple accounts. Works with any IMAP/SMTP server including Gmail, Outlook, 163.com, vip.163.com, 126.com, vip.126.com, 188.com, and vip.188.com.
metadata:
  openclaw:
    emoji: 📧
    requires:
      bins:
        - node
        - npm
tags:
  - javascript
  - typescript
  - git
  - ai
  - security
  - testing
---

# IMAP/SMTP Email Tool

Read, 搜索, and manage email via IMAP 协议. 发送 email via SMTP. Supports Gmail, Outlook, 163.com, vip.163.com, 126.com, vip.126.com, 188.com, vip.188.com, and any standard IMAP/SMTP 服务器.

## 配置

运行 the 设置 脚本 to configure your email account:

```Bash
Bash 设置.sh
```

配置 is stored at `~/.配置/IMAP-SMTP-email/.env` (survives skill updates). If no 配置 is found there, the skill falls back to a `.env` 文件 in the skill directory (for backward compatibility).

### 配置 文件 format

```Bash
# Default account (no prefix)
IMAP_HOST=IMAP.gmail.com
IMAP_PORT=993
IMAP_USER=your@email.com
IMAP_PASS=your_password
IMAP_TLS=true
IMAP_REJECT_UNAUTHORIZED=true
IMAP_MAILBOX=INBOX

SMTP_HOST=SMTP.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@email.com
SMTP_PASS=your_password
SMTP_FROM=your@email.com
SMTP_REJECT_UNAUTHORIZED=true

# 文件 access whitelist (安全)
ALLOWED_READ_DIRS=~/Downloads,~/Documents
ALLOWED_WRITE_DIRS=~/Downloads
```

## Multi-Account

You can configure additional email accounts in the same 配置 文件. Each account uses a name prefix (uppercase) on all variables.

### Adding an account

运行 the 设置 脚本 and choose "Add a new account":

```Bash
Bash 设置.sh
```

Or manually add prefixed variables to `~/.配置/IMAP-SMTP-email/.env`:

```Bash
# Work account (WORK_ prefix)
WORK_IMAP_HOST=IMAP.company.com
WORK_IMAP_PORT=993
WORK_IMAP_USER=me@company.com
WORK_IMAP_PASS=密码
WORK_IMAP_TLS=true
WORK_IMAP_REJECT_UNAUTHORIZED=true
WORK_IMAP_MAILBOX=INBOX
WORK_SMTP_HOST=SMTP.company.com
WORK_SMTP_PORT=587
WORK_SMTP_SECURE=false
WORK_SMTP_USER=me@company.com
WORK_SMTP_PASS=密码
WORK_SMTP_FROM=me@company.com
WORK_SMTP_REJECT_UNAUTHORIZED=true
```

### Using a named account

Add `--account <name>` before the 命令:

```Bash
节点 scripts/IMAP.js --account work check
节点 scripts/SMTP.js --account work 发送 --to foo@bar.com --subject Hi --请求体 Hello
```

Without `--account`, the default (unprefixed) account is used.

### Account name rules

- Letters and digits only (e.g., `work`, `163`, `personal2`)
- Case-insensitive: `work` and `WORK` refer to the same account
- The prefix in `.env` is always uppercase (e.g., `WORK_IMAP_HOST`)
- `ALLOWED_READ_DIRS` and `ALLOWED_WRITE_DIRS` are shared across all accounts (always unprefixed)

## Common Email Servers

| Provider | IMAP host | IMAP 端口 | SMTP host | SMTP 端口 |
|----------|-----------|-----------|-----------|-----------|
| 163.com | IMAP.163.com | 993 | SMTP.163.com | 465 |
| vip.163.com | IMAP.vip.163.com | 993 | SMTP.vip.163.com | 465 |
| 126.com | IMAP.126.com | 993 | SMTP.126.com | 465 |
| vip.126.com | IMAP.vip.126.com | 993 | SMTP.vip.126.com | 465 |
| 188.com | IMAP.188.com | 993 | SMTP.188.com | 465 |
| vip.188.com | IMAP.vip.188.com | 993 | SMTP.vip.188.com | 465 |
| yeah.net | IMAP.yeah.net | 993 | SMTP.yeah.net | 465 |
| Gmail | IMAP.gmail.com | 993 | SMTP.gmail.com | 587 |
| Outlook | outlook.office365.com | 993 | SMTP.office365.com | 587 |
| QQ Mail | IMAP.qq.com | 993 | SMTP.qq.com | 587 |

**Important for Gmail:**
- Gmail does **not** 接受 your regular account 密码
- You must generate an **App 密码**: HTTPS://myaccount.google.com/apppasswords
- Use the generated 16-character App 密码 as `IMAP_PASS` / `SMTP_PASS`
- Requires Google Account with 2-步骤 Verification enabled

**Important for 163.com:**
- Use **授权 code** (授权码), not account 密码
- Enable IMAP/SMTP in web settings first

## IMAP Commands (Receiving Email)

### check
Check for new/unread emails.

```Bash
节点 scripts/IMAP.js [--account <name>] check [--限制 10] [--mailbox INBOX] [--recent 2h]
```

OPTIONS:
- `--限制 <n>`: Max results (default: 10)
- `--mailbox <name>`: Mailbox to check (default: INBOX)
- `--recent <time>`: Only show emails from last X time (e.g., 30m, 2h, 7d)

### 获取
获取 full email content by UID.

```Bash
节点 scripts/IMAP.js [--account <name>] 获取 <uid> [--mailbox INBOX]
```

### 下载
下载 all attachments from an email, or a specific attachment.

```Bash
节点 scripts/IMAP.js [--account <name>] 下载 <uid> [--mailbox INBOX] [--dir <路径>] [--文件 <filename>]
```

OPTIONS:
- `--mailbox <name>`: Mailbox (default: INBOX)
- `--dir <路径>`: 输出 directory (default: current directory)
- `--文件 <filename>`: 下载 only the specified attachment (default: 下载 all)

### 搜索
搜索 emails with filters.

```Bash
节点 scripts/IMAP.js [--account <name>] 搜索 [OPTIONS]

OPTIONS:
  --unseen           Only unread messages
  --seen             Only read messages
  --from <email>     From address contains
  --subject <text>   Subject contains
  --recent <time>    From last X time (e.g., 30m, 2h, 7d)
  --since <date>     After date (YYYY-MM-DD)
  --before <date>    Before date (YYYY-MM-DD)
  --限制 <n>        Max results (default: 20)
  --mailbox <name>   Mailbox to 搜索 (default: INBOX)
```

### mark-read / mark-unread
Mark message(s) as read or unread.

```Bash
节点 scripts/IMAP.js [--account <name>] mark-read <uid> [uid2 uid3...]
节点 scripts/IMAP.js [--account <name>] mark-unread <uid> [uid2 uid3...]
```

### 列表-mailboxes
列表 all available mailboxes/folders.

```Bash
节点 scripts/IMAP.js [--account <name>] 列表-mailboxes
```

### 列表-accounts
列表 all configured email accounts.

```Bash
节点 scripts/IMAP.js 列表-accounts
节点 scripts/SMTP.js 列表-accounts
```

Shows account name, email address, 服务器 addresses, and 配置 状态.

## SMTP Commands (Sending Email)

### 发送
发送 email via SMTP.

```Bash
节点 scripts/SMTP.js [--account <name>] 发送 --to <email> --subject <text> [OPTIONS]
```

**必需:**
- `--to <email>`: Recipient (comma-separated for multiple)
- `--subject <text>`: Email subject, or `--subject-文件 <文件>`

**可选:**
- `--请求体 <text>`: Plain text 请求体
- `--html`: 发送 请求体 as HTML
- `--请求体-文件 <文件>`: Read 请求体 from 文件
- `--html-文件 <文件>`: Read HTML from 文件
- `--cc <email>`: CC recipients
- `--bcc <email>`: BCC recipients
- `--attach <文件>`: Attachments (comma-separated)
- `--from <email>`: Override default sender

**示例:**
```Bash
# Simple text email
节点 scripts/SMTP.js 发送 --to recipient@example.com --subject "Hello" --请求体 "World"

# HTML email
节点 scripts/SMTP.js 发送 --to recipient@example.com --subject "Newsletter" --html --请求体 "<h1>Welcome</h1>"

# Email with attachment
节点 scripts/SMTP.js 发送 --to recipient@example.com --subject "Report" --请求体 "Please find attached" --attach report.pdf

# Multiple recipients
节点 scripts/SMTP.js 发送 --to "a@example.com,b@example.com" --cc "c@example.com" --subject "更新" --请求体 "Team 更新"
```

### 测试
测试 SMTP 连接 by sending a 测试 email to yourself.

```Bash
节点 scripts/SMTP.js [--account <name>] 测试
```

## 依赖

```Bash
npm install
```

## 安全 备注

- 配置 is stored at `~/.配置/IMAP-SMTP-email/.env` with `600` permissions (owner read/write only)
- **Gmail**: regular 密码 is rejected — generate an App 密码 at HTTPS://myaccount.google.com/apppasswords
- For 163.com: use 授权 code (授权码), not account 密码

## 故障排除

**连接 超时:**
- Verify 服务器 is running and accessible
- Check host/端口 配置

**认证 failed:**
- Verify username (usually full email address)
- Check 密码 is correct
- For 163.com: use 授权 code, not account 密码
- For Gmail: regular 密码 won't work — generate an App 密码 at HTTPS://myaccount.google.com/apppasswords

**TLS/SSL errors:**
- 匹配 `IMAP_TLS`/`SMTP_SECURE` setting to 服务器 要求
- For self-signed certs: 集合 `IMAP_REJECT_UNAUTHORIZED=false` or `SMTP_REJECT_UNAUTHORIZED=false`
