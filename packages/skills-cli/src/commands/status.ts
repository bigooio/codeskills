import { getAllGroups, getActiveGroups, getActiveSkills, getUngroupedSkills, getAllSkills } from '../db'
import { info, success, warn } from '../utils'

export function statusCommand() {
  const allGroups = getAllGroups()
  const activeGroups = getActiveGroups()
  const activeSkills = getActiveSkills()
  const allSkills = getAllSkills()
  const ungrouped = getUngroupedSkills()

  console.log(info('╔═══════════════════════════════════════════╗'))
  console.log(info('║           CodeSkills 状态               ║'))
  console.log(info('╚═══════════════════════════════════════════╝'))
  console.log()

  // Skills overview
  console.log(info('技能统计:'))
  console.log(`  总数:     ${success(allSkills.length + ' 个')}`)
  console.log(`  已激活:   ${success(activeSkills.length + ' 个')}`)
  if (ungrouped.length > 0) {
    console.log(`  未分组:   ${warn(ungrouped.length + ' 个')}`)
  } else {
    console.log(`  未分组:   0 个`)
  }

  // Groups overview
  console.log()
  console.log(info('分组统计:'))
  console.log(`  分组数:   ${allGroups.length} 个`)
  console.log(`  已激活:   ${activeGroups.length} 个`)

  if (allGroups.length > 0) {
    console.log()
    console.log(info('激活的分组:'))
    if (activeGroups.length === 0) {
      console.log(`  ${warn('暂无激活的分组')}`)
    } else {
      for (const group of activeGroups) {
        console.log(`  ${success('●')} ${group.name}`)
      }
    }

    console.log()
    console.log(info('激活的技能:'))
    if (activeSkills.length === 0) {
      console.log(`  ${warn('暂无激活的技能')}`)
    } else {
      const skillNames = activeSkills.slice(0, 10).map(s => s.name)
      console.log(`  ${skillNames.join(', ')}`)
      if (activeSkills.length > 10) {
        console.log(`  ${warn(`...还有 ${activeSkills.length - 10} 个`)}`)
      }
    }
  } else {
    console.log()
    console.log(`  ${warn('暂无分组')}`)
    console.log(`  ${info('创建分组:')} codeskills group create <名称>`)
  }

  // Quick commands
  console.log()
  console.log(info('常用命令:'))
  console.log(`  ${info('codeskills status')}          查看状态`)
  console.log(`  ${info('codeskills activate <组>')}  激活分组`)
  console.log(`  ${info('codeskills group list')}     列出分组`)
  console.log(`  ${info('codeskills help')}           查看帮助`)
  console.log()
}
