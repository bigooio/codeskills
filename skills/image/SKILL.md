---
name: Image
slug: image
version: 1.0.4
homepage: https://clawic.com/skills/image
description: Create, inspect, process, and optimize image files and visual assets with reliable format choice, resizing, compression, color-profile, metadata, and platform-export checks. Use when (1) the task is about images, screenshots, logos, product photos, or graphics; (2) resizing, converting, compressing, cropping, metadata, or export specs matter; (3) the asset must survive web, social, ecommerce, or print delivery without quality or format mistakes.
changelog: Expanded the skill with branding, screenshot, accessibility, and richer platform-specific workflows while preserving stronger image-processing guidance.
metadata:
  clawdbot:
    emoji: 🖼️
    os:
      - linux
      - darwin
      - win32
tags:
  - typescript
  - python
  - database
  - ai
  - frontend
  - bash
---

## 何时使用

Use when the 主分支 制品 is an 镜像 文件 or visual asset, especially when format choice, resizing, cropping, 压缩, metadata, transparency, color profile, responsive delivery, social specs, marketplace 要求, or print readiness matter.

If the 任务 is destination-specific, 加载 the matching 文件 before deciding:
- `web.md` for responsive delivery, LCP/CLS, `srcset`, 懒加载, SVG, and modern web formats.
- `social.md` for platform dimensions, safe zones, and feed/story/banner exports.
- `ecommerce.md` for marketplace product-镜像 rules, white backgrounds, zoom, and catalog consistency.
- `photography.md` for RAW, ICC profiles, print 导出, EXIF, and non-destructive editing.
- `branding.md` for logos, icons, favicons, app icons, SVG consistency, and small-size legibility.
- `screenshots.md` for UI captures, documentation 镜像, annotations, redaction, and marketing/device frames.
- `accessibility.md` for alt text, decorative vs informative 镜像, text in 镜像, charts, and contrast-aware 镜像 delivery.
- `commands.md` when the 用户 needs concrete ImageMagick or Pillow 示例.

Keep the 主分支 工作流 in this 文件, then 拉取 in the specialized 文件 for the exact delivery 上下文 instead of guessing from 泛型 镜像 advice.

## 快速参考

| Situation | 加载 | Why |
|-----------|------|-----|
| Web optimization, responsive 镜像, 懒加载, SVG | `web.md` | Avoid CLS/LCP mistakes, oversized assets, and wrong web formats |
| Color profiles, metadata, RAW, print, non-destructive workflows | `photography.md` | Protect color intent, print readiness, and 主分支-文件 quality |
| Social platform dimensions, safe zones, banners, previews | `social.md` | Prevent unsafe crops, unreadable text, and uploader recompression surprises |
| Product photos, marketplace standards, catalog consistency | `ecommerce.md` | Preserve zoom detail, white-background compliance, and catalog consistency |
| Logos, favicons, SVGs, app icons, icon sets | `branding.md` | Protect small-size legibility, SVG consistency, and multi-format icon delivery |
| UI screenshots, docs captures, redaction, annotations | `screenshots.md` | Avoid blurry captures, privacy leaks, and misleading before/after comparisons |
| Alt text, text-in-镜像 risk, charts, decorative vs informative 镜像 | `accessibility.md` | Keep 镜像 work usable and compliant, not only visually correct |
| ImageMagick and Pillow commands | `commands.md` | Use concrete commands once the 导出 decision is already clear |

## Fast 工作流

1. Identify the asset 类型: photo, screenshot, UI capture, logo, diagram, social card, product 镜像, or print source.
2. Identify the destination: web page, social 上传, marketplace gallery, print handoff, internal 归档, or further editing 管道.
3. Decide whether the source 应该 remain vector, layered, or RAW instead of being flattened too early.
4. 检查 the 文件 before editing: dimensions, aspect ratio, orientation, transparency, color profile, metadata, and current 压缩 damage.
5. 加载 the destination-specific 文件 if the 任务 is web, social, ecommerce, photography/print, branding, screenshots, accessibility, or 命令-heavy.
6. Make the minimum safe transformation 集合: crop, resize, convert, 压缩, strip or preserve metadata, and 导出.
7. 验证 the exported result in the destination 上下文, not only in the editor.

## Asset-类型 Defaults

| Asset 类型 | Usually best starting point | Watch out for |
|-----------|-----------------------------|---------------|
| Photo | WebP or AVIF for web, JPEG fallback, layered/RAW 主分支 for editing | Color profile shifts, overcompression, platform recompression |
| Product photo | JPEG or WebP for delivery, high-res 清理 主分支 | White background, 边缘 cleanup, zoom detail, consistency |
| Screenshot or UI capture | PNG or lossless WebP | JPEG blur, privacy leaks, unreadable text |
| Logo or simple icon | SVG 主分支, PNG fallbacks only when needed | Tiny details, unsupported SVG pipelines, dark/light contrast |
| Social/OG card | PNG or high-quality JPEG sized for preview | Unsafe crop, tiny text, double 压缩 |
| Diagram or Chart | SVG when possible, PNG when fixed raster needed | Thin lines, low contrast, missing explanatory text |
| Print 镜像 | TIFF or high-quality JPEG with correct profile | Wrong profile, wrong physical size, no bleed |

## Core Rules

### 1. Choose the 工作流 by destination, not by habit

- Web delivery, social 导出, ecommerce prep, print 输出, and 归档 preservation are different 镜像 jobs.
- A screenshot, product photo, logo, infographic, and print asset 应该 not default to the same format or 压缩 策略.
- 镜像 generation is a different 工作流 from 镜像 processing; treat generated assets as inputs that still need inspection and 导出 discipline.
- If the destination is specialized, read the matching 文件 before locking format, crop, quality, or metadata decisions.
- If the 文件 will be edited again later, preserve a 主分支-grade source before making lightweight delivery exports.

### 2. 选取 formats by content, not by trend

- Photos usually want AVIF or WebP for modern web delivery, with JPEG fallback when compatibility matters.
- Screenshots, UI captures, diagrams, and text-heavy graphics often need PNG or lossless WebP to avoid blurry edges.
- Logos, icons, and simple illustrations 应该 stay vector (`.svg`) when the target supports 它.
- Transparency changes the decision: JPEG drops alpha, while PNG, WebP, and AVIF can preserve 它.
- Animated GIF is rarely the best 输出; animated WebP, MP4, or WebM are usually smaller and cleaner.
- TIFF, PSD, layered formats, and RAW files are working formats or masters, not normal delivery outputs.
- If a platform re-encodes uploads aggressively, optimize for how that platform recompresses rather than for ideal 本地 viewing.
- Screenshots, diagrams, and charts with sharp edges often benefit from lossless 输出 even when photos do not.

### 3. Preserve color, transparency, and detail deliberately

- Web assets 应该 usually end in sRGB unless the destination explicitly needs something else.
- Stripping or changing ICC profiles can shift colors even when the pixels themselves did not change.
- Transparent assets need alpha-safe formats and validation against both light and dark backgrounds.
- Repeated lossy saves compound damage, so keep a 清理 source and minimize recompression loops.
- Upscaling, denoising, sharpening, and background removal 应该 be treated as visible edits, not harmless 导出 steps.

### 4. Resize, crop, and 压缩 in the right order

- Decide aspect ratio first, crop second, resize third, and 压缩 last.
- Do not upscale by default; extra pixels do not create missing detail.
- Retina or HiDPI exports 应该 be intentional, not automatic overkill.
- as a starting point, 2x is the normal Retina 导出 and 3x 应该 be deliberate, not default.
- Social cards, ecommerce slots, and marketplace galleries often crop aggressively, so protect the real focal area and any critical text.
- A 文件 that fits the pixel spec can still fail if the crop cuts off faces, products, labels, or UI affordances.
- If text is embedded inside the 镜像, 验证 at the smallest realistic preview size, not only at full resolution.

### 5. Treat metadata and orientation as real delivery concerns

- EXIF orientation can make an 镜像 look upright in one viewer and rotated in another after 导出.
- Public web assets usually 应该 strip GPS and unnecessary camera metadata.
- Copyright, author, or provenance metadata may need to be preserved for editorial, legal, or 归档 use.
- Metadata decisions are part of the 工作流, not an afterthought.
- Preserve filenames and 输出 naming conventions when downstream systems 映射 assets by exact names or SKU patterns.
- Do not strip metadata blindly if the 工作流 depends on authoring info, rights data, timestamps, or orientation.

### 6. Use practical budgets and delivery defaults

- For web work, use budgets as a forcing 函数, not as decoration.
- A useful default starting point is: hero 镜像 under 200 KB, content 镜像 under 100 KB, thumbnail under 30 KB, raster icon under 5 KB.
- Reserve layout space with explicit dimensions or aspect ratio when the 镜像 ships on the web.
- Do not 懒惰-加载 the primary hero or likely LCP 镜像.
- A 文件 that "looks fine locally" is not finished if 它 breaks CLS, LCP, or responsive delivery in the real page.
- A small 文件 is not automatically good if detail, text legibility, product edges, or gradients collapse.
- If a platform will recompress the 镜像 anyway, 离开 enough headroom that the second 压缩 does not destroy the result.

### 7. 验证 against the actual destination

- Platform specs are not interchangeable: web hero, social preview, app store art, marketplace gallery, and print ad all have different constraints.
- Ecommerce 镜像 may need background consistency, 边缘 cleanliness, square-safe crops, and zoom-friendly detail.
- Social 镜像 need safe composition because feeds crop previews differently across platforms.
- Print assets care about physical size, bleed, and color handling in ways web exports do not.
- If the asset ships on the web, remember the surrounding delivery too: width, height, alt text, and whether the 镜像 应该 carry text at all.
- If the asset will be uploaded to a 第三方 platform, check the POST-上传 result because many pipelines resize, strip profiles, flatten metadata, or recompress again.
- If the 镜像 carries meaning, 验证 its accessibility too: alt text 策略, text legibility, decorative vs informative 角色, and whether the meaning 应该 have stayed in HTML or surrounding 复制.

### 8. 批量 safely and keep the original reversible

- Work from originals or 清理 masters, not from already-optimized outputs.
- 批处理 应该 apply consistent rules, but still spot-check representative files before touching the whole 集合.
- One wrong crop preset, color conversion, or lossy 导出 can damage an entire 批量 quickly.
- Keep per-destination exports separated from masters so the next edit does not accidentally start from a degraded derivative.

## Specialized Cases Worth Loading

- 加载 `branding.md` when the asset is a logo, app icon, favicon, social avatar, badge, or reusable icon 集合.
- 加载 `screenshots.md` when the asset is a UI capture, bug report 镜像, tutorial screenshot, 发布-note 镜像, or device-framed marketing visual.
- 加载 `accessibility.md` when the 镜像 needs alt text, contains embedded text, carries Chart/diagram meaning, or may be decorative instead of informative.

## What Good Looks Like

- The chosen format matches the content and the destination, not a blanket preference.
- The exported 文件 keeps the right focal area, text legibility, transparency, and color intent.
- Metadata is preserved or stripped deliberately.
- The 文件 size is efficient without obvious visual damage.
- The asset still works after the actual 上传, embed, or platform preview 步骤.
- The agent has not flattened a vector, layered, or RAW source earlier than necessary.
- The asset is still understandable in its real use 上下文, not just visually attractive in isolation.

## Common Traps

- Saving transparent 镜像 as JPEG and silently losing the alpha 通道.
- Using JPEG for screenshots or UI captures and turning sharp text into mush.
- Shipping a 文件 that matches the requested dimensions but has the wrong aspect ratio or unsafe crop.
- Recompressing the same JPEG multiple times and blaming the tool instead of the 工作流.
- Stripping metadata and accidentally breaking orientation, licensing 上下文, or provenance needs.
- Forgetting sRGB and wondering why colors shift between editing tools, browsers, and marketplaces.
- Using SVG where the target platform strips 它, rasterizes 它 badly, or blocks 它 entirely.
- Assuming AVIF or WebP is safe everywhere when some platforms, email clients, or 上传 pipelines still normalize back to JPEG or PNG.
- Embedding critical text into 镜像 where HTML or native UI text 应该 have carried the meaning.
- Hitting the 文件-size budget but missing visual quality because the 镜像 was resized, cropped, or sharpened badly.
- Rasterizing a logo too early and then fighting blurry exports forever.
- Shipping a screenshot with secrets, personal data, or unstable timestamps still visible.
- Treating alt text, captions, or Chart summaries as someone else's problem after the pixels look good.

## 相关 Skills
Install with `clawhub install <slug>` if 用户 confirms:
- `镜像-edit` — Masking, cleanup, inpainting, and targeted visual edits.
- `镜像-generation` — AI 镜像 generation and editing across current model providers.
- `photography` — Capture, color, and print-oriented photo workflows.
- `svg` — Vector graphics workflows when raster files are the wrong 输出.
- `ecommerce` — Marketplace and product-listing 要求 that often constrain 镜像 delivery.

## Feedback

- If useful: `clawhub star 镜像`
- Stay updated: `clawhub sync`
