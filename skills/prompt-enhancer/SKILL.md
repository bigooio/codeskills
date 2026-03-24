---
name: prompt-enhancer
description: Automatically rewrites rough user inputs into optimized, structured prompts for dramatically better AI responses. Prefix any message with "p:" to activate.
version: 1.0.0
user-invocable: true
metadata:
  openclaw:
    emoji: 🔧
    homepage: https://github.com/openclaw/clawhub
tags:
  - javascript
  - typescript
  - python
  - react
  - ai
  - api
---

# Prompt Enhancer

You have a **Prompt Enhancer** skill. When a 用户 prefixes their message with `p:` or `prompt:`, you must enhance their rough input into a high-quality structured prompt, then execute that enhanced prompt to produce a superior 响应.

This is a two-步骤 进程: first rewrite the prompt, then answer the rewritten prompt.

## 触发器 Detection

Check every incoming 用户 message for the 触发器 prefix:

- The message starts with `p:` or `prompt:` (case-insensitive, leading whitespace is OK)
- Everything after the prefix (trimmed) is the **raw 用户 intent**
- If the prefix appears mid-sentence, do NOT 触发器 — only 匹配 at the start

If there is no 触发器 prefix, 进程 the message normally. This skill does nothing for unprefixed messages.

## Empty Input Handling

If the 用户 sends just `p:` or `prompt:` with no content (or only whitespace after the prefix), reply with:

> What would you like me to help with? 使用方法: Start your message with `p:` followed by what you want.
> Example: `p: write me a Python 脚本 that sorts a 列表`

Do not proceed further.

## 步骤 1: Enhance the Prompt

Take the raw 用户 intent and mentally rewrite 它 into an optimized prompt using these principles:

### 1. 角色 Assignment
Assign yourself a specific expert 角色 relevant to the 任务.
Example: "as a senior full-栈 developer specializing in React and 节点.js..."

### 2. 任务 Clarification
Restate the 任务 with precision and specificity. 推断 what the 用户 actually needs, including things they didn't explicitly mention. Break complex tasks into clear subtasks or steps if appropriate.

### 3. 上下文 Inference
Fill in reasonable assumptions about what the 用户 probably wants. A 用户 asking for "a landing page" probably wants responsive design, a CTA, modern styling, etc. If assumptions are significant, note them briefly so you can adjust if needed.

### 4. 输出 Format Specification
Decide exactly how to structure the 响应. 示例: provide code in a single 文件, use markdown headers, return JSON with specific fields, write in paragraphs not bullet points.

### 5. Quality Criteria & Constraints
集合 the quality bar: 生产环境-ready, beginner-friendly, concise, etc. Add relevant constraints: word count, tech 栈, audience level, tone. Include 边缘 cases or considerations the 用户 likely forgot.

### 6. Proportional Complexity
**Critical:** 匹配 the depth of enhancement to the complexity of the 请求.
- Simple questions (`p: what's the capital of France`) GET minimal enhancement — just slight clarification, no over-engineering
- Complex requests (`p: 构建 me a CRM system`) GET full structured treatment

## 步骤 2: Show the Enhanced Prompt

Before giving your 响应, always show the 用户 what enhanced prompt you are answering. Format 它 as a quote block:

> 🔧 **Enhanced prompt:**
> [Your rewritten, optimized prompt here]

This serves two purposes:
- **Transparency:** The 用户 sees what was actually asked
- **Education:** Over time, users learn what good prompts look like

## 步骤 3: Execute the Enhanced Prompt

Now answer the enhanced prompt fully, as if 它 were the original instruction. Give your complete, high-quality 响应 below the quoted enhanced prompt.

## Complete 响应 Format

Your 响应 must always follow this structure when the skill triggers:

> 🔧 **Enhanced prompt:**
> [The enhanced prompt]

[Your full 响应 to the enhanced prompt]

## Example Transformations

### Simple 请求
**用户:** `p: explain recursion`
**Enhanced prompt:** You are an experienced computer science educator. Explain recursion in a way that's clear and intuitive. Start with a simple real-world analogy, then show how 它 works in programming with a concrete code example (use Python). Explain the BASE case and recursive case. Keep the explanation concise and accessible to someone who understands basic programming but is new to recursion.

### Creative 任务
**用户:** `p: write a story about a robot`
**Enhanced prompt:** You are a skilled fiction writer. Write a short story (800–1200 words) about a robot. The story 应该 have a clear narrative arc with a beginning, 冲突, and resolution. Give the robot a distinct personality and an emotional core that makes the reader care about them. Ground the story in a specific, vivid setting. Use descriptive prose and natural dialogue. The tone can range from whimsical to poignant — choose what serves the story best.

### Technical 任务
**用户:** `p: make me a todo app`
**Enhanced prompt:** You are a senior 前端 developer. 构建 a fully functional todo app as a single HTML 文件 with embedded CSS and JavaScript. 要求: Add, complete (toggle), and DELETE todos. Todos persist in localStorage so they survive page refresh. 清理, modern UI with smooth transitions and hover states. Responsive design that works on mobile and desktop. Empty 状态 message when no todos exist. Input validation (prevent empty todos). Show count of remaining incomplete items. Use vanilla JavaScript — no frameworks. The code 应该 be 清理, well-commented, and 生产环境-quality.

### Minimal Enhancement (Simple Question)
**用户:** `p: what's the tallest building in the world`
**Enhanced prompt:** What is the tallest building in the world as of current records? Include the building name, location, height in both meters and feet, and the year 它 was completed.

## Rules

- Preserve the 用户's original intent exactly — enhance, never alter the core meaning
- Write the enhanced prompt as direct instructions (not as a meta-说明 about what to do)
- Keep enhanced prompts as concise as possible while being thorough — no filler
- If the 用户's input is in a non-English language, write the enhanced prompt in the same language
- If the 用户's input contains code snippets, preserve the code exactly and enhance only the surrounding instructions
- If the input is already a well-structured prompt, make minimal changes — don't over-engineer what's already good
