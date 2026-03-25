import { getAllGroups, createGroup, deleteGroup, updateGroup, getGroup, getGroupSkills, addSkillToGroup, removeSkillFromGroup } from '../db'
import { info, success, error, warn } from '../utils'

export function groupCommand(args: string[]) {
  const [action, ...rest] = args

  switch (action) {
    case 'list':
    case undefined:
      listGroups()
      break
    case 'create':
      createGroupCmd(rest)
      break
    case 'delete':
      deleteGroupCmd(rest)
      break
    case 'rename':
      renameGroupCmd(rest)
      break
    case 'edit':
      editGroupCmd(rest)
      break
    case 'add':
      addSkillCmd(rest)
      break
    case 'remove':
      removeSkillCmd(rest)
      break
    case 'show':
      showGroupCmd(rest)
      break
    default:
      if (action) {
        console.log(error(`未知操作: ${action}`))
      }
      help()
  }
}

function help() {
  console.log()
  console.log(info('分组管理命令:'))
  console.log(`  ${success('codeskills group list')}              列出所有分组`)
  console.log(`  ${success('codeskills group create <名称>')}     创建新分组`)
  console.log(`  ${success('codeskills group delete <名称>')}     删除分组`)
  console.log(`  ${success('codeskills group rename <旧名> <新名>')}  重命名分组`)
  console.log(`  ${success('codeskills group edit <名称>')}       编辑分组描述`)
  console.log(`  ${success('codeskills group add <技能> [分组]')}  添加技能到分组`)
  console.log(`  ${success('codeskills group remove <技能> [分组]')} 从分组移除技能`)
  console.log(`  ${success('codeskills group show <名称>')}        显示分组详情`)
  console.log()
}

function listGroups() {
  const groups = getAllGroups()

  if (groups.length === 0) {
    console.log(warn('暂无分组'))
    console.log(`  ${info('创建分组:')} codeskills group create <名称>`)
    return
  }

  console.log()
  console.log(info('分组列表:'))
  console.log()
  for (const group of groups) {
    const skills = getGroupSkills(group.id)
    console.log(`  ${success('●')} ${group.name} ${info(`(${skills.length} 个技能)`)}`)
    if (group.description) {
      console.log(`    ${group.description}`)
    }
  }
  console.log()
}

function createGroupCmd(args: string[]) {
  const [name, ...descParts] = args
  if (!name) {
    console.log(error('请提供分组名称'))
    console.log(`  用法: codeskills group create <名称> [描述]`)
    return
  }

  const description = descParts.join(' ')
  const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  try {
    createGroup(id, name, description)
    console.log(success(`分组 "${name}" 创建成功！`))
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) {
      console.log(error(`分组 "${name}" 已存在`))
    } else {
      console.log(error(`创建失败: ${e.message}`))
    }
  }
}

function deleteGroupCmd(args: string[]) {
  const [name] = args
  if (!name) {
    console.log(error('请提供分组名称'))
    return
  }

  const group = getGroup(name) || getAllGroups().find(g => g.name.toLowerCase() === name.toLowerCase())
  if (!group) {
    console.log(error(`分组 "${name}" 不存在`))
    return
  }

  deleteGroup(group.id)
  console.log(success(`分组 "${group.name}" 已删除`))
}

function renameGroupCmd(args: string[]) {
  const [oldName, ...newNameParts] = args
  if (!oldName || newNameParts.length === 0) {
    console.log(error('请提供旧名称和新名称'))
    console.log(`  用法: codeskills group rename <旧名> <新名>`)
    return
  }

  const group = getGroup(oldName) || getAllGroups().find(g => g.name.toLowerCase() === oldName.toLowerCase())
  if (!group) {
    console.log(error(`分组 "${oldName}" 不存在`))
    return
  }

  const newName = newNameParts.join(' ')
  updateGroup(group.id, newName, group.description || undefined)
  console.log(success(`分组已更名为 "${newName}"`))
}

function editGroupCmd(args: string[]) {
  const [name, ...descParts] = args
  if (!name) {
    console.log(error('请提供分组名称'))
    console.log(`  用法: codeskills group edit <名称> [描述]`)
    return
  }

  const group = getGroup(name) || getAllGroups().find(g => g.name.toLowerCase() === name.toLowerCase())
  if (!group) {
    console.log(error(`分组 "${name}" 不存在`))
    return
  }

  const description = descParts.join(' ') || undefined
  updateGroup(group.id, group.name, description)
  console.log(success(`分组 "${group.name}" 已更新`))
}

function addSkillCmd(args: string[]) {
  const [skillName, groupName] = args
  if (!skillName) {
    console.log(error('请提供技能名称'))
    console.log(`  用法: codeskills group add <技能> [分组]`)
    return
  }

  const skillId = skillName.toLowerCase().replace(/\s+/g, '-')
  const allGroups = getAllGroups()

  if (allGroups.length === 0) {
    console.log(warn('暂无分组，请先创建分组: codeskills group create <名称>'))
    return
  }

  let targetGroup = groupName
    ? (getGroup(groupName) || getAllGroups().find(g => g.name.toLowerCase() === groupName.toLowerCase()))
    : allGroups.find(g => g.name.toLowerCase() === 'default') || allGroups[0]

  if (!targetGroup && groupName) {
    console.log(error(`分组 "${groupName}" 不存在`))
    return
  }

  if (!targetGroup) {
    console.log(error('没有可用的分组'))
    return
  }

  addSkillToGroup(targetGroup.id, skillId)
  console.log(success(`技能 "${skillName}" 已添加到分组 "${targetGroup.name}"`))
}

function removeSkillCmd(args: string[]) {
  const [skillName, groupName] = args
  if (!skillName) {
    console.log(error('请提供技能名称'))
    console.log(`  用法: codeskills group remove <技能> [分组]`)
    return
  }

  const skillId = skillName.toLowerCase().replace(/\s+/g, '-')

  if (groupName) {
    const group = getGroup(groupName) || getAllGroups().find(g => g.name.toLowerCase() === groupName.toLowerCase())
    if (!group) {
      console.log(error(`分组 "${groupName}" 不存在`))
      return
    }
    removeSkillFromGroup(group.id, skillId)
    console.log(success(`技能 "${skillName}" 已从分组 "${group.name}" 移除`))
  } else {
    // Remove from all groups
    const groups = getAllGroups()
    for (const group of groups) {
      removeSkillFromGroup(group.id, skillId)
    }
    console.log(success(`技能 "${skillName}" 已从所有分组移除`))
  }
}

function showGroupCmd(args: string[]) {
  const [name] = args
  if (!name) {
    console.log(error('请提供分组名称'))
    return
  }

  const group = getGroup(name) || getAllGroups().find(g => g.name.toLowerCase() === name.toLowerCase())
  if (!group) {
    console.log(error(`分组 "${name}" 不存在`))
    return
  }

  const skills = getGroupSkills(group.id)

  console.log()
  console.log(`${info('分组:')} ${success(group.name)}`)
  if (group.description) {
    console.log(`${info('描述:')} ${group.description}`)
  }
  console.log(`${info('技能:')} ${skills.length} 个`)
  console.log()

  if (skills.length > 0) {
    for (const skill of skills) {
      console.log(`  • ${skill.name}`)
      if (skill.description) {
        console.log(`    ${skill.description.substring(0, 60)}...`)
      }
    }
  } else {
    console.log(`  ${warn('暂无技能')}`)
    console.log(`  ${info('添加技能:')} codeskills group add <技能> ${group.name}`)
  }
  console.log()
}
