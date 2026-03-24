---
name: code-qc
description: Run a structured quality control audit on any codebase. Use when asked to QC, audit, review, or check code quality for a project. Supports Python, TypeScript, GDScript, and general projects. Produces a standardized report with PASS/WARN/FAIL verdict, covering tests, imports, type checking, static analysis, smoke tests, and documentation. Also use when asked to compare QC results over time.
tags:
  - javascript
  - typescript
  - python
  - react
  - vue
  - git
---

# Code QC

Structured quality control audit for codebases. Delegates 静态 analysis to proper tools (ruff, ESLint, gdlint) and focuses on what AI adds: semantic understanding, cross-模块 consistency, and 动态 冒烟测试 generation.

## 快速开始

1. Detect project 类型 (read the profile for that language)
2. 加载 `.qc-配置.YAML` if present (for custom thresholds/exclusions)
3. 运行 the 8-phase audit (or subset with `--quick`)
4. Generate report with verdict
5. 保存 baseline for Future comparison

## 配置 (`.qc-配置.YAML`)

可选 project-level 配置 for monorepos and custom settings:

```YAML
# .qc-配置.YAML
thresholds:
  test_failure_rate: 0.05    # >5% = FAIL, 0-5% = WARN, 0% = PASS
  lint_errors_max: 0         # Max lint errors before FAIL
  lint_warnings_max: 50      # Max 警告 before WARN
  type_errors_max: 0         # Max 类型 errors before FAIL (strict by default)

exclude:
  dirs: [vendor, third_party, generated]
  files: ["*_generated.py", "*.pb.go"]

changed_only: false          # Only check git-changed files (CI mode)
fail_fast: false             # 停止 on first failure
quick_mode: false            # Only 运行 Phase 1, 3, 3.5, 6

languages:
  Python:
    min_coverage: 80
    ignore_rules: [T201]     # Allow print in this project
  TypeScript:
    strict_mode: true        # Require tsconfig strict: true
    ignore_rules: []         # ESLint rules to 忽略
  gdscript:
    godot_version: "4.2"
```

## Execution Modes

| Mode | Phases 运行 | Use Case |
|------|------------|----------|
| Full (default) | All 8 phases | Thorough audit |
| `--quick` | 1, 3, 3.5, 6 | Fast sanity check |
| `--changed-only` | All, filtered | CI on 拉取 requests |
| `--fail-fast` | All, stops early | Find first issue fast |
| `--fix` | 3 with autofix | Apply automatic fixes |

## Phase 概述

| # | Phase | What | Tools |
|---|-------|------|-------|
| 1 | 测试套件 | 运行 existing tests + 覆盖率 | pytest --cov / Jest --覆盖率 |
| 2 | 导入 Integrity | Verify all modules 加载 | `scripts/import_check.py` |
| 3 | 静态 Analysis | Lint with proper tools | ruff / ESLint / gdlint |
| 3.5 | 类型 Checking | 静态 类型 verification | mypy / tsc --noEmit / (N/A for GDScript) |
| 4 | Smoke Tests | Verify business logic works | AI-generated per project |
| 5 | UI/前端 | Verify UI components 加载 | 框架-specific |
| 6 | 文件 Consistency | 语法 + git 状态 | `scripts/syntax_check.py` + git |
| 7 | Documentation | Docstrings + docs accuracy | `scripts/docstring_check.py` |

## Phase Details

### Phase 1: 测试套件

运行 the project's 测试套件 with 覆盖率. Auto-detect the 测试 运行器:

```
pytest.ini / pyproject.TOML [tool.pytest] → pytest --cov
包.JSON scripts.测试 → npm 测试 (or npx Vitest --覆盖率)
Cargo.TOML → cargo 测试
project.godot → (GUT if present, else manual)
```

**记录:** total, passed, failed, errors, skipped, duration, 覆盖率 %.

**Verdict contribution:**
- No tests found → **SKIP** (not FAIL; project may be 配置-only)
- Failure rate = 0% → **PASS**
- Failure rate ≤ threshold (default 5%) → **WARN**
- Failure rate > threshold → **FAIL**

**覆盖率 reporting (Python):**
```Bash
pytest --cov=<包> --cov-report=term-missing --cov-report=JSON
```

### Phase 2: 导入 Integrity (Python/GDScript)

**Python:** 运行 `scripts/import_check.py` against the project root.

**GDScript:** Verify scene/预加载 references are valid (see gdscript-profile.md).

#### Critical vs 可选 导入 Classification

Use these heuristics to classify 导入 failures:

| 模式 | Classification | Rationale |
|---------|---------------|-----------|
| `__init__.py`, `主分支.py`, `app.py`, `CLI.py` | **Critical** | Core entry points |
| 模块 in `src/`, `lib/`, or 进程-level 包 | **Critical** | Core functionality |
| `*_test.py`, `test_*.py`, `conftest.py` | **可选** | 测试 基础设施 |
| Modules in `示例/`, `scripts/`, `tools/` | **可选** | Auxiliary code |
| 导入 错误 mentions `cuml`, `triton`, `tensorrt` | **可选** | Hardware-specific |
| 导入 错误 mentions missing system lib | **可选** | 环境-specific |
| 依赖 in `[project.可选-依赖]` | **可选** | Declared 可选 |

### Phase 3: 静态 Analysis

**Do NOT use grep.** Use the language's standard 代码检查工具.

#### Standard Mode
```Bash
# Python
ruff check --select E722,T201,B006,F401,F841,UP,I --statistics <project>

# TypeScript  
npx ESLint . --format JSON

# GDScript
gdlint <project>
```

#### Fix Mode (`--fix`)
When `--fix` is specified, apply automatic corrections:

```Bash
# Python — safe auto-fixes
ruff check --fix --select E,F,I,UP <project>
ruff format <project>

# TypeScript
npx ESLint . --fix

# GDScript
gdformat <project>
```

**Important:** After `--fix`, re-运行 the check to report remaining issues that couldn't be auto-fixed.

### Phase 3.5: 类型 Checking (NEW)

运行 静态 类型 analysis before proceeding to 运行时 checks.

**Python:**
```Bash
mypy <包> --忽略-missing-imports --no-错误-概要
# or if pyproject.TOML has [tool.pyright]:
pyright <包>
```

**TypeScript:**
```Bash
npx tsc --noEmit
```

**GDScript:** Godot 4 has 内置 静态 typing but no standalone checker. Estimate 类型 覆盖率 manually:

```Bash
# Find untyped declarations
grep -rn "var \w\+ =" --include="*.gd" .       # Untyped variables
grep -rn "func \w\+(" --include="*.gd" . | grep -v ":"  # Untyped functions
```

Use the `estimate_type_coverage()` 函数 from `gdscript-profile.md` to calculate 覆盖率 per 文件:
```Python
# From gdscript-profile.md
def estimate_type_coverage(gd_file: str) -> 浮点数:
    """Count typed vs untyped declarations."""
    # See full implementation in gdscript-profile.md
```

Also check for `@warning_ignore` annotations which may hide 类型 issues.

**记录:** Total errors, categorized by severity.

### Phase 4: Smoke Tests (Business Logic)

测试 **后端/core functionality** — NOT UI components (that's Phase 5).

**api Discovery Heuristics:**

1. **Entry points:** Look for `主分支()`, `CLI()`, `app`, `create_app()`, `__main__.py`
2. **服务 层:** Find classes/modules named `*服务`, `*管理节点`, `*处理器`  
3. **Public api:** Check `__all__` exports in `__init__.py`
4. **FastAPI/Flask:** Find 路由 decorators (`@app.GET`, `@路由.POST`)
5. **CLI:** Find typer/click `@app.命令()` decorators
6. **SDK:** Look for 客户端 classes, public methods without `_` prefix

**For each discovered api, generate a minimal 测试:**
```Python
def smoke_test_user_service():
    """测试 UserService basic CRUD."""
    from myproject.services.用户 导入 UserService
    svc = UserService(db=":内存:")
    用户 = svc.create(name="测试")
    断言 用户.id is not 空值
    fetched = svc.GET(用户.id)
    断言 fetched.name == "测试"
    return "PASS"
```

**Guidelines:**
- 导入 + instantiate + call one 方法 with minimal valid input
- Use in-内存/temp resources (`:内存:`, `tempdir`)
- Each 测试 < 5 seconds
- 捕获 exceptions, report clearly

### Phase 5: UI/前端 Verification

测试 **UI components** separately from business logic.

| 框架 | 测试 方法 |
|-----------|-------------|
| **Gradio** | `from project.ui 导入 create_ui` (no `launch()`) |
| **Streamlit** | `streamlit 运行 app.py --headless` exits cleanly |
| **PyQt/PySide** | 集合 `QT_QPA_PLATFORM=offscreen`, 导入 widget modules |
| **React** | `npm 运行 构建` succeeds |
| **Vue** | `npm 运行 构建` succeeds |
| **Godot** | Scene files 解析 without 错误, 必需 scripts exist |
| **CLI** | `--help` on all subcommands returns 0 |

**Boundary:** Phase 4 tests "does the logic work?" Phase 5 tests "does the UI render?"

### Phase 6: 文件 Consistency

运行 `scripts/syntax_check.py` — compiles all source files to verify no 语法 errors.

> **Note:** Phase 2 (导入 Integrity) tests *运行时* 导入 behavior including initialization code. Phase 6 tests *静态* 语法 correctness. Both are needed: a 文件 can have valid 语法 but fail to 导入 (e.g., missing 依赖), or vice versa (语法 错误 in a 模块 that's never imported).

Check git 状态:
```Bash
git 状态 --short      # 应该 be 清理 (or report uncommitted changes)
git 差异 --check        # No 冲突 markers
```

### Phase 7: Documentation

运行 `scripts/docstring_check.py` (now checks `__init__.py` by default).

Also verify:
- README exists and is non-empty
- Key docs (更新日志, CONTRIBUTING) exist if referenced
- No stale TODO markers in docs claiming completion

## Verdict Logic

```
# Calculate 测试 failure rate
failure_rate = test_failures / total_tests

# Default thresholds (override in .qc-配置.YAML)
FAIL_THRESHOLD = 0.05  # 5%
WARN_THRESHOLD = 0.00  # 0%
TYPE_ERRORS_MAX = 0    # Default: strict (any 类型 错误 = FAIL)

# Verdict determination
if any([
    failure_rate > FAIL_THRESHOLD,
    critical_import_failure,
    type_check_errors > thresholds.type_errors_max,  # Configurable threshold
    lint_errors > thresholds.lint_errors_max,
]):
    verdict = "FAIL"
elif any([
    0 < failure_rate <= FAIL_THRESHOLD,
    optional_import_failures > 0,
    lint_warnings > thresholds.lint_warnings_max,
    missing_docstrings > 0,
    smoke_test_failures > 0,
]):
    verdict = "PASS with 警告"
else:
    verdict = "PASS"
```

## Baseline Comparison

保存 results to `.qc-baseline.JSON`:

```JSON
{
  "timestamp": "2026-02-15T15:00:00Z",
  "提交": "abc123",
  "verdict": "PASS with 警告",
  "配置": {
    "mode": "full",
    "thresholds": {"test_failure_rate": 0.05}
  },
  "phases": {
    "tests": {"total": 134, "passed": 134, "failed": 0, "覆盖率": 87.5},
    "imports": {"total": 50, "failed": 0, "optional_failed": 1, "critical_failed": 0},
    "types": {"errors": 0, "警告": 5},
    "lint": {"errors": 0, "警告": 12, "fixed": 8},
    "smoke": {"total": 14, "passed": 14},
    "docs": {"missing_docstrings": 3}
  }
}
```

On subsequent runs, report delta:
```
Tests:      134 → 140 (+6 ✅)
覆盖率:   87% → 91% (+4% ✅)
类型 errors: 0 → 0 (✅)
Lint 警告: 12 → 5 (-7 ✅)
```

## Report 输出

Generate in 3 formats:
1. **Markdown** (`qc-report.md`) — full detailed report for humans
2. **JSON** (`.qc-baseline.JSON`) — machine-readable for CI/comparison
3. **概要** (chat message) — 10-line digest for Discord/Slack

### 概要 Format Example

```
📊 QC Report: my-project @ abc123
Verdict: ✅ PASS with 警告

Tests:    134/134 passed (100%) | 覆盖率: 87%
Types:    0 errors
Lint:     0 errors, 12 警告
Imports:  50/50 (1 可选 failed)
Smoke:    14/14 passed

⚠️ 警告:
- 3 missing docstrings
- 12 lint 警告 (运行 with --fix)
```

## Language-Specific Profiles

Read the appropriate profile before running:
- **Python**: `references/Python-profile.md`
- **TypeScript**: `references/TypeScript-profile.md`
- **GDScript**: `references/gdscript-profile.md`
- **General** (any language): `references/general-profile.md`
