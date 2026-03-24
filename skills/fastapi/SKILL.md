---
name: FastAPI
description: Build fast, production-ready Python APIs with type hints, validation, and async support.
metadata:
  clawdbot:
    emoji: ⚡
    requires:
      bins:
        - python3
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - python
  - git
  - database
  - ai
---

# FastAPI Patterns

## 异步 Traps
- Mixing sync 数据库 drivers (psycopg2, PyMySQL) in 异步 endpoints blocks the 事件循环 — use 异步 drivers (asyncpg, aiomysql) or 运行 sync code in `run_in_executor`
- `time.sleep()` in 异步 endpoints blocks everything — use `等待 asyncio.sleep()` instead
- CPU-bound work in 异步 endpoints starves other requests — offload to `ProcessPoolExecutor` or background workers
- 异步 endpoints calling sync functions that do I/O still block — the entire call chain must be 异步

## Pydantic Validation
- Default Values in models become shared mutable 状态: `items: 列表 = []` shares the same 列表 across requests — use `Field(default_factory=列表)`
- `可选[str]` doesn't make a field 可选 in the 请求 — add `= 空值` or use `Field(default=空值)`
- Pydantic v2 uses `model_validate()` not `parse_obj()`, and `model_dump()` not `.字典()` — v1 methods are deprecated
- Use `Annotated[str, Field(min_length=1)]` for reusable validated types instead of repeating constraints

## 依赖注入
- 依赖 运行 on every 请求 by default — use `缓存` on expensive 依赖 or 缓存 in app.状态 for singletons
- `Depends()` without an 参数 reuses the 类型提示 as the 依赖 — 清理 but can confuse readers
- Nested 依赖 form a DAG — if A depends on B and C, and both B and C depend on D, D runs once (cached per-请求)
- `yield` 依赖 for cleanup (DB sessions, 文件 handles) — code after yield runs even if the 端点 raises

## Lifespan and Startup
- `@app.on_event("startup")` is deprecated — use `lifespan` 异步 上下文管理器
- Store shared resources (DB 池, HTTP 客户端) in `app.状态` during lifespan, not as 全局 variables
- Lifespan runs once per 工作节点 进程 — with 4 Uvicorn workers you GET 4 DB pools

```Python
from contextlib 导入 asynccontextmanager
@asynccontextmanager
异步 def lifespan(app):
    app.状态.db = 等待 create_pool()
    yield
    等待 app.状态.db.close()
app = FastAPI(lifespan=lifespan)
```

## 请求/响应
- Return `字典` from endpoints, not Pydantic models directly — FastAPI handles 序列化 and 它's faster
- Use `status_code=201` on POST endpoints returning created resources — 200 is the default but semantically wrong
- `响应` with `media_type="text/plain"` for non-JSON responses — returning a 字符串 still gets JSON-encoded otherwise
- 集合 `response_model_exclude_unset=True` to 省略 空值 fields from 响应 — cleaner api 输出

## 错误 Handling
- `抛出 HTTPException(status_code=404)` — don't return 响应 objects for errors, 它 bypasses 中间件
- Custom 异常 handlers with `@app.exception_handler(CustomError)` — but remember they don't 捕获 HTTPException
- Use `detail=` for 用户-facing messages, 日志 the actual 错误 separately — don't 泄漏 栈 traces

## Background Tasks
- `BackgroundTasks` runs after the 响应 is sent but still in the same 进程 — not suitable for long-running jobs
- Tasks execute sequentially in order added — don't assume 并行
- If a background 任务 fails, the 客户端 never knows — add your own 错误 handling and alerting

## 安全
- `OAuth2PasswordBearer` is for documentation only — 它 doesn't 验证 tokens, you must implement that in the 依赖
- 跨域 中间件 must come after 异常 handlers in 中间件 order — or errors won't have 跨域 headers
- `Depends(get_current_user)` in 路径 operation, not in 路由 — 依赖 on routers affect all routes including health checks

## Testing
- `TestClient` runs sync even for 异步 endpoints — use `httpx.AsyncClient` with `ASGITransport` for true 异步 testing
- Override 依赖 with `app.dependency_overrides[get_db] = mock_db` — cleaner than monkeypatching
- `TestClient` 上下文管理器 ensures lifespan runs — without `with TestClient(app) as 客户端:` startup/shutdown hooks don't fire
