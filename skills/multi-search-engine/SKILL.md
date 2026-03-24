---
name: multi-search-engine
description: 集成 17 个搜索引擎（8 个国内 + 9 个国际），支持高级搜索语法、时间筛选、站点搜索、隐私搜索引擎及 WolframAlpha 知识查询。无需 API 密钥。
compatibility: 需要网络连接
tags:
  - git
  - ai
  - bash
---

# 多搜索引擎集成

集成 17 个搜索引擎，方便获取不同来源的信息。

## 国内搜索引擎

1. 百度搜索
2. 搜狗搜索
3. 360 搜索
4. 神马搜索
5. 必应搜索（国内版）
6. 头条搜索
7. 微博搜索
8. 微信搜索

## 国际搜索引擎

1. Google
2. Bing
3. DuckDuckGo
4. Yahoo
5. Ask
6. AOL
7. WolframAlpha
8. Brave
9. Startpage

## 基础用法

```bash
# 默认搜索（使用所有引擎）
search "查询内容"

# 使用特定引擎
search --engine google "查询内容"
search --engine baidu "查询内容"

# 限制结果数量
search --limit 10 "查询内容"
```

## 高级搜索

```bash
# 站内搜索
search --site github.com "关键字"

# 时间筛选
search --time-range "2024-01-01" "关键字"

# 隐私模式（不追踪）
search --privacy "敏感查询"
```

## 搜索语法

```bash
# 精确匹配
search "exact phrase"

# 排除词
search "word1 -word2"

# OR 搜索
search "word1 OR word2"

# 组合
search ""exact phrase" site:github.com -old"
```

## WolframAlpha 知识查询

```bash
# 数学计算
ask "2+2"

# 单位转换
ask "100 km to miles"

# 事实查询
ask "population of China"
```

## 最佳实践

1. 根据查询内容选择合适的搜索引擎
2. 国内内容用百度/搜狗，国际内容用 Google/Bing
3. 敏感查询使用隐私引擎
4. 复杂问题用 WolframAlpha
