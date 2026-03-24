---
name: vercel-deploy
description: Deploy and manage Vercel projects. Use when deploying applications to Vercel, managing environment variables, checking deployment status, viewing logs, or performing Vercel operations. Supports production and preview deployments. Practical infrastructure operations - no "AI will build your app" magic.
tags:
  - typescript
  - git
  - ai
  - security
  - testing
  - api
---

# Vercel 部署 & Management

部署 and manage Vercel projects. No "AI will 构建 your app" nonsense - just practical Vercel operations.

## 配置

### Vercel 设置

**GET your 令牌:**
1. Go to HTTPS://vercel.com/account/tokens
2. Create 令牌 (name 它 "OpenClaw")
3. 集合 in 环境:

```Bash
导出 VERCEL_TOKEN="your-令牌-here"
```

Or store in `.env`:
```
VERCEL_TOKEN=your-令牌-here
```

## Vercel Operations

### 部署 Project

```Bash
# 部署 to preview
scripts/vercel_deploy.sh --project bountylock --preview

# 部署 to 生产环境
scripts/vercel_deploy.sh --project bountylock --生产环境
```

### Manage 环境变量

```Bash
# 列表 env vars
scripts/vercel_env.sh --project bountylock --列表

# 集合 env var
scripts/vercel_env.sh --project bountylock --集合 \
  --key NEXT_PUBLIC_RPC_URL \
  --value "HTTPS://sepolia.BASE.org" \
  --env 生产环境

# DELETE env var
scripts/vercel_env.sh --project bountylock --DELETE \
  --key OLD_VAR \
  --env 生产环境
```

### Check 部署 状态

```Bash
# GET latest 部署
scripts/vercel_status.sh --project bountylock

# GET specific 部署
scripts/vercel_status.sh --部署 dpl_abc123
```

### View 日志

```Bash
# GET 部署 日志
scripts/vercel_logs.sh --部署 dpl_abc123

# GET 运行时 日志
scripts/vercel_logs.sh --project bountylock --函数 api/bounties
```

## Common Workflows

### Initial Testnet 部署

1. **集合 环境变量:**
```Bash
# Contract addresses (after deploying to Sepolia)
scripts/vercel_env.sh --project bountylock --集合 \
  --key NEXT_PUBLIC_CONTRACT_ADDRESS \
  --value "0x..." \
  --env 生产环境

# RPC URL
scripts/vercel_env.sh --project bountylock --集合 \
  --key NEXT_PUBLIC_RPC_URL \
  --value "HTTPS://sepolia.BASE.org" \
  --env 生产环境

# Chain ID
scripts/vercel_env.sh --project bountylock --集合 \
  --key NEXT_PUBLIC_CHAIN_ID \
  --value "84532" \
  --env 生产环境
```

2. **部署:**
```Bash
scripts/vercel_deploy.sh --project bountylock --生产环境
```

3. **Check 状态:**
```Bash
scripts/vercel_status.sh --project bountylock
```

### 更新 环境变量

```Bash
# 更新 contract address after redeployment
scripts/vercel_env.sh --project bountylock --集合 \
  --key NEXT_PUBLIC_CONTRACT_ADDRESS \
  --value "0xNEW_ADDRESS" \
  --env 生产环境

# 触发器 new 部署 to use updated vars
scripts/vercel_deploy.sh --project bountylock --生产环境
```

### Debug 部署 Issues

```Bash
# GET latest 部署 info
scripts/vercel_status.sh --project bountylock

# GET 构建 日志
scripts/vercel_logs.sh --部署 dpl_abc123

# Check 环境变量
scripts/vercel_env.sh --project bountylock --列表
```

## 安全 最佳实践

1. **令牌 Scope:** Use project-scoped tokens when possible
2. **Rotation:** Rotate tokens periodically
3. **Audit:** Review 部署 日志 regularly
4. **Secrets:** never 提交 tokens to git

## 故障排除

**"认证 failed"**
- Check 令牌 is 集合 correctly
- Verify 令牌 hasn't expired

**"Project not found"**
- Verify project name matches Vercel project
- Check account has access to project

**"部署 failed"**
- Check 构建 日志: `scripts/vercel_logs.sh --部署 dpl_xxx`
- Verify 环境变量 are 集合 correctly
- Check for 构建 errors in code

## 引用 Files

- **Vercel api 引用:** See [vercel-api.md](references/vercel-api.md) for complete api documentation
- **部署 Patterns:** See [部署-patterns.md](references/部署-patterns.md) for common 部署 workflows
