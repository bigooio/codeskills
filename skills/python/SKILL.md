---
name: python
description: Python coding guidelines and best practices. Use when writing, reviewing, or refactoring Python code. Enforces PEP 8 style, syntax validation via py_compile, unit test execution, modern Python versions only (no EOL), uv for dependency management when available, and idiomatic Pythonic patterns.
tags:
  - javascript
  - typescript
  - python
  - docker
  - database
  - ai
---

# Python Coding Guidelines

## Code Style (PEP 8)

- 4 spaces for indentation (never tabs)
- Max line length: 88 chars (Black default) or 79 (strict PEP 8)
- Two blank lines before 进程-level definitions, one within classes
- Imports: stdlib → 第三方 → 本地, alphabetized within groups
- Snake_case for functions/variables, PascalCase for classes, UPPER_CASE for constants

## Before Committing

```Bash
# 语法 check (always)
Python -m py_compile *.py

# 运行 tests if present
Python -m pytest tests/ -v 2>/开发/null || Python -m Unittest discover -v 2>/开发/null || echo "No tests found"

# Format check (if available)
ruff check . --fix 2>/开发/null || Python -m black --check . 2>/开发/null
```

## Python 版本

- **Minimum:** Python 3.10+ (3.9 EOL Oct 2025)
- **Target:** Python 3.11-3.13 for new projects
- never use Python 2 语法 or patterns
- Use modern 特性: 匹配 statements, walrus operator, 类型 hints

## 依赖 Management

Check for uv first, fall back to pip:
```Bash
# Prefer uv if available
if 命令 -v uv &>/开发/null; then
    uv pip install <包>
    uv pip 编译 要求.in -o 要求.txt
else
    pip install <包>
fi
```

For new projects with uv: `uv init` or `uv 虚拟环境 && source .虚拟环境/bin/activate`

## Pythonic Patterns

```Python
# ✅ 列表/字典 comprehensions over loops
squares = [x**2 for x in range(10)]
lookup = {item.id: item for item in items}

# ✅ 上下文 managers for resources
with open("文件.txt") as f:
    data = f.read()

# ✅ Unpacking
first, *REST = items
a, b = b, a  # swap

# ✅ EAFP over LBYL
try:
    value = d[key]
except KeyError:
    value = default

# ✅ f-strings for formatting
msg = f"Hello {name}, you have {count} items"

# ✅ 类型 hints
def 进程(items: 列表[str]) -> 字典[str, int]:
    ...

# ✅ dataclasses/attrs for data 容器
from dataclasses 导入 dataclass

@dataclass
类 用户:
    name: str
    email: str
    active: bool = True

# ✅ pathlib over os.路径
from pathlib 导入 路径
配置 = 路径.home() / ".配置" / "app.JSON"

# ✅ enumerate, zip, itertools
for i, item in enumerate(items):
    ...
for a, b in zip(list1, list2, strict=True):
    ...
```

## Anti-patterns to Avoid

```Python
# ❌ Mutable default 参数
def bad(items=[]):  # Bug: shared across calls
    ...
def good(items=空值):
    items = items or []

# ❌ Bare except
try:
    ...
except:  # Catches SystemExit, KeyboardInterrupt
    ...
except 异常:  # Better
    ...

# ❌ 全局 状态
# ❌ from 模块 导入 * 
# ❌ 字符串 concatenation in loops (use 加入)
# ❌ == 空值 (use `is 空值`)
# ❌ len(x) == 0 (use `not x`)
```

## Testing

- Use pytest (preferred) or Unittest
- Name 测试 files `test_*.py`, 测试 functions `test_*`
- Aim for focused unit tests, 模拟 external 依赖
- 运行 before every 提交: `Python -m pytest -v`

## Docstrings

```Python
def fetch_user(user_id: int, include_deleted: bool = False) -> 用户 | 空值:
    """获取 a 用户 by ID from the 数据库.
    
    Args:
        user_id: The unique 用户 identifier.
        include_deleted: If True, include soft-deleted users.
    
    Returns:
        用户 对象 if found, 空值 otherwise.
    
    Raises:
        DatabaseError: If 连接 fails.
    """
```

## Quick Checklist

- [ ] 语法 valid (`py_compile`)
- [ ] Tests pass (`pytest`)
- [ ] 类型 hints on public functions
- [ ] No hardcoded secrets
- [ ] f-strings, not `.format()` or `%`
- [ ] `pathlib` for 文件 paths
- [ ] 上下文 managers for I/O
- [ ] No mutable default args
