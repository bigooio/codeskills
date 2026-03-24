---
name: code-stats
description: Visualizes repository complexity by counting files, lines of code, and grouping by extension. Use to assess project size or growth.
tags:
  - javascript
  - typescript
  - bash
---

# Code 统计

Analyzes the current 工作空间 to provide 开发环境 metrics.

## 使用方法

```Bash
节点 skills/code-统计/index.js [路径]
```

Defaults to current working directory if 路径 is omitted.

## 输出

JSON 对象 with:
- `files`: Total 文件 count.
- `lines`: Total line count (approximate).
- `byExt`: Breakdown by 文件 扩展.
