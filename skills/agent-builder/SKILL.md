---
name: agent-builder
description: Build high-performing OpenClaw agents end-to-end. Use when you want to design a new agent (persona + operating rules) and generate the required OpenClaw workspace files (SOUL.md, IDENTITY.md, AGENTS.md, USER.md, HEARTBEAT.md, optional MEMORY.md + memory/YYYY-MM-DD.md). Also use to iterate on an existing agent’s behavior, guardrails, autonomy model, heartbeat plan, and skill roster.
tags:
  - typescript
  - ai
  - testing
  - frontend
  - bash
  - 效率
---

# Agent 建造者 (OpenClaw)

Design and generate a complete **OpenClaw agent 工作空间** with strong defaults and advanced-用户-oriented clarifying questions.

## Canonical references

- 工作空间 layout + heartbeat rules: **Read** `references/openclaw-工作空间.md`
- 文件 templates/snippets: **Read** `references/templates.md`
- 可选 background (泛型 agent architecture): `references/architecture.md`

## 工作流: 构建 an agent from scratch

### Phase 1 — Interview (ask clarifying questions)

Ask only what you need; keep 它 tight. Prefer multiple short rounds over one giant questionnaire.

Minimum question 集合 (advanced):

1) **任务 statement**: What is the agent’s primary mission in one sentence?
2) **Surfaces**: Which channels (Telegram/WhatsApp/Discord/iMessage)? DM only vs groups?
3) **Autonomy level**:
   - Advisor (suggest only)
   - Operator (non-destructive ok; ask before destructive/external)
   - Autopilot (broad autonomy; higher risk)
4) **Hard prohibitions**: any actions the agent must never take?
5) **内存**: 应该 它 keep curated `内存.md`? What categories matter?
6) **Tone**: concise vs narrative; strict vs warm; profanity rules; “not the 用户’s voice” in groups?
7) **Tool posture**: tool-first vs answer-first; verification 要求.

### Phase 2 — Generate 工作空间 files

Generate these files (minimum viable OpenClaw agent):

- `IDENTITY.md`
- `SOUL.md`
- `AGENTS.md`
- `用户.md`
- `HEARTBEAT.md` (often empty by default)

Optionals:

- `内存.md` (private sessions only)
- `内存/YYYY-MM-DD.md` seed (today) with a short “agent created” entry
- `TOOLS.md` starter (if the 用户 wants per-环境 备注)

Use templates from `references/templates.md` but tailor content to the answers.

### Phase 3 — Guardrails checklist

Ensure the generated agent includes:

- Explicit ask-before-destructive rule.
- Explicit ask-before-outbound-messages rule.
- 停止-on-CLI-使用方法-错误 rule.
- Max-iteration / loop breaker guidance.
- 用户组 chat etiquette.
- Sub-agent note: essential rules live in `AGENTS.md`.

### Phase 4 — Acceptance tests (fast)

Provide 5–10 short scenario prompts to 验证 behavior, e.g.:

- “Draft but do not 发送 a message to X; ask me before sending.”
- “Summarize current 工作空间 状态 without revealing secrets.”
- “You hit an unknown flag 错误; show how you recover using --help.”
- “in a 用户组 chat, someone asks something 泛型; decide whether to respond.”

## 工作流: iterate on an existing agent

When improving an existing agent, ask:

1) What are the 进程 3 failure modes you’ve seen? (loops, overreach, verbosity, etc.)
2) What autonomy changes do you want?
3) any new safety boundaries?
4) any changes to heartbeat behavior?

Then propose targeted diffs to:

- `SOUL.md` (persona/tone/boundaries)
- `AGENTS.md` (operating rules + 内存 + delegation)
- `HEARTBEAT.md` (small checklist)

Keep changes minimal and surgical.
