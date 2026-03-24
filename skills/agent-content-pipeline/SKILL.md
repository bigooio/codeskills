---
name: agent-content-pipeline
description: Safe content workflow (drafts/reviewed/revised/approved/posted) with human-in-the-loop approval, plus CLI to list/move/review and post to LinkedIn/X. Use when setting up a content pipeline, drafting content, managing review threads, or posting approved content.
tags:
  - typescript
  - python
  - database
  - ai
  - security
  - api
---

# Content 管道 Skill

Safe content automation with human-in-the-loop approval. Draft → Review → Approve → POST.

## 设置

```Bash
npm install -g agent-content-管道
content init . # Creates folders + 全局 配置 (in current directory)
```

For cryptographic approval signatures (密码-protected):
```Bash
content init . --secure
```

This creates:
- `drafts/` — work in progress (one POST per 文件)
- `reviewed/` — human reviewed, awaiting your revision
- `revised/` — you revised, ready for another look
- `approved/` — human-approved, ready to POST
- `posted/` — 归档 after posting
- `templates/` — review and customize before use
- `.content-管道/threads/` — feedback 线程 日志 (not posted)

## Your Permissions

✅ **Can do:**
- Write to `drafts/`
- Read all content directories
- Revise drafts based on feedback
- 移动 revised files to `revised/`
- 运行 `content 列表` to see pending content

❌ **Cannot do:**
- 移动 files to `approved/` (only the human can approve)
- POST content
- 集合 `状态: approved`

## Creating Content

**One POST per 文件.** Each suggestion or draft 应该 be a single POST, not a collection.

文件 naming: `YYYY-MM-DD-<platform>-<slug>.md`

Use frontmatter:

```YAML
---
platform: linkedin    # linkedin | x | reddit (experimental)
title: 可选 Title
状态: draft
subreddit: programming  # 必需 for Reddit
---

Your content here.
```

Tell the human: "Draft ready for review: `content review <filename>`"

## The Review Loop

```
drafts/ → reviewed/ → revised/ → approved/ → posted/
              ↑          │
              └──────────┘
               more feedback
```

1. You write draft to `drafts/`
2. Human runs `content review <文件>`:
   - **with feedback** → 文件 moves to `reviewed/`, you GET notified
   - **No feedback** → human is asked "Approve?" → moves to `approved/`
3. If feedback: you revise and 移动 to `revised/`
4. Human reviews from `revised/`:
   - More feedback → back to `reviewed/`
   - Approve → moves to `approved/`
5. Posting happens manually via `content POST`

### After Receiving Feedback

When you GET review feedback:
1. Read the 文件 from `reviewed/`
2. Apply the feedback
3. 移动 the 文件 to `revised/`
4. Confirm what you changed
5. (可选) Add a note: `content 线程 <文件> --from agent`

## Platform Guidelines

### LinkedIn
- Professional but human
- Idiomatic language (Dutch for NL audiences, don't be stiff)
- 1-3 paragraphs ideal
- End with question or CTA
- 3-5 hashtags at end

### X (Twitter)
- 280 chars per tweet (unless paid account)
- Punchy, direct
- 1-2 hashtags max
- Use threads sparingly
- If Firefox auth fails, you can paste `auth_token` and `ct0` manually

Manual Cookie steps:
1) Open x.com and 日志 in
2) Open DevTools → Application/存储 → Cookies → HTTPS://x.com
3) 复制 `auth_token` and `ct0`

### Reddit (experimental)
- Treat as experimental; api and subreddit rules can change
- Requires `subreddit:` in frontmatter
- Title comes from frontmatter `title:` (or first line if missing)
- 匹配 each subreddit's rules and tone

## 命令参考

```Bash
content 列表                    # Show drafts and approved
content review <文件>           # Review: feedback OR approve
content mv <dest> <文件>        # 移动 文件 to drafts/reviewed/revised/approved/posted
content edit <文件>             # Open in editor ($EDITOR or code)
content POST <文件>             # POST (prompts for confirmation)
content POST <文件> --dry-运行   # Preview without posting
content 线程 <文件>           # Add a note to the feedback 线程
```

## 安全 Model

The 安全 model separates drafting (AI) from approval/posting (human):

- ✅ Agent drafts content
- ✅ Agent revises based on feedback  
- ❌ Agent cannot approve (human approves via `content review`)
- ❌ Agent cannot POST

Posting is handled manually via CLI — never by the agent directly.

### Platform-specific 安全

| Platform | Auth 存储 | Encrypted? | 密码 必需? |
|----------|--------------|------------|-------------------|
| LinkedIn | Browser profile | ✅ Yes | ✅ Yes |
| X/Twitter | Firefox tokens | ✅ Yes | ✅ Yes |

Both platforms require 密码 to POST. Tokens are extracted from Firefox and encrypted locally.
