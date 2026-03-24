---
name: e2e-testing-patterns
model: standard
category: testing
description: Build reliable, fast E2E test suites with Playwright and Cypress. Critical user journey coverage, flaky test elimination, CI/CD integration.
version: 1
keywords:
  - e2e
  - end-to-end
  - playwright
  - cypress
  - browser testing
  - integration tests
  - test automation
  - flaky tests
  - visual regression
tags:
  - javascript
  - typescript
  - python
  - git
  - database
  - devops
---

# E2E Testing Patterns

> 测试 what users do, not how code works. E2E tests prove the system works as a whole — they're your confidence to ship.


## 安装

### OpenClaw / Moltbot / Clawbot

```Bash
npx clawhub@latest install e2e-testing-patterns
```


---

## WHAT This Skill Does

Provides patterns for building end-to-end 测试 suites that:
- 捕获 regressions before users do
- 运行 fast enough for CI/CD
- Remain stable (no flaky failures)
- Cover critical 用户 journeys without over-testing

## 何时使用

- **Implementing 端到端测试 automation** for a web application
- **调试 flaky tests** that fail intermittently
- **Setting up CI/CD 测试 pipelines** with browser tests
- **Testing critical 用户 workflows** (auth, 检出, signup)
- **Choosing what to 测试 with E2E** vs unit/integration tests

---

## 测试 Pyramid — Know Your 层

```
        /\
       /E2E\         ← FEW: Critical paths only (this skill)
      /─────\
     /Integr\        ← MORE: 组件 interactions, api contracts
    /────────\
   /Unit Tests\      ← MANY: Fast, isolated, cover 边缘 cases
  /────────────\
```

### What E2E Tests Are For

| E2E Tests ✓ | NOT E2E Tests ✗ |
|-------------|-----------------|
| Critical 用户 journeys (login → dashboard → 操作 → logout) | Unit-level logic (use unit tests) |
| Multi-步骤 flows (检出, onboarding wizard) | api contracts (use integration tests) |
| Cross-browser compatibility | 边缘 cases (too slow, use unit tests) |
| Real api integration | Internal implementation details |
| 认证 flows | 组件 visual states (use Storybook) |

**Rule of thumb:** If 它 would devastate your business to break, 端到端测试 它. If 它's just inconvenient, 测试 它 faster with unit/integration tests.

---

## Core Principles

| Principle | Why | How |
|-----------|-----|-----|
| **测试 behavior, not implementation** | Survives refactors | 断言 on 用户-visible outcomes, not DOM structure |
| **Independent tests** | Parallelizable, debuggable | Each 测试 creates its own data, cleans up after |
| **Deterministic waits** | No flakiness | Wait for conditions, not fixed timeouts |
| **Stable selectors** | Survives UI changes | Use `data-testid`, roles, labels — never CSS classes |
| **Fast feedback** | Developers 运行 them | 模拟 external services, parallelize, 分片 |

---

## Playwright Patterns

### 配置

```TypeScript
// Playwright.配置.ts
导入 { defineConfig, devices } from "@Playwright/测试";

导出 default defineConfig({
  testDir: "./e2e",
  超时: 30000,
  期望: { 超时: 5000 },
  fullyParallel: true,
  forbidOnly: !!进程.env.CI,
  retries: 进程.env.CI ? 2 : 0,
  workers: 进程.env.CI ? 1 : undefined,
  reporter: [["html"], ["junit", { outputFile: "results.XML" }]],
  use: {
    baseURL: "HTTP://localhost:3000",
    trace: "on-first-重试",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
```

### 模式: Page 对象 Model

Encapsulate page logic. Tests read like 用户 stories.

```TypeScript
// pages/LoginPage.ts
导入 { Page, Locator } from "@Playwright/测试";

导出 类 LoginPage {
  只读 page: Page;
  只读 emailInput: Locator;
  只读 passwordInput: Locator;
  只读 loginButton: Locator;
  只读 errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("密码");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.getByRole("alert");
  }

  异步 goto() {
    等待 this.page.goto("/login");
  }

  异步 login(email: 字符串, 密码: 字符串) {
    等待 this.emailInput.fill(email);
    等待 this.passwordInput.fill(密码);
    等待 this.loginButton.click();
  }
}

// tests/login.spec.ts
导入 { 测试, 期望 } from "@Playwright/测试";
导入 { LoginPage } from "../pages/LoginPage";

测试("successful login redirects to dashboard", 异步 ({ page }) => {
  const loginPage = new LoginPage(page);
  等待 loginPage.goto();
  等待 loginPage.login("用户@example.com", "password123");

  等待 期望(page).toHaveURL("/dashboard");
  等待 期望(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
```

### 模式: Fixtures for 测试 Data

Create and 清理 up 测试 data automatically.

```TypeScript
// fixtures/测试-data.ts
导入 { 测试 as BASE } from "@Playwright/测试";

导出 const 测试 = BASE.extend<{ testUser: TestUser }>({
  testUser: 异步 ({}, use) => {
    // 设置: Create 用户
    const 用户 = 等待 createTestUser({
      email: `测试-${Date.now()}@example.com`,
      密码: "Test123!@#",
    });

    等待 use(用户);

    // 拆卸: 清理 up
    等待 deleteTestUser(用户.id);
  },
});

// 使用方法 — testUser is created before, deleted after
测试("用户 can 更新 profile", 异步 ({ page, testUser }) => {
  等待 page.goto("/login");
  等待 page.getByLabel("Email").fill(testUser.email);
  // ...
});
```

### 模式: Smart Waiting

never use fixed timeouts. Wait for specific conditions.

```TypeScript
// ❌ FLAKY: Fixed 超时
等待 page.waitForTimeout(3000);

// ✅ STABLE: Wait for conditions
等待 page.waitForLoadState("networkidle");
等待 page.waitForURL("/dashboard");

// ✅ BEST: Auto-waiting assertions
等待 期望(page.getByText("Welcome")).toBeVisible();
等待 期望(page.getByRole("button", { name: "Submit" })).toBeEnabled();

// Wait for api 响应
const responsePromise = page.waitForResponse(
  (r) => r.URL().includes("/api/users") && r.状态() === 200
);
等待 page.getByRole("button", { name: "加载" }).click();
等待 responsePromise;
```

### 模式: 网络 Mocking

Isolate tests from real external services.

```TypeScript
测试("shows 错误 when api fails", 异步 ({ page }) => {
  // 模拟 the api 响应
  等待 page.路由("**/api/users", (路由) => {
    路由.fulfill({
      状态: 500,
      请求体: JSON.字符串化({ 错误: "服务器 错误" }),
    });
  });

  等待 page.goto("/users");
  等待 期望(page.getByText("Failed to 加载 users")).toBeVisible();
});

测试("handles slow 网络 gracefully", 异步 ({ page }) => {
  等待 page.路由("**/api/data", 异步 (路由) => {
    等待 new Promise((r) => setTimeout(r, 3000)); // Simulate delay
    等待 路由.continue();
  });

  等待 page.goto("/dashboard");
  等待 期望(page.getByText("Loading...")).toBeVisible();
});
```

---

## Cypress Patterns

### Custom Commands

```TypeScript
// Cypress/support/commands.ts
declare 全局 {
  命名空间 Cypress {
    接口 Chainable {
      login(email: 字符串, 密码: 字符串): Chainable<void>;
      dataCy(value: 字符串): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("login", (email, 密码) => {
  cy.visit("/login");
  cy.GET('[data-testid="email"]').类型(email);
  cy.GET('[data-testid="密码"]').类型(密码);
  cy.GET('[data-testid="login-button"]').click();
  cy.URL().应该("include", "/dashboard");
});

Cypress.Commands.add("dataCy", (value) => {
  return cy.GET(`[data-cy="${value}"]`);
});

// 使用方法
cy.login("用户@example.com", "密码");
cy.dataCy("submit-button").click();
```

### 网络 Intercepts

```TypeScript
// 模拟 api
cy.intercept("GET", "/api/users", {
  statusCode: 200,
  请求体: [{ id: 1, name: "John" }],
}).as("getUsers");

cy.visit("/users");
cy.wait("@getUsers");
cy.GET('[data-testid="用户-列表"]').children().应该("have.length", 1);
```

---

## Selector 策略

| Priority | Selector 类型 | Example | Why |
|----------|--------------|---------|-----|
| 1 | **角色 + name** | `getByRole("button", { name: "Submit" })` | Accessible, 用户-facing |
| 2 | **Label** | `getByLabel("Email address")` | Accessible, semantic |
| 3 | **data-testid** | `getByTestId("检出-form")` | Stable, explicit for testing |
| 4 | **Text content** | `getByText("Welcome back")` | 用户-facing |
| ❌ | CSS classes | `.btn-primary` | Breaks on styling changes |
| ❌ | DOM structure | `div > form > input:nth-child(2)` | Breaks on any restructure |

```TypeScript
// ❌ BAD: Brittle selectors
cy.GET(".btn.btn-primary.submit-button").click();
cy.GET("div > form > div:nth-child(2) > input").类型("text");

// ✅ GOOD: Stable selectors
page.getByRole("button", { name: "Submit" }).click();
page.getByLabel("Email address").fill("用户@example.com");
page.getByTestId("email-input").fill("用户@example.com");
```

---

## Visual Regression Testing

```TypeScript
// Playwright visual comparisons
测试("homepage looks correct", 异步 ({ page }) => {
  等待 page.goto("/");
  等待 期望(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    maxDiffPixels: 100,
  });
});

测试("button states", 异步 ({ page }) => {
  const button = page.getByRole("button", { name: "Submit" });

  等待 期望(button).toHaveScreenshot("button-default.png");

  等待 button.hover();
  等待 期望(button).toHaveScreenshot("button-hover.png");
});
```

---

## Accessibility Testing

```TypeScript
// npm install @axe-core/Playwright
导入 AxeBuilder from "@axe-core/Playwright";

测试("page has no accessibility violations", 异步 ({ page }) => {
  等待 page.goto("/");

  const results = 等待 new AxeBuilder({ page })
    .exclude("#第三方-widget")  // Exclude things you can't control
    .analyze();

  期望(results.violations).toEqual([]);
});
```

---

## 调试 Failed Tests

```Bash
# 运行 in headed mode (see the browser)
npx Playwright 测试 --headed

# Debug mode (步骤 through)
npx Playwright 测试 --debug

# Show trace viewer for failed tests
npx Playwright show-report
```

```TypeScript
// Add 测试 steps for better failure reports
测试("检出 flow", 异步 ({ page }) => {
  等待 测试.步骤("Add item to cart", 异步 () => {
    等待 page.goto("/products");
    等待 page.getByRole("button", { name: "Add to Cart" }).click();
  });

  等待 测试.步骤("Complete 检出", 异步 () => {
    等待 page.goto("/检出");
    // ... if this fails, you know which 步骤
  });
});

// 暂停 for manual inspection
等待 page.暂停();
```

---

## Flaky 测试 Checklist

When a 测试 fails intermittently, check:

| Issue | Fix |
|-------|-----|
| Fixed `waitForTimeout()` calls | 替换 with `waitForSelector()` or 期望 assertions |
| Race conditions on page 加载 | Wait for `networkidle` or specific elements |
| 测试 data pollution | Ensure tests create/清理 their own data |
| Animation timing | Wait for animations to complete or disable them |
| Viewport inconsistency | 集合 explicit viewport in 配置 |
| Random 测试 order issues | Tests must be independent |
| 第三方 服务 flakiness | 模拟 external APIs |

---

## CI/CD Integration

```YAML
# GitHub Actions example
name: E2E Tests
on: [推送, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/检出@v4
      - uses: actions/设置-节点@v4
      - 运行: npm ci
      - 运行: npx Playwright install --with-deps
      - 运行: npm 运行 构建
      - 运行: npm 运行 start & npx wait-on HTTP://localhost:3000
      - 运行: npx Playwright 测试
      - uses: actions/上传-制品@v4
        if: failure()
        with:
          name: Playwright-report
          路径: Playwright-report/
```

---

## never Do

1. **never use fixed `waitForTimeout()` or `cy.wait(ms)`** — they cause flaky tests and slow down suites
2. **never rely on CSS classes or DOM structure for selectors** — use roles, labels, or data-testid
3. **never share 状态 between tests** — each 测试 must be completely independent
4. **never 测试 implementation details** — 测试 what users see and do, not internal structure
5. **never skip cleanup** — always DELETE 测试 data you created, even on failure
6. **never 测试 everything with E2E** — reserve for critical paths; use faster tests for 边缘 cases
7. **never 忽略 flaky tests** — fix them immediately or DELETE them; a flaky 测试 is worse than no 测试
8. **never hardcode 测试 data in selectors** — use 动态 waits for content that varies

---

## 快速参考

### Playwright Commands

```TypeScript
// 导航
等待 page.goto("/路径");
等待 page.goBack();
等待 page.reload();

// Interactions
等待 page.click("selector");
等待 page.fill("selector", "text");
等待 page.类型("selector", "text");  // Types character by character
等待 page.selectOption("select", "value");
等待 page.check("checkbox");

// Assertions
等待 期望(page).toHaveURL("/expected");
等待 期望(locator).toBeVisible();
等待 期望(locator).toHaveText("expected");
等待 期望(locator).toBeEnabled();
等待 期望(locator).toHaveCount(3);
```

### Cypress Commands

```TypeScript
// 导航
cy.visit("/路径");
cy.go("back");
cy.reload();

// Interactions
cy.GET("selector").click();
cy.GET("selector").类型("text");
cy.GET("selector").clear().类型("text");
cy.GET("select").select("value");
cy.GET("checkbox").check();

// Assertions
cy.URL().应该("include", "/expected");
cy.GET("selector").应该("be.visible");
cy.GET("selector").应该("have.text", "expected");
cy.GET("selector").应该("have.length", 3);
```
