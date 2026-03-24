---
name: Google Cloud
description: Deploy, monitor, and manage GCP services with battle-tested patterns.
metadata:
  clawdbot:
    emoji: 🌐
    requires:
      anyBins:
        - gcloud
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - docker
  - git
  - aws
  - gcp
  - database
---

# Google Cloud 生产环境 Rules

## Cost Traps
- Stopped 计算 Engine VMs still pay for persistent disks and 静态 IPs — DELETE disks or use snapshots for long-term 存储
- Cloud NAT charges per VM and per GB processed — use Private Google Access for GCP api traffic instead
- BigQuery on-demand pricing charges for bytes scanned, not rows returned — 分区 tables and use `限制` in 开发, but `限制` doesn't reduce 扫描 cost in prod
- Preemptible VMs 保存 80% but can be terminated anytime — only for fault-tolerant 批量 workloads
- Egress to internet costs, egress to same region is free — keep resources in same region, use Cloud CDN for 全局 distribution

## 安全 Rules
- 服务 accounts are both identity and resource — one 服务 account can impersonate another with `roles/IAM.serviceAccountTokenCreator`
- IAM 策略 inheritance: Organization → Folder → Project → Resource — deny policies at org level override allows below
- VPC 服务 Controls protect against data exfiltration — but break Cloud Console access if not configured with access levels
- Default 计算 Engine 服务 account has Editor 角色 — create dedicated 服务 accounts with least privilege
- Workload Identity Federation eliminates 服务 account keys — use for GitHub Actions, GitLab CI, external workloads

## Networking
- VPC is 全局, subnets are regional — unlike AWS, single VPC can span all regions
- 防火墙 rules are allow-only by default — implicit deny all Ingress, allow all egress. Add explicit deny rules for egress control
- Private Google Access is per-子网 setting — enable on every 子网 that needs to reach GCP APIs without public ip
- Cloud 负载均衡 全局 vs regional — 全局 for multi-region, but regional is simpler and cheaper for single region
- Shared VPC separates 网络 管理员 from project 管理员 — host project owns 网络, 服务 projects consume 它

## Performance
- Cloud Functions gen1 has 9-minute 超时 — gen2 (Cloud 运行 based) allows 60 minutes
- Cloud SQL 连接 limits vary by instance size — use 连接 pooling or Cloud SQL Auth 代理
- Firestore/Datastore hotspotting on sequential IDs — use UUIDs or reverse timestamps for document IDs
- GKE Autopilot simplifies but limits — no DaemonSets, no 特权模式 容器, no host 网络
- Cloud 存储 single 对象 限制 is 5TB — use 组合 for larger, parallel uploads for faster

## Monitoring
- Cloud 日志 retention: 30 days default, \_Required bucket is 400 days — create custom bucket with longer retention for compliance
- Cloud Monitoring alert policies have 24-hour auto-close — incident disappears even if issue persists, configure notification channels for re-alert
- 错误 Reporting groups by 栈 trace — same 错误 with different messages creates duplicates
- Cloud Trace sampling is automatic — may miss rare errors, increase sampling rate for 调试
- Audit 日志: 管理员 Activity always on, Data Access off by default — enable Data Access 日志 for 安全 compliance

## 基础设施 as Code
- Terraform google provider requires project ID everywhere — use `google_project` data source or variables, never hardcode
- `gcloud` commands are imperative — use 部署 管理节点 or Terraform for reproducible infra
- Cloud 构建 triggers on 推送 but IAM permissions on first 运行 confusing — grant Cloud 构建 服务 account necessary roles before first 部署
- Project deletion has 30-day recovery period — but project ID is globally unique forever, can't reuse
- Labels propagate to billing — use consistent labeling for cost 分配: `env`, `team`, `服务`

## IAM 最佳实践
- Primitive roles (Owner/Editor/Viewer) are too broad — use predefined roles, create custom for least privilege
- 服务 account keys are 安全 liability — use Workload Identity, impersonation, or attached 服务 accounts instead
- `roles/IAM.serviceAccountUser` lets you 运行 as that SA — equivalent to having its permissions, grant carefully
- Organization policies restrict what projects can do — `constraints/计算.vmExternalIpAccess` blocks public VMs org-wide
