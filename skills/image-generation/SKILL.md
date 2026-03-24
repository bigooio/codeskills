---
name: AI Image Generation
slug: image-generation
version: 1.0.3
homepage: https://clawic.com/skills/image-generation
description: Create AI images with GPT Image, Gemini Nano Banana, FLUX, Imagen, and top providers using prompt engineering, style control, and smart editing.
changelog: Updated for 2026 with benchmark-backed model selection and clearer guidance for modern image generation stacks.
metadata:
  clawdbot:
    emoji: 🎨
    requires:
      bins: []
      env.optional:
        - OPENAI_API_KEY
        - GEMINI_API_KEY
        - BFL_API_KEY
        - GOOGLE_CLOUD_PROJECT
        - REPLICATE_API_TOKEN
        - LEONARDO_API_KEY
        - IDEOGRAM_API_KEY
      config:
        - ~/image-generation/
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - python
  - database
  - ai
  - security
  - api
---

## 设置

On first use, read `设置.md`.

## 何时使用

用户 needs AI-generated visuals, edits, or consistent 镜像 sets.
Use this skill to 选取 the right model, write stronger prompts, and avoid outdated model choices.

## Architecture

用户 preferences persist in `~/镜像-generation/`. See `内存-模板.md` for 设置.

```
~/镜像-generation/
├── 内存.md      # Preferred providers, project 上下文, winning recipes
└── 历史.md     # 可选 generation 日志
```

## 快速参考

| Topic | 文件 |
|-------|------|
| Initial 设置 | `设置.md` |
| 内存 模板 | `内存-模板.md` |
| 迁移 guide | `迁移.md` |
| Benchmark snapshots | `benchmarks-2026.md` |
| Prompt techniques | `prompting.md` |
| api handling | `api-patterns.md` |
| GPT 镜像 (OpenAI) | `gpt-镜像.md` |
| Gemini and Imagen (Google) | `gemini.md` |
| Flux (Black Forest Labs) | `Flux.md` |
| Midjourney | `midjourney.md` |
| Leonardo | `leonardo.md` |
| Ideogram | `ideogram.md` |
| Replicate | `replicate.md` |
| Stable Diffusion | `stable-diffusion.md` |

## Core Rules

### 1. Resolve aliases to official model IDs first

Community names shift quickly. Before calling an api, 映射 the nickname to the provider model ID.

| Community label | Official model ID to try first | 备注 |
|-----------------|--------------------------------|-------|
| Nano Banana | `gemini-2.5-flash-镜像-preview` | Common nickname, not an official Google model ID |
| Nano Banana 2 / Pro | Verify provider docs | Usually a provider preset over Gemini 镜像 models |
| GPT 镜像 1.5 | `gpt-镜像-1.5` | Current OpenAI high-tier 镜像 model |
| GPT 镜像 mini / iMini | `gpt-镜像-1-mini` | Budget/faster OpenAI variant |
| Flux 2 Pro / Max | `Flux-pro` / `Flux-ultra` | Many platforms rename these SKUs |

### 2. 选取 models by 任务, not by hype

| 任务 | First choice | Backup |
|------|--------------|--------|
| Exact text in 镜像 | `gpt-镜像-1.5` | Ideogram |
| Multi-turn edits | `gemini-2.5-flash-镜像-preview` | `Flux-kontext-pro` |
| Photoreal hero shots | `imagen-4.0-ultra-generate-001` | `Flux-ultra` |
| Fast low-cost drafts | `gpt-镜像-1-mini` | `imagen-4.0-fast-generate-001` |
| Character/product consistency | `Flux-kontext-max` | `gpt-镜像-1.5` with references |
| 本地 no-api workflows | `Flux-schnell` | SDXL |

### 3. Use benchmark tables as dated snapshots

Benchmarks drift weekly. Use `benchmarks-2026.md` as a starting point, then recheck current rankings when quality is critical.

### 4. Draft cheap, finish expensive

Start with 1-4 low-cost drafts, 选取 one, then upscale or rerender only the winner.

### 5. Keep a fallback chain

If the preferred model is unavailable, fallback by tier:
1) same provider lower tier, 2) cross-provider equivalent, 3) 本地/open model.

### 6. Treat DALL-E as legacy

OpenAI lists DALL-E 2/3 as legacy. Do not use them as default for new projects.

## Common Traps

- Using vendor nicknames as model IDs -> api errors and wasted retries
- Assuming "Nano Banana Pro" or "Flux 2" are universal IDs -> provider mismatch
- Copying old DALL-E prompt habits -> weaker 输出 vs modern GPT/Gemini 镜像 models
- Comparing text-to-镜像 and 镜像-editing scores as if they were the same benchmark
- Optimizing every draft at max quality -> cost spikes without quality gain

## 安全 & Privacy

**Data that leaves your machine:**
- Prompt text
- 引用 镜像 when editing or style matching

**Data that stays 本地:**
- Provider preferences in `~/镜像-generation/内存.md`
- 可选 本地 历史 文件

**This skill does NOT:**
- Store api keys
- 上传 files outside chosen provider requests
- Persist generated 镜像 unless 用户 asks to 保存 them

## External Endpoints

| Provider | 端点 | Data Sent | Purpose |
|----------|----------|-----------|---------|
| OpenAI | `api.openai.com` | Prompt text, 可选 input 镜像 | GPT 镜像 generation/editing |
| Google Gemini api | `generativelanguage.googleapis.com` | Prompt text, 可选 input 镜像 | Gemini 镜像 generation/editing |
| Google Vertex AI | `aiplatform.googleapis.com` | Prompt text, 可选 input 镜像 | Imagen 4 generation |
| Black Forest Labs | `api.bfl.AI` | Prompt text, 可选 input 镜像 | Flux generation/editing |
| Replicate | `api.replicate.com` | Prompt text, 可选 input 镜像 | Hosted 第三方 镜像 models |
| Midjourney | `discord.com` | Prompt text | Midjourney generation via Discord workflows |
| Leonardo | `cloud.leonardo.AI` | Prompt text, 可选 input 镜像 | Leonardo generation/editing |
| Ideogram | `api.ideogram.AI` | Prompt text | Typography-focused 镜像 generation |

No other data is sent externally.

## 迁移

If upgrading from a previous 版本, read `迁移.md` before updating 本地 内存 structure.

## Trust

This skill may 发送 prompts and 引用 镜像 to 第三方 AI providers.
Only install if you trust those providers with your content.

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `镜像-edit` - Specialized inpainting, outpainting, and mask workflows
- `video-generation` - Convert 镜像 concepts into video pipelines
- `colors` - 构建 palettes for visual consistency across assets
- `ffmpeg` - POST-进程 镜像 sequences and exports

## Feedback

- If useful: `clawhub star 镜像-generation`
- Stay updated: `clawhub sync`
