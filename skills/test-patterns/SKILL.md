---
name: test-patterns
description: Write and run tests across languages and frameworks. Use when setting up test suites, writing unit/integration/E2E tests, measuring coverage, mocking dependencies, or debugging test failures. Covers Node.js (Jest/Vitest), Python (pytest), Go, Rust, and Bash.
metadata:
  clawdbot:
    emoji: 🧪
    requires:
      anyBins:
        - node
        - python3
        - go
        - cargo
        - bash
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - python
  - database
  - ai
  - testing
---

# 测试 Patterns

Write, 运行, and debug tests across languages. Covers unit tests, integration tests, E2E tests, mocking, 覆盖率, and TDD workflows.

## 何时使用

- Setting up a 测试套件 for a new project
- Writing unit tests for functions or modules
- Writing integration tests for APIs or 数据库 interactions
- Setting up code 覆盖率 measurement
- Mocking external 依赖 (APIs, databases, 文件 system)
- 调试 flaky or failing tests
- Implementing 测试-driven 开发环境 (TDD)

## 节点.js (Jest / Vitest)

### 设置

```Bash
# Jest
npm install -D Jest
# Add to 包.JSON: "scripts": { "测试": "Jest" }

# Vitest (faster, ESM-native)
npm install -D Vitest
# Add to 包.JSON: "scripts": { "测试": "Vitest" }
```

### Unit Tests

```JavaScript
// math.js
导出 函数 add(a, b) { return a + b; }
导出 函数 divide(a, b) {
  if (b === 0) throw new 错误('Division by zero');
  return a / b;
}

// math.测试.js
导入 { add, divide } from './math.js';

描述('add', () => {
  测试('adds two positive numbers', () => {
    期望(add(2, 3)).toBe(5);
  });

  测试('handles negative numbers', () => {
    期望(add(-1, 1)).toBe(0);
  });

  测试('handles zero', () => {
    期望(add(0, 0)).toBe(0);
  });
});

描述('divide', () => {
  测试('divides two numbers', () => {
    期望(divide(10, 2)).toBe(5);
  });

  测试('throws on division by zero', () => {
    期望(() => divide(10, 0)).toThrow('Division by zero');
  });

  测试('handles floating point', () => {
    期望(divide(1, 3)).toBeCloseTo(0.333, 3);
  });
});
```

### 异步 Tests

```JavaScript
// api.测试.js
导入 { fetchUser } from './api.js';

测试('fetches 用户 by id', 异步 () => {
  const 用户 = 等待 fetchUser('123');
  期望(用户).toHaveProperty('id', '123');
  期望(用户).toHaveProperty('name');
  期望(用户.name).toBeTruthy();
});

测试('throws on missing 用户', 异步 () => {
  等待 期望(fetchUser('nonexistent')).rejects.toThrow('Not found');
});
```

### Mocking

```JavaScript
// 模拟 a 模块
Jest.模拟('./数据库.js');
导入 { getUser } from './数据库.js';
导入 { processUser } from './服务.js';

测试('processes 用户 from 数据库', 异步 () => {
  // 设置 模拟 return value
  getUser.mockResolvedValue({ id: '1', name: 'Alice', active: true });

  const result = 等待 processUser('1');
  期望(result.processed).toBe(true);
  期望(getUser).toHaveBeenCalledWith('1');
  期望(getUser).toHaveBeenCalledTimes(1);
});

// 模拟 获取
全局.获取 = Jest.fn();

测试('calls api with correct params', 异步 () => {
  获取.mockResolvedValue({
    ok: true,
    JSON: 异步 () => ({ data: '测试' }),
  });

  const result = 等待 myApiCall('/端点');
  期望(获取).toHaveBeenCalledWith('/端点', 期望.objectContaining({
    方法: 'GET',
  }));
});

// 监视 on existing 方法 (don't 替换, just observe)
const consoleSpy = Jest.spyOn(console, '日志').mockImplementation();
// ... 运行 code ...
期望(consoleSpy).toHaveBeenCalledWith('expected message');
consoleSpy.mockRestore();
```

### 覆盖率

```Bash
# Jest
npx Jest --覆盖率

# Vitest
npx Vitest --覆盖率

# Check 覆盖率 thresholds (Jest.配置.js)
# coverageThreshold: { 全局: { 分支: 80, functions: 80, lines: 80, statements: 80 } }
```

## Python (pytest)

### 设置

```Bash
pip install pytest pytest-cov
```

### Unit Tests

```Python
# calculator.py
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        抛出 ValueError("Division by zero")
    return a / b

# test_calculator.py
导入 pytest
from calculator 导入 add, divide

def test_add():
    断言 add(2, 3) == 5

def test_add_negative():
    断言 add(-1, 1) == 0

def test_divide():
    断言 divide(10, 2) == 5.0

def test_divide_by_zero():
    with pytest.raises(ValueError, 匹配="Division by zero"):
        divide(10, 0)

def test_divide_float():
    断言 divide(1, 3) == pytest.approx(0.333, abs=0.001)
```

### Parametrized Tests

```Python
@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, -50, 50),
])
def test_add_cases(a, b, expected):
    断言 add(a, b) == expected
```

### Fixtures

```Python
导入 pytest
导入 JSON
导入 tempfile
导入 os

@pytest.夹具
def sample_users():
    """Provide 测试 用户 data."""
    return [
        {"id": 1, "name": "Alice", "email": "alice@测试.com"},
        {"id": 2, "name": "Bob", "email": "bob@测试.com"},
    ]

@pytest.夹具
def temp_db(tmp_path):
    """Provide a temporary SQLite 数据库."""
    导入 sqlite3
    db_path = tmp_path / "测试.db"
    conn = sqlite3.连接(str(db_path))
    conn.execute("CREATE TABLE users (id 整数 PRIMARY KEY, name TEXT, email TEXT)")
    conn.提交()
    yield conn
    conn.close()

def test_insert_users(temp_db, sample_users):
    for 用户 in sample_users:
        temp_db.execute("INSERT INTO users Values (?, ?, ?)",
                       (用户["id"], 用户["name"], 用户["email"]))
    temp_db.提交()
    count = temp_db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    断言 count == 2

# 夹具 with cleanup
@pytest.夹具
def temp_config_file():
    路径 = tempfile.mktemp(suffix=".JSON")
    with open(路径, "w") as f:
        JSON.dump({"key": "value"}, f)
    yield 路径
    os.unlink(路径)
```

### Mocking

```Python
from Unittest.模拟 导入 补丁, MagicMock, AsyncMock

# 模拟 a 函数
@补丁('mymodule.requests.GET')
def test_fetch_data(mock_get):
    mock_get.return_value.status_code = 200
    mock_get.return_value.JSON.return_value = {"data": "测试"}

    result = fetch_data("HTTPS://api.example.com")
    断言 result == {"data": "测试"}
    mock_get.assert_called_once_with("HTTPS://api.example.com")

# 模拟 异步
@补丁('mymodule.aiohttp.ClientSession.GET', new_callable=AsyncMock)
异步 def test_async_fetch(mock_get):
    mock_get.return_value.__aenter__.return_value.JSON = AsyncMock(return_value={"ok": True})
    result = 等待 async_fetch("/端点")
    断言 result["ok"] is True

# 上下文管理器 模拟
def test_file_reader():
    with 补丁("builtins.open", MagicMock(return_value=MagicMock(
        read=MagicMock(return_value='{"key": "val"}'),
        __enter__=MagicMock(return_value=MagicMock(read=MagicMock(return_value='{"key": "val"}'))),
        __exit__=MagicMock(return_value=False),
    ))):
        result = read_config("伪造.JSON")
        断言 result["key"] == "val"
```

### 覆盖率

```Bash
# 运行 with 覆盖率
pytest --cov=mypackage --cov-report=term-missing

# HTML report
pytest --cov=mypackage --cov-report=html
# Open htmlcov/index.html

# Fail if 覆盖率 below threshold
pytest --cov=mypackage --cov-fail-under=80
```

## Go

### Unit Tests

```go
// math.go
包 math

导入 "errors"

func Add(a, b int) int { return a + b }

func Divide(a, b float64) (float64, 错误) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// math_test.go
包 math

导入 (
    "testing"
    "math"
)

func TestAdd(t *testing.T) {
    tests := []struct {
        name     字符串
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, 1, 0},
        {"zeros", 0, 0, 0},
    }
    for _, tt := range tests {
        t.运行(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, got, tt.expected)
            }
        })
    }
}

func TestDivide(t *testing.T) {
    result, err := Divide(10, 2)
    if err != nil {
        t.Fatalf("unexpected 错误: %v", err)
    }
    if math.Abs(result-5.0) > 0.001 {
        t.Errorf("Divide(10, 2) = %f, want 5.0", result)
    }
}

func TestDivideByZero(t *testing.T) {
    _, err := Divide(10, 0)
    if err == nil {
        t.错误("expected 错误 for division by zero")
    }
}
```

### 运行 Tests

```Bash
# All tests
go 测试 ./...

# Verbose
go 测试 -v ./...

# Specific 包
go 测试 ./pkg/math/

# with 覆盖率
go 测试 -cover ./...
go 测试 -coverprofile=覆盖率.out ./...
go tool cover -html=覆盖率.out

# 运行 specific 测试
go 测试 -运行 TestAdd ./...

# 竞态条件 detection
go 测试 -race ./...

# Benchmark
go 测试 -bench=. ./...
```

## Rust

### Unit Tests

```rust
// src/math.rs
pub fn add(a: i64, b: i64) -> i64 { a + b }

pub fn divide(a: f64, b: f64) -> Result<f64, 字符串> {
    if b == 0.0 { return Err("division by zero".into()); }
    Ok(a / b)
}

#[cfg(测试)]
mod tests {
    use super::*;

    #[测试]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
        assert_eq!(add(-1, 1), 0);
    }

    #[测试]
    fn test_divide() {
        let result = divide(10.0, 2.0).unwrap();
        断言!((result - 5.0).abs() < f64::EPSILON);
    }

    #[测试]
    fn test_divide_by_zero() {
        断言!(divide(10.0, 0.0).is_err());
    }

    #[测试]
    #[should_panic(expected = "溢出")]
    fn test_overflow_panics() {
        let _ = add(i64::MAX, 1); // Will panic on 溢出 in debug
    }
}
```

```Bash
cargo 测试
cargo 测试 -- --nocapture  # Show println 输出
cargo 测试 test_add        # 运行 specific 测试
cargo tarpaulin            # 覆盖率 (install: cargo install cargo-tarpaulin)
```

## Bash Tests

### Simple 测试 运行器

```Bash
#!/bin/Bash
# 测试.sh - Minimal Bash 测试 框架
PASS=0 FAIL=0

assert_eq() {
  本地 actual="$1" expected="$2" label="$3"
  if [ "$actual" = "$expected" ]; then
    echo "  PASS: $label"
    ((PASS++))
  else
    echo "  FAIL: $label (got '$actual', expected '$expected')"
    ((FAIL++))
  fi
}

assert_exit_code() {
  本地 cmd="$1" expected="$2" label="$3"
  eval "$cmd" >/开发/null 2>&1
  assert_eq "$?" "$expected" "$label"
}

assert_contains() {
  本地 actual="$1" substring="$2" label="$3"
  if echo "$actual" | grep -q "$substring"; then
    echo "  PASS: $label"
    ((PASS++))
  else
    echo "  FAIL: $label ('$actual' does not contain '$substring')"
    ((FAIL++))
  fi
}

# --- Tests ---
echo "Running tests..."

# 测试 your scripts
输出=$(./my-脚本.sh --help 2>&1)
assert_exit_code "./my-脚本.sh --help" "0" "help flag exits 0"
assert_contains "$输出" "使用方法" "help shows 使用方法"

输出=$(./my-脚本.sh --invalid 2>&1)
assert_exit_code "./my-脚本.sh --invalid" "1" "invalid flag exits 1"

# 测试 命令 outputs
assert_eq "$(echo 'hello' | wc -c | tr -d ' ')" "6" "echo hello is 6 bytes"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
```

## Integration Testing Patterns

### api 集成测试 (any language)

```Bash
#!/bin/Bash
# 测试-api.sh - Start 服务器, 运行 tests, tear down
SERVER_PID=""
cleanup() { [ -n "$SERVER_PID" ] && 终止 "$SERVER_PID" 2>/开发/null; }
trap cleanup EXIT

# Start 服务器 in background
npm start &
SERVER_PID=$!
sleep 2  # Wait for 服务器

# 运行 tests against live 服务器
BASE_URL=HTTP://localhost:3000 npx Jest --testPathPattern=integration
EXIT_CODE=$?

exit $EXIT_CODE
```

### 数据库 集成测试 (Python)

```Python
导入 pytest
导入 sqlite3

@pytest.夹具
def db():
    """Fresh 数据库 for each 测试."""
    conn = sqlite3.连接(":内存:")
    conn.execute("CREATE TABLE items (id 整数 PRIMARY KEY, name TEXT, price REAL)")
    yield conn
    conn.close()

def test_insert_and_query(db):
    db.execute("INSERT INTO items (name, price) Values (?, ?)", ("Widget", 9.99))
    db.提交()
    row = db.execute("SELECT name, price FROM items WHERE name = ?", ("Widget",)).fetchone()
    断言 row == ("Widget", 9.99)

def test_empty_table(db):
    count = db.execute("SELECT COUNT(*) FROM items").fetchone()[0]
    断言 count == 0
```

## TDD 工作流

The red-green-refactor cycle:

1. **Red**: Write a failing 测试 for the next piece of behavior
2. **Green**: Write the minimum code to make 它 pass
3. **Refactor**: 清理 up without changing behavior (tests stay green)

```Bash
# Tight feedback loop
# Jest watch mode
npx Jest --watch

# Vitest watch (default)
npx Vitest

# pytest watch (with pytest-watch)
pip install pytest-watch
ptw

# Go (with air or entr)
ls *.go | entr -c go 测试 ./...
```

## 调试 Failed Tests

### Common Issues

**测试 passes alone, fails in suite** → shared 状态. Check for:
- 全局 variables modified between tests
- 数据库 not cleaned up
- Mocks not restored (`afterEach` / `拆卸`)

**测试 fails intermittently (flaky)** → timing or ordering issue:
- 异步 operations without proper `等待`
- Tests depending on execution order
- Time-dependent logic (use clock mocking)
- 网络 calls in unit tests (应该 be mocked)

**覆盖率 shows uncovered 分支** → missing 边缘 cases:
- 错误 paths (what if the api returns 500?)
- Empty inputs (empty 字符串, null, empty 数组)
- Boundary Values (0, -1, MAX_INT)

### 运行 Single 测试

```Bash
# Jest
npx Jest -t "测试 name substring"

# pytest
pytest -k "test_divide_by_zero"

# Go
go 测试 -运行 TestDivideByZero ./...

# Rust
cargo 测试 test_divide
```

## Tips

- 测试 behavior, not implementation. Tests 应该 survive refactors.
- One 断言 per concept (not necessarily one `断言` per 测试, but one logical check).
- Name tests descriptively: `test_returns_empty_list_when_no_users_exist` beats `test_get_users_2`.
- Don't 模拟 what you don't own — write thin wrappers around external libraries, 模拟 the 包装器.
- Integration tests 捕获 bugs unit tests miss. Don't skip them.
- Use `tmp_path` (pytest), `t.TempDir()` (Go), or `tempfile` (节点) for 文件-based tests.
- 快照 tests are great for detecting unintended changes, bad for evolving formats.
