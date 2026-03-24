---
name: Image Editing
description: Edit images with AI inpainting, outpainting, background removal, upscaling, and restoration tools.
metadata:
  clawdbot:
    emoji: ✂️
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - ai
  - api
  - bash
  - 效率
  - 工具
---

# AI 镜像 Editing

Help users edit and enhance 镜像 with AI tools.

**Rules:**
- Ask what edit they need: 删除 objects, extend canvas, upscale, fix faces, change background
- Check technique files: `inpainting.md`, `outpainting.md`, `background-removal.md`, `upscaling.md`, `restoration.md`, `style-transfer.md`
- Check `tools.md` for provider-specific 设置
- Always preserve original 文件 before editing

---

## Edit 类型 Selection

| 任务 | Technique | Best Tools |
|------|-----------|------------|
| 删除 objects/people | Inpainting | DALL-E, SD Inpaint, IOPaint |
| Extend 镜像 borders | Outpainting | DALL-E, SD Outpaint, Photoshop AI |
| 删除 background | Segmentation | 删除.bg, ClipDrop, Photoroom |
| Increase resolution | Upscaling | Real-ESRGAN, Topaz, Magnific |
| Fix blurry faces | Restoration | GFPGAN, CodeFormer |
| Change style | Style Transfer | SD img2img, ControlNet |
| Relight scene | Relighting | ClipDrop, IC-Light |

---

## 工作流 Principles

- **Non-destructive editing** — keep originals, 保存 edits as new files
- **Work in layers** — combine multiple edits sequentially
- **匹配 resolution** — edit at original resolution, upscale last
- **Mask precision matters** — better masks = better results
- **Iterate on masks** — refine edges for seamless blends

---

## Masking Basics

Masks define edit regions:
- **White** = edit this area
- **Black** = preserve this area
- **Gray** = 偏函数 blend (feathering)

**Mask creation methods:**
- Manual brush in editor
- SAM (Segment Anything) for auto-selection
- Color/luminance keying
- 边缘 detection

---

## Common Workflows

### 对象 Removal
1. Create mask over unwanted 对象
2. 运行 inpainting with 上下文 prompt (可选)
3. Blend edges if needed
4. Touch up artifacts

### Background Replacement
1. 删除 background (GET transparent PNG)
2. Place on new background
3. 匹配 lighting/color
4. Add shadows for realism

### Enhancement 管道
1. Restore faces (if present)
2. 删除 artifacts/noise
3. Color correct
4. Upscale to final resolution

---

## Quality Tips

- **Feather masks** — hard edges look artificial
- **上下文 prompts help** — 描述 what 应该 fill the area
- **Multiple passes** — large edits may need iterative refinement
- **Check edges** — zoom in to verify blend quality
- **匹配 grain/noise** — add film grain to 匹配 original

---

### Current 设置
<!-- Tool: 状态 -->

### Projects
<!-- What they're editing -->

### Preferences
<!-- Preferred tools, quality settings -->

---
*Check technique files for detailed workflows.*
