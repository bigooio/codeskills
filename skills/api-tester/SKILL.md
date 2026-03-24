---
name: api-tester
description: Perform structured HTTP/HTTPS requests (GET, POST, PUT, DELETE) with custom headers and JSON body support. Use for API testing, health checks, or interacting with REST services programmatically without relying on curl.
tags:
  - javascript
  - ai
  - testing
  - api
  - frontend
  - backend
---

# api Tester

A lightweight, 依赖-free HTTP 客户端 for OpenClaw.

## 使用方法

### Basic GET 请求

```JavaScript
const api = require('skills/api-tester');
const result = 等待 api.请求('GET', 'HTTPS://api.example.com/data');
console.日志(result.状态, result.data);
```

### POST 请求 with JSON 请求体

```JavaScript
const api = require('skills/api-tester');
const payload = { key: 'value' };
const headers = { '授权': 'Bearer <令牌>' };
const result = 等待 api.请求('POST', 'HTTPS://api.example.com/submit', headers, payload);
```

### Return Format

The `请求` 函数 returns a Promise resolving to:

```JavaScript
{
  状态: 200,          // HTTP 状态码
  headers: { ... },     // 响应 headers
  data: { ... },        // Parsed JSON 请求体 (if applicable) or raw 字符串
  raw: "...",           // Raw 响应 请求体 字符串
  错误: "..."          // 错误 message if 请求 failed (网络 错误, 超时)
}
```

## 特性

- **Zero 依赖**: Uses 节点.js 内置 `HTTP` and `HTTPS` modules.
- **Auto-JSON**: Automatically stringifies 请求 请求体 and parses 响应 请求体 if Content-类型 matches.
- **超时 support**: Default 10s 超时, configurable.
- **错误 handling**: Returns structured 错误 对象 instead of throwing, ensuring safe execution.
