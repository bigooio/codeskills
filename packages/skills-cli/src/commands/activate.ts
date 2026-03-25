import { activateGroup, deactivateGroup, deactivateAllGroups, getActiveGroups, getGroup, getAllGroups } from '../db'
import { info, success, error, warn } from '../utils'

export function activateCommand(args: string[]) {
  const [action, ...rest] = args

  if (action === '-a' || action === '--all' || action === 'all') {
    activateAll()
  } else if (action === '-n' || action === '--none' || action === 'none') {
    deactivateAll()
  } else if (!action || action === 'list') {
    listActive()
  } else {
    // Assume it's a group name
    toggleGroup(action)
  }
}

function toggleGroup(name: string) {
  const group = getGroup(name) || getAllGroups().find(g => g.name.toLowerCase() === name.toLowerCase())
  if (!group) {
    console.log(error(`分组 "${name}" 不存在`))
    console.log(`  使用 codeskills activate --all 激活所有分组`)
    return
  }

  const isActive = getActiveGroups().some(g => g.id === group.id)
  if (isActive) {
    deactivateGroup(group.id)
    console.log(success(`分组 "${group.name}" 已停用`))
  } else {
    activateGroup(group.id)
    console.log(success(`分组 "${group.name}" 已激活`))
  }
}

function activateAll() {
  const groups = getAllGroups()
  if (groups.length === 0) {
    console.log(warn('暂无分组'))
    return
  }

  deactivateAllGroups()
  for (const group of groups) {
    activateGroup(group.id)
  }

  console.log(success(`已激活所有分组 (${groups.length} 个)`))
  console.log(`  ${info('查看状态:')} codeskills status`)
}

function deactivateAll() {
  deactivateAllGroups()
  console.log(success('已停用所有分组'))
  console.log(`  ${info('查看状态:')} codeskills status`)
}

function listActive() {
  const activeGroups = getActiveGroups()
  const allGroups = getAllGroups()

  if (allGroups.length === 0) {
    console.log(warn('暂无分组'))
    console.log(`  ${info('创建分组:')} codeskills group create <名称>`)
    console.log()
    return
  }

  console.log()
  console.log(info('分组状态:'))
  console.log()

  for (const group of allGroups) {
    const isActive = activeGroups.some(g => g.id === group.id)
    const status = isActive ? success('● 激活') : warn('○ 停用')
    console.log(`  ${status}  ${group.name}`)
  }

  console.log()
}
