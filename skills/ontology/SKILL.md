---
name: ontology
description: 类型化知识图谱，用于结构化 AI Agent 记忆和可组合技能。支持创建/查询实体（人员、项目、任务、事件、文档）及关联关系。
compatibility: 需要存储后端支持
tags:
  - javascript
  - ai
  - bash
---

# Ontology - 知识图谱

结构化的记忆系统，帮助 AI Agent 记住和组织信息。

## 支持的实体类型

- **Person** - 人员
- **Project** - 项目
- **任务** - 任务
- **事件** - 事件
- **Document** - 文档
- **Organization** - 组织
- **Location** - 地点
- **Concept** - 概念

## 基础操作

```Bash
# 创建实体
ontology create person --name "张三" --角色 "开发者"

# 查询实体
ontology find person --name "张三"

# 更新实体
ontology 更新 person "person_id" --name "新名字"

# 删除实体
ontology DELETE person "person_id"
```

## 关系管理

```Bash
# 创建关系
ontology relate --from "person_id" --to "project_id" --类型 "works_on"

# 查询关系
ontology relations --实体 "person_id"

# 删除关系
ontology unrelate --from "person_id" --to "project_id"
```

## 查询示例

```Bash
# 查找某人的所有项目
ontology find --类型 person --name "张三" | ontology 相关 --类型 project

# 查找项目所有参与者
ontology find --类型 project --name "项目X" | ontology 相关 --类型 person

# 查找时间范围内的任务
ontology find --类型 任务 --after "2024-01-01" --before "2024-12-31"
```

## 在 Agent 中的使用

```JavaScript
// 记住用户偏好
等待 ontology.create('person', {
  name: '用户',
  preferences: ['喜欢简洁的设计', '使用中文']
})

// 查询历史交互
const 历史 = 等待 ontology.find('事件', {
  类型: 'interaction',
  related_to: 'current_user'
})
```

## 最佳实践

1. **一致性** - 实体命名保持一致
2. **可追溯** - 记录实体间关系
3. **定期清理** - 删除无用实体
4. **版本化** - 记录重要变更
