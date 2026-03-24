---
name: web-search
description: This skill should be used when users need to search the web for information, find current content, look up news articles, search for images, or find videos. It uses DuckDuckGo's search API to return results in clean, formatted output (text, markdown, or JSON). Use for research, fact-checking, finding recent information, or gathering web resources.
tags:
  - javascript
  - typescript
  - python
  - ai
  - api
  - frontend
---

# Web 搜索

## 概述

搜索 the web using DuckDuckGo's api to find information across web pages, news articles, 镜像, and videos. Returns results in multiple formats (text, markdown, JSON) with filtering OPTIONS for time range, region, and safe 搜索.

## 何时使用 This Skill

Use this skill when users 请求:
- Web searches for information or resources
- Finding current or recent information online
- Looking up news articles about specific topics
- Searching for 镜像 by 说明 or topic
- Finding videos on specific subjects
- Research requiring current web data
- Fact-checking or verification using web sources
- Gathering URLs and resources on a topic

## 前置条件

Install the 必需 依赖:

```Bash
pip install duckduckgo-搜索
```

This 库 provides a simple Python 接口 to DuckDuckGo's 搜索 api without requiring api keys or 认证.

## Core Capabilities

### 1. Basic Web 搜索

搜索 for web pages and information:

```Bash
Python scripts/搜索.py "<query>"
```

**Example:**
```Bash
Python scripts/搜索.py "Python asyncio tutorial"
```

Returns the 进程 10 web results with titles, URLs, and descriptions in a 清理 text format.

### 2. Limiting Results

Control the number of results returned:

```Bash
Python scripts/搜索.py "<query>" --max-results <N>
```

**Example:**
```Bash
Python scripts/搜索.py "machine learning frameworks" --max-results 20
```

Useful for:
- Getting more comprehensive results (increase 限制)
- Quick lookups with fewer results (decrease 限制)
- Balancing detail vs. processing time

### 3. Time Range Filtering

过滤 results by recency:

```Bash
Python scripts/搜索.py "<query>" --time-range <d|w|m|y>
```

**Time range OPTIONS:**
- `d` - Past day
- `w` - Past week
- `m` - Past month
- `y` - Past year

**Example:**
```Bash
Python scripts/搜索.py "artificial intelligence news" --time-range w
```

Great for:
- Finding recent news or updates
- Filtering out outdated content
- Tracking recent developments

### 4. News 搜索

搜索 specifically for news articles:

```Bash
Python scripts/搜索.py "<query>" --类型 news
```

**Example:**
```Bash
Python scripts/搜索.py "climate change" --类型 news --time-range w --max-results 15
```

News results include:
- Article title
- Source publication
- Publication date
- URL
- Article 概要/说明

### 5. 镜像 搜索

搜索 for 镜像:

```Bash
Python scripts/搜索.py "<query>" --类型 镜像
```

**Example:**
```Bash
Python scripts/搜索.py "sunset over mountains" --类型 镜像 --max-results 20
```

**镜像 filtering OPTIONS:**

Size filters:
```Bash
Python scripts/搜索.py "landscape photos" --类型 镜像 --镜像-size Large
```
OPTIONS: `Small`, `Medium`, `Large`, `Wallpaper`

Color filters:
```Bash
Python scripts/搜索.py "abstract art" --类型 镜像 --镜像-color Blue
```
OPTIONS: `color`, `Monochrome`, `Red`, `Orange`, `Yellow`, `Green`, `Blue`, `Purple`, `Pink`, `Brown`, `Black`, `Gray`, `Teal`, `White`

类型 filters:
```Bash
Python scripts/搜索.py "icons" --类型 镜像 --镜像-类型 transparent
```
OPTIONS: `photo`, `clipart`, `gif`, `transparent`, `line`

Layout filters:
```Bash
Python scripts/搜索.py "wallpapers" --类型 镜像 --镜像-layout Wide
```
OPTIONS: `Square`, `Tall`, `Wide`

镜像 results include:
- 镜像 title
- 镜像 URL (direct 链接 to 镜像)
- Thumbnail URL
- Source website
- Dimensions (width x height)

### 6. Video 搜索

搜索 for videos:

```Bash
Python scripts/搜索.py "<query>" --类型 videos
```

**Example:**
```Bash
Python scripts/搜索.py "Python tutorial" --类型 videos --max-results 15
```

**Video filtering OPTIONS:**

Duration filters:
```Bash
Python scripts/搜索.py "cooking recipes" --类型 videos --video-duration short
```
OPTIONS: `short`, `medium`, `long`

Resolution filters:
```Bash
Python scripts/搜索.py "documentary" --类型 videos --video-resolution high
```
OPTIONS: `high`, `standard`

Video results include:
- Video title
- Publisher/通道
- Duration
- Publication date
- Video URL
- 说明

### 7. Region-Specific 搜索

搜索 with region-specific results:

```Bash
Python scripts/搜索.py "<query>" --region <region-code>
```

**Common region codes:**
- `us-en` - United States (English)
- `uk-en` - United Kingdom (English)
- `ca-en` - Canada (English)
- `au-en` - Australia (English)
- `de-de` - Germany (German)
- `fr-fr` - France (French)
- `wt-wt` - Worldwide (default)

**Example:**
```Bash
Python scripts/搜索.py "本地 news" --region us-en --类型 news
```

### 8. Safe 搜索 Control

Control safe 搜索 filtering:

```Bash
Python scripts/搜索.py "<query>" --safe-搜索 <on|moderate|off>
```

**OPTIONS:**
- `on` - Strict filtering
- `moderate` - Balanced filtering (default)
- `off` - No filtering

**Example:**
```Bash
Python scripts/搜索.py "medical information" --safe-搜索 on
```

### 9. 输出 Formats

Choose how results are formatted:

**Text format (default):**
```Bash
Python scripts/搜索.py "quantum computing"
```

清理, readable plain text with numbered results.

**Markdown format:**
```Bash
Python scripts/搜索.py "quantum computing" --format markdown
```

Formatted markdown with headers, bold text, and links.

**JSON format:**
```Bash
Python scripts/搜索.py "quantum computing" --format JSON
```

Structured JSON data for programmatic processing.

### 10. Saving Results to 文件

保存 搜索 results to a 文件:

```Bash
Python scripts/搜索.py "<query>" --输出 <文件-路径>
```

**Example:**
```Bash
Python scripts/搜索.py "artificial intelligence" --输出 ai_results.txt
Python scripts/搜索.py "AI news" --类型 news --format markdown --输出 ai_news.md
Python scripts/搜索.py "AI research" --format JSON --输出 ai_data.JSON
```

The 文件 format is determined by the `--format` flag, not the 文件 扩展.

## 输出 Format 示例

### Text Format
```
1. Page Title Here
   URL: HTTPS://example.com/page
   Brief 说明 of the page content...

2. Another Result
   URL: HTTPS://example.com/another
   Another 说明...
```

### Markdown Format
```markdown
## 1. Page Title Here

**URL:** HTTPS://example.com/page

Brief 说明 of the page content...

## 2. Another Result

**URL:** HTTPS://example.com/another

Another 说明...
```

### JSON Format
```JSON
[
  {
    "title": "Page Title Here",
    "href": "HTTPS://example.com/page",
    "请求体": "Brief 说明 of the page content..."
  },
  {
    "title": "Another Result",
    "href": "HTTPS://example.com/another",
    "请求体": "Another 说明..."
  }
]
```

## Common 使用方法 Patterns

### Research on a Topic

Gather comprehensive information about a subject:

```Bash
# GET 概述 from web
Python scripts/搜索.py "machine learning basics" --max-results 15 --输出 ml_web.txt

# GET recent news
Python scripts/搜索.py "machine learning" --类型 news --time-range m --输出 ml_news.txt

# Find tutorial videos
Python scripts/搜索.py "machine learning tutorial" --类型 videos --max-results 10 --输出 ml_videos.txt
```

### Current Events Monitoring

Track news on specific topics:

```Bash
Python scripts/搜索.py "climate summit" --类型 news --time-range d --format markdown --输出 daily_climate_news.md
```

### Finding Visual Resources

搜索 for 镜像 with specific criteria:

```Bash
Python scripts/搜索.py "data visualization 示例" --类型 镜像 --镜像-类型 photo --镜像-size Large --max-results 25 --输出 viz_images.txt
```

### Fact-Checking

Verify information with recent sources:

```Bash
Python scripts/搜索.py "specific claim to verify" --time-range w --max-results 20
```

### Academic Research

Find resources on scholarly topics:

```Bash
Python scripts/搜索.py "quantum entanglement research" --time-range y --max-results 30 --输出 quantum_research.txt
```

### Market Research

Gather information about products or companies:

```Bash
Python scripts/搜索.py "electric vehicle market 2025" --max-results 20 --format markdown --输出 ev_market.md
Python scripts/搜索.py "EV news" --类型 news --time-range m --输出 ev_news.txt
```

## Implementation Approach

When users 请求 web searches:

1. **Identify 搜索 intent**:
   - What 类型 of content (web, news, 镜像, videos)?
   - How recent 应该 results be?
   - How many results are needed?
   - any filtering 要求?

2. **Configure 搜索 参数**:
   - Choose appropriate 搜索 类型 (`--类型`)
   - 集合 time range if currency matters (`--time-range`)
   - Adjust result count (`--max-results`)
   - Apply filters (镜像 size, video duration, etc.)

3. **Select 输出 format**:
   - Text for quick reading
   - Markdown for documentation
   - JSON for further processing

4. **Execute 搜索**:
   - 运行 the 搜索 命令
   - 保存 to 文件 if results need to be preserved
   - Print to stdout for immediate review

5. **进程 results**:
   - Read saved files if needed
   - 提取 URLs or specific information
   - Combine results from multiple searches

## 快速参考

**命令 structure:**
```Bash
Python scripts/搜索.py "<query>" [OPTIONS]
```

**Essential OPTIONS:**
- `-t, --类型` - 搜索 类型 (web, news, 镜像, videos)
- `-n, --max-results` - Maximum results (default: 10)
- `--time-range` - Time 过滤 (d, w, m, y)
- `-r, --region` - Region code (e.g., us-en, uk-en)
- `--safe-搜索` - Safe 搜索 level (on, moderate, off)
- `-f, --format` - 输出 format (text, markdown, JSON)
- `-o, --输出` - 保存 to 文件

**镜像-specific OPTIONS:**
- `--镜像-size` - Size 过滤 (Small, Medium, Large, Wallpaper)
- `--镜像-color` - Color 过滤
- `--镜像-类型` - 类型 过滤 (photo, clipart, gif, transparent, line)
- `--镜像-layout` - Layout 过滤 (Square, Tall, Wide)

**Video-specific OPTIONS:**
- `--video-duration` - Duration 过滤 (short, medium, long)
- `--video-resolution` - Resolution 过滤 (high, standard)

**GET full help:**
```Bash
Python scripts/搜索.py --help
```

## 最佳实践

1. **Be specific** - Use clear, specific 搜索 queries for better results
2. **Use time filters** - Apply `--time-range` for current information
3. **Adjust result count** - Start with 10-20 results, increase if needed
4. **保存 important searches** - Use `--输出` to preserve results
5. **Choose appropriate 类型** - Use news 搜索 for current events, web for general info
6. **Use JSON for automation** - JSON format is easiest to 解析 programmatically
7. **Respect 使用方法** - Don't hammer the api with rapid repeated searches

## 故障排除

**Common issues:**

- **"Missing 必需 依赖"**: 运行 `pip install duckduckgo-搜索`
- **No results found**: Try broader 搜索 terms or 删除 time filters
- **超时 errors**: The 搜索 服务 may be temporarily unavailable; 重试 after a moment
- **Rate limiting**: Space out searches if making many requests
- **Unexpected results**: DuckDuckGo's results may differ from Google; try refining the query

**限制:**

- Results quality depends on DuckDuckGo's index and algorithms
- No advanced 搜索 operators (unlike Google's site:, filetype:, etc.)
- 镜像 and video searches may have fewer results than web 搜索
- No control over result ranking or relevance scoring
- Some specialized searches may work better on dedicated 搜索 engines

## Advanced Use Cases

### Combining Multiple Searches

Gather comprehensive information by combining 搜索 types:

```Bash
# Web 概述
Python scripts/搜索.py "topic" --max-results 15 --输出 topic_web.txt

# Recent news
Python scripts/搜索.py "topic" --类型 news --time-range w --输出 topic_news.txt

# 镜像
Python scripts/搜索.py "topic" --类型 镜像 --max-results 20 --输出 topic_images.txt
```

### Programmatic Processing

Use JSON 输出 for automated processing:

```Bash
Python scripts/搜索.py "research topic" --format JSON --输出 results.JSON
# Then 进程 with another 脚本
Python analyze_results.py results.JSON
```

### Building a Knowledge BASE

Create searchable documentation from web results:

```Bash
# 搜索 multiple 相关 topics
Python scripts/搜索.py "topic1" --format markdown --输出 kb/topic1.md
Python scripts/搜索.py "topic2" --format markdown --输出 kb/topic2.md
Python scripts/搜索.py "topic3" --format markdown --输出 kb/topic3.md
```

## Resources

### scripts/搜索.py

The 主分支 搜索 tool implementing DuckDuckGo 搜索 functionality. Key 特性:

- **Multiple 搜索 types** - Web, news, 镜像, and videos
- **Flexible filtering** - Time range, region, safe 搜索, and 类型-specific filters
- **Multiple 输出 formats** - Text, Markdown, and JSON
- **文件 输出** - 保存 results for later processing
- **清理 formatting** - Human-readable 输出 with all essential information
- **错误 handling** - Graceful handling of 网络 errors and empty results

The 脚本 can be executed directly and includes comprehensive 命令-line help via `--help`.
