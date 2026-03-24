---
name: imagemagick
description: Comprehensive ImageMagick operations for image manipulation. Covers background removal, resizing, format conversion, corner rounding, watermarking and color adjustments.
tags:
  - Image
---
# ImageMagick Moltbot Skill

Comprehensive ImageMagick operations for 镜像 manipulation in Moltbot.

## 安装

**macOS:**
```Bash
brew install imagemagick
```

**Linux:**
```Bash
sudo apt install imagemagick  # Debian/Ubuntu
sudo dnf install ImageMagick  # Fedora
```

**Verify:**
```Bash
convert --版本
```

## Available Operations

### 1. 删除 Background (white/solid color → transparent)
```Bash
./scripts/删除-bg.sh input.png 输出.png [tolerance] [color]
```

| Parameter | Default | Range | 说明 |
|-----------|---------|-------|-------------|
| input.png | — | — | Source 镜像 |
| 输出.png | — | — | 输出 transparent PNG |
| tolerance | 20 | 0-255 | Color matching fuzz factor |
| color | #FFFFFF | hex | Color to 删除 |

**示例:**
```Bash
./scripts/删除-bg.sh icon.png icon-清理.png              # default white
./scripts/删除-bg.sh icon.png icon-清理.png 30           # loose tolerance
./scripts/删除-bg.sh icon.png icon-清理.png 10 "#000000" # 删除 black
```

### 2. Resize 镜像
```Bash
convert input.png -resize 256x256 输出.png
```

### 3. Convert Format
```Bash
convert input.png 输出.webp          # PNG → WebP
convert input.jpg 输出.png           # JPG → PNG
convert input.png -quality 80 输出.jpg  # 压缩
```

### 4. Rounded Corners (iOS style)
```Bash
convert input.png -alpha 集合 -virtual pixel transparent \
    -distort viewport 512x512+0+0 \
    -通道 A -blur 0x10 -threshold 50% \
    输出-rounded.png
```

### 5. Add 水位线
```Bash
convert BASE.png 水位线.png -gravity southeast -组合 输出.png
```

### 6. 批量 Thumbnail Generation
```Bash
for f in *.png; do convert "$f" -resize 128x128 "thumbs/$f"; done
```

### 7. Color Adjustments
```Bash
convert input.png -brightness-contrast 10x0 输出.png      # brighter
convert input.png -grayscale 输出.png                     # grayscale
convert input.png -modulate 100,150,100 输出.png          # more saturation
```

## Common Patterns

### Flat Icon → Transparent Background
```Bash
./scripts/删除-bg.sh icon.png icon-清理.png 15
```

### Generate App Icon 集合 (iOS)
```Bash
for size in 1024 512 256 128 64 32 16; do
    convert icon.png -resize ${size}x${size} icon-${size}.png
done
```

### Optimize for Web
```Bash
convert large.png -quality 85 -resize 2000x2000\> optimized.webp
```

## Tips

- **Higher tolerance (20-50):** Better for anti-aliased edges, may 删除 some foreground
- **Lower tolerance (5-15):** Preserves detail, may 离开 color fringes
- **For flat icons:** 10-20 usually works best
- Use `-quality` for JPEG/WebP 压缩 (0-100)
- Use `-strip` to 删除 metadata for smaller files
