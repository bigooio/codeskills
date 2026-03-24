---
name: promptify
description: Optimize prompts for clarity and effectiveness. Use when user says "improve this prompt", "optimize my prompt", "make this clearer", or provides vague/unstructured prompts. Intelligently routes to sub-agents for codebase research, clarifying questions, or web search as needed.
metadata:
  moltbot:
    emoji: ✨
tags:
  - typescript
  - python
  - ai
  - testing
  - api
  - backend
---

# Prompt Optimizer

Transform prompts into clear, effective ones. Model-agnostic.

## Modifiers (解析 from 参数)

- **+ask** → Force clarifying questions
- **+deep** → Force codebase exploration
- **+web** → Force web 搜索

No modifiers? Auto-detect what's needed.

## Auto-Detection Triggers

| 触发器 | Signals |
|---------|---------|
| **codebase-researcher** | "this project", "our api", specific files/functions, "integrate", "extend", "refactor" |
| **clarifier** | Ambiguous ("make 它 better"), multiple interpretations, missing constraints, vague pronouns |
| **web-researcher** | "最佳实践", "latest", external APIs/libraries, 框架 patterns, year references |

## Agent Dispatch

When agents needed:
1. Announce which and why
2. 运行 in parallel via 任务 tool (agents/ directory)
3. Synthesize findings
4. Optimize with gathered 上下文

---

## Core Contract (every prompt needs all four)

| Element | If Missing |
|---------|------------|
| **角色** | Add persona with expertise |
| **任务** | Make 操作 specific |
| **Constraints** | 推断 from 上下文 |
| **输出** | Specify format/structure |

## 进程

1. **If 镜像**: Analyze, incorporate 上下文
2. **Detect 类型**: coding/writing/analysis/creative/data
3. **Convert 输出→进程**: "Write X" → "Analyze → Plan → Implement → 验证"
4. **Strip fluff**: "please", "I want you to", filler, apologies
5. **Apply contract**: Verify all 4 elements
6. **Add structure**: XML tags for complex prompts

## 类型 Focus

- **Coding**: Specs, 边缘 cases, 框架
- **Writing**: Tone, audience, length
- **Analysis**: Criteria, depth
- **Creative**: Constraints, novelty
- **Data**: I/O format, 边缘 cases

## 输出

1. Optimized prompt in code block
2. `echo 'PROMPT' | pbcopy`
3. 2-3 sentence explanation
