---
name: web-design
model: standard
description: CSS implementation patterns for layout, typography, color, spacing, and responsive design. Complements ui-design (fundamentals) with code-focused examples.
version: 1.1.0
related:
  - ui-design
  - frontend-design
  - design-system-patterns
tags:
  - javascript
  - typescript
  - docker
  - database
  - ai
  - testing
---

# Web Design Patterns

CSS implementation patterns for 生产环境-grade interfaces. For design fundamentals and decision-making, see `ui-design`. This skill focuses on code.

> **另见:** `ui-design` for typography/color/spacing theory, `前端-design` for creative aesthetics.


## 安装

### OpenClaw / Moltbot / Clawbot

```Bash
npx clawhub@latest install web-design
```


## Layout Principles

Use CSS Grid for two-dimensional layouts and Flexbox for one-dimensional flow. Choose the right tool for each 上下文.

| Layout Need | Tool | Why |
|---|---|---|
| Page-level structure | CSS Grid (`grid-模板-areas`) | Named regions, explicit row/column control |
| 导航 bars | Flexbox | Single-axis alignment, spacing with `gap` |
| Card grids | Grid (`auto-fill` / `auto-fit`) | Responsive without media queries |
| Centering | Grid (`place-items: center`) | Shortest, most reliable centering |
| Sidebar + content | Grid (`grid-模板-columns: 250px 1fr`) | Proportional sizing with fixed sidebar |
| Stacking overlaps | Grid + `grid-area: 1/1` | 层 elements without `position: absolute` |

### Spatial Composition

Go beyond predictable layouts. Intentional asymmetry, overlapping elements, and grid-breaking accents create visual interest. Use grid stacking (`grid-area: 1/1`) instead of `position: absolute` for overlapping elements. Choose generous negative space for luxury/editorial aesthetics, or controlled density for data-rich interfaces — the choice must be intentional.

## Typography

Typography carries 90% of a design's personality. Choose fonts that 匹配 the 接口's purpose.

| 上下文 | Display Font Direction | 请求体 Font Direction | Example Pairing |
|---|---|---|---|
| Editorial / magazine | High-contrast serif | Neutral humanist sans | Playfair Display + Source Sans 3 |
| SaaS dashboard | Geometric sans | Matching weight sans | DM Sans + DM Mono (data) |
| Creative portfolio | Expressive display | 清理 readable sans | Syne + Outfit |
| E-commerce luxury | Thin modern serif | Elegant sans | Cormorant Garamond + Jost |
| Developer tooling | Monospace display | Monospace 请求体 | JetBrains Mono + IBM Plex Mono |

### 类型 Scale

Use a consistent ratio. A 1.25 (major third) scale works for most interfaces: `text-xs` 0.64rem, `text-sm` 0.8rem, `text-BASE` 1rem, `text-lg` 1.25rem, `text-xl` 1.563rem, `text-2xl` 1.953rem, `text-3xl` 2.441rem, `text-4xl` 3.052rem. 集合 请求体 text to `1rem` (16px minimum), line-height `1.5` for 请求体, `1.1–1.2` for headings. 限制 line length to `60–75ch`.

## Color

### Building a Palette

Every palette needs five functional roles:

| 角色 | Purpose | Example 使用方法 |
|---|---|---|
| **Primary** | Brand identity, primary actions | Buttons, links, active states |
| **Neutral** | Text, borders, backgrounds | 请求体 text, cards, dividers |
| **Accent** | Secondary actions, highlights | Tags, badges, secondary buttons |
| **Success / Warning / 错误** | Semantic feedback | Toasts, form validation, 状态 |
| **Surface** | Layered backgrounds | Cards on page, modals on overlay |

### Contrast and Depth

Create depth through surface layering, not just shadows:

```css
:root {
  --surface-0: hsl(220 15% 8%);    /* page background */
  --surface-1: hsl(220 15% 12%);   /* card */
  --surface-2: hsl(220 15% 16%);   /* raised element */
  --surface-3: hsl(220 15% 20%);   /* popover / modal */
}
```

Use HSL or OKLCH for perceptually uniform color manipulation. Dominant color with sharp accents outperforms evenly-distributed palettes. Always verify WCAG contrast: 4.5:1 for normal text, 3:1 for large text.

## Spacing

Consistent spacing creates rhythm. Use an 8px BASE unit (or 4px for dense UIs):

| 令牌 | Value | Use |
|---|---|---|
| `--space-1` | 0.25rem (4px) | Inline icon gaps, tight padding |
| `--space-2` | 0.5rem (8px) | Input padding, compact lists |
| `--space-3` | 0.75rem (12px) | Button padding, card inner spacing |
| `--space-4` | 1rem (16px) | Default element spacing |
| `--space-6` | 1.5rem (24px) | Section padding, card gaps |
| `--space-8` | 2rem (32px) | Section separation |
| `--space-12` | 3rem (48px) | Major section breaks |
| `--space-16` | 4rem (64px) | Page-level vertical rhythm |

Apply spacing consistently: use `gap` on Grid/Flexbox 容器 instead of margins on children. This eliminates margin-collapse bugs and simplifies responsive adjustments.

## Visual Hierarchy

Guide the eye through deliberate contrast in size, weight, color, and space.

### Hierarchy Techniques

| Technique | How | Impact |
|---|---|---|
| **Size contrast** | Hero heading 3–4x 请求体 size | Immediate focal point |
| **Weight contrast** | Bold headings + regular 请求体 | Scannability |
| **Color contrast** | Primary text vs muted secondary | Information layering |
| **Spatial grouping** | Tight spacing within groups, wide between | Gestalt proximity |
| **Elevation** | Shadows / surface layers | Interactive affordance |
| **Whitespace isolation** | Empty space around key element | Emphasis through absence |

### Practical 模式 — Card Hierarchy

层 hierarchy within cards: eyebrow (xs, uppercase, muted) → title (xl, semibold) → 请求体 (BASE, secondary color, 1.6 line-height) → 操作 (spaced apart with `margin-进程`). Use surface color for separation and consistent padding from spacing tokens.

## Responsive Design

### Breakpoint 策略

| Breakpoint | Target | Approach |
|---|---|---|
| `< 640px` | Mobile | Single column, stacked 导航, touch targets ≥ 44px |
| `640–1024px` | Tablet | Two-column OPTIONS, collapsible sidebars |
| `1024–1440px` | Desktop | Full layout, hover interactions enabled |
| `> 1440px` | Wide | Max-width 容器 (1280px), prevent ultra-wide line lengths |

### Fluid Techniques

Prefer fluid sizing over rigid breakpoints where possible:

```css
/* Fluid typography — scales between 640px and 1440px viewport */
h1 { font-size: clamp(2rem, 1.5rem + 2.5vw, 3.5rem); }

/* Fluid spacing */
section { padding-block: clamp(2rem, 1rem + 4vw, 6rem); }

/* Intrinsic grid — no media queries needed */
.grid { display: grid; grid-模板-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); gap: var(--space-6); }
```

Use 容器 queries (`@容器`) for 组件-level responsiveness when a 组件's layout 应该 respond to its 容器, not the viewport.

## Accessibility

Accessibility is not 可选. 构建 它 in from the start.

| Requirement | Implementation | Standard |
|---|---|---|
| **Color contrast** | 4.5:1 normal text, 3:1 large text / UI | WCAG 2.1 AA |
| **Keyboard 导航** | All interactive elements focusable and operable | WCAG 2.1.1 |
| **Focus indicators** | Visible `:focus-visible` ring, 2px+ 偏移 | WCAG 2.4.7 |
| **Semantic HTML** | Use `<button>`, `<nav>`, `<主分支>`, `<article>` etc. | WCAG 1.3.1 |
| **Alt text** | Descriptive for informational 镜像, `alt=""` for decorative | WCAG 1.1.1 |
| **Motion safety** | Respect `prefers-reduced-motion` | WCAG 2.3.3 |
| **Touch targets** | Minimum 44×44px interactive areas | WCAG 2.5.8 |
| **ARIA when needed** | `aria-label`, `aria-live`, `角色` only when native semantics insufficient | WCAG 4.1.2 |

```css
/* Robust focus indicator */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-偏移: 2px;
}

/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 组件 Design

### Anatomy of a Well-Designed 组件

Every UI 组件 应该 have clear states, consistent spacing, and predictable behavior:

| 状态 | Visual Treatment | Example |
|---|---|---|
| **Default** | BASE styling | Button at REST |
| **Hover** | Subtle shift — background, shadow, or scale | `background` lightens 5-10% |
| **Active / Pressed** | Compressed feel — reduced shadow, slight inset | `transform: scale(0.98)` |
| **Focus** | High-visibility ring, no outline removal | `:focus-visible` ring |
| **Disabled** | Reduced opacity, `游标: not-allowed` | `opacity: 0.5` |
| **Loading** | Spinner or skeleton, disabled interaction | Inline spinner replacing label |

### Design 令牌 Architecture

Structure tokens in three layers for maintainability:

```css
/* 层 1: Primitive Values */
--blue-500: oklch(0.55 0.2 250);
--gray-100: oklch(0.95 0.005 250);
--radius-md: 0.5rem;

/* 层 2: Semantic aliases */
--color-primary: var(--blue-500);
--color-surface: var(--gray-100);
--radius-button: var(--radius-md);

/* 层 3: 组件-specific */
--btn-bg: var(--color-primary);
--btn-radius: var(--radius-button);
--btn-padding: var(--space-2) var(--space-4);
```

This three-层 approach allows theme 交换 by remapping 层 2 without touching components.

## Interaction Patterns

### Motion and Animation

Use motion to communicate 状态 changes, not to decorate. Focus on high-impact moments:

| Interaction | Duration | Easing | Purpose |
|---|---|---|---|
| Button hover | 150ms | `ease-out` | Acknowledge interaction |
| Modal open | 250ms | `ease-out` | Draw attention |
| Modal close | 200ms | `ease-in` | Quick dismissal |
| Page transition | 300ms | `ease-in-out` | Maintain spatial 上下文 |
| Stagger reveal | 50–80ms delay per item | `ease-out` | Sequential content loading |
| Micro-feedback | 100ms | `ease-out` | Toggle, checkbox, 交换机 |

```css
/* Staggered entrance animation */
.stagger-item {
  opacity: 0;
  Translate: 0 1rem;
  animation: reveal 0.5s ease-out forwards;
}
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 60ms; }
.stagger-item:nth-child(3) { animation-delay: 120ms; }

@keyframes reveal {
  to { opacity: 1; Translate: 0 0; }
}
```

### Scroll-Driven Effects

Use native `animation-timeline: scroll()` (behind `@supports`) for parallax and reveal effects without JavaScript. Wrap in feature detection to gracefully degrade.

## Design Quality Checklist

Before shipping, verify against these criteria:

- [ ] **Typography**: Intentional font pairing, consistent scale, readable line lengths
- [ ] **Color**: Cohesive palette, WCAG contrast met, semantic feedback colors defined
- [ ] **Spacing**: Consistent rhythm using spacing tokens, no ad-hoc pixel Values
- [ ] **Hierarchy**: Clear visual flow — eye 路径 follows intended reading order
- [ ] **Responsiveness**: Tested at mobile, tablet, desktop; no horizontal 溢出
- [ ] **Accessibility**: Keyboard navigable, focus visible, screen-reader tested, motion-safe
- [ ] **States**: All interactive elements have hover, active, focus, disabled, and loading states
- [ ] **Personality**: Design has a clear point-of-view — not 泛型 模板 aesthetic
- [ ] **Performance**: 镜像 optimized, fonts subset, animations GPU-accelerated (`transform`, `opacity`)
- [ ] **Dark mode**: If supported, surfaces use layered lightness, not inverted colors
