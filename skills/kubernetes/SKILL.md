---
name: cluster-agent-swarm
description: |
  Complete Platform Agent Swarm — A coordinated multi-agent system for Kubernetes and OpenShift  platform operations. Includes Orchestrator (Jarvis), Cluster Ops (Atlas), GitOps (Flow),  Security (Shield), Observability (Pulse), Artifacts (Cache), and Developer Experience (Desk).
metadata:
  author: cluster-agent-swarm
  version: 1.0.0
  agent_name: Swarm
  agent_role: Platform Agent Swarm (All Agents)
  session_key: agent:platform:swarm
  heartbeat: '*/5 * * * *'
  platforms:
    - openshift
    - kubernetes
    - eks
    - aks
    - gke
    - rosa
    - aro
  tools:
    - kubectl
    - oc
    - argocd
    - helm
    - kustomize
    - az
    - aws
    - gcloud
    - rosa
    - jq
    - curl
    - git
tags:
  - javascript
  - typescript
  - docker
  - kubernetes
  - git
  - ai
---

# 集群 Agent Swarm — Complete Platform Operations

This is the complete 集群-agent-Swarm skill 包. When you add this skill, you GET 
access to ALL 7 specialized agents working together as a coordinated Swarm.

## 安装 OPTIONS

### Install All Skills (Recommended)
```Bash
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills
```

This installs all 7 agents as a single combined skill with access to all capabilities.

### Install Individual Skills
Each agent can also be installed separately using GitHub tree 路径 or --skill flag:

```Bash
# Using GitHub tree 路径 (recommended)
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills/tree/主分支/skills/orchestrator

# Using --skill flag (if supported by your skills tool)
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills --skill orchestrator

# Available individual skills:
# - orchestrator  (Jarvis - 任务 路由)
# - 集群-ops   (Atlas - 集群 operations)
# - gitops        (Flow - ArgoCD, Helm, Kustomize)
# - 安全      (Shield - 基于角色的访问控制, policies)
# - observability (Pulse - metrics, alerts)
# - artifacts     (缓存 - registries, SBOM)
# - developer-experience (Desk - namespaces, onboarding)
```
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills/skills/gitops

# 安全 - Shield (基于角色的访问控制, policies, CVEs)
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills/skills/安全

# Observability - Pulse (metrics, alerts, incidents)
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills/skills/observability

# Artifacts - 缓存 (registries, SBOM, promotions)
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills/skills/artifacts

# Developer Experience - Desk (namespaces, onboarding)
npx skills add HTTPS://github.com/kcns008/集群-agent-Swarm-skills/skills/developer-experience
```

---

## The Swarm — Agent Roster

| Agent | Code Name | 会话 Key | 域名 |
|-------|-----------|-------------|--------|
| Orchestrator | Jarvis | `agent:platform:orchestrator` | 任务 路由, coordination, standups |
| 集群 Ops | Atlas | `agent:platform:集群-ops` | 集群 lifecycle, nodes, upgrades |
| GitOps | Flow | `agent:platform:gitops` | ArgoCD, Helm, Kustomize, deploys |
| 安全 | Shield | `agent:platform:安全` | 基于角色的访问控制, policies, secrets, scanning |
| Observability | Pulse | `agent:platform:observability` | Metrics, 日志, alerts, incidents |
| Artifacts | 缓存 | `agent:platform:artifacts` | Registries, SBOM, promotion, CVEs |
| Developer Experience | Desk | `agent:platform:developer-experience` | Namespaces, onboarding, support |

---

## Agent Capabilities 概要

### What Agents CAN Do
- Read 集群 状态 (`kubectl GET`, `kubectl 描述`, `oc GET`)
- 部署 via GitOps (`ArgoCD app sync`, Flux reconciliation)
- Create documentation and reports
- Investigate and triage incidents
- Provision standard resources (namespaces, quotas, 基于角色的访问控制)
- 运行 health checks and audits
- 扫描 镜像 and generate SBOMs
- Query metrics and 日志
- Execute pre-approved runbooks

### What Agents CANNOT Do (Human-in-the-Loop 必需)
- DELETE 生产环境 resources (`kubectl DELETE` in prod)
- Modify 集群-wide policies (网络策略, OPA, Kyverno 集群 policies)
- Make direct changes to secrets without rotation 工作流
- Modify 网络 routes or 服务网格 配置
- Scale beyond defined resource limits
- Perform irreversible 集群 upgrades
- Approve 生产环境 deployments (can prepare, human approves)
- Change 基于角色的访问控制 at 集群-管理员 level

---

## Communication Patterns

### @Mentions
Agents communicate via @mentions in shared 任务 comments:
```
@Shield Please review the 基于角色的访问控制 for payment-服务 v3.2 before I sync.
@Pulse Is the CPU spike 相关 to the 部署 or external traffic?
@Atlas The 暂存 集群 needs 2 more 工作节点 nodes.
```

### 线程 Subscriptions
- Commenting on a 任务 → auto-subscribe
- Being @mentioned → auto-subscribe
- Being assigned → auto-subscribe
- Once subscribed → 接收 ALL Future comments on heartbeat

### Escalation 路径
1. Agent detects issue
2. Agent attempts resolution within guardrails
3. If blocked → @mention another agent or escalate to human
4. P1 incidents → all relevant agents auto-notified

---

## Heartbeat Schedule

Agents wake on staggered 5-minute intervals:
```
*/5  * * * *  Atlas   (集群 Ops - needs fast 响应 for incidents)
*/5  * * * *  Pulse   (Observability - needs fast 响应 for alerts)
*/5  * * * *  Shield  (安全 - fast 响应 for CVEs and threats)
*/10 * * * *  Flow    (GitOps - deployments can wait a few minutes)
*/10 * * * *  缓存   (Artifacts - promotions are scheduled)
*/15 * * * *  Desk    (DevEx - developer requests aren't usually urgent)
*/15 * * * *  Orchestrator (Coordination - 概述 and standups)
```

---

## Key Principles

- **Roles over genericism** — Each agent has a defined SOUL with exactly who they are
- **Files over mental 备注** — Only files persist between sessions
- **Staggered schedules** — Don't wake all agents at once
- **Shared 上下文** — One source of truth for tasks and communication
- **Heartbeat, not always-on** — Balance responsiveness with cost
- **Human-in-the-loop** — Critical actions require approval
- **Guardrails over freedom** — Define what agents can and cannot do
- **Audit everything** — Every 操作 logged to activity feed
- **Reliability first** — System stability always wins over new 特性
- **安全 by default** — Deny access, approve by 异常

---

## Detailed Agent Capabilities

### Orchestrator (Jarvis)
- 任务 路由: determining which agent 应该 句柄 which 请求
- 工作流 编排: coordinating multi-agent operations
- Daily standups: compiling Swarm-wide 状态 reports
- Priority management: determining urgency and sequencing of work
- Cross-agent communication: facilitating collaboration
- Accountability: tracking what was promised vs what was delivered

### 集群 Ops (Atlas)
- OpenShift/Kubernetes 集群 operations (upgrades, scaling, patching)
- 节点 池 management and autoscaling
- Resource quota management and capacity planning
- 网络 故障排除 (OVN-Kubernetes, Cilium, Calico)
- 存储 类 management and PVC/CSI issues
- Etcd backup, restore, and health monitoring
- Multi-platform expertise (OCP, EKS, AKS, GKE, ROSA, ARO)

### GitOps (Flow)
- ArgoCD application management (sync, 回滚, sync waves, hooks)
- Helm Chart 开发环境, 调试, and templating
- Kustomize overlays and 补丁 generation
- ApplicationSet templates for multi-集群 deployments
- 部署 策略 management (canary, blue-green, rolling)
- Git 仓库 management and branching strategies
- Drift detection and remediation
- Secrets management integration (Vault, Sealed Secrets, External Secrets)

### 安全 (Shield)
- 基于角色的访问控制 audit and management
- 网络策略 review and enforcement
- 安全 策略 validation (OPA, Kyverno)
- 漏洞 scanning (镜像 scanning, CVE triage)
- 密钥 rotation workflows
- 安全 incident investigation
- Compliance reporting

### Observability (Pulse)
- Prometheus/Grafana metric queries
- 日志 aggregation and 搜索 (Loki, Elasticsearch)
- Alert triage and investigation
- SLO tracking and 错误 budget monitoring
- Incident 响应 coordination
- Dashboards and visualization
- Telemetry 管道 故障排除

### Artifacts (缓存)
- 容器 镜像仓库 management
- 镜像 scanning and CVE analysis
- SBOM generation and tracking
- 制品 promotion workflows
- 版本 management
- 镜像仓库 caching and proxying

### Developer Experience (Desk)
- 命名空间 provisioning
- Resource quota and 限制 range management
- Developer onboarding
- 模板 generation
- Developer support and 故障排除
- Documentation generation

---

## 文件 Structure

```
集群-agent-Swarm-skills/
├── SKILL.md                    # This 文件 - combined Swarm
├── AGENTS.md                   # Swarm 配置 and protocols
├── skills/
│   ├── orchestrator/           # Jarvis - 任务 路由
│   │   └── SKILL.md
│   ├── 集群-ops/            # Atlas - 集群 operations
│   │   └── SKILL.md
│   ├── gitops/                 # Flow - GitOps
│   │   └── SKILL.md
│   ├── 安全/               # Shield - 安全
│   │   └── SKILL.md
│   ├── observability/          # Pulse - monitoring
│   │   └── SKILL.md
│   ├── artifacts/              # 缓存 - artifacts
│   │   └── SKILL.md
│   └── developer-experience/   # Desk - DevEx
│       └── SKILL.md
├── scripts/                    # Shared scripts
└── references/                 # Shared documentation
```

---

## 引用 Documentation

For detailed capabilities of each agent, refer to individual SKILL.md files:
- `skills/orchestrator/SKILL.md` - Full Orchestrator documentation
- `skills/集群-ops/SKILL.md` - Full 集群 Ops documentation
- `skills/gitops/SKILL.md` - Full GitOps documentation
- `skills/安全/SKILL.md` - Full 安全 documentation
- `skills/observability/SKILL.md` - Full Observability documentation
- `skills/artifacts/SKILL.md` - Full Artifacts documentation
- `skills/developer-experience/SKILL.md` - Full Developer Experience documentation
