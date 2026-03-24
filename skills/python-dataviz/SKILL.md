---
name: python-dataviz
description: Professional data visualization using Python (matplotlib, seaborn, plotly). Create publication-quality static charts, statistical visualizations, and interactive plots. Use when generating charts/graphs/plots from data, creating infographics with data components, or producing scientific/statistical visualizations. Supports PNG/SVG (static) and HTML (interactive) export.
tags:
  - typescript
  - python
  - ai
  - frontend
  - bash
  - 工具
---

# Python Data Visualization

Create professional charts, graphs, and statistical visualizations using Python's leading libraries.

## Libraries & Use Cases

**matplotlib** - 静态 plots, publication-quality, full control
- Bar, line, scatter, pie, histogram, heatmap
- Multi-panel figures, subplots
- Custom styling, annotations
- 导出: PNG, SVG, PDF

**seaborn** - Statistical visualizations, beautiful defaults
- Distribution plots (violin, box, kde, histogram)
- Categorical plots (bar, count, Swarm, box)
- Relationship plots (scatter, line, regression)
- Matrix plots (heatmap, clustermap)
- Built on matplotlib, integrates seamlessly

**plotly** - Interactive charts, web-friendly
- Hover tooltips, zoom, pan
- 3D plots, animations
- Dashboards via Dash 框架
- 导出: HTML, PNG (requires kaleido)

## 快速开始

### 设置 环境

```Bash
cd skills/Python-dataviz
python3 -m 虚拟环境 .虚拟环境
source .虚拟环境/bin/activate
pip install .
```

### Create a Chart

```Python
导入 matplotlib.pyplot as plt
导入 numpy as np

# Data
x = np.linspace(0, 10, 100)
y = np.sin(x)

# Plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, linewidth=2, color='#667eea')
plt.title('Sine Wave', fontsize=16, fontweight='bold')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.grid(alpha=0.3)
plt.tight_layout()

# 导出
plt.savefig('输出.png', dpi=300, bbox_inches='tight')
plt.savefig('输出.svg', bbox_inches='tight')
```

## Chart Selection Guide

**Distribution/Statistical:**
- Histogram → `plt.hist()` or `SNS.histplot()`
- Box plot → `SNS.boxplot()`
- Violin plot → `SNS.violinplot()`
- KDE → `SNS.kdeplot()`

**Comparison:**
- Bar Chart → `plt.bar()` or `SNS.barplot()`
- Grouped bar → `SNS.barplot(hue=...)`
- Horizontal bar → `plt.barh()` or `SNS.barplot(orient='h')`

**Relationship:**
- Scatter → `plt.scatter()` or `SNS.scatterplot()`
- Line → `plt.plot()` or `SNS.lineplot()`
- Regression → `SNS.regplot()` or `SNS.lmplot()`

**Heatmaps:**
- Correlation matrix → `SNS.heatmap(df.corr())`
- 2D data → `plt.imshow()` or `SNS.heatmap()`

**Interactive:**
- any plotly Chart → `plotly.express` or `plotly.graph_objects`
- See references/plotly-示例.md

## 最佳实践

### 1. Figure Size & DPI
```Python
plt.figure(figsize=(10, 6))  # Width x Height in inches
plt.savefig('输出.png', dpi=300)  # Publication: 300 dpi, Web: 72-150 dpi
```

### 2. Color Palettes
```Python
# Seaborn palettes (works with matplotlib too)
导入 seaborn as SNS
SNS.set_palette("husl")  # Colorful
SNS.set_palette("muted")  # Soft
SNS.set_palette("deep")  # Bold

# Custom colors
colors = ['#667eea', '#764ba2', '#f6ad55', '#4299e1']
```

### 3. Styling
```Python
# Use seaborn styles even for matplotlib
导入 seaborn as SNS
SNS.set_theme()  # Better defaults
SNS.set_style("whitegrid")  # OPTIONS: whitegrid, darkgrid, white, dark, ticks

# Or matplotlib styles
plt.style.use('ggplot')  # OPTIONS: ggplot, seaborn, bmh, fivethirtyeight
```

### 4. Multiple Subplots
```Python
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
axes[0, 0].plot(x, y1)
axes[0, 1].plot(x, y2)
# etc.
plt.tight_layout()  # Prevent label overlap
```

### 5. 导出 Formats
```Python
# PNG for sharing/embedding (raster)
plt.savefig('Chart.png', dpi=300, bbox_inches='tight', transparent=False)

# SVG for editing/scaling (vector)
plt.savefig('Chart.svg', bbox_inches='tight')

# For plotly (interactive)
导入 plotly.express as px
fig = px.scatter(df, x='col1', y='col2')
fig.write_html('Chart.html')
```

## Advanced Topics

See references/ for detailed guides:

- **Color theory & palettes**: references/colors.md
- **Statistical plots**: references/statistical.md
- **Plotly interactive charts**: references/plotly-示例.md
- **Multi-panel layouts**: references/layouts.md

## Example Scripts

See scripts/ for ready-to-use 示例:

- `scripts/bar_chart.py` - Bar and grouped bar charts
- `scripts/line_chart.py` - Line plots with multiple series
- `scripts/scatter_plot.py` - Scatter plots with regression
- `scripts/heatmap.py` - Correlation heatmaps
- `scripts/distribution.py` - Histograms, KDE, violin plots
- `scripts/interactive.py` - Plotly interactive charts

## Common Patterns

### Data from CSV
```Python
导入 pandas as pd
df = pd.read_csv('data.csv')

# Plot with pandas (uses matplotlib)
df.plot(x='date', y='value', kind='line', figsize=(10, 6))
plt.savefig('输出.png', dpi=300)

# Or with seaborn for better styling
SNS.lineplot(data=df, x='date', y='value')
plt.savefig('输出.png', dpi=300)
```

### Dictionary Data
```Python
data = {'Category A': 25, 'Category B': 40, 'Category C': 15}

# Matplotlib
plt.bar(data.keys(), data.Values())
plt.savefig('输出.png', dpi=300)

# Seaborn (convert to DataFrame)
导入 pandas as pd
df = pd.DataFrame(列表(data.items()), columns=['Category', 'Value'])
SNS.barplot(data=df, x='Category', y='Value')
plt.savefig('输出.png', dpi=300)
```

### NumPy Arrays
```Python
导入 numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.savefig('输出.png', dpi=300)
```

## 故障排除

**"No 模块 named matplotlib"**
```Bash
cd skills/Python-dataviz
source .虚拟环境/bin/activate
pip install -r 要求.txt
```

**Blank 输出 / "Figure is empty"**
- Check that `plt.savefig()` comes AFTER plotting commands
- Use `plt.show()` for interactive viewing during 开发环境

**Labels cut off**
```Python
plt.tight_layout()  # Add before plt.savefig()
# Or
plt.savefig('输出.png', bbox_inches='tight')
```

**Low resolution 输出**
```Python
plt.savefig('输出.png', dpi=300)  # Not 72 or 100
```

## 环境

The skill includes a 虚拟环境 with all 依赖. Always activate before use:

```Bash
cd /home/matt/.openclaw/工作空间/skills/Python-dataviz
source .虚拟环境/bin/activate
```

依赖: matplotlib, seaborn, plotly, pandas, numpy, kaleido (for plotly 静态 导出)
