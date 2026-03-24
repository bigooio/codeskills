---
name: Cloud
description: Choose, organize, sync, share, and back up personal files across iCloud, Google Drive, Dropbox, and OneDrive.
tags:
  - typescript
  - docker
  - aws
  - azure
  - ai
  - security
---

## Triggers

Activate on: iCloud full, cloud 存储, backup photos, sync between devices, share folder, Google Drive help, Dropbox issues, "where are my files", 存储 plan comparison.

## Scope

This skill covers **consumer cloud 存储** — the services regular people use for photos, documents, and backups.

**Not this skill:** AWS, Azure, S3 buckets, VPS, Docker, APIs → use `基础设施`, `S3`, or `服务器`.

## Quick 服务 Picker

| Your devices | Best fit | Why |
|--------------|----------|-----|
| iPhone + Mac | iCloud | Native integration, seamless |
| Android + Chrome | Google Drive | Included with Gmail, auto photo backup |
| Windows PC | OneDrive | Built into Windows, Office integration |
| Mixed devices | Dropbox | Works equally well everywhere |

For detailed pricing and 特性, see `services.md`.

## Common Confusions

| What you think | What's actually happening |
|----------------|---------------------------|
| "I deleted 它 from my phone and now 它's gone from my laptop" | Sync works as designed — one 文件, everywhere |
| "iCloud 存储 full but my phone has space" | Phone 存储 ≠ iCloud 存储 |
| "My photos are duplicated everywhere" | Multiple services backing up the same camera roll |
| "I pay for 3 cloud services" | 选取 one primary, cancel the REST |

## 存储 Full — What to Do

1. **Check what's using space** — Photos usually dominate
2. **Empty trash** — Deleted files count until trash is emptied
3. **Disable duplicate backups** — 选取 one photo backup 服务
4. **Offload old files** — 移动 archives to external drive

For 服务-specific cleanup steps, see `cleanup.md`.

## Backup 策略

- **3-2-1 rule:** 3 copies, 2 different media, 1 offsite
- **Cloud counts as offsite** — but also keep a 本地 backup
- **Check backup 状态 monthly** — don't assume 它's working

What to back up and what NOT to store in cloud: see `backup.md`.

## Sharing Files

| Need | 方法 |
|------|--------|
| Quick share with anyone | 链接 (集合 expiration) |
| Ongoing family access | Shared folder |
| Sensitive documents | Don't use cloud, or 加密 first |

步骤-by-步骤 per 服务: see `sharing.md`.

## 安全 Basics

- **Enable 双因素认证** on all cloud accounts
- **Review shared links** quarterly — revoke old ones
- **Don't store unencrypted:** passwords, IDs, financial documents
