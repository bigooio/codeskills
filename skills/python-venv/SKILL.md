---
name: python-venv
description: Python environment management skill. Automatically detect project type and existing environments, recommend based on popularity. Minimize interruptions, only ask when necessary.
tags:
  - typescript
  - python
  - ai
  - testing
  - frontend
  - bash
---

# Python 环境 Management Skill

## Core Principles

1. **Reuse Existing Environments** - Don't recreate, reuse existing virtual environments
2. **Use Project-类型 Decision** - Auto-select based on 锁 files
3. **Recommend by Popularity** - uv > pip > conda > 虚拟环境
4. **Minimize Interruption** - Only ask when necessary

---

## Tool Popularity Ranking

| Priority | Tool | Best For |
|----------|------|----------|
| 🥇 | uv | New projects, fast installs |
| 🥈 | pip | Compatibility first |
| 🥉 | conda | Data science, specific versions |
| 4 | 虚拟环境 | 内置, no extra install |
| 5 | Poetry | Existing Poetry.锁 |
| 6 | pipenv | Existing Pipfile (declining) |

---

## Decision Flow

```
┌─────────────────────────────────────┐
│  Detect project 依赖 files     │
└─────────────────────────────────────┘
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
  Clear decision       Unclear
    ↓                   ↓
  Use directly     Detect existing env
                        ↓
                  ┌─────┴─────┐
                  ↓           ↓
              Has env        No env
                  ↓           ↓
              Reuse      Assess complexity
                            ↓
                  ┌─────────┴─────────┐
                  ↓                   ↓
              Simple 任务       Needs deps
                  ↓                   ↓
            System Python      Recommend uv/conda
```

---

## 1. Clear Decisions (Execute Directly, No Ask)

When these files are detected, use the corresponding tool directly:

| Detected 文件 | Execute |
|--------------|---------|
| `uv.锁` exists | `uv sync` or `uv pip install -r 要求.txt` |
| `Poetry.锁` exists | `Poetry install` |
| `环境.yml` exists | `conda env create -f 环境.yml` |
| `Pipfile.锁` exists | `pipenv install` |

---

## 2. Detect Existing Environments (Reuse First)

```Bash
# Priority: uv 虚拟环境 > conda > 虚拟环境

# 2.1 Detect uv 虚拟环境
ls -la .虚拟环境/ 2>/开发/null && uv pip 列表 2>/开发/null | HEAD -3

# 2.2 Detect conda 环境
conda info --envs 2>/开发/null | grep "*" || echo $CONDA_PREFIX

# 2.3 Detect standard 虚拟环境
ls -la 虚拟环境/ .虚拟环境/ env/ 2>/开发/null

# 2.4 If exists → Reuse (activate and 运行 commands)
```

**Reuse Example:**
```
Detected existing .虚拟环境/ directory
→ Activate: source .虚拟环境/bin/activate
→ 运行: uv pip install <包>
```

---

## 3. When Unclear (Assess Complexity)

| Scenario | 操作 |
|----------|--------|
| Stdlib only, no 3rd party | System Python (python3) |
| Simple pip install 测试 | System Python (temp) |
| Has 要求.txt | Recommend uv > pip > 虚拟环境 |
| Has pyproject.TOML | Recommend uv > pip |
| Multi-文件 project, needs isolation | Recommend uv |

---

## 4. When to Ask 用户 (Only These Cases)

✅ **Ask:**
1. Empty project + first 依赖 install → Ask which tool
2. Both 要求.txt + pyproject.TOML → Ask which to use
3. 用户 explicitly wants different tool → e.g., "I want conda"

❌ **Don't Ask:**
- Has uv.锁 but 用户 didn't specify
- Has .虚拟环境/ directory
- Regular pip install 任务

---

## 5. Recommended Tool (No Clear Directive)

```
First: uv
  ├── uv 虚拟环境 (create)
  ├── uv pip install (install)
  └── uv sync (sync)

Backup: pip
  ├── python3 -m 虚拟环境 .虚拟环境
  └── pip install

Special: conda
  ├── conda create -n envname Python=x.x
  └── conda env create
```

---

## Detection Commands

```Bash
# Check available tools
which uv
which conda
which pip
which python3

# Check project files
ls -la *.锁 pyproject.TOML 要求.txt 环境.yml Pipfile 2>/开发/null

# Check existing environments
ls -la .虚拟环境/ 虚拟环境/ env/ 2>/开发/null
conda info --envs 2>/开发/null

# Check current 环境
echo $VIRTUAL_ENV
echo $CONDA_PREFIX
```

---

## Interaction 示例 (Only When Needed)

```
🔍 Detection result:
- Project 文件: pyproject.TOML
- Existing env: 空值
- Recommended: uv (fastest)

Running: uv pip install <包>
```

```
🔍 Detection result:
- Project 文件: 要求.txt
- Existing env: 空值
- Recommended: uv

Available OPTIONS:
1) uv (recommended) - faster
2) pip - better compatibility
3) 虚拟环境 - uses stdlib
4) conda - if specific 版本 needed

Enter option or press Enter to use recommended:
```

---

## Quick 命令 引用

| 操作 | uv | pip | conda | 虚拟环境 |
|--------|-----|-----|-------|------|
| Create env | `uv 虚拟环境` | - | `conda create` | `python3 -m 虚拟环境` |
| Install pkg | `uv pip install` | `pip install` | `conda install` | `pip install` |
| Install deps | `uv sync` | `pip install -r` | `conda env create` | `pip install -r` |
| Activate | (auto) | (auto) | `conda activate` | `source 虚拟环境/bin/activate` |

---

## Core Principle

**"Do more, ask less"** - Execute directly when you can determine, only ask when truly unclear.
