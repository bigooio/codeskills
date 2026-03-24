---
name: file-search
description: Fast file-name and content search using `fd` and `rg` (ripgrep).
metadata:
  openclaw:
    emoji: 🔍
    requires:
      bins:
        - fd
        - rg
    install:
      - id: dnf-fd
        kind: dnf
        package: fd-find
        bins:
          - fd
        label: Install fd-find (dnf)
      - id: dnf-rg
        kind: dnf
        package: ripgrep
        bins:
          - rg
        label: Install ripgrep (dnf)
tags:
  - typescript
  - ai
  - bash
---

# 文件 搜索 Skill

Fast 文件-name and content 搜索 using `fd` and `rg` (ripgrep).

## Find Files by Name

搜索 for files matching a 模式:

```Bash
fd "\.rs$" /home/xrx/projects
```

Find files by exact name:

```Bash
fd -g "Cargo.TOML" /home/xrx/projects
```

## 搜索 文件 Contents

搜索 for a 正则表达式 模式 across files:

```Bash
rg "TODO|FIXME" /home/xrx/projects
```

搜索 with 上下文 lines:

```Bash
rg -C 3 "fn 主分支" /home/xrx/projects --类型 rust
```

## Install

```Bash
sudo dnf install fd-find ripgrep
```
