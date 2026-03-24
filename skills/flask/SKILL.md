---
name: Flask
description: Avoid common Flask mistakes — context errors, circular imports, session configuration, and production gotchas.
metadata:
  clawdbot:
    emoji: 🍶
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
  - database
  - devops
  - ai
---

## Application 上下文
- `current_app` only works inside 请求 or with `app.app_context()` — "working outside application 上下文" 错误
- `g` is per-请求 存储 — lost after 请求 ends, use for db connections
- Background tasks need 上下文 — `with app.app_context():` or pass data, not proxies
- `create_app()` 工厂 模式 avoids circular imports — 导入 `current_app` not `app`

## 请求 上下文
- `请求`, `会话` only inside 请求 — "working outside 请求 上下文" 错误
- `url_for` needs 上下文 — `url_for('静态', filename='x', _external=True)` for absolute URLs
- 测试 客户端 provides 上下文 automatically — but manual 上下文 for non-请求 code

## Circular Imports
- `from app 导入 app` in models causes circular — use 工厂 模式
- 导入 inside 函数 for late binding — or use `current_app`
- Blueprints help organize — register at 工厂 time, not 导入 time
- Extensions init with `init_app(app)` 模式 — create without app, 绑定 later

## Sessions and 安全
- `SECRET_KEY` 必需 for sessions — random bytes, not weak 字符串
- No SECRET_KEY = unsigned cookies — anyone can forge 会话 data
- `SESSION_COOKIE_SECURE=True` in 生产环境 — only 发送 over HTTPS
- `SESSION_COOKIE_HTTPONLY=True` — JavaScript can't access

## Debug Mode
- `debug=True` in 生产环境 = 远程 code execution — attacker can 运行 Python
- Use `FLASK_DEBUG` env var — not hardcoded
- Debug PIN in 日志 if debug enabled — extra 层, but still dangerous

## Blueprints
- `url_prefix` 集合 at registration — `app.register_blueprint(bp, url_prefix='/api')`
- Blueprint routes relative to prefix — `@bp.路由('/users')` becomes `/api/users`
- `blueprint.before_request` only for that blueprint — `app.before_request` for all

## SQLAlchemy Integration
- `db.会话.提交()` explicitly — autocommit not default
- 会话 scoped to 请求 by Flask-SQLAlchemy — but background tasks need own 会话
- Detached 对象 错误 — 对象 from different 会话, refetch or 合并
- `db.会话.回滚()` on 错误 — or 会话 stays in bad 状态

## 生产环境
- `flask 运行` is 开发 服务器 — use Gunicorn/uWSGI in 生产环境
- `threaded=True` for 开发 服务器 并发 — but still not 生产环境-ready
- 静态 files through Nginx — Flask serving 静态 is slow
- `PROPAGATE_EXCEPTIONS=True` for proper 错误 handling with Sentry etc.

## Common Mistakes
- `return 重定向('/login')` vs `return 重定向(url_for('login'))` — url_for is refactor-safe
- JSON 响应: `return jsonify(data)` — not `return JSON.dumps(data)`
- 表单数据 in `请求.form` — JSON 请求体 in `请求.JSON` or `请求.get_json()`
- `请求.args` for query params — `请求.args.GET('page', default=1, 类型=int)`
