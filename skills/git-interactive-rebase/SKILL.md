---
name: git-interactive-rebase
description: Git 交互式 rebase 整理提交历史。适用于合并 commits、修改提交信息、删除冗余提交、整理 PR 提交等场景。
tags:
  - git
  - bash
---

# Git 交互式 变基 整理提交

git 变基 -i 是整理提交历史的利器。

## 基本用法

```Bash
# 整理最近 3 个提交
git 变基 -i HEAD~3

# 整理从 HEAD 到指定提交
git 变基 -i <commit_hash>
```

## 交互式命令

在打开的编辑器中，每个提交前有以下命令：

| 命令 | 说明 |
|------|------|
| `选取` | 保留提交 |
| `压缩` | 合并到上一个提交 |
| `fixup` | 合并到上一个提交（丢弃此提交的消息） |
| `修改提交信息` | 修改提交信息 |
| `edit` | 暂停在此提交，可以修改文件 |
| `drop` | 删除此提交 |

## 常见场景

### 1. 合并最近的多个提交

```Bash
git 变基 -i HEAD~3

# 将后两个 选取 改为 压缩：
选取 abc1234 feat: add feature A
压缩 def5678 feat: add feature B
压缩 ghi9012 feat: add feature C

# 保存退出后会让你编辑最终的提交信息
```

### 2. 修改某个提交的信息

```Bash
git 变基 -i HEAD~3

# 将要修改的提交前的 选取 改为 修改提交信息：
选取 abc1234 feat: add feature A
修改提交信息 def5678 feat: add something
选取 ghi9012 feat: add feature C
```

### 3. 删除错误的提交

```Bash
git 变基 -i HEAD~3

# 将要删除的提交前的 选取 改为 drop：
选取 abc1234 feat: add feature A
drop def5678 oops wrong 提交
选取 ghi9012 feat: add feature C
```

### 4. 拆分提交

```Bash
git 变基 -i HEAD~1

# 将 选取 改为 edit
edit abc1234 feat: add feature A

# Git 会停在此提交，你可以：
git 重置 HEAD~1    # 取消提交但保留更改
git add file1       # 分阶段添加
git 提交 -m "part 1"  # 提交第一部分
git add file2       # 添加第二部分
git 提交 -m "part 2"  # 提交第二部分
git 变基 --continue  # 继续 变基
```

## 推送修改

```Bash
# 强制推送（变基 后必须）
git 推送 --force

# 或使用安全模式（如果没人协作）
git 推送 --force-with-lease
```

## 撤销 变基

```Bash
# 找到 变基 前的提交
git 引用日志

# 恢复
git 重置 --hard ORIG_HEAD
```

## 最佳实践

1. **不要 变基 已推送的提交** - 会覆盖远程历史
2. **团队协作时约定** - 只 变基 自己未推送的提交
3. **频繁小改** - 比一次性大改更安全
4. **用 `--force-with-lease`** - 比 `--force` 更安全
5. **变基 前备份** - `git 分支 backup` 以防万一
