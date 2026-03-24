---
name: skill-creator
description: 创建有效 Skills 的指南。当用户希望创建新技能（或更新现有技能）时使用，通过专业知识、工作流或工具集成扩展 AI 能力。
tags:
  - typescript
  - ai
  - frontend
  - bash
  - 工具
---

# Skill Creator - 技能创建指南

本指南帮助你创建有效的 Agent Skills。

## Skill 目录结构

每个 Skill 是一个文件夹，包含：

```
skill-name/
├── SKILL.md          # 必需：元数据 + 指令
├── scripts/          # 可选：可执行脚本
├── references/       # 可选：参考文档
├── assets/          # 可选：模板、资源
└── ...              # 其他文件
```

## SKILL.md 格式

```YAML
---
name: skill-name
说明: 描述这个技能的作用和使用场景（最大1024字符）
许可: MIT-0
compatibility: 环境要求（如需要）
metadata:
  author: 作者名
  版本: "1.0"
---

# 技能名称

## 何时使用
描述什么时候应该激活这个技能。

## 使用方法
详细的使用说明和示例。
```

## 命名规范

- 最多 64 个字符
- 只能包含小写字母、数字和连字符
- 不能以连字符开头或结尾
- 必须与文件夹名称一致

## 说明 编写技巧

好的 说明 应该：
1. 描述技能**做什么**
2. 说明**何时使用**
3. 包含帮助 AI 识别的关键词

```
# 好的例子
"处理 PDF 文件、填写表单、合并多个 PDF。需要处理 PDF 文档时使用。"

# 不好的例子
"处理 PDF。"
```

## 脚本编写

```Bash
#!/bin/Bash
# scripts/install.sh

集合 -e

echo "安装技能..."

# 检查依赖
if ! 命令 -v 必需-tool &> /开发/null; then
    echo "错误: 需要 必需-tool"
    exit 1
fi

echo "技能安装完成"
```

## 最佳实践

1. **保持简洁** - SKILL.md 建议小于 500 行
2. **渐进式披露** - 把详细文档放到 references/ 目录
3. **处理边界情况** - 添加错误处理和帮助信息
4. **测试验证** - 确保脚本在目标环境可运行
5. **版本控制** - 在 metadata 中记录版本号

## 验证你的 Skill

```Bash
# 使用 skills-ref 验证
npx skills-ref 验证 ./my-skill
```
