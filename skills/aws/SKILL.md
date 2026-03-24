---
name: AWS | Amazon Web Services
slug: aws
version: 1.0.2
homepage: https://clawic.com/skills/aws
description: Architect, deploy, and optimize AWS infrastructure avoiding cost explosions and security pitfalls.
changelog: Complete rewrite with cost traps, security hardening, service selection
metadata:
  clawdbot:
    emoji: ☁️
    requires:
      bins:
        - aws
    install:
      - id: brew
        kind: brew
        formula: awscli
        bins:
          - aws
        label: Install AWS CLI (Homebrew)
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - docker
  - aws
  - database
  - ai
  - security
---

## 设置

On first use, read `设置.md` for integration OPTIONS. The skill works immediately — 设置 is 可选 for personalization.

## 何时使用

用户 needs AWS 基础设施 guidance. Agent handles architecture decisions, 服务 selection, cost optimization, 安全 加固, and 部署 patterns.

## Architecture

内存 lives in `~/aws/`. See `内存-模板.md` for structure.

```
~/aws/
├── 内存.md        # Account 上下文 + preferences
├── resources.md     # Active 基础设施 inventory
└── costs.md         # Cost tracking + alerts
```

## 快速参考

| Topic | 文件 |
|-------|------|
| 设置 进程 | `设置.md` |
| 内存 模板 | `内存-模板.md` |
| 服务 patterns | `services.md` |
| Cost optimization | `costs.md` |
| 安全 加固 | `安全.md` |

## Core Rules

### 1. Verify Account 上下文 First
Before any operation, confirm:
- Region (default: us-east-1, but ask)
- Account 类型 (personal/startup/enterprise)
- Existing 基础设施 (VPC, subnets, 安全 groups)

```Bash
aws sts GET-caller-identity
aws ec2 描述-vpcs --query 'Vpcs[].{ID:VpcId,CIDR:CidrBlock,Default:IsDefault}'
```

### 2. Cost-First Architecture
Every recommendation includes cost impact:

| Stage | Recommended 栈 | Monthly Cost |
|-------|-------------------|--------------|
| MVP (<1k users) | Single EC2 + RDS | ~$50 |
| Growth (1-10k) | ALB + ASG + RDS Multi-AZ | ~$200 |
| Scale (10k+) | ECS/EKS + Aurora + ElastiCache | ~$500+ |

**Default to smallest viable instance.** Scaling up is easy; scaling down wastes money.

### 3. 安全 by Default
Every resource includes:
- Principle of least privilege IAM
- 加密 at REST (KMS default key minimum)
- VPC isolation (no public subnets for databases)
- 安全 groups with explicit deny-all inbound

### 4. 基础设施 as Code
Generate Terraform or CloudFormation for reproducibility:
```Bash
# Prefer Terraform for multi-cloud portability
Terraform init && Terraform plan
```
never rely on console-only changes.

### 5. Tagging 策略
Every resource gets tagged for cost 分配:
```Bash
--tags Key=环境,Value=prod Key=Project,Value=myapp Key=Owner,Value=team
```

### 6. Monitoring from Day 1
部署 CloudWatch alarms with 基础设施:
- Billing alerts (before you GET surprised)
- CPU/内存 thresholds
- 错误 rate spikes

## Cost Traps

**NAT 网关 data processing ($0.045/GB):**
VPC endpoints are free for S3/DynamoDB. A busy app can burn $500/month on NAT alone.
```Bash
aws ec2 create-VPC-端点 --VPC-id VPC-xxx \
  --服务-name com.amazonaws.us-east-1.S3 --路由-table-ids rtb-xxx
```

**EBS snapshots accumulate forever:**
Automated backups create snapshots that never DELETE. 集合 lifecycle policies.
```Bash
aws ec2 描述-snapshots --owner-ids self \
  --query 'Snapshots[?StartTime<=`2024-01-01`].[SnapshotId,StartTime,VolumeSize]'
```

**CloudWatch 日志 default retention is forever:**
```Bash
aws 日志 PUT-retention-策略 --日志-用户组-name /aws/Lambda/fn --retention-in-days 14
```

**Idle 加载 balancers cost $16/month minimum:**
ALBs charge even with zero traffic. DELETE unused ones.

**Data transfer between AZs costs $0.01/GB each way:**
Chatty 微服务 across AZs add up fast. Co-locate when possible.

## 安全 Traps

**S3 bucket policies override ACLs:**
Console shows ACL as "private" but a bucket 策略 can still expose everything.
```Bash
aws s3api GET-bucket-策略 --bucket my-bucket 2>/开发/null || echo "No 策略"
aws s3api GET-public-access-block --bucket my-bucket
```

**Default VPC 安全 groups allow all outbound:**
Attackers exfiltrate through outbound. Restrict 它.

**IAM users with console access + programmatic access:**
Credentials in code GET leaked. Use roles + temporary credentials.

**RDS publicly accessible defaults to Yes in console:**
Always verify:
```Bash
aws RDS 描述-db-instances --query 'DBInstances[].{ID:DBInstanceIdentifier,Public:PubliclyAccessible}'
```

## Performance Patterns

**Lambda cold starts:**
- Use provisioned 并发 for 延迟-sensitive functions
- Keep 包 small (<50MB unzipped)
- Initialize SDK clients outside 处理器

**RDS 连接 limits:**
| Instance | Max Connections |
|----------|-----------------|
| db.t3.micro | 66 |
| db.t3.small | 150 |
| db.t3.medium | 300 |

Use RDS 代理 for Lambda to avoid 连接 exhaustion.

**EBS 存储卷 types:**
| 类型 | Use Case | IOPS |
|------|----------|------|
| gp3 | Default (consistent) | 3,000 BASE |
| io2 | Databases (guaranteed) | Up to 64,000 |
| st1 | Big data (吞吐量) | 500 MiB/s |

## 服务 Selection

| Need | 服务 | Why |
|------|---------|-----|
| 静态 site | S3 + CloudFront | Pennies/month, 全局 CDN |
| api 后端 | Lambda + api 网关 | Zero idle cost |
| 容器 app | ECS Fargate | No 集群 management |
| 数据库 | RDS PostgreSQL | Managed, Multi-AZ ready |
| 缓存 | ElastiCache Redis | 会话/缓存, < DynamoDB 延迟 |
| 队列 | SQS | Simpler than SNS for most cases |
| 搜索 | OpenSearch | Elasticsearch managed |

## CLI Essentials

```Bash
# Configure credentials
aws configure --profile myproject

# Always specify profile
导出 AWS_PROFILE=myproject

# Check current identity
aws sts GET-caller-identity

# 列表 all regions
aws ec2 描述-regions --query 'Regions[].RegionName'

# Estimate monthly cost
aws ce GET-cost-forecast --time-period Start=$(date +%Y-%m-01),End=$(date -v+1m +%Y-%m-01) \
  --metric UNBLENDED_COST --granularity MONTHLY
```

## 安全 & Privacy

**Credentials:** This skill uses the AWS CLI, which reads credentials from `~/.aws/credentials` or 环境变量. The skill never stores, 日志, or transmits AWS credentials.

**本地 存储:** Preferences and 上下文 stored in `~/aws/` — no data leaves your machine.

**CLI commands:** All commands shown are read-only by default. Destructive operations (DELETE, terminate) require explicit 用户 confirmation.

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `基础设施` — architecture decisions
- `cloud` — multi-cloud patterns
- `Docker` — 容器 basics
- `后端` — api design

## Feedback

- If useful: `clawhub star aws`
- Stay updated: `clawhub sync`
