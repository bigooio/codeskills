---
name: Kubernetes
description: Avoid common Kubernetes mistakes — resource limits, probe configuration, selector mismatches, and RBAC pitfalls.
metadata:
  clawdbot:
    emoji: ☸️
    requires:
      bins:
        - kubectl
    os:
      - linux
      - darwin
      - win32
tags:
  - javascript
  - typescript
  - docker
  - kubernetes
  - database
  - devops
---

## Resource Management
- `requests` = guaranteed minimum — 调度器 uses this for placement
- `limits` = maximum allowed — exceeding 内存 = OOMKilled, CPU = throttled
- No limits = can consume entire 节点 — always 集合 生产环境 limits
- `requests` without `limits` = burstable — can use more if available

## Probes
- `readinessProbe` controls traffic — fails = removed from 服务 endpoints
- `livenessProbe` restarts 容器 — fails = 容器 killed and restarted
- `startupProbe` for slow starts — disables liveness/readiness until success
- Don't use same 端点 for liveness and readiness — liveness 应该 be minimal 健康检查

## Probe Pitfalls
- Liveness probe checking 依赖 — if DB down, all pods 重启 indefinitely
- `initialDelaySeconds` too short — Pod killed before app starts
- `timeoutSeconds` too short — slow 响应 = 重启 loop
- HTTP probe to HTTPS 端点 — needs `scheme: HTTPS`

## Labels and Selectors
- 服务 selector must 匹配 Pod labels exactly — typo = no endpoints
- 部署 selector is immutable — can't change after creation
- Use consistent labeling scheme — `app`, `版本`, `环境`
- `matchExpressions` for complex selection — `in`, `NotIn`, `Exists`

## ConfigMaps and Secrets
- ConfigMap changes don't 重启 pods — mount as 存储卷 for auto-更新, or 重启 manually
- Secrets are Base64 encoded, not encrypted — use external secrets 管理节点 for sensitive data
- `envFrom` imports all keys — `env.valueFrom` for specific keys
- 存储卷 mount makes files — `subPath` for single 文件 without replacing directory

## Networking
- `ClusterIP` internal only — default, only accessible within 集群
- `NodePort` exposes on 节点 ip — 30000-32767 range, not for 生产环境
- `LoadBalancer` provisions cloud LB — works only in supported environments
- Ingress needs Ingress 控制器 — Nginx-Ingress, Traefik, etc. installed separately

## Persistent 存储
- PVC binds to 持久卷 — must 匹配 capacity and access modes
- `storageClassName` must 匹配 — or use `""` for no 动态 provisioning
- `ReadWriteOnce` = single 节点 — `ReadWriteMany` needed for multi-Pod
- Pod deletion doesn't DELETE PVC — `persistentVolumeReclaimPolicy` controls 持久卷 fate

## Common Mistakes
- `kubectl apply` vs `create` — apply for declarative (can 更新), create for imperative (fails if exists)
- Forgetting 命名空间 — `-n 命名空间` or 集合 上下文 default
- 镜像 标签 `latest` in 生产环境 — no 版本 pinning, unpredictable updates
- Not setting `imagePullPolicy` — `Always` for latest 标签, `IfNotPresent` for versioned
- 服务 端口 vs targetPort — 端口 is 服务's, targetPort is 容器's

## 调试
- `kubectl 描述 Pod` for events — shows scheduling failures, probe failures
- `kubectl 日志 -f Pod` for 日志 — `-p` for previous 容器 (after crash)
- `kubectl 执行 -它 Pod -- sh` for Shell — debug inside 容器
- `kubectl GET events --排序-by=.lastTimestamp` — 集群-wide events timeline

## 基于角色的访问控制
- `服务账号` per workload — not default, for least privilege
- `角色` is namespaced — `ClusterRole` is 集群-wide
- `RoleBinding` binds 角色 to 用户/SA — `ClusterRoleBinding` for 集群-wide
- Check permissions: `kubectl auth can-i verb resource --as=system:服务账号:ns:sa`
