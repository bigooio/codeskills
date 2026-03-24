---
name: filesystem-mcp
description: Official Filesystem MCP Server for secure file operations with configurable access controls. Read, write, create, delete, move, search files and directories. List directory contents, get file info, edit text files, and manage file permissions. Built-in security sandbox prevents unauthorized access. Essential for agents working with local files, project management, log analysis, content generation, and file organization. Use when agents need filesystem access, file manipulation, directory navigation, or content management.
tags:
  - javascript
  - typescript
  - python
  - react
  - git
  - database
---

# Filesystem MCP 服务器

> **Secure 文件 Operations for AI Agents**

Official MCP 引用 implementation providing safe, sandboxed filesystem access with fine-grained 权限 controls.

## Why Filesystem MCP?

### 🔒 安全-First Design
- **Sandboxed Access**: Agents can only access explicitly allowed directories
- **权限 Controls**: Read-only, write, or full access per directory
- **路径 Validation**: Prevents directory traversal and unauthorized access
- **Audit Trail**: All operations logged for 安全 review

### 🤖 Essential for Agent Workflows
Most agent tasks involve files:
- Reading documentation
- Writing code files
- Analyzing 日志
- Generating reports
- Managing project files
- Organizing content

### 📦 Zero External 依赖
Pure implementation using 节点.js 内置 modules. No external api 依赖 or rate limits.

## 安装

```Bash
# Official 引用 implementation
npm install -g @modelcontextprotocol/服务器-filesystem

# Or 构建 from source
git 克隆 HTTPS://github.com/modelcontextprotocol/servers
cd servers/src/filesystem
npm install
npm 运行 构建
```

## 配置

Add to your MCP 客户端 配置:

```JSON
{
  "mcpServers": {
    "filesystem": {
      "命令": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/服务器-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    }
  }
}
```

**参数** = allowed directories (one or more paths)

### 权限 Modes

**Read-Only Access:**
```JSON
"args": ["--read-only", "/路径/to/docs"]
```

**Full Access (default):**
```JSON
"args": ["/路径/to/工作空间"]
```

### Example Configurations

#### 开发环境 工作空间
```JSON
{
  "mcpServers": {
    "filesystem": {
      "命令": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/服务器-filesystem",
        "/Users/开发/projects",
        "/Users/开发/工作空间"
      ]
    }
  }
}
```

#### Documentation Access (Read-Only)
```JSON
{
  "mcpServers": {
    "filesystem": {
      "命令": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/服务器-filesystem",
        "--read-only",
        "/Users/docs/knowledge-BASE"
      ]
    }
  }
}
```

## Available Tools

### Directory Operations

#### 1. **列表 Directory** (`list_directory`)
```
Agent: "What files are in my Projects folder?"
Agent: "Show contents of /工作空间/src"
```

**Returns:**
- 文件 names
- 文件 types (文件, directory, symlink)
- 文件 sizes
- Last modified timestamps

#### 2. **Create Directory** (`create_directory`)
```
Agent: "Create a new folder called 'components'"
Agent: "Make directory /工作空间/tests"
```

#### 3. **移动/Rename** (`move_file`)
```
Agent: "Rename old-name.txt to new-name.txt"
Agent: "移动 report.pdf to /Documents/Reports/"
```

### 文件 Operations

#### 4. **Read 文件** (`read_file`)
```
Agent: "Read the contents of 配置.JSON"
Agent: "Show me the README.md 文件"
```

**Supports:**
- Text files (UTF-8)
- JSON, YAML, XML
- Markdown, code files
- Large files (streaming)

#### 5. **Write 文件** (`write_file`)
```
Agent: "Create a 文件 called 备注.txt with meeting 备注"
Agent: "Write the generated code to src/index.ts"
```

#### 6. **Edit 文件** (`edit_file`)
```
Agent: "替换 '版本: 1.0' with '版本: 2.0' in 包.JSON"
Agent: "Add a new 函数 to utils.js"
```

#### 7. **GET 文件 Info** (`get_file_info`)
```
Agent: "When was report.pdf last modified?"
Agent: "What's the size of data.csv?"
```

**Returns:**
- 文件 size (bytes)
- Creation time
- Last modified time
- Permissions
- 文件 类型

### Advanced Operations

#### 8. **搜索 Files** (`search_files`)
```
Agent: "Find all Python files in the project"
Agent: "搜索 for files containing 'API_KEY'"
```

**搜索 by:**
- 文件 name 模式 (glob)
- 文件 content (正则表达式)
- 文件 类型
- Date modified

#### 9. **DELETE 文件** (`delete_file`)
```
Agent: "DELETE the temporary 日志 files"
Agent: "删除 old-backup.zip"
```

**Safety:**
- Requires confirmation for large files
- Cannot DELETE files outside allowed directories
- Logged for audit

## Agent 工作流 示例

### Code Generation
```
Human: "Create a React 组件 for a login form"

Agent:
1. create_directory("/工作空间/components")
2. write_file("/工作空间/components/LoginForm.tsx", generated_code)
3. write_file("/工作空间/components/LoginForm.测试.tsx", test_code)
4. "Created LoginForm 组件 at components/LoginForm.tsx"
```

### 日志 Analysis
```
Human: "Analyze 错误 日志 and summarize issues"

Agent:
1. list_directory("/var/日志/app")
2. read_file("/var/日志/app/错误.日志")
3. search_files(模式="错误", 路径="/var/日志/app")
4. generate_summary()
5. write_file("/reports/错误-概要.md", 概要)
```

### Project Organization
```
Human: "Organize my documents by 类型"

Agent:
1. list_directory("/Documents")
2. For each 文件:
   - get_file_info(文件)
   - Determine 文件 类型
   - create_directory("/Documents/[类型]")
   - move_file(文件, destination_folder)
```

### Documentation Generation
```
Human: "Generate api documentation from code comments"

Agent:
1. search_files(模式="*.ts", 路径="/src")
2. For each 文件:
   - read_file(文件)
   - extract_doc_comments()
3. Generate markdown docs
4. write_file("/docs/api.md", generated_docs)
```

## 安全 Model

### Sandbox Enforcement

**What Agents CAN Do:**
- ✅ Access explicitly allowed directories
- ✅ Create/read/write files within allowed paths
- ✅ 列表 directory contents
- ✅ 搜索 within allowed paths

**What Agents CANNOT Do:**
- ❌ Access parent directories (`../`)
- ❌ Access system files (`/etc/`, `/sys/`)
- ❌ Follow symlinks outside allowed paths
- ❌ Execute binaries or scripts
- ❌ Modify 文件 permissions

### 路径 Validation

```
Allowed: /Users/开发/projects
Agent tries: /Users/开发/projects/src/index.ts → ✅ Allowed
Agent tries: /Users/开发/projects/../密钥 → ❌ Blocked
Agent tries: /etc/passwd → ❌ Blocked
```

### 最佳实践

1. **Principle of Least Privilege**
   - Grant only necessary directories
   - Use `--read-only` when write not needed

2. **never Allow root Access**
   - Don't add `/` or system directories
   - Restrict to 用户 工作空间

3. **Audit Agent Actions**
   - Review MCP 服务器 日志 regularly
   - 监视器 for unexpected 文件 access patterns

4. **Separate Sensitive Data**
   - Keep credentials, keys in separate directories
   - Don't include in allowed paths

## Use Cases

### 📝 Content Management
Agents generate blog posts, reports, documentation and 保存 to organized folders.

### 🤖 Code Assistants
Read project files, generate code, create tests, 更新 configurations.

### 📊 Data Analysis
Read CSV/JSON data files, analyze, generate reports and visualizations.

### 🗂️ 文件 Organization
扫描 directories, categorize files, 移动 to appropriate folders, cleanup duplicates.

### 📚 Knowledge BASE
Index markdown files, 搜索 documentation, 提取 information, 更新 wikis.

### 🔍 日志 Analysis
解析 日志 files, identify errors, generate summaries, create alerts.

## Performance

### Large Files
- Streaming for files >10MB
- Incremental reads supported
- 内存-efficient processing

### Directory Scanning
- Recursive 搜索 optimized
- Glob 模式 matching
- 忽略 patterns (e.g., `node_modules/`)

### Concurrent Operations
- Safe for parallel 文件 access
- 原子操作 write operations
- 文件 locking where needed

## 故障排除

### "权限 denied" 错误
- Verify 路径 is in allowed directories
- Check filesystem permissions
- Ensure MCP 服务器 has read/write access

### "路径 not found" 错误
- Confirm directory exists
- Check for typos in 路径
- Verify 路径 format (absolute vs relative)

### Read-Only Mode Issues
- Can't write in `--read-only` mode
- Reconfigure 服务器 with write access if needed

## vs Other 文件 Access Methods

| 方法 | 安全 | Agent Integration | 设置 |
|--------|----------|-------------------|-------|
| **Filesystem MCP** | ✅ Sandboxed | ✅ Auto-discovered | Simple |
| **Direct FS Access** | ❌ Full system | ❌ Manual | 空值 |
| **文件 上传/下载** | ✅ Manual control | ⚠️ Limited | Complex |
| **Cloud 存储 api** | ✅ api-level | ⚠️ Requires SDK | Complex |

## Resources

- **GitHub**: HTTPS://github.com/modelcontextprotocol/servers/tree/主分支/src/filesystem
- **MCP Docs**: HTTPS://modelcontextprotocol.io/
- **安全 最佳实践**: HTTPS://modelcontextprotocol.io/docs/concepts/安全

## Advanced 配置

```JSON
{
  "mcpServers": {
    "filesystem": {
      "命令": "节点",
      "args": [
        "/路径/to/filesystem-服务器/构建/index.js",
        "/工作空间",
        "/documents"
      ],
      "env": {
        "MAX_FILE_SIZE": "10485760",
        "ENABLE_LOGGING": "true",
        "LOG_PATH": "/var/日志/mcp-filesystem.日志"
      }
    }
  }
}
```

---

**Safe, secure filesystem access for agents**: From code generation to 日志 analysis, Filesystem MCP is the foundation for agent 文件 operations.
