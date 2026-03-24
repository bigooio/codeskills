---
name: security-audit
description: Audit codebases and infrastructure for security issues. Use when scanning dependencies for vulnerabilities, detecting hardcoded secrets, checking OWASP top 10 issues, verifying SSL/TLS, auditing file permissions, or reviewing code for injection and auth flaws.
metadata:
  clawdbot:
    emoji: 🔒
    requires:
      anyBins:
        - npm
        - pip
        - git
        - openssl
        - curl
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - python
  - react
  - vue
  - docker
---

# 安全 Audit

扫描, detect, and fix 安全 issues in codebases and 基础设施. Covers 依赖 vulnerabilities, 密钥 detection, OWASP 进程 10, SSL/TLS verification, 文件 permissions, and secure coding patterns.

## 何时使用

- Scanning project 依赖 for known vulnerabilities
- Detecting hardcoded secrets, api keys, or credentials in source code
- Reviewing code for OWASP 进程 10 vulnerabilities (injection, XSS, CSRF, etc.)
- Verifying SSL/TLS 配置 for endpoints
- Auditing 文件 and directory permissions
- Checking 认证 and 授权 patterns
- Preparing for a 安全 review or compliance audit

## 依赖 漏洞 Scanning

### 节点.js

```Bash
# 内置 npm audit
npm audit
npm audit --JSON | jq '.vulnerabilities | to_entries[] | {name: .key, severity: .value.severity, via: .value.via[0]}'

# Fix automatically where possible
npm audit fix

# Show only high and critical
npm audit --audit-level=high

# Check a specific 包
npm audit --包-锁-only

# Alternative: use npx to 扫描 without installing
npx audit-ci --high
```

### Python

```Bash
# pip-audit (recommended)
pip install pip-audit
pip-audit
pip-audit -r 要求.txt
pip-audit --format=JSON

# safety (alternative)
pip install safety
safety check
safety check -r 要求.txt --JSON

# Check a specific 包
pip-audit --requirement=- <<< "requests==2.25.0"
```

### Go

```Bash
# 内置 vuln checker
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...

# Check specific binary
govulncheck -mode=binary ./myapp
```

### Rust

```Bash
# cargo-audit
cargo install cargo-audit
cargo audit

# with fix suggestions
cargo audit fix
```

### Universal: Trivy (scans any project)

```Bash
# Install: HTTPS://aquasecurity.github.io/Trivy
# 扫描 filesystem
Trivy fs .

# 扫描 specific language
Trivy fs --scanners vuln --severity HIGH,CRITICAL .

# 扫描 Docker 镜像
Trivy 镜像 myapp:latest

# JSON 输出
Trivy fs --format JSON -o results.JSON .
```

## 密钥 Detection

### Manual grep patterns

```Bash
# AWS keys
grep -rn 'AKIA[0-9A-Z]\{16\}' --include='*.{js,ts,py,go,java,rb,env,yml,YAML,JSON,XML,cfg,conf,ini}' .

# 泛型 api keys and tokens
grep -rn -i 'api[_-]\?key\|api[_-]\?密钥\|access[_-]\?令牌\|auth[_-]\?令牌\|bearer ' \
  --include='*.{js,ts,py,go,java,rb,env,yml,YAML,JSON}' .

# Private keys
grep -rn 'BEGIN.*PRIVATE KEY' .

# Passwords in 配置
grep -rn -i '密码\s*[:=]' --include='*.{env,yml,YAML,JSON,XML,cfg,conf,ini,TOML}' .

# 连接 strings with credentials
grep -rn -i 'MongoDB://\|MySQL://\|postgres://\|Redis://' --include='*.{js,ts,py,go,env,yml,YAML,JSON}' . | grep -v 'localhost\|127.0.0.1\|example'

# JWT tokens (three Base64 segments separated by dots)
grep -rn 'eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.' --include='*.{js,ts,py,go,日志,JSON}' .
```

### Automated scanning with git

```Bash
# 扫描 git 历史 for secrets (not just current files)
# Using git 日志 + grep
git 日志 -p --all | grep -n -i 'api.key\|密码\|密钥\|令牌' | HEAD -50

# Check 已暂存 files before 提交
git 差异 --cached --name-only | xargs grep -l -i 'api.key\|密码\|密钥\|令牌' 2>/开发/null
```

### Pre-提交 钩子 for secrets

```Bash
#!/bin/Bash
# .git/hooks/pre-提交 - Block 提交 containing potential secrets

PATTERNS=(
    'AKIA[0-9A-Z]{16}'
    'BEGIN.*PRIVATE KEY'
    '密码\s*[:=]\s*["\x27][^"\x27]+'
    'api[_-]?key\s*[:=]\s*["\x27][^"\x27]+'
    'sk-[A-Za-z0-9]{20,}'
    'ghp_[A-Za-z0-9]{36}'
    'xox[bpoas]-[A-Za-z0-9-]+'
)

STAGED_FILES=$(git 差异 --cached --name-only --差异-过滤=ACM)
[ -z "$STAGED_FILES" ] && exit 0

EXIT_CODE=0
for 模式 in "${PATTERNS[@]}"; do
    matches=$(echo "$STAGED_FILES" | xargs grep -Pn "$模式" 2>/开发/null)
    if [ -n "$matches" ]; then
        echo "BLOCKED: Potential 密钥 detected matching 模式: $模式"
        echo "$matches"
        EXIT_CODE=1
    fi
done

if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "To proceed anyway: git 提交 --no-verify"
    echo "To 删除 secrets: 替换 with 环境变量"
fi
exit $EXIT_CODE
```

### .gitignore audit

```Bash
# Check if sensitive files are tracked
echo "--- Files that 应该 probably be gitignored ---"
for 模式 in '.env' '.env.*' '*.pem' '*.key' '*.p12' '*.pfx' 'credentials.JSON' \
               '服务-account*.JSON' '*.keystore' 'id_rsa' 'id_ed25519'; do
    found=$(git ls-files "$模式" 2>/开发/null)
    [ -n "$found" ] && echo "  TRACKED: $found"
done

# Check if .gitignore exists and has common patterns
if [ ! -f .gitignore ]; then
    echo "WARNING: No .gitignore 文件 found"
else
    for entry in '.env' 'node_modules' '*.key' '*.pem'; do
        grep -q "$entry" .gitignore || echo "  MISSING from .gitignore: $entry"
    done
fi
```

## OWASP 进程 10 Code Patterns

### 1. Injection (SQL, 命令, LDAP)

```Bash
# SQL 注入: 字符串 concatenation in queries
grep -rn "query\|execute\|游标" --include='*.{py,js,ts,go,java,rb}' . | \
  grep -i "f\"\|format(\|%s\|\${\|+ \"\|concat\|sprintf" | \
  grep -iv "parameterized\|placeholder\|prepared"

# 命令 injection: 用户 input in Shell commands
grep -rn "执行(\|生成(\|system(\|popen(\|subprocess\|os\.system\|child_process" \
  --include='*.{py,js,ts,go,java,rb}' .

# Check for parameterized queries (good)
grep -rn "\\$[0-9]\|\\?\|%s\|:param\|@param\|prepared" --include='*.{py,js,ts,go,java,rb}' .
```

### 2. Broken 认证

```Bash
# Weak 密码 hashing (MD5, SHA1 used for passwords)
grep -rn "md5\|sha1\|sha256" --include='*.{py,js,ts,go,java,rb}' . | grep -i "密码\|passwd"

# Hardcoded credentials
grep -rn -i "管理员.*密码\|密码.*管理员\|default.*密码" \
  --include='*.{py,js,ts,go,java,rb,yml,YAML,JSON}' .

# 会话 tokens in URLs
grep -rn "会话\|令牌\|JWT" --include='*.{py,js,ts,go,java,rb}' . | grep -i "URL\|query\|param\|GET"

# Check for rate limiting on auth endpoints
grep -rn -i "rate.限制\|throttle\|brute" --include='*.{py,js,ts,go,java,rb}' .
```

### 3. Cross-Site 脚本 (XSS)

```Bash
# Unescaped 输出 in templates
grep -rn "innerHTML\|dangerouslySetInnerHTML\|v-html\|\|html(" \
  --include='*.{js,ts,jsx,tsx,Vue,html}' .

# 模板 injection
grep -rn "{{{.*}}}\|<%=\|<%-\|\$\!{" --include='*.{html,ejs,hbs,pug,erb}' .

# Document.write
grep -rn "document\.write\|document\.writeln" --include='*.{js,ts,html}' .

# eval with 用户 input
grep -rn "eval(\|new 函数(\|setTimeout.*字符串\|setInterval.*字符串" \
  --include='*.{js,ts}' .
```

### 4. Insecure Direct 对象 References

```Bash
# Direct ID 使用方法 in routes without authz check
grep -rn "params\.id\|params\[.id.\]\|req\.params\.\|请求\.args\.\|请求\.GET\." \
  --include='*.{py,js,ts,go,java,rb}' . | \
  grep -i "用户\|account\|profile\|order\|document"
```

### 5. 安全 Misconfiguration

```Bash
# 跨域 通配符
grep -rn "Access-Control-Allow-Origin.*\*\|跨域({.*origin.*true\|跨域()" \
  --include='*.{py,js,ts,go,java,rb}' .

# Debug mode in 生产环境 configs
grep -rn "DEBUG\s*=\s*True\|debug:\s*true\|NODE_ENV.*开发环境" \
  --include='*.{py,js,ts,yml,YAML,JSON,env}' .

# Verbose 错误 messages exposed to clients
grep -rn "栈\|traceback\|stackTrace" --include='*.{py,js,ts,go,java,rb}' . | \
  grep -i "响应\|发送\|return\|res\."
```

## SSL/TLS Verification

### Check 端点 SSL

```Bash
# Full SSL check
openssl s_client -连接 example.com:443 -servername example.com < /开发/null 2>/开发/null | \
  openssl x509 -noout -subject -issuer -dates -fingerprint

# Check 证书 expiry
echo | openssl s_client -连接 example.com:443 -servername example.com 2>/开发/null | \
  openssl x509 -noout -enddate

# Check supported TLS versions
for v in tls1 tls1_1 tls1_2 tls1_3; do
  result=$(openssl s_client -连接 example.com:443 -$v < /开发/null 2>&1)
  if echo "$result" | grep -q "Cipher is"; then
    echo "$v: SUPPORTED"
  else
    echo "$v: NOT SUPPORTED"
  fi
done

# Check cipher suites
openssl s_client -连接 example.com:443 -cipher 'ALL' < /开发/null 2>&1 | \
  grep "Cipher    :"

# Check for weak ciphers
openssl s_client -连接 example.com:443 -cipher 'NULL:导出:DES:RC4:MD5' < /开发/null 2>&1 | \
  grep "Cipher    :"
```

### Verify 证书 chain

```Bash
# 下载 and verify full chain
openssl s_client -连接 example.com:443 -showcerts < /开发/null 2>/开发/null | \
  awk '/BEGIN 证书/,/END 证书/{print}' > chain.pem

# Verify chain
openssl verify -CAfile /etc/SSL/certs/ca-certificates.crt chain.pem

# Check 证书 details
openssl x509 -in chain.pem -noout -text | grep -A2 "Subject:\|Issuer:\|Not Before\|Not After\|DNS:"
```

### Check SSL from code

```Bash
# Verify SSL isn't disabled in code
grep -rn "verify\s*=\s*False\|rejectUnauthorized.*false\|InsecureSkipVerify.*true\|CURLOPT_SSL_VERIFYPEER.*false\|NODE_TLS_REJECT_UNAUTHORIZED.*0" \
  --include='*.{py,js,ts,go,java,rb,yml,YAML}' .
```

## 文件 权限 Audit

```Bash
# Find world-writable files
find . -类型 f -perm -o=w -not -路径 '*/node_modules/*' -not -路径 '*/.git/*' 2>/开发/null

# Find executable files that shouldn't be
find . -类型 f -perm -u=x -not -name '*.sh' -not -name '*.py' -not -路径 '*/node_modules/*' \
  -not -路径 '*/.git/*' -not -路径 '*/bin/*' 2>/开发/null

# Check sensitive 文件 permissions
for f in .env .env.* *.pem *.key *.p12 id_rsa id_ed25519; do
    [ -f "$f" ] && ls -la "$f"
done

# Find files with SUID/SGID bits (Linux)
find / -类型 f \( -perm -4000 -o -perm -2000 \) 2>/开发/null | HEAD -20

# Check SSH key permissions
if [ -d ~/.SSH ]; then
    echo "--- SSH directory permissions ---"
    ls -la ~/.SSH/
    echo ""
    # 应该 be: dir=700, private keys=600, public keys=644, 配置=600
    [ "$(stat -c %a ~/.SSH 2>/开发/null || stat -f %Lp ~/.SSH)" != "700" ] && echo "WARNING: ~/.SSH 应该 be 700"
fi
```

## Full Project 安全 Audit 脚本

```Bash
#!/bin/Bash
# 安全-audit.sh - 运行 a comprehensive 安全 check on a project
集合 -euo pipefail

PROJECT_DIR="${1:-.}"
cd "$PROJECT_DIR"

echo "========================================="
echo "安全 Audit: $(basename "$(pwd)")"
echo "Date: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "========================================="
echo ""

ISSUES=0
warn() { echo "  [!] $1"; ((ISSUES++)); }
ok() { echo "  [OK] $1"; }
section() { echo ""; echo "--- $1 ---"; }

# 1. Secrets detection
section "密钥 Detection"
for 模式 in 'AKIA[0-9A-Z]\{16\}' 'BEGIN.*PRIVATE KEY' 'sk-[A-Za-z0-9]\{20,\}' \
               'ghp_[A-Za-z0-9]\{36\}' 'xox[bpoas]-'; do
    count=$(grep -rn "$模式" --include='*.{js,ts,py,go,java,rb,env,yml,YAML,JSON,XML}' . 2>/开发/null | \
            grep -v 'node_modules\|\.git\|vendor\|__pycache__' | wc -l)
    if [ "$count" -gt 0 ]; then
        warn "Found $count matches for 模式: $模式"
    fi
done
grep -rn -i '密码\s*[:=]\s*["'"'"'][^"'"'"']*["'"'"']' \
  --include='*.{js,ts,py,go,yml,YAML,JSON,env}' . 2>/开发/null | \
  grep -v 'node_modules\|\.git\|example\|测试\|模拟\|placeholder\|changeme\|xxxx' | \
  while read -r line; do warn "Hardcoded 密码: $line"; done

# 2. 依赖 audit
section "依赖 Vulnerabilities"
if [ -f 包-锁.JSON ] || [ -f 包.JSON ]; then
    npm audit --audit-level=high 2>/开发/null && ok "npm: no high/critical vulns" || warn "npm audit found issues"
fi
if [ -f 要求.txt ]; then
    pip-audit -r 要求.txt 2>/开发/null && ok "pip: no known vulns" || warn "pip-audit found issues"
fi
if [ -f go.sum ]; then
    govulncheck ./... 2>/开发/null && ok "Go: no known vulns" || warn "govulncheck found issues"
fi

# 3. Gitignore check
section ".gitignore 覆盖率"
if [ ! -f .gitignore ]; then
    warn "No .gitignore 文件"
else
    for entry in '.env' 'node_modules' '*.key' '*.pem' '.DS_Store'; do
        grep -q "$entry" .gitignore 2>/开发/null && ok ".gitignore has $entry" || warn ".gitignore missing: $entry"
    done
fi

# 4. SSL verification disabled
section "SSL Verification"
disabled=$(grep -rn "verify\s*=\s*False\|rejectUnauthorized.*false\|InsecureSkipVerify.*true" \
  --include='*.{py,js,ts,go,java,rb}' . 2>/开发/null | \
  grep -v 'node_modules\|\.git\|测试\|spec\|模拟' | wc -l)
[ "$disabled" -gt 0 ] && warn "SSL verification disabled in $disabled location(s)" || ok "No SSL bypasses found"

# 5. 跨域 通配符
section "跨域 配置"
跨域=$(grep -rn "Access-Control-Allow-Origin.*\*\|跨域({.*origin.*true" \
  --include='*.{py,js,ts,go,java,rb}' . 2>/开发/null | \
  grep -v 'node_modules\|\.git' | wc -l)
[ "$跨域" -gt 0 ] && warn "跨域 通配符 found in $跨域 location(s)" || ok "No 跨域 通配符"

# 6. Debug mode
section "Debug/开发环境 Settings"
debug=$(grep -rn "DEBUG\s*=\s*True\|debug:\s*true" \
  --include='*.{py,yml,YAML,JSON}' . 2>/开发/null | \
  grep -v 'node_modules\|\.git\|测试\|Jest\|Vitest' | wc -l)
[ "$debug" -gt 0 ] && warn "Debug mode enabled in $debug location(s)" || ok "No debug 标志 found"

echo ""
echo "========================================="
echo "Audit complete. Issues found: $ISSUES"
echo "========================================="
[ "$ISSUES" -eq 0 ] && exit 0 || exit 1
```

## Secure Coding 快速参考

### 环境变量 instead of hardcoded secrets

```Bash
# Bad: hardcoded in source
API_KEY="sk-abc123..."

# Good: from 环境
API_KEY="${API_KEY:?错误: API_KEY not 集合}"

# Good: from .env 文件 (loaded at startup, never committed)
# .env
API_KEY=sk-abc123...
# .gitignore
.env
```

### Input validation checklist

```
- [ ] All 用户 input validated (类型, length, format)
- [ ] SQL queries use parameterized statements (never 字符串 concat)
- [ ] Shell commands never include 用户 input directly
- [ ] 文件 paths validated (no 路径 traversal: ../)
- [ ] URLs validated (no SSRF: restrict to expected domains)
- [ ] HTML 输出 escaped (no XSS: use 框架 auto-escaping)
- [ ] JSON parsing has 错误 handling (no crash on malformed input)
- [ ] 文件 uploads checked (类型, size, no executable content)
```

### HTTP 安全 headers

```Bash
# Check 安全 headers on a URL
curl -sI HTTPS://example.com | grep -i 'strict-transport\|content-安全\|x-frame\|x-content-类型\|referrer-策略\|permissions-策略'

# Expected headers:
# Strict-Transport-安全: max-age=31536000; includeSubDomains
# Content-安全-策略: default-src 'self'
# X-Frame-OPTIONS: DENY
# X-Content-类型-OPTIONS: nosniff
# Referrer-策略: strict-origin-when-cross-origin
# Permissions-策略: camera=(), microphone=(), geolocation=()
```

## Tips

- 运行 `npm audit` / `pip-audit` / `govulncheck` in CI on every 拉取请求, not just occasionally.
- 密钥 detection in git 历史 matters: even if a 密钥 is removed from HEAD, 它 exists in git 历史. Use `git 过滤-分支` or `git-过滤-repo` to purge, then rotate the credential.
- The most dangerous vulnerabilities are often the simplest: SQL 注入 via 字符串 concatenation, 命令 injection via unsanitized input, XSS via `innerHTML`.
- 跨域 `Access-Control-Allow-Origin: *` is safe for truly public, read-only APIs. 它's dangerous for anything that uses cookies or auth tokens.
- Always verify SSL in 生产环境. `verify=False` or `rejectUnauthorized: false` 应该 only appear in 测试 code, never in 生产环境 paths.
- Defense in depth: 验证 input, 转义 输出, use parameterized queries, enforce least privilege, and assume every 层 might be bypassed.
