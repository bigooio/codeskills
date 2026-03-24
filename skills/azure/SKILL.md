---
name: Azure
description: Deploy, monitor, and manage Azure services with battle-tested patterns.
metadata:
  clawdbot:
    emoji: 🔷
    requires:
      anyBins:
        - az
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - docker
  - azure
  - database
  - ai
  - security
---

# Azure 生产环境 Rules

## Cost Traps
- Stopped VMs still pay for attached disks and public IPs — deallocate fully with `az vm deallocate` not just 停止 from portal
- Premium SSD default on VM creation — 交换机 to Standard SSD for 开发/测试, saves 50%+
- 日志 分析 工作空间 retention defaults to 30 days free, then charges per GB — 集合 data retention 策略 and daily cap before 生产环境
- Bandwidth between regions is charged both ways — keep paired resources in same region, use Private 链接 for cross-region when needed
- Cosmos DB charges for provisioned RU/s even when idle — use 无服务器 for bursty workloads or autoscale with minimum RU setting

## 安全 Rules
- Resource Groups don't provide 网络 isolation — NSGs and Private Endpoints do. RG is for management, not 安全 boundary
- Managed Identity eliminates secrets for Azure-to-Azure auth — use System Assigned for single-resource, 用户 Assigned for shared identity
- Key Vault soft-DELETE enabled by default (90 days) — can't reuse Vault name until purged, plan naming accordingly
- Azure AD conditional access policies don't apply to 服务 principals — use App Registrations with 证书 auth, not 客户端 secrets
- Private Endpoints don't automatically 更新 DNS — configure Private DNS Zone and 链接 to VNet or resolution fails

## Networking
- NSG rules evaluate by priority (lowest number first) — default rules at 65000+ always lose to custom rules
- Application 网关 v2 requires dedicated 子网 — at least /24 recommended for autoscaling
- Azure 防火墙 premium SKU 必需 for TLS inspection and IDPS — standard can't 检查 encrypted traffic
- VNet peering is non-transitive — 中心-and-spoke requires routes in each spoke, or use Azure Virtual WAN
- 服务 Endpoints expose entire 服务 to VNet — Private Endpoints give private ip for specific resource instance

## Performance
- Azure Functions consumption plan has cold start — Premium plan with minimum instances for 延迟-sensitive
- Cosmos DB 分区 key choice is permanent and determines scale — can't change without recreating 容器
- App 服务 plan density: P1v3 handles ~10 slots, more causes resource contention — 监视器 CPU/内存 per slot
- Azure 缓存 for Redis Standard tier has no SLA for replication — use Premium for persistence and clustering
- Blob 存储 hot tier for frequent access — cool has 30-day minimum, 归档 has 180-day and hours-long rehydration

## Monitoring
- Application Insights sampling kicks in at high 存储卷 — telemetry may miss intermittent errors, adjust `MaxTelemetryItemsPerSecond`
- Azure 监视器 alert rules charge per metric tracked — consolidate metrics in 日志 分析 for complex alerts
- Activity 日志 only shows 控制平面 operations — diagnostic settings 必需 for 数据平面 (blob access, SQL queries)
- Alert 操作 groups have rate limits — 1 SMS per 5 min, 1 voice call per 5 min, 100 emails per hour per 用户组
- 日志 分析 query 超时 is 10 minutes — optimize queries with time filters first, then other predicates

## 基础设施 as Code
- ARM templates fail silently on some 属性 changes — use `what-if` 部署 mode to preview changes
- Terraform azurerm provider 状态 contains secrets in plaintext — use 远程 后端 with 加密 (Azure 存储 + customer key)
- Bicep is ARM's replacement — transpiles to ARM, better tooling, use for new projects
- Resource locks prevent accidental deletion but block some operations — CanNotDelete 锁 still allows modifications
- Azure 策略 evaluates on resource creation and updates — existing non-compliant resources need remediation 任务

## Identity and Access
- 基于角色的访问控制 角色 assignments take up to 30 minutes to propagate — 管道 may fail immediately after assignment
- Owner 角色 can't manage 角色 assignments if PIM requires approval — use separate 用户 Access Administrator
- 服务 principal 密钥 expiration defaults to 1 year — 集合 calendar reminder or use 证书 with longer validity
- Azure AD B2C is separate from Azure AD — different tenant, different APIs, different pricing
