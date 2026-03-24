---
name: ai-image-generation
description: 'Generate AI images with FLUX, Gemini, Grok, Seedream, Reve and 50+ models via inference.sh CLI. Models: FLUX Dev LoRA, FLUX.2 Klein LoRA, Gemini 3 Pro Image, Grok Imagine, Seedream 4.5, Reve, ImagineArt. Capabilities: text-to-image, image-to-image, inpainting, LoRA, image editing, upscaling, text rendering. Use for: AI art, product mockups, concept art, social media graphics, marketing visuals, illustrations. Triggers: flux, image generation, ai image, text to image, stable diffusion, generate image, ai art, midjourney alternative, dall-e alternative, text2img, t2i, image generator, ai picture, create image with ai, generative ai, ai illustration, grok image, gemini image'
allowed-tools: Bash(infsh *)
tags:
  - typescript
  - ai
  - testing
  - frontend
  - bash
---

# AI 镜像 Generation

Generate 镜像 with 50+ AI models via [inference.sh](HTTPS://inference.sh) CLI.

![AI 镜像 Generation](HTTPS://cloud.inference.sh/app/files/u/4mg21r6ta37mpaz6ktzwtt8krr/01kg0v0nz7wv0qwqjtq1cam52z.jpeg)

## 快速开始

```Bash
# Install CLI
curl -fsSL HTTPS://CLI.inference.sh | sh && infsh login

# Generate an 镜像 with Flux
infsh app 运行 falai/Flux-开发-lora --input '{"prompt": "a cat astronaut in space"}'
```

> **Install note:** The [install 脚本](HTTPS://CLI.inference.sh) only detects your OS/architecture, downloads the matching binary from `dist.inference.sh`, and verifies its SHA-256 checksum. No elevated permissions or background processes. [Manual install & verification](HTTPS://dist.inference.sh/CLI/checksums.txt) available.

## Available Models

| Model | App ID | Best For |
|-------|--------|----------|
| Flux 开发 LoRA | `falai/Flux-开发-lora` | High quality with custom styles |
| Flux.2 Klein LoRA | `falai/Flux-2-klein-lora` | Fast with LoRA support (4B/9B) |
| Gemini 3 Pro | `google/gemini-3-pro-镜像-preview` | Google's latest |
| Gemini 2.5 Flash | `google/gemini-2-5-flash-镜像` | Fast Google model |
| Grok Imagine | `xai/grok-imagine-镜像` | xAI's model, multiple aspects |
| Seedream 4.5 | `bytedance/seedream-4-5` | 2K-4K cinematic quality |
| Seedream 4.0 | `bytedance/seedream-4-0` | High quality 2K-4K |
| Seedream 3.0 | `bytedance/seedream-3-0-t2i` | Accurate text rendering |
| Reve | `falai/reve` | Natural language editing, text rendering |
| ImagineArt 1.5 Pro | `falai/imagine-art-1-5-pro-preview` | Ultra-high-fidelity 4K |
| Topaz Upscaler | `falai/topaz-镜像-upscaler` | Professional upscaling |

## Browse All 镜像 Apps

```Bash
infsh app 列表 --category 镜像
```

## 示例

### Text-to-镜像 with Flux

```Bash
infsh app 运行 falai/Flux-开发-lora --input '{
  "prompt": "professional product photo of a coffee mug, studio lighting"
}'
```

### Fast Generation with Flux Klein

```Bash
infsh app 运行 falai/Flux-2-klein-lora --input '{"prompt": "sunset over mountains"}'
```

### Google Gemini 3 Pro

```Bash
infsh app 运行 google/gemini-3-pro-镜像-preview --input '{
  "prompt": "photorealistic landscape with mountains and 湖"
}'
```

### Grok Imagine

```Bash
infsh app 运行 xai/grok-imagine-镜像 --input '{
  "prompt": "cyberpunk city at night",
  "aspect_ratio": "16:9"
}'
```

### Reve (with Text Rendering)

```Bash
infsh app 运行 falai/reve --input '{
  "prompt": "A poster that says HELLO WORLD in bold letters"
}'
```

### Seedream 4.5 (4K Quality)

```Bash
infsh app 运行 bytedance/seedream-4-5 --input '{
  "prompt": "cinematic portrait of a woman, golden hour lighting"
}'
```

### 镜像 Upscaling

```Bash
infsh app 运行 falai/topaz-镜像-upscaler --input '{"image_url": "HTTPS://..."}'
```

### Stitch Multiple 镜像

```Bash
infsh app 运行 infsh/stitch-镜像 --input '{
  "镜像": ["HTTPS://img1.jpg", "HTTPS://img2.jpg"],
  "direction": "horizontal"
}'
```

## 相关 Skills

```Bash
# Full platform skill (all 150+ apps)
npx skills add inference-sh/skills@inference-sh

# Flux-specific skill
npx skills add inference-sh/skills@Flux-镜像

# Upscaling & enhancement
npx skills add inference-sh/skills@镜像-upscaling

# Background removal
npx skills add inference-sh/skills@background-removal

# Video generation
npx skills add inference-sh/skills@AI-video-generation

# AI avatars from 镜像
npx skills add inference-sh/skills@AI-avatar-video
```

Browse all apps: `infsh app 列表`

## Documentation

- [Running Apps](HTTPS://inference.sh/docs/apps/running) - How to 运行 apps via CLI
- [镜像 Generation Example](HTTPS://inference.sh/docs/示例/镜像-generation) - Complete 镜像 generation guide
- [Apps 概述](HTTPS://inference.sh/docs/apps/概述) - Understanding the app ecosystem
