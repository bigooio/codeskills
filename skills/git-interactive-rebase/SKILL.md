---
name: git-interactive-rebase
description: Git 交互式 rebase 整理提交历史。适用于合并 commits、修改提交信息、删除冗余提交、整理 PR 提交等场景。
---

# Git 交互式 rebase 整理提交

git rebase -i 是整理提交历史的利器。

## 基本用法

```bash
# 整理最近 3 个提交
git rebase -i HEAD~3

# 整理从 HEAD 到指定提交
git rebase -i <commit_hash>
```

## 交互式命令

在打开的编辑器中，每个提交前有以下命令：

| 命令 | 说明 |
|------|------|
| `pick` | 保留提交 |
| `squash` | 合并到上一个提交 |
| `fixup` | 合并到上一个提交（丢弃此提交的消息） |
| `reword` | 修改提交信息 |
| `edit` | 暂停在此提交，可以修改文件 |
| `drop` | 删除此提交 |

## 常见场景

### 1. 合并最近的多个提交

```bash
git rebase -i HEAD~3

# 将后两个 pick 改为 squash：
pick abc1234 feat: add feature A
squash def5678 feat: add feature B
squash ghi9012 feat: add feature C

# 保存退出后会让你编辑最终的提交信息
```

### 2. 修改某个提交的信息

```bash
git rebase -i HEAD~3

# 将要修改的提交前的 pick 改为 reword：
pick abc1234 feat: add feature A
reword def5678 feat: add something
pick ghi9012 feat: add feature C
```

### 3. 删除错误的提交

```bash
git rebase -i HEAD~3

# 将要删除的提交前的 pick 改为 drop：
pick abc1234 feat: add feature A
drop def5678 oops wrong commit
pick ghi9012 feat: add feature C
```

### 4. 拆分提交

```bash
git rebase -i HEAD~1

# 将 pick 改为 edit
edit abc1234 feat: add feature A

# Git 会停在此提交，你可以：
git reset HEAD~1    # 取消提交但保留更改
git add file1       # 分阶段添加
git commit -m "part 1"  # 提交第一部分
git add file2       # 添加第二部分
git commit -m "part 2"  # 提交第二部分
git rebase --continue  # 继续 rebase
```

## 推送修改

```bash
# 强制推送（rebase 后必须）
git push --force

# 或使用安全模式（如果没人协作）
git push --force-with-lease
```

## 撤销 rebase

```bash
# 找到 rebase 前的提交
git reflog

# 恢复
git reset --hard ORIG_HEAD
```

## 最佳实践

1. **不要 rebase 已推送的提交** - 会覆盖远程历史
2. **团队协作时约定** - 只 rebase 自己未推送的提交
3. **频繁小改** - 比一次性大改更安全
4. **用 `--force-with-lease`** - 比 `--force` 更安全
5. **rebase 前备份** - `git branch backup` 以防万一
