---
name: ontology
description: 类型化知识图谱，用于结构化 AI Agent 记忆和可组合技能。支持创建/查询实体（人员、项目、任务、事件、文档）及关联关系。
compatibility: 需要存储后端支持
---

# Ontology - 知识图谱

结构化的记忆系统，帮助 AI Agent 记住和组织信息。

## 支持的实体类型

- **Person** - 人员
- **Project** - 项目
- **Task** - 任务
- **Event** - 事件
- **Document** - 文档
- **Organization** - 组织
- **Location** - 地点
- **Concept** - 概念

## 基础操作

```bash
# 创建实体
ontology create person --name "张三" --role "开发者"

# 查询实体
ontology find person --name "张三"

# 更新实体
ontology update person "person_id" --name "新名字"

# 删除实体
ontology delete person "person_id"
```

## 关系管理

```bash
# 创建关系
ontology relate --from "person_id" --to "project_id" --type "works_on"

# 查询关系
ontology relations --entity "person_id"

# 删除关系
ontology unrelate --from "person_id" --to "project_id"
```

## 查询示例

```bash
# 查找某人的所有项目
ontology find --type person --name "张三" | ontology related --type project

# 查找项目所有参与者
ontology find --type project --name "项目X" | ontology related --type person

# 查找时间范围内的任务
ontology find --type task --after "2024-01-01" --before "2024-12-31"
```

## 在 Agent 中的使用

```javascript
// 记住用户偏好
await ontology.create('person', {
  name: '用户',
  preferences: ['喜欢简洁的设计', '使用中文']
})

// 查询历史交互
const history = await ontology.find('event', {
  type: 'interaction',
  related_to: 'current_user'
})
```

## 最佳实践

1. **一致性** - 实体命名保持一致
2. **可追溯** - 记录实体间关系
3. **定期清理** - 删除无用实体
4. **版本化** - 记录重要变更
