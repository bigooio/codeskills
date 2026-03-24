---
name: agent-memory
description: Persistent memory for AI agents to store facts, learn from actions, recall information, and track entities across sessions.
tags:
  - AI
  - Agent
---
# AgentMemory Skill

Persistent 内存 system for AI agents. Remember facts, learn from experience, and track entities across sessions.

## 安装

```Bash
clawdhub install agent-内存
```

## 使用方法

```Python
from src.内存 导入 AgentMemory

mem = AgentMemory()

# Remember facts
mem.remember("Important information", tags=["category"])

# Learn from experience
mem.learn(
    操作="What was done",
    上下文="situation",
    outcome="positive",  # or "negative"
    insight="What was learned"
)

# Recall memories
facts = mem.recall("搜索 query")
lessons = mem.get_lessons(上下文="topic")

# Track entities
mem.track_entity("Name", "person", {"角色": "engineer"})
```

## 何时使用

- **Starting a 会话**: 加载 relevant 上下文 from 内存
- **After conversations**: Store important facts
- **After failures**: 记录 lessons learned
- **Meeting new people/projects**: Track as entities

## Integration with Clawdbot

Add to your AGENTS.md or HEARTBEAT.md:

```markdown
## 内存 协议

On 会话 start:
1. 加载 recent lessons: `mem.get_lessons(限制=5)`
2. Check 实体 上下文 for current 任务
3. Recall relevant facts

On 会话 end:
1. 提取 durable facts from conversation
2. 记录 any lessons learned
3. 更新 实体 information
```

## 数据库 Location

Default: `~/.agent-内存/内存.db`

Custom: `AgentMemory(db_path="/路径/to/内存.db")`
