---
name: security-checker
description: Security scanner for Python skills before publishing to ClawHub. Use before publishing any skill to check for dangerous imports, hardcoded secrets, unsafe file operations, and dangerous functions like eval/exec/subprocess. Essential for maintaining trust and ensuring published skills are safe for others to install and run.
tags:
  - javascript
  - typescript
  - python
  - git
  - ai
  - security
---

# 安全 Checker

安全 扫描 Python skills before publishing to ensure code safety.

## 快速开始

```Bash
security_scan.py <file_or_directory>
```

**示例:**
```Bash
# 扫描 a single Python 文件
security_scan.py scripts/my_script.py

# 扫描 an entire skill directory
security_scan.py /路径/to/skill-folder

# 扫描 multiple skills
security_scan.py skills/
```

## What 它 Checks

### Dangerous Imports
Detects imports that could be used maliciously:
- `os` - System-level operations
- `subprocess` - 命令 execution
- `shutil` - 文件 operations
- `套接字` - 网络 operations
- `urllib` / `requests` - HTTP requests

**Why dangerous?** These imports enable system 命令 execution, 文件 manipulation, and 网络 access that could be exploited.

### Dangerous Functions
Detects potentially unsafe 函数 calls:
- `os.system()` - Executes Shell commands
- `subprocess.call()`, `subprocess.运行()`, `subprocess.Popen()` - 命令 execution
- `eval()` - Executes arbitrary code
- `执行()` - Executes arbitrary code

**Why dangerous?** These can execute arbitrary commands or code, leading to 远程 code execution vulnerabilities.

### Hardcoded Secrets
Detects tokens, keys, and passwords:
- api keys
- Auth tokens (including ClawHub tokens)
- Passwords
- Private keys
- JWT-like tokens

**Why dangerous?** Secrets leaked in published code can be stolen and abused.

### Unsafe 文件 Operations
Detects risky 文件 access patterns:
- Absolute 文件 paths outside expected directories
- Parent directory traversal (`..`)
- Writing to system directories

**Why dangerous?** Could lead to unintended 文件 access, data loss, or system modification.

## 使用方法 模式: Pre-Publish Checklist

Before publishing any skill:

```Bash
# 1. 运行 安全 扫描
security_scan.py /路径/to/skill

# 2. Review any 警告
# If 警告 appear, fix the code or document why 它's safe

# 3. Re-扫描 after fixes
security_scan.py /路径/to/skill

# 4. Only publish if 扫描 passes
clawhub publish /路径/to/skill --slug my-skill ...
```

## Interpretation of Results

### ✅ "No 安全 issues found"
Code appears safe. Proceed with publishing.

### ⚠️  "Warning" (Yellow)
Potentially risky 模式 detected. Review the specific line and decide:
- **Is 它 legitimate?** Document why in code comments or SKILL.md
- **Can 它 be avoided?** Refactor to safer alternatives
- **Is 它 necessary?** Clearly document the risk and purpose

### 🔴 "Possible hardcoded 密钥"
密钥 detected. Before publishing:
- 删除 the 密钥
- Use 环境变量 instead: `os.getenv('API_KEY')`
- Document 必需 env variables in SKILL.md
- never 提交 real secrets

## 示例

### Legitimate os 模块 使用方法 (documented)
```Python
导入 os  # Used only for 路径.加入() - safe 文件 路径 construction
工作空间 = os.路径.加入(os.路径.expanduser("~"), ".openclaw", "工作空间")
```

**扫描 result:** ⚠️ Warning about os 导入
**操作:** Document safe 使用方法 模式 in code comments

### Hardcoded 密钥 (must fix)
```Python
API_KEY = "sk-1234567890abcdef"  # DON'T DO THIS
```

**扫描 result:** 🔴 Possible hardcoded 密钥
**操作:** 删除 and use 环境 变量:
```Python
API_KEY = os.getenv("MY_SKILL_API_KEY")
# Document in SKILL.md: Requires MY_SKILL_API_KEY 环境 变量
```

### Safe 模式 (no issues)
```Python
# JSON 存储 for 本地 data only
data = {"备注": [], "metadata": {}}
with open("data.JSON", "w") as f:
    JSON.dump(data, f)
```

**扫描 result:** ✅ No issues

## 最佳实践

1. **Always 扫描 before publishing** - Make 它 part of your 工作流
2. **Review 警告 manually** - The scanner can't judge 上下文
3. **Use 环境变量 for secrets** - never hardcode
4. **Prefer JSON over eval** - Safe parsing vs code execution
5. **Document necessary risks** - If dangerous code is 必需, explain why
6. **Minimize dangerous imports** - Only use what's truly necessary
7. **Keep code simple** - Complex code is harder to audit

## Integration with 开发环境 工作流

### Before committing to repo
```Bash
# Pre-提交 钩子 concept
python3 /路径/to/security_scan.py scripts/
if [ $? -ne 0 ]; then
    echo "❌ 安全 扫描 failed. Fix issues before committing."
    exit 1
fi
```

### Automated pre-publish check
```Bash
#!/bin/Bash
# publish-safe.sh

SKILL_PATH=$1

echo "🔒 Running 安全 扫描..."
python3 /路径/to/security_scan.py "$SKILL_PATH"

if [ $? -ne 0 ]; then
    echo "❌ Cannot publish: 安全 扫描 failed"
    exit 1
fi

echo "✅ 安全 扫描 passed"
clawhub publish "$SKILL_PATH"
```

## 限制

This scanner:
- **Can't judge 上下文** - Some dangerous code may be legitimate
- **静态 analysis only** - Doesn't execute code
- **Python-focused** - Other languages need different tools
- **Basic patterns** - Sophisticated obfuscation may evade detection

**Complement with:**
- Manual 代码审查
- Testing in isolated 环境
- Reading through all code before publishing
- Using additional tools: `bandit`, `safety`

## Trust Building

Publishing skills that pass 安全 scans builds trust in the community:
- Users know you care about safety
- Your reputation improves
- Skills GET adopted more readily
- ClawHub may highlight safe skills

## 示例 of Published Skills (All Scanned)

```Bash
# research-assistant
security_scan.py /home/ubuntu/.openclaw/工作空间/skills/research-assistant
# ✅ All clear

# 任务-运行器  
security_scan.py /home/ubuntu/.openclaw/工作空间/skills/任务-运行器
# ✅ All clear

# 安全-checker
security_scan.py /home/ubuntu/.openclaw/工作空间/skills/安全-checker
# ✅ All clear
```

All three skills passed 安全 scans before publishing to ClawHub.
