import { getAllSkills, getGroupSkills, getAllGroups } from '../db'
import { info, success, warn } from '../utils'

export function listCommand(args: string[]) {
  const [filter] = args

  if (filter === '--local' || filter === '-l') {
    listLocal()
  } else if (filter === '--remote' || filter === '-r') {
    listRemote()
  } else {
    // Default: show local skills
    listLocal()
  }
}

function listLocal() {
  const skills = getAllSkills()
  const groups = getAllGroups()

  if (skills.length === 0) {
    console.log(warn('暂无本地技能'))
    console.log(`  ${info('搜索远程技能:')} codeskills search <关键词>`)
    console.log(`  ${info('浏览远程:')} codeskills list --remote`)
    return
  }

  console.log(info('╔═══════════════════════════════════════════╗'))
  console.log(info('║         本地已安装技能               ║'))
  console.log(info('╚═══════════════════════════════════════════╝'))
  console.log()

  // Group skills by their groups
  const skillsByGroup = new Map<string, typeof skills>()

  for (const skill of skills) {
    const skillGroups = groups.filter(g =>
      getGroupSkills(g.id).some(s => s.id === skill.id)
    )
    if (skillGroups.length === 0) {
      if (!skillsByGroup.has('ungrouped')) {
        skillsByGroup.set('ungrouped', [])
      }
      skillsByGroup.get('ungrouped')!.push(skill)
    } else {
      for (const group of skillGroups) {
        if (!skillsByGroup.has(group.name)) {
          skillsByGroup.set(group.name, [])
        }
        skillsByGroup.get(group.name)!.push(skill)
      }
    }
  }

  for (const [groupName, groupSkills] of skillsByGroup) {
    const label = groupName === 'ungrouped' ? warn('未分组') : success(groupName)
    console.log(`${label} (${groupSkills.length}个):`)

    for (const skill of groupSkills) {
      console.log(`  • ${skill.name}`)
      if (skill.description) {
        const desc = skill.description.length > 50
          ? skill.description.substring(0, 50) + '...'
          : skill.description
        console.log(`    ${desc}`)
      }
    }
    console.log()
  }
}

function listRemote() {
  console.log(`${info('正在获取远程技能列表...')}`)
  console.log()

  fetch('https://codeskills.cn/api/skills')
    .then(res => {
      if (!res.ok) {
        throw new Error('获取列表失败')
      }
      return res.json()
    })
    .then((skills: any[]) => {
      if (skills.length === 0) {
        console.log(warn('暂无远程技能'))
        return
      }

      console.log(info('╔═══════════════════════════════════════════╗'))
      console.log(info('║         远程技能市场                 ║'))
      console.log(info('╚═══════════════════════════════════════════╝'))
      console.log()

      console.log(success(`共 ${skills.length} 个技能`))
      console.log()

      for (const skill of skills.slice(0, 30)) {
        console.log(`  ${success('●')} ${skill.name}`)
        if (skill.description) {
          const desc = skill.description.length > 60
            ? skill.description.substring(0, 60) + '...'
            : skill.description
          console.log(`    ${desc}`)
        }
        if (skill.tags) {
          const tags = Array.isArray(skill.tags) ? skill.tags.join(', ') : skill.tags
          console.log(`    ${info('标签:')} ${tags}`)
        }
        console.log(`    ${info('安装:')} codeskills install ${skill.slug}`)
        console.log()
      }

      if (skills.length > 30) {
        console.log(warn(`...还有 ${skills.length - 30} 个技能`))
      }
      console.log(`  ${info('浏览全部:')} https://codeskills.cn`)
    })
    .catch((e: Error) => {
      console.log(error(e.message))
    })
}
