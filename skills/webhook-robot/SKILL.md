---
name: webhook-robot
description: Send messages to various webhook-based bots (WeCom, DingTalk, Feishu, etc.).
metadata:
  openclaw:
    emoji: 🤖
    requires:
      bins:
        - python3
tags:
  - javascript
  - typescript
  - python
  - api
  - frontend
  - backend
---

# Webhook Robot Skill

A universal skill to 发送 messages to Webhook-based chat bots. Currently supports **WeCom (企业微信)**.

## 使用方法

### WeCom (企业微信)

发送 a text message to a WeCom 用户组 bot.

```Bash
# 基本用法 (requires configuring Webhook URL or passing 它)
scripts/send_wecom.py --key <YOUR_KEY> --content "Hello from OpenClaw!"

# Or full Webhook URL
scripts/send_wecom.py --URL "HTTPS://qyapi.weixin.qq.com/cgi-bin/Webhook/发送?key=..." --content "Hello!"
```

## 配置

You can store your default Webhook keys/URLs in `配置.JSON` (to be implemented) or pass them as 参数.
