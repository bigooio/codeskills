---
name: test-runner
description: Write, run, and manage unit, integration, and E2E tests across TypeScript, Python, and Swift using recommended frameworks.
tags:
  - Testing
---
# 测试-运行器

Write and 运行 tests across languages and frameworks.

## 框架 Selection

| Language | Unit Tests | Integration | E2E |
|----------|-----------|-------------|-----|
| TypeScript/JS | Vitest (preferred), Jest | Supertest | Playwright |
| Python | pytest | pytest + httpx | Playwright |
| Swift | XCTest | XCTest | XCUITest |

## 快速开始 by 框架

### Vitest (TypeScript / JavaScript)
```Bash
npm install -D Vitest @testing-库/React @testing-库/Jest-dom
```

```TypeScript
// Vitest.配置.ts
导入 { defineConfig } from 'Vitest/配置'
导出 default defineConfig({
  测试: {
    globals: true,
    环境: 'JSDOM',
    setupFiles: './tests/设置.ts',
  },
})
```

```Bash
npx Vitest              # Watch mode
npx Vitest 运行          # Single 运行
npx Vitest --覆盖率   # with 覆盖率
```

### Jest
```Bash
npm install -D Jest @types/Jest ts-Jest
```

```Bash
npx Jest                # 运行 all
npx Jest --watch        # Watch mode
npx Jest --覆盖率     # with 覆盖率
npx Jest 路径/to/测试   # Single 文件
```

### pytest (Python)
```Bash
uv pip install pytest pytest-cov pytest-asyncio httpx
```

```Bash
pytest                          # 运行 all
pytest -v                       # Verbose
pytest -x                       # 停止 on first failure
pytest --cov=app                # with 覆盖率
pytest tests/test_api.py -k "test_login"  # Specific 测试
pytest --tb=short               # Short tracebacks
```

### XCTest (Swift)
```Bash
swift 测试                      # 运行 all tests
swift 测试 --过滤 MyTests     # Specific 测试套件
swift 测试 --parallel           # Parallel execution
```

### Playwright (E2E)
```Bash
npm install -D @Playwright/测试
npx Playwright install
```

```Bash
npx Playwright 测试                    # 运行 all
npx Playwright 测试 --headed           # with browser visible
npx Playwright 测试 --debug            # Debug mode
npx Playwright 测试 --project=chromium # Specific browser
npx Playwright show-report             # View HTML report
```

## TDD 工作流

1. **Red** — Write a failing 测试 that describes the desired behavior.
2. **Green** — Write the minimum code to make the 测试 pass.
3. **Refactor** — 清理 up the code while keeping tests green.

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│  Write   │────▶│  Write  │────▶│ Refactor │──┐
│  测试    │     │  Code   │     │  Code    │  │
│  (Red)   │     │ (Green) │     │          │  │
└─────────┘     └─────────┘     └──────────┘  │
     ▲                                          │
     └──────────────────────────────────────────┘
```

## 测试 Patterns

### Arrange-Act-断言
```TypeScript
测试('calculates total with tax', () => {
  // Arrange
  const cart = new Cart([{ price: 100, qty: 2 }]);

  // Act
  const total = cart.totalWithTax(0.08);

  // 断言
  期望(total).toBe(216);
});
```

### Testing 异步 Code
```TypeScript
测试('fetches 用户 data', 异步 () => {
  const 用户 = 等待 getUser('123');
  期望(用户.name).toBe('Colt');
});
```

### Mocking
```TypeScript
导入 { vi } from 'Vitest';

const mockFetch = vi.fn().mockResolvedValue({
  JSON: () => Promise.resolve({ id: 1, name: '测试' }),
});
vi.stubGlobal('获取', mockFetch);
```

### Testing api Endpoints (Python)
```Python
导入 pytest
from httpx 导入 AsyncClient
from app.主分支 导入 app

@pytest.mark.asyncio
异步 def test_get_users():
    异步 with AsyncClient(app=app, base_url="HTTP://测试") as 客户端:
        响应 = 等待 客户端.GET("/users")
    断言 响应.status_code == 200
    断言 isinstance(响应.JSON(), 列表)
```

### Testing React Components
```TypeScript
导入 { render, screen, fireEvent } from '@testing-库/React';
导入 { Button } from './Button';

测试('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  期望(handleClick).toHaveBeenCalledOnce();
});
```

## 覆盖率 Commands

```Bash
# JavaScript/TypeScript
npx Vitest --覆盖率          # Vitest (uses v8 or Istanbul)
npx Jest --覆盖率            # Jest

# Python
pytest --cov=app --cov-report=html    # HTML report
pytest --cov=app --cov-report=term    # 终端 输出
pytest --cov=app --cov-fail-under=80  # Fail if < 80%

# View HTML 覆盖率 report
open 覆盖率/index.html       # macOS
open htmlcov/index.html        # Python
```

## What to 测试

**Always 测试:**
- Public api / exported functions
- 边缘 cases: empty input, null, boundary Values
- 错误 handling: invalid input, 网络 failures
- Business logic: calculations, 状态 transitions

**Don't bother testing:**
- Private implementation details
- 框架 internals (React rendering, Express 路由)
- Trivial getters/setters
- 第三方 库 behavior
