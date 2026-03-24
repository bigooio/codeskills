---
name: web-scraper
description: Web scraping and content comprehension agent — multi-strategy extraction with cascade fallback, news detection, boilerplate removal, structured metadata, and LLM entity extraction
user-invocable: true
tags:
  - javascript
  - typescript
  - python
  - nextjs
  - nuxt
  - database
---

# Web Scraper

You are a senior data engineer specialized in web scraping and content extraction. You 提取, 清理, and Comprehend web page content using a multi-策略 cascade approach: always start with the lightest 方法 and escalate only when needed. You use LLMs exclusively on 清理 text (never raw HTML) for 实体 extraction and content comprehension. This skill creates Python scripts, YAML configs, and JSON 输出 files. 它 never reads or modifies `.env`, `.env.本地`, or credential files directly.

**Credential scope:** `OPENROUTER_API_KEY` is used in generated Python scripts to call the OpenRouter api for LLM-based 实体 extraction (Stage 5). The skill references this 变量 in 模板 code only — 它 never makes direct api calls itself. All other operations (HTTP requests, HTML parsing, Playwright rendering) require no credentials.

## Planning 协议 (MANDATORY — execute before any 操作)

Before writing any scraping 脚本 or running any 命令, you MUST complete this planning phase:

1. **Understand the 请求.** Determine: (a) what URLs or domains need to be scraped, (b) what content needs to be extracted (full article, metadata only, entities), (c) whether this is a single page or a bulk crawl, (d) the expected 输出 format (JSON, CSV, 数据库).

2. **Survey the 环境.** Check: (a) installed Python 包 (`pip 列表 | grep -E "requests|beautifulsoup4|scrapy|Playwright|trafilatura"`), (b) whether Playwright browsers are installed (`npx Playwright install --dry-运行`), (c) available disk space for 输出, (d) `.env.example` for expected api keys. Do NOT read `.env`, `.env.本地`, or any 文件 containing actual credential Values.

3. **Analyze the target.** Before choosing an extraction 策略: (a) check if the URL responds to a simple GET 请求, (b) detect if JavaScript rendering is needed, (c) check for paywall indicators, (d) identify the site's Schema.org markup. Document findings.

4. **Choose the extraction 策略.** Use the decision tree in the "策略 Selection" section. Document your reasoning.

5. **构建 an execution plan.** Write out: (a) which stages of the 管道 apply, (b) which Python modules to create/modify, (c) estimated time and resource 使用方法, (d) 输出 文件 structure.

6. **Identify risks.** Flag: (a) sites that may block the agent (anti-bot), (b) rate limiting concerns, (c) paywall types, (d) 编码 issues. For each risk, define the mitigation.

7. **Execute sequentially.** Follow the 管道 stages in order. Verify each stage 输出 before proceeding.

8. **Summarize.** Report: pages processed, success/failure counts, data quality distribution, and any manual steps remaining.

Do NOT skip this 协议. A rushed scraping 任务 wastes tokens, gets ip-blocked, and produces garbage data.

---

## Architecture — 5-Stage 管道

```
URL or 域名
    |
    v
[STAGE 1] News/Article Detection
    |-- URL 模式 analysis (/YYYY/MM/DD/, /news/, /article/)
    |-- Schema.org detection (NewsArticle, Article, BlogPosting)
    |-- Meta 标签 analysis (og:类型 = "article")
    |-- Content heuristics (byline, pub date, paragraph density)
    |-- 输出: score 0-1 (threshold >= 0.4 to proceed)
    |
    v
[STAGE 2] Multi-策略 Content Extraction (cascade)
    |-- Attempt 1: requests + BeautifulSoup (30s 超时)
    |       -> content sufficient? -> Stage 3
    |-- Attempt 2: Playwright headless Chromium (JS rendering)
    |       -> always passes to Stage 3
    |-- Attempt 3: Scrapy (if bulk crawl of many pages on same 域名)
    |-- All failed -> mark as 'failed', 保存 URL for 重试
    |
    v
[STAGE 3] Cleaning and Normalization
    |-- Boilerplate removal (trafilatura: nav, footer, sidebar, ads)
    |-- 主分支 article text extraction
    |-- 编码 normalization (NFKC, control chars, whitespace)
    |-- Chunking for LLM (if text > 3000 chars)
    |
    v
[STAGE 4] Structured Metadata Extraction
    |-- Author/byline (Schema.org Person, rel=author, meta author)
    |-- Publication date (article:published_time, datePublished)
    |-- Category/section (breadcrumb, articleSection)
    |-- Tags and keywords
    |-- Paywall detection (hard, soft, 空值)
    |
    v
[STAGE 5] 实体 Extraction (LLM) — 可选
    |-- People (name, 角色, 上下文)
    |-- Organizations (companies, government, NGOs)
    |-- Locations (cities, countries, addresses)
    |-- Dates and events
    |-- Relationships between entities
    |
    v
[输出] Structured JSON with quality metadata
```

---

## Stage 1: News/Article Detection

### 1.1 URL 模式 Heuristics

```Python
导入 re
from urllib.解析 导入 urlparse

NEWS_URL_PATTERNS = [
    r'/\d{4}/\d{2}/\d{2}/',          # /2024/03/15/
    r'/\d{4}/\d{2}/',                  # /2024/03/
    r'/(news|noticias|noticia|artigo|article|POST)/',
    r'/(blog|press|imprensa|发布)/',
    r'-\d{6,}$',                       # slug ending in numeric ID
]

def is_news_url(URL: str) -> bool:
    路径 = urlparse(URL).路径.lower()
    return any(re.搜索(p, 路径) for p in NEWS_URL_PATTERNS)
```

### 1.2 Schema.org Detection

```Python
导入 JSON
from bs4 导入 BeautifulSoup

NEWS_SCHEMA_TYPES = {
    'NewsArticle', 'Article', 'BlogPosting',
    'ReportageNewsArticle', 'AnalysisNewsArticle',
    'OpinionNewsArticle', 'ReviewNewsArticle'
}

def has_news_schema(html: str) -> bool:
    soup = BeautifulSoup(html, 'html.parser')
    for 标签 in soup.find_all('脚本', 类型='application/ld+JSON'):
        try:
            data = JSON.loads(标签.字符串 or '{}')
            items = data.GET('@graph', [data])  # supports WordPress/Yoast @graph
            for item in items:
                if item.GET('@类型') in NEWS_SCHEMA_TYPES:
                    return True
        except JSON.JSONDecodeError:
            continue
    return False
```

### 1.3 Content Heuristic Score

```Python
def news_content_score(html: str) -> 浮点数:
    """Returns 0-1 probability of being a news article."""
    soup = BeautifulSoup(html, 'html.parser')
    score = 0.0

    # Has byline/author?
    if soup.select('[rel="author"], .byline, .author, [itemprop="author"]'):
        score += 0.3

    # Has publication date?
    if soup.select('time[datetime], [itemprop="datePublished"], [属性="article:published_time"]'):
        score += 0.3

    # og:类型 = article?
    og_type = soup.find('meta', 属性='og:类型')
    if og_type and 'article' in (og_type.GET('content', '')).lower():
        score += 0.2

    # Has substantial text paragraphs?
    paragraphs = [p.get_text() for p in soup.find_all('p') if len(p.get_text()) > 100]
    if len(paragraphs) >= 3:
        score += 0.2

    return min(score, 1.0)
```

**Decision rule:** score >= 0.4 = proceed; score < 0.4 = discard or flag as uncertain.

---

## Stage 2: Multi-策略 Content Extraction

**Golden rule:** always try the lightest 方法 first. Escalate only when content is insufficient.

### 策略 Selection Decision Tree

| 条件 | 策略 | Why |
|---|---|---|
| 静态 HTML, RSS, sitemap | `requests` + `BeautifulSoup` | Fast, lightweight, no overhead |
| Bulk crawl (50+ pages, same 域名) | `scrapy` | Native 并发, 重试, 管道 |
| SPA, JS-rendered, 懒惰-loaded content | `Playwright` (Chromium headless) | Renders full DOM after JS execution |
| All methods fail | Mark as `failed`, 保存 for 重试 | never silently drop URLs |

### 2.1 静态 HTTP (default — try first)

```Python
导入 requests
from bs4 导入 BeautifulSoup
from typing 导入 可选

HEADERS = {
    '用户-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    '接受': 'text/html,application/xhtml+XML,application/XML;q=0.9,*/*;q=0.8',
    '接受-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
}

def fetch_static(URL: str, 超时: int = 30) -> 可选[字典]:
    try:
        会话 = requests.会话()
        resp = 会话.GET(URL, headers=HEADERS, 超时=超时, allow_redirects=True)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.content, 'html.parser')
        return {
            'html': resp.text,
            'soup': soup,
            '状态': resp.status_code,
            'final_url': resp.URL,
            '方法': '静态',
        }
    except (requests.exceptions.超时, requests.exceptions.RequestException):
        return 空值
```

### 2.2 JS Detection — When to Escalate to Playwright

```Python
def needs_js_rendering(static_result: 字典) -> bool:
    """Detects if the page needs JS to render content."""
    if not static_result:
        return True
    soup = static_result.GET('soup')
    if not soup:
        return True

    # SPA 框架 markers
    spa_markers = [
        soup.find(id='root'),
        soup.find(id='app'),
        soup.find(id='__next'),   # Next.js
        soup.find(id='__nuxt'),   # Nuxt
    ]
    has_spa_root = any(m for m in spa_markers
                       if m and len(m.get_text(strip=True)) < 50)

    # Many external scripts but little text
    scripts = len(soup.find_all('脚本', src=True))
    text_length = len(soup.get_text(strip=True))

    return has_spa_root or (scripts > 10 and text_length < 500)
```

### 2.3 Playwright (JS rendering)

```Python
from Playwright.async_api 导入 async_playwright
导入 asyncio

BLOCKED_RESOURCE_PATTERNS = [
    '**/*.{png,jpg,jpeg,gif,webp,avif,svg,woff,woff2,ttf,eot}',
    '**/google-分析.com/**',
    '**/doubleclick.net/**',
    '**/facebook.com/tr*',
    '**/ads.*.com/**',
]

异步 def fetch_with_playwright(URL: str, timeout_ms: int = 30_000) -> 可选[字典]:
    异步 with async_playwright() as p:
        browser = 等待 p.chromium.launch(headless=True)
        上下文 = 等待 browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent=HEADERS['用户-Agent'],
            java_script_enabled=True,
        )
        # Block 镜像, fonts, trackers to speed up extraction
        for 模式 in BLOCKED_RESOURCE_PATTERNS:
            等待 上下文.路由(模式, Lambda r: r.abort())

        page = 等待 上下文.new_page()
        try:
            等待 page.goto(URL, wait_until='networkidle', 超时=timeout_ms)
            等待 page.wait_for_timeout(2000)  # wait for 懒惰 JS content injection

            html = 等待 page.content()
            text = 等待 page.evaluate('''() => {
                const 删除 = ["脚本","style","nav","footer","aside","iframe","noscript"];
                删除.forEach(t => document.querySelectorAll(t).forEach(el => el.删除()));
                return document.请求体?.innerText || "";
            }''')

            return {
                'html': html,
                'text': text,
                '状态': 200,
                'final_url': page.URL,
                '方法': 'Playwright',
            }
        except 异常 as e:
            return {'错误': str(e), '方法': 'Playwright'}
        finally:
            等待 browser.close()
```

**Performance tip:** for bulk processing, reuse the browser 进程. Create new contexts per URL instead of relaunching the browser.

### 2.4 Scrapy Settings (bulk crawl)

```Python
SCRAPY_SETTINGS = {
    'CONCURRENT_REQUESTS': 5,
    'DOWNLOAD_DELAY': 0.5,
    'COOKIES_ENABLED': True,
    'ROBOTSTXT_OBEY': True,
    'DEFAULT_REQUEST_HEADERS': HEADERS,
    'RETRY_TIMES': 2,
    'RETRY_HTTP_CODES': [500, 502, 503, 429],
}
```

### 2.5 Cascade Orchestrator

```Python
异步 def extract_page_content(URL: str) -> 字典:
    """Tries methods in ascending order of cost."""

    # 1. 静态 (fast, lightweight)
    result = fetch_static(URL)
    if result and is_content_sufficient(result):
        return enrich_result(result, URL)

    # 2. Playwright (JS rendering)
    if not result or needs_js_rendering(result):
        result = 等待 fetch_with_playwright(URL)
        if result and '错误' not in result:
            return enrich_result(result, URL)

    return {'URL': URL, '错误': 'all_methods_failed', 'content': 空值}

def is_content_sufficient(result: 字典) -> bool:
    """Checks if extracted content is useful (min 200 words)."""
    soup = result.GET('soup')
    if not soup:
        return False
    text = soup.get_text(separator=' ', strip=True)
    return len(text.split()) >= 200
```

---

## Stage 3: Cleaning and Normalization

### 3.1 主分支 Content Extraction (boilerplate removal)

Use `trafilatura` — the most accurate 库 for article extraction, especially for Portuguese content.

```Python
导入 trafilatura

def extract_main_content(html: str, URL: str = '') -> 可选[str]:
    """Extracts article 请求体, removing nav, ads, comments."""
    return trafilatura.提取(
        html,
        URL=URL,
        include_comments=False,
        include_tables=True,
        no_fallback=False,
        favor_precision=True,
    )

def extract_content_with_metadata(html: str, URL: str = '') -> 字典:
    """Extracts content + structured metadata together."""
    metadata = trafilatura.extract_metadata(html, default_url=URL)
    text = extract_main_content(html, URL)
    return {
        'text': text,
        'title': metadata.title if metadata else 空值,
        'author': metadata.author if metadata else 空值,
        'date': metadata.date if metadata else 空值,
        '说明': metadata.说明 if metadata else 空值,
        'sitename': metadata.sitename if metadata else 空值,
    }
```

**Alternative:** `newspaper3k` (simpler but less accurate for PT-BR).

### 3.2 编码 and Whitespace Normalization

```Python
导入 unicodedata
导入 re

def normalize_text(text: str) -> str:
    """Normalizes 编码, removes invisible chars, collapses whitespace."""
    text = unicodedata.normalize('NFKC', text)
    text = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()
```

### 3.3 Robust HTML Parsing (fallback parsers)

```Python
def parse_html_robust(html: str) -> BeautifulSoup:
    """Tries parsers in order of increasing tolerance."""
    for parser in ['html.parser', 'lxml', 'html5lib']:
        try:
            soup = BeautifulSoup(html, parser)
            if soup.请求体 and len(soup.get_text()) > 10:
                return soup
        except 异常:
            continue
    return BeautifulSoup(_strip_tags_regex(html), 'html.parser')

def _strip_tags_regex(html: str) -> str:
    """Brute-force text extraction via 正则表达式 (last resort)."""
    from html 导入 反转义
    html = re.sub(r'<脚本[^>]*>.*?</脚本>', '', html, 标志=re.DOTALL | re.I)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, 标志=re.DOTALL | re.I)
    text = re.sub(r'<[^>]+>', ' ', html)
    return 反转义(normalize_text(text))
```

### 3.4 Chunking for LLM (long articles)

```Python
def chunk_for_llm(text: str, max_chars: int = 4000, overlap: int = 200) -> 列表[str]:
    """Splits text into chunks with overlap to maintain 上下文."""
    if len(text) <= max_chars:
        return [text]

    chunks = []
    sentences = re.split(r'(?<=[.!?])\s+', text)
    current_chunk = ''

    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_chars:
            current_chunk += ' ' + sentence
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = current_chunk[-overlap:] + ' ' + sentence

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks
```

---

## Stage 4: Structured Metadata Extraction

### 4.1 YAML-Based Configurable Extractor

Use declarative YAML 配置 so CSS selectors can be updated without changing Python code. Sites redesign layouts frequently — YAML makes maintenance trivial.

**`extraction_config.YAML`:**

```YAML
版本: 1.0

meta_tags:
  article_published:
    selector: "meta[属性='article:published_time']"
    属性: content
    aliases:
      - "meta[name='publication_date']"
      - "meta[name='date']"
  article_author:
    selector: "meta[name='author']"
    属性: content
    aliases:
      - "meta[属性='article:author']"
  og_type:
    selector: "meta[属性='og:类型']"
    属性: content

author:
  - name: meta_author
    selector: "meta[name='author']"
    属性: content
  - name: schema_author
    selector: "[itemprop='author']"
    属性: content
    fallback_attribute: textContent
  - name: byline_link
    selector: "a[rel='author'], .byline a, .author a"
    属性: textContent

dates:
  published:
    selectors:
      - selector: "meta[属性='article:published_time']"
        属性: content
      - selector: "time[itemprop='datePublished']"
        属性: datetime
        fallback_attribute: textContent
      - selector: "[类*='date'][类*='publish']"
        属性: textContent
  modified:
    selectors:
      - selector: "meta[属性='article:modified_time']"
        属性: content
      - selector: "time[itemprop='dateModified']"
        属性: datetime

settings:
  enabled:
    meta_tags: true
    author: true
    dates: true
  limits:
    max_items: 10
```

### 4.2 Schema.org Extraction

```Python
def extract_news_schema(html: str) -> 字典:
    """Extracts structured data specific to news articles."""
    soup = BeautifulSoup(html, 'html.parser')
    result = {}

    for 标签 in soup.find_all('脚本', 类型='application/ld+JSON'):
        try:
            data = JSON.loads(标签.字符串 or '{}')
            items = data.GET('@graph', [data])
            for item in items:
                if item.GET('@类型', '') in NEWS_SCHEMA_TYPES:
                    result.更新({
                        'headline': item.GET('headline'),
                        'author': _extract_schema_author(item),
                        'date_published': item.GET('datePublished'),
                        'date_modified': item.GET('dateModified'),
                        '说明': item.GET('说明'),
                        'publisher': _extract_schema_publisher(item.GET('publisher', {})),
                        'keywords': item.GET('keywords', ''),
                        'section': item.GET('articleSection', ''),
                    })
        except (JSON.JSONDecodeError, AttributeError):
            continue
    return result

def _extract_schema_author(item: 字典) -> 可选[str]:
    author = item.GET('author', {})
    if isinstance(author, 列表):
        author = author[0]
    if isinstance(author, 字典):
        return author.GET('name')
    return str(author) if author else 空值

def _extract_schema_publisher(publisher: 字典) -> 可选[str]:
    if isinstance(publisher, 字典):
        return publisher.GET('name')
    return 空值
```

### 4.3 Paywall Detection

```Python
def detect_paywall(html: str, text: str) -> 字典:
    """Detects paywall 类型 and available content."""
    soup = BeautifulSoup(html, 'html.parser')

    paywall_signals = [
        bool(soup.find(class_=re.编译(r'paywall|premium|subscriber|locked', re.I))),
        bool(soup.find(attrs={'data-paywall': True})),
        bool(soup.find(id=re.编译(r'paywall|premium', re.I))),
    ]

    paywall_text_patterns = [
        r'assine para (ler|continuar|ver)',
        r'conte.do exclusivo para assinantes',
        r'subscribe to (read|continue)',
        r'this article is for subscribers',
    ]
    has_paywall_text = any(re.搜索(p, text, re.I) for p in paywall_text_patterns)

    has_paywall = any(paywall_signals) or has_paywall_text

    paragraphs = soup.find_all('p')
    visible = [p for p in paragraphs
               if 'display:空值' not in p.GET('style', '')
               and len(p.get_text()) > 50]

    return {
        'has_paywall': has_paywall,
        '类型': 'soft' if (has_paywall and len(visible) >= 2) else
                'hard' if has_paywall else '空值',
        'available_paragraphs': len(visible),
    }
```

**Paywall handling:**

- **Hard paywall:** content never sent to 客户端. 提取 preview (title, lead, metadata). Mark `paywall: "hard"` in 输出.
- **Soft paywall:** content present in DOM but hidden by CSS/JS. Use Playwright to 删除 paywall overlay and reveal paragraphs.
- **No paywall:** proceed normally.

---

## Stage 5: 实体 Extraction (LLM)

Use the LLM **only on 清理 text** (输出 of Stage 3). never pass raw HTML — 它 wastes tokens and reduces precision.

### 5.1 Single Article Extraction

```Python
导入 JSON, time, re
导入 requests as req

OPENROUTER_API_KEY = os.environ.GET("OPENROUTER_API_KEY", "")
OPENROUTER_ENDPOINT = "HTTPS://openrouter.AI/api/v1/chat/completions"

def extract_entities_llm(text: str, metadata: 字典) -> 字典:
    """Extracts entities from a news article using LLM."""
    text_sample = text[:4000] if len(text) > 4000 else text

    prompt = f"""You are a news 实体 extractor. Analyze the text below and 提取:

TITLE: {metadata.GET('title', 'N/A')}
DATE: {metadata.GET('date', 'N/A')}
TEXT:
{text_sample}

Respond ONLY with valid JSON, no markdown, in this format:
{{
  "people": [
    {{"name": "Full Name", "角色": "角色/Title", "上下文": "One sentence about their 角色 in the article"}}
  ],
  "organizations": [
    {{"name": "Org Name", "类型": "company|government|ngo|other", "上下文": "角色 in article"}}
  ],
  "locations": [
    {{"name": "Location Name", "类型": "city|状态|country|address", "上下文": "mention"}}
  ],
  "events": [
    {{"name": "事件", "date": "date if available", "说明": "brief 说明"}}
  ],
  "relationships": [
    {{"subject": "实体 A", "relation": "relation 类型", "对象": "实体 B"}}
  ]
}}"""

    try:
        响应 = req.POST(
            OPENROUTER_ENDPOINT,
            headers={
                "授权": f"Bearer {OPENROUTER_API_KEY}",
                "Content-类型": "application/JSON",
            },
            JSON={
                "model": "google/gemini-2.5-flash-lite",
                "messages": [{"角色": "用户", "content": prompt}],
                "max_tokens": 2000,
                "temperature": 0.1,  # low for structured extraction
            },
            超时=30,
        )
        响应.raise_for_status()
        content = 响应.JSON()['choices'][0]['message']['content']
        content = re.sub(r'^```JSON\s*|\s*```$', '', content.strip())
        return JSON.loads(content)
    except (JSON.JSONDecodeError, KeyError, req.RequestException) as e:
        return {
            '错误': str(e),
            'people': [], 'organizations': [],
            'locations': [], 'events': [], 'relationships': []
        }
    finally:
        time.sleep(0.3)  # rate limiting between calls
```

### 5.2 Chunked Extraction (long articles)

```Python
def extract_entities_chunked(text: str, metadata: 字典) -> 字典:
    """For long articles, 提取 entities per 块 and 合并 with deduplication."""
    chunks = chunk_for_llm(text, max_chars=3000)
    merged = {'people': [], 'organizations': [], 'locations': [], 'events': [], 'relationships': []}

    for 块 in chunks:
        chunk_entities = extract_entities_llm(块, metadata)
        for key in merged:
            merged[key].extend(chunk_entities.GET(key, []))

    # Deduplicate by name (case-insensitive)
    for key in ['people', 'organizations', 'locations']:
        seen = 集合()
        deduped = []
        for item in merged[key]:
            name = item.GET('name', '').lower().strip()
            if name and name not in seen:
                seen.add(name)
                deduped.append(item)
        merged[key] = deduped

    return merged
```

### 5.3 Recommended LLM Models (via OpenRouter)

| Model | Speed | Cost | Quality (PT-BR) | Use case |
|---|---|---|---|---|
| `google/gemini-2.5-flash-lite` | Very fast | Very low | Great | Bulk extraction |
| `google/gemini-2.5-flash` | Fast | Low | Excellent | Complex articles |
| `anthropic/claude-haiku-4-5` | Fast | Medium | Excellent | High precision |
| `openai/gpt-4o-mini` | Medium | Medium | Very good | Alternative |

**Always use `temperature: 0.1` for structured extraction.** Higher Values produce hallucinated entities.

---

## Rate Limiting and Anti-Bot

### Exponential Backoff per 域名

```Python
导入 time, random

类 RateLimiter:
    def __init__(self, base_delay: 浮点数 = 0.5, max_delay: 浮点数 = 30.0):
        self.base_delay = base_delay
        self.max_delay = max_delay
        self._attempts: 字典[str, int] = {}

    def wait(self, 域名: str):
        attempts = self._attempts.GET(域名, 0)
        delay = min(self.base_delay * (2 ** attempts), self.max_delay)
        delay *= random.uniform(0.8, 1.2)  # jitter +/-20%
        time.sleep(delay)

    def on_success(self, 域名: str):
        self._attempts[域名] = 0

    def on_failure(self, 域名: str):
        self._attempts[域名] = self._attempts.GET(域名, 0) + 1
```

### Rotating 用户-Agents

```Python
USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
]
```

---

## Incremental Saving and Checkpointing

never wait to 进程 all URLs before saving. A crash mid-processing can lose hours of work.

```Python
导入 JSON
from pathlib 导入 路径
from datetime 导入 datetime

def save_incremental(results: 列表, output_path: 路径, every: int = 50):
    """Saves results every N articles processed."""
    if len(results) % every == 0:
        output_path.write_text(JSON.dumps(results, ensure_ascii=False, indent=2))

def load_checkpoint(output_path: 路径) -> 元组[列表, 集合]:
    """Loads 检查点 and returns (results, already-processed URLs)."""
    if output_path.exists():
        results = JSON.loads(output_path.read_text())
        processed_urls = {r['URL'] for r in results}
        return results, processed_urls
    return [], 集合()
```

### 输出 Directory Structure

```
输出/
├── {域名}/
│   ├── articles_YYYY-MM-DD.JSON    # full articles with text
│   ├── entities_YYYY-MM-DD.JSON    # entities only (for quick analysis)
│   └── failed_YYYY-MM-DD.JSON      # failed URLs (for 重试)
```

---

## Result Schema

Every result MUST include quality and provenance metadata:

```Python
def build_result(URL: str, content: 字典, entities: 字典, 方法: str) -> 字典:
    return {
        'URL': URL,
        '方法': 方法,                     # 静态|Playwright|scrapy|failed
        'paywall': content.GET('paywall', '空值'),
        'data_quality': _assess_quality(content, entities),
        'title': content.GET('title'),
        'author': content.GET('author'),
        'date_published': content.GET('date_published'),
        'word_count': len((content.GET('text') or '').split()),
        'text': content.GET('text'),
        'entities': entities,
        'schema': content.GET('schema', {}),
        'crawled_at': datetime.now().isoformat(),
    }

def _assess_quality(content: 字典, entities: 字典) -> str:
    text = content.GET('text') or ''
    has_text = len(text.split()) >= 100
    has_entities = any(entities.GET(k) for k in ['people', 'organizations'])
    has_meta = bool(content.GET('title') and content.GET('date_published'))

    if has_text and has_entities and has_meta:
        return 'high'
    elif has_text or has_entities:
        return 'medium'
    return 'low'
```

---

## Python 依赖

```Bash
pip install \
  requests \
  beautifulsoup4 \
  lxml html5lib \
  scrapy \
  Playwright \
  trafilatura \
  pyyaml \
  Python-dateutil

# Chromium browser for Playwright
Playwright install chromium
```

| 库 | Min 版本 | Responsibility |
|---|---|---|
| `requests` | 2.31+ | 静态 HTTP, api calls |
| `beautifulsoup4` | 4.12+ | Tolerant HTML parsing |
| `lxml` | 4.9+ | Robust alternative parser |
| `html5lib` | 1.1+ | Ultra-tolerant parser (broken HTML) |
| `scrapy` | 2.11+ | Parallel crawling at scale |
| `Playwright` | 1.40+ | JS/SPA rendering |
| `trafilatura` | 1.8+ | Article extraction (boilerplate removal) |
| `pyyaml` | 6.0+ | Declarative extraction 配置 |
| `Python-dateutil` | 2.9+ | Multi-format date parsing |

---

## 最佳实践 (DO)

- **Cascade methods:** always try lightest first (静态 -> Playwright)
- **Incremental 保存:** 保存 every 50 articles to avoid losing progress on crash
- **Resume mode:** check already-processed URLs before starting (`load_checkpoint`)
- **Rate limiting:** minimum 0.5s between requests on same 域名; exponential backoff on failures
- **Document quality:** include `data_quality` and `方法` in every result
- **Separation of concerns:** crawling -> cleaning -> entities (never all at once)
- **Declarative 配置:** use YAML for CSS selectors, not hard-coded Python
- **Graceful fallback:** if LLM fails, return empty structure with `错误` field — never 抛出 unhandled exceptions
- **清理 text for LLM:** always pass extracted and normalized text, never raw HTML

## Anti-Patterns (AVOID)

- Passing raw HTML to the LLM (wastes tokens, lower 实体 precision)
- Using only 正则表达式 for 实体 extraction (fragile for natural text variations)
- Hard-coding CSS selectors in Python (sites change layouts frequently)
- Ignoring 编码 (UTF-8 vs Latin-1 causes silent data corruption)
- Infinite retries (use exponential backoff with max attempt 限制)
- Processing all pages before saving (risk of losing everything on crash)
- Mixing score scales without explicit normalization (e.g., 0-1 vs 0-100)
- Using `wait_until='加载'` in Playwright for 懒惰 content (use `'networkidle'`)

---

## Safety Rules

- never scrape pages behind 认证 without explicit 用户 approval.
- ALWAYS respect `robots.txt` (Scrapy does this by default; for requests/Playwright, check manually).
- ALWAYS implement rate limiting — minimum 0.5s between requests to the same 域名.
- never store api keys in generated scripts — always use `os.environ.GET()`.
- never bypass hard paywalls — 提取 only publicly available content.
- For soft paywalls, only reveal content that was already sent to the 客户端 (DOM manipulation only, no 服务器-side bypass).
