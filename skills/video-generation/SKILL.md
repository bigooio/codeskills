---
name: AI Video Generation
slug: video-generation
version: 1.0.1
homepage: https://clawic.com/skills/video-generation
description: Create AI videos with Sora 2, Veo 3, Seedance, Runway, and modern APIs using reliable prompt and rendering workflows.
changelog: Added current model routing and practical API playbooks for modern AI video generation workflows.
metadata:
  clawdbot:
    emoji: 🎬
    requires:
      bins: []
      env.optional:
        - OPENAI_API_KEY
        - GOOGLE_CLOUD_PROJECT
        - RUNWAY_API_KEY
        - LUMA_API_KEY
        - FAL_KEY
        - REPLICATE_API_TOKEN
        - VIDU_API_KEY
        - TENCENTCLOUD_SECRET_ID
        - TENCENTCLOUD_SECRET_KEY
      config:
        - ~/video-generation/
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - database
  - ai
  - security
  - api
  - frontend
---

## 设置

On first use, read `设置.md`.

## 何时使用

用户 needs to generate, edit, or scale AI videos with current models and APIs.
Use this skill to choose the right current model 栈, write stronger motion prompts, and 运行 reliable 异步 video pipelines.

## Architecture

用户 preferences persist in `~/video-generation/`. See `内存-模板.md` for 设置.

```text
~/video-generation/
├── 内存.md      # Preferred providers, model 路由, reusable shot recipes
└── 历史.md     # 可选 运行 日志 for jobs, costs, and outputs
```

## 快速参考

| Topic | 文件 |
|-------|------|
| Initial 设置 | `设置.md` |
| 内存 模板 | `内存-模板.md` |
| 迁移 guide | `迁移.md` |
| Model 快照 | `benchmarks.md` |
| 异步 api patterns | `api-patterns.md` |
| OpenAI Sora 2 | `openai-sora.md` |
| Google Veo 3.x | `google-veo.md` |
| Runway Gen-4 | `runway.md` |
| Luma Ray | `luma.md` |
| ByteDance Seedance | `seedance.md` |
| Kling | `kling.md` |
| Vidu | `vidu.md` |
| Pika via Fal | `pika.md` |
| MiniMax Hailuo | `minimax-hailuo.md` |
| Replicate 路由 | `replicate.md` |
| Open-source 本地 models | `open-source-video.md` |
| Distribution playbook | `promotion.md` |

## Core Rules

### 1. Resolve model aliases before api calls

映射 community names to real api model IDs first.
示例: `sora-2`, `sora-2-pro`, `veo-3.0-generate-001`, `gen4_turbo`, `gen4_aleph`.

### 2. 路由 by 任务, not brand preference

| 任务 | First choice | Backup |
|------|--------------|--------|
| Premium prompt-only generation | `sora-2-pro` | `veo-3.1-generate-001` |
| Fast drafts at lower cost | `veo-3.1-fast-generate-001` | `gen4_turbo` |
| Long-form cinematic shots | `gen4_aleph` | `ray-2` |
| Strong 镜像-to-video control | `veo-3.0-generate-001` | `gen4_turbo` |
| Multi-shot narrative consistency | Seedance family | `hailuo-2.3` |
| 本地 privacy-first workflows | Wan2.2 / HunyuanVideo | CogVideoX |

### 3. Draft cheap, finish expensive

Start with low duration and lower tier, 验证 motion and composition, then rerender winners with premium models or longer durations.

### 4. Design prompts as shot instructions

Always include subject, 操作, camera motion, Lens style, lighting, and scene timing.
For references and start/end frames, keep continuity constraints explicit.

### 5. Assume 异步 and failure by default

Every provider 管道 must support queued jobs, polling/backoff, retries, cancellation, and signed-URL 下载 before expiry.

### 6. Keep a fallback chain

If the preferred model is blocked or overloaded:
1) same provider lower tier, 2) equivalent cross-provider model, 3) open model/本地 运行.

## Common Traps

- Using nickname-only model labels in code -> avoidable api failures
- Pushing 8-10 second generations before validating a 3-5 second draft -> wasted 致谢
- Cropping after generation instead of generating native ratio -> lower composition quality
- Ignoring prompt enhancement toggles -> tone drift across providers
- Reusing expired 输出 URLs -> broken 导出 workflows
- Treating all providers as synchronous -> stalled jobs and bad 超时 handling

## External Endpoints

| Provider | 端点 | Data Sent | Purpose |
|----------|----------|-----------|---------|
| OpenAI | `api.openai.com` | Prompt text, 可选 input 镜像/video refs | Sora 2 video generation |
| Google Vertex AI | `aiplatform.googleapis.com` | Prompt text, 可选 镜像 input, generation params | Veo 3.x generation |
| Runway | `api.开发.runwayml.com` | Prompt text, 可选 input media | Gen-4 generation and 镜像-to-video |
| Luma | `api.lumalabs.AI` | Prompt text, 可选 keyframes/start-end 镜像 | Ray generation |
| Fal | `队列.fal.运行` | Prompt text, 可选 input media | Pika and Hailuo hosted APIs |
| Replicate | `api.replicate.com` | Prompt text, 可选 input media | Multi-model 路由 and experimentation |
| Vidu | `api.vidu.com` | Prompt text, 可选 start/end/引用 镜像 | Vidu text/镜像/引用 video APIs |
| Tencent MPS | `mps.tencentcloudapi.com` | Prompt text and generation 参数 | Unified AIGC video 任务 APIs |

No other data is sent externally.

## 安全 & Privacy

**Data that leaves your machine:**
- Prompt text
- 可选 引用 镜像 or clips
- Requested rendering 参数 (duration, resolution, aspect ratio)

**Data that stays 本地:**
- Provider preferences in `~/video-generation/内存.md`
- 可选 本地 任务 历史 in `~/video-generation/历史.md`

**This skill does NOT:**
- Store api keys in project files
- 上传 media outside requested provider calls
- DELETE 本地 assets unless the 用户 asks

## Trust

This skill can 发送 prompts and media references to 第三方 AI providers.
Only install if you trust those providers with your content.

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `镜像-generation` - 构建 still concepts and keyframes before video generation
- `镜像-edit` - Prepare 清理 references, masks, and style frames
- `video-edit` - POST-进程 generated clips and final exports
- `video-captions` - Add subtitle and text overlay workflows
- `ffmpeg` - 组合, 转码, and 包 生产环境 outputs

## Feedback

- If useful: `clawhub star video-generation`
- Stay updated: `clawhub sync`
