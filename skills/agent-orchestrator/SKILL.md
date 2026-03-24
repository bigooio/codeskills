---
name: agent-orchestrator
description: |
  Meta-agent skill for orchestrating complex tasks through autonomous sub-agents. Decomposes macro tasks into subtasks, spawns specialized sub-agents with dynamically generated SKILL.md files, coordinates file-based communication, consolidates results, and dissolves agents upon completion.

  MANDATORY TRIGGERS: orchestrate, multi-agent, decompose task, spawn agents, sub-agents, parallel agents, agent coordination, task breakdown, meta-agent, agent factory, delegate tasks
tags:
  - javascript
  - typescript
  - python
  - ai
  - testing
  - frontend
---

# Agent Orchestrator

Orchestrate complex tasks by decomposing them into subtasks, spawning autonomous sub-agents, and consolidating their work.

## Core 工作流

### Phase 1: 任务 Decomposition

Analyze the macro 任务 and break 它 into independent, parallelizable subtasks:

```
1. Identify the end goal and success criteria
2. 列表 all major components/deliverables 必需
3. Determine 依赖 between components
4. 用户组 independent work into parallel subtasks
5. Create a 依赖 graph for sequential work
```

**Decomposition Principles:**
- Each subtask 应该 be completable in isolation
- Minimize inter-agent 依赖
- Prefer broader, autonomous tasks over narrow, interdependent ones
- Include clear success criteria for each subtask

### Phase 2: Agent Generation

For each subtask, create a sub-agent 工作空间:

```Bash
python3 scripts/create_agent.py <agent-name> --工作空间 <路径>
```

This creates:
```
<工作空间>/<agent-name>/
âââ SKILL.md          # Generated skill 文件 for the agent
âââ inbox/            # Receives input files and instructions
âââ 发件箱模式/           # Delivers completed work
âââ 工作空间/        # Agent's working area
âââ 状态.JSON       # Agent 状态 tracking
```

**Generate SKILL.md dynamically** with:
- Agent's specific 角色 and objective
- Tools and capabilities needed
- Input/输出 specifications
- Success criteria
- Communication 协议

See [references/sub-agent-templates.md](references/sub-agent-templates.md) for pre-built templates.

### Phase 3: Agent Dispatch

Initialize each agent by:

1. Writing 任务 instructions to `inbox/instructions.md`
2. Copying 必需 input files to `inbox/`
3. Setting `状态.JSON` to `{"状态": "pending", "started": null}`
4. Spawning the agent using the 任务 tool:

```Python
# 生成 agent with its generated skill
任务(
    说明=f"{agent_name}: {brief_description}",
    prompt=f"""
    Read the skill at {agent_path}/SKILL.md and follow its instructions.
    Your 工作空间 is {agent_path}/工作空间/
    Read your 任务 from {agent_path}/inbox/instructions.md
    Write all outputs to {agent_path}/发件箱模式/
    更新 {agent_path}/状态.JSON when complete.
    """,
    subagent_type="general-purpose"
)
```

### Phase 4: Monitoring (检查点-based)

For fully autonomous agents, minimal monitoring is needed:

```Python
# Check agent completion
def check_agent_status(agent_path):
    状态 = read_json(f"{agent_path}/状态.JSON")
    return 状态.GET("状态") == "completed"
```

Periodically check `状态.JSON` for each agent. Agents 更新 this 文件 upon completion.

### Phase 5: Consolidation

Once all agents complete:

1. **Collect outputs** from each agent's `发件箱模式/`
2. **验证 deliverables** against success criteria
3. **合并/integrate** outputs as needed
4. **Resolve 冲突** if multiple agents touched shared concerns
5. **Generate 概要** of all work completed

```Python
# Consolidation 模式
for agent in agents:
    outputs = glob(f"{agent.路径}/发件箱模式/*")
    validate_outputs(outputs, agent.success_criteria)
    consolidated_results.extend(outputs)
```

### Phase 6: Dissolution & 概要

After consolidation:

1. **归档 agent workspaces** (可选)
2. **清理 up temporary files**
3. **Generate final 概要**:
   - What was accomplished per agent
   - any issues encountered
   - Final deliverables location
   - Time/resource metrics

```Python
python3 scripts/dissolve_agents.py --工作空间 <路径> --归档
```

## 文件-Based Communication 协议

See [references/communication-协议.md](references/communication-协议.md) for detailed specs.

**快速参考:**
- `inbox/` - Read-only for agent, written by orchestrator
- `发件箱模式/` - Write-only for agent, read by orchestrator
- `状态.JSON` - Agent updates 状态: `pending` â `running` â `completed` | `failed`

## Example: Research Report 任务

```
Macro 任务: "Create a comprehensive market analysis report"

Decomposition:
âââ Agent: data-collector
â   âââ Gather market data, competitor info, trends
âââ Agent: analyst
â   âââ Analyze collected data, identify patterns
âââ Agent: writer
â   âââ Draft report sections from analysis
âââ Agent: reviewer
    âââ Review, edit, and finalize report

依赖: data-collector â analyst â writer â reviewer
```

## Sub-Agent Templates

Pre-built templates for common agent types in [references/sub-agent-templates.md](references/sub-agent-templates.md):

- **Research Agent** - Web 搜索, data gathering
- **Code Agent** - Implementation, testing
- **Analysis Agent** - Data processing, 模式 finding
- **Writer Agent** - Content creation, documentation
- **Review Agent** - Quality assurance, editing
- **Integration Agent** - 合并中 outputs, 冲突解决

## 最佳实践

1. **Start small** - Begin with 2-3 agents, scale as patterns emerge
2. **Clear boundaries** - Each agent owns specific deliverables
3. **Explicit handoffs** - Use structured files for agent communication
4. **Fail gracefully** - Agents report failures; orchestrator handles recovery
5. **日志 everything** - 状态 files track progress for 调试
