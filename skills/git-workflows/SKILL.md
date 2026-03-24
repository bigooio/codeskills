---
name: git-workflows
description: Advanced git operations beyond add/commit/push. Use when rebasing, bisecting bugs, using worktrees for parallel development, recovering with reflog, managing subtrees/submodules, resolving merge conflicts, cherry-picking across branches, or working with monorepos.
metadata:
  clawdbot:
    emoji: 🌿
    requires:
      bins:
        - git
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - python
  - git
  - ai
  - testing
  - api
---

# Git Workflows

Advanced git operations for real-world 开发环境. Covers interactive 变基, 二分查找, 工作树, 引用日志 recovery, subtrees, submodules, sparse 检出, 冲突解决, and Monorepo patterns.

## 何时使用

- Cleaning up 提交 历史 before 合并中 (interactive 变基)
- Finding which 提交 introduced a bug (二分查找)
- Working on multiple 分支 simultaneously (工作树)
- Recovering lost 提交 or undoing mistakes (引用日志)
- Managing shared code across repos (subtree/子模块)
- Resolving complex 合并 冲突
- Cherry-picking 提交 across 分支 or forks
- Working with large monorepos (sparse 检出)

## Interactive 变基

### 压缩, reorder, edit 提交

```Bash
# 变基 last 5 提交 interactively
git 变基 -i HEAD~5

# 变基 onto 主分支 (all 提交 since diverging)
git 变基 -i 主分支
```

The editor opens with a 选取 列表:

```
选取 a1b2c3d Add 用户 model
选取 e4f5g6h Fix typo in 用户 model
选取 i7j8k9l Add 用户 控制器
选取 m0n1o2p Add 用户 routes
选取 q3r4s5t Fix 导入 in 控制器
```

Commands available:
```
选取   = use 提交 as-is
修改提交信息 = use 提交 but edit the message
edit   = 停止 after this 提交 to 修改 它
压缩 = 合并 into previous 提交 (keep both messages)
fixup  = 合并 into previous 提交 (discard this message)
drop   = 删除 the 提交 entirely
```

### Common patterns

```Bash
# 压缩 fix 提交 into their parent
# Change "选取" to "fixup" for the fix 提交:
选取 a1b2c3d Add 用户 model
fixup e4f5g6h Fix typo in 用户 model
选取 i7j8k9l Add 用户 控制器
fixup q3r4s5t Fix 导入 in 控制器
选取 m0n1o2p Add 用户 routes

# Reorder 提交 (just 移动 lines)
选取 i7j8k9l Add 用户 控制器
选取 m0n1o2p Add 用户 routes
选取 a1b2c3d Add 用户 model

# Split a 提交 into two
# Mark as "edit", then when 它 stops:
git 重置 HEAD~
git add src/model.ts
git 提交 -m "Add 用户 model"
git add src/控制器.ts
git 提交 -m "Add 用户 控制器"
git 变基 --continue
```

### Autosquash (提交 messages that auto-arrange)

```Bash
# When committing a fix, 引用 the 提交 to 压缩 into
git 提交 --fixup=a1b2c3d -m "Fix typo"
# or
git 提交 --压缩=a1b2c3d -m "Additional changes"

# Later, 变基 with autosquash
git 变基 -i --autosquash 主分支
# fixup/压缩 提交 are automatically placed after their targets
```

### Abort or continue

```Bash
git 变基 --abort      # Cancel and restore original 状态
git 变基 --continue   # Continue after resolving 冲突 or editing
git 变基 --skip       # Skip the current 提交 and continue
```

## 二分查找 (Find the Bug)

### Binary 搜索 through 提交

```Bash
# Start 二分查找
git 二分查找 start

# Mark current 提交 as bad (has the bug)
git 二分查找 bad

# Mark a known-good 提交 (before the bug existed)
git 二分查找 good v1.2.0
# or: git 二分查找 good abc123

# Git checks out a middle 提交. 测试 它, then:
git 二分查找 good   # if this 提交 doesn't have the bug
git 二分查找 bad    # if this 提交 has the bug

# Repeat until git identifies the exact 提交
# "abc123 is the first bad 提交"

# Done — return to original 分支
git 二分查找 重置
```

### Automated 二分查找 (with a 测试 脚本)

```Bash
# Fully automatic: git runs the 脚本 on each 提交
# 脚本 must exit 0 for good, 1 for bad
git 二分查找 start HEAD v1.2.0
git 二分查找 运行 ./测试-for-bug.sh

# Example 测试 脚本
cat > /tmp/测试-for-bug.sh << 'EOF'
#!/bin/Bash
# Return 0 if bug is NOT present, 1 if 它 IS
npm 测试 -- --grep "login 应该 重定向" 2>/开发/null
EOF
chmod +x /tmp/测试-for-bug.sh
git 二分查找 运行 /tmp/测试-for-bug.sh
```

### 二分查找 with 构建 failures

```Bash
# If a 提交 doesn't 编译, skip 它
git 二分查找 skip

# Skip a range of known-broken 提交
git 二分查找 skip v1.3.0..v1.3.5
```

## 工作树 (Parallel 分支)

### Work on multiple 分支 simultaneously

```Bash
# Add a 工作树 for a different 分支
git 工作树 add ../myproject-热修复 热修复/urgent-fix
# Creates a new directory with that 分支 checked out

# Add a 工作树 with a new 分支
git 工作树 add ../myproject-feature -b feature/new-thing

# 列表 worktrees
git 工作树 列表

# 删除 a 工作树 when done
git 工作树 删除 ../myproject-热修复

# 清理 stale 工作树 references
git 工作树 清理
```

### Use cases

```Bash
# Review a PR while keeping your current work untouched
git 工作树 add ../review-pr-123 origin/pr-123

# 运行 tests on 主分支 while developing on 功能分支
git 工作树 add ../主分支-tests 主分支
cd ../主分支-tests && npm 测试

# Compare behavior between 分支 side by side
git 工作树 add ../compare-old 发布/v1.0
git 工作树 add ../compare-new 发布/v2.0
```

## 引用日志 (Recovery)

### See everything git remembers

```Bash
# Show 引用日志 (all HEAD movements)
git 引用日志
# 输出:
# abc123 HEAD@{0}: 提交: Add feature
# def456 HEAD@{1}: 变基: moving to 主分支
# ghi789 HEAD@{2}: 检出: moving from feature to 主分支

# Show 引用日志 for a specific 分支
git 引用日志 show feature/my-分支

# Show with timestamps
git 引用日志 --date=relative
```

### Recover from mistakes

```Bash
# Undo a bad 变基 (find the 提交 before 变基 in 引用日志)
git 引用日志
# Find: "ghi789 HEAD@{5}: 检出: moving from feature to 主分支" (pre-变基)
git 重置 --hard ghi789

# Recover a deleted 分支
git 引用日志
# Find the last 提交 on that 分支
git 分支 recovered-分支 abc123

# Recover after 重置 --hard
git 引用日志
git 重置 --hard HEAD@{2}   # Go back 2 引用日志 entries

# Recover a dropped 暂存
git fsck --unreachable | grep 提交
# or
git 暂存 列表  # if 它's still there
git 日志 --walk-reflogs --all -- 暂存  # find dropped 暂存 提交
```

## 摘取

### 复制 specific 提交 to another 分支

```Bash
# 选取 a single 提交
git 摘取 abc123

# 选取 multiple 提交
git 摘取 abc123 def456 ghi789

# 选取 a range (exclusive start, inclusive end)
git 摘取 abc123..ghi789

# 选取 without committing (stage changes only)
git 摘取 --no-提交 abc123

# 摘取 from another 远程/分叉
git 远程 add upstream HTTPS://github.com/other/repo.git
git 获取 upstream
git 摘取 upstream/主分支~3   # 3rd 提交 from upstream's 主分支
```

### 句柄 冲突 during 摘取

```Bash
# If 冲突 arise:
# 1. Resolve 冲突 in the files
# 2. Stage resolved files
git add resolved-文件.ts
# 3. Continue
git 摘取 --continue

# Or abort
git 摘取 --abort
```

## Subtree and 子模块

### Subtree (simpler — copies code into your repo)

```Bash
# Add a subtree
git subtree add --prefix=lib/shared HTTPS://github.com/org/shared-lib.git 主分支 --压缩

# 拉取 updates from upstream
git subtree 拉取 --prefix=lib/shared HTTPS://github.com/org/shared-lib.git 主分支 --压缩

# 推送 本地 changes back to upstream
git subtree 推送 --prefix=lib/shared HTTPS://github.com/org/shared-lib.git 主分支

# Split subtree into its own 分支 (for extraction)
git subtree split --prefix=lib/shared -b shared-lib-standalone
```

### 子模块 (指针 to another repo at a specific 提交)

```Bash
# Add a 子模块
git 子模块 add HTTPS://github.com/org/shared-lib.git lib/shared

# 克隆 a repo with submodules
git 克隆 --recurse-submodules HTTPS://github.com/org/主分支-repo.git

# Initialize submodules after 克隆 (if forgot --recurse)
git 子模块 更新 --init --recursive

# 更新 submodules to latest
git 子模块 更新 --远程

# 删除 a 子模块
git rm lib/shared
rm -rf .git/modules/lib/shared
# 删除 entry from .gitmodules if 它 persists
```

### 何时使用 which

```
Subtree: Simpler, no special commands for cloners, code lives in your repo.
         Use when: shared 库, vendor code, infrequent upstream changes.

子模块: 指针 to exact 提交, smaller repo, clear separation.
           Use when: large 依赖, independent 发布 cycle, many contributors.
```

## Sparse 检出 (Monorepo)

### Check out only the directories you need

```Bash
# Enable sparse 检出
git sparse-检出 init --cone

# Select directories
git sparse-检出 集合 包/my-app 包/shared-lib

# Add another directory
git sparse-检出 add 包/another-lib

# 列表 what's checked out
git sparse-检出 列表

# Disable (check out everything again)
git sparse-检出 disable
```

### 克隆 with sparse 检出 (large monorepos)

```Bash
# 偏函数 克隆 + sparse 检出 (fastest for huge repos)
git 克隆 --过滤=blob:空值 --sparse HTTPS://github.com/org/Monorepo.git
cd Monorepo
git sparse-检出 集合 包/my-服务

# No-检出 克隆 (just metadata)
git 克隆 --no-检出 HTTPS://github.com/org/Monorepo.git
cd Monorepo
git sparse-检出 集合 包/my-服务
git 检出 主分支
```

## 冲突解决

### Understand the 冲突 markers

```
<<<<<<< HEAD (or "ours")
Your changes on the current 分支
=======
Their changes from the incoming 分支
>>>>>>> feature-分支 (or "theirs")
```

### Resolution strategies

```Bash
# 接受 all of ours (current 分支 wins)
git 检出 --ours 路径/to/文件.ts
git add 路径/to/文件.ts

# 接受 all of theirs (incoming 分支 wins)
git 检出 --theirs 路径/to/文件.ts
git add 路径/to/文件.ts

# 接受 ours for ALL files
git 检出 --ours .
git add .

# Use a 合并 tool
git mergetool

# See the three-way 差异 (BASE, ours, theirs)
git 差异 --cc 路径/to/文件.ts

# Show common ancestor 版本
git show :1:路径/to/文件.ts   # BASE (common ancestor)
git show :2:路径/to/文件.ts   # ours
git show :3:路径/to/文件.ts   # theirs
```

### 变基 冲突 工作流

```Bash
# During 变基, 冲突 appear one 提交 at a time
# 1. Fix the 冲突 in the 文件
# 2. Stage the fix
git add fixed-文件.ts
# 3. Continue to next 提交
git 变基 --continue
# 4. Repeat until done

# If a 提交 is now empty after resolution
git 变基 --skip
```

### Rerere (reuse recorded resolutions)

```Bash
# Enable rerere globally
git 配置 --全局 rerere.enabled true

# Git remembers how you resolved 冲突
# Next time the same 冲突 appears, 它 auto-resolves

# See recorded resolutions
ls .git/rr-缓存/

# Forget a bad resolution
git rerere forget 路径/to/文件.ts
```

## 暂存 Patterns

```Bash
# 暂存 with a message
git 暂存 推送 -m "WIP: refactoring auth flow"

# 暂存 specific files
git 暂存 推送 -m "偏函数 暂存" -- src/auth.ts src/login.ts

# 暂存 including untracked files
git 暂存 推送 -u -m "with untracked"

# 列表 stashes
git 暂存 列表

# Apply most recent 暂存 (keep in 暂存 列表)
git 暂存 apply

# Apply and 删除 from 暂存 列表
git 暂存 pop

# Apply a specific 暂存
git 暂存 apply 暂存@{2}

# Show what's in a 暂存
git 暂存 show -p 暂存@{0}

# Create a 分支 from a 暂存
git 暂存 分支 new-feature 暂存@{0}

# Drop a specific 暂存
git 暂存 drop 暂存@{1}

# Clear all stashes
git 暂存 clear
```

## 追溯 and 日志 Archaeology

```Bash
# Who changed each line (with date)
git 追溯 src/auth.ts

# 追溯 a specific line range
git 追溯 -L 50,70 src/auth.ts

# 忽略 whitespace changes in 追溯
git 追溯 -w src/auth.ts

# Find when a line was deleted (搜索 all 历史)
git 日志 -S "函数 oldName" --oneline

# Find when a 正则表达式 模式 was added/removed
git 日志 -G "TODO.*hack" --oneline

# Follow a 文件 through renames
git 日志 --follow --oneline -- src/new-name.ts

# Show the 提交 that last touched each line, ignoring moves
git 追溯 -M src/auth.ts

# Show 日志 with 文件 changes
git 日志 --stat --oneline -20

# Show all 提交 affecting a specific 文件
git 日志 --oneline -- src/auth.ts

# Show 差异 of a specific 提交
git show abc123
```

## Tags and Releases

```Bash
# Create annotated 标签 (preferred for releases)
git 标签 -a v1.2.0 -m "发布 1.2.0: Added auth 模块"

# Create lightweight 标签
git 标签 v1.2.0

# 标签 a past 提交
git 标签 -a v1.1.0 abc123 -m "Retroactive 标签 for 发布 1.1.0"

# 列表 tags
git 标签 -l
git 标签 -l "v1.*"

# 推送 tags
git 推送 origin v1.2.0      # Single 标签
git 推送 origin --tags       # All tags

# DELETE a 标签
git 标签 -d v1.2.0            # 本地
git 推送 origin --DELETE v1.2.0  # 远程
```

## Tips

- `git 变基 -i` is the single most useful advanced git 命令. Learn 它 first.
- never 变基 提交 that have been pushed to a shared 分支. 变基 your 本地/feature work only.
- `git 引用日志` is your safety net. If you lose 提交, they're almost always recoverable within 90 days.
- `git 二分查找 运行` with an automated 测试 is faster than manual binary 搜索 and eliminates human 错误.
- Worktrees are cheaper than multiple clones — they share `.git` 存储.
- Prefer `git subtree` over `git 子模块` unless you have a specific reason. Subtrees are simpler for collaborators.
- Enable `rerere` globally. 它 remembers 冲突 resolutions so you never solve the same 冲突 twice.
- `git 暂存 推送 -m "说明"` is much better than bare `git 暂存`. You'll thank yourself when you have 5 stashes.
- `git 日志 -S "字符串"` (pickaxe) is the fastest way to find when a 函数 or 变量 was added or removed.
