import { installSkill, getSkill, getAllSkills } from '../db'
import { info, success, error, warn } from '../utils'
import fs from 'fs'
import path from 'path'
import os from 'os'

const CONFIG_DIR = path.join(os.homedir(), '.codeskills')
const SKILLS_DIR = path.join(CONFIG_DIR, 'skills')

interface SkillMeta {
  id: string
  name: string
  description: string | null
  tags: string | null
  source: string | null
  source_url: string | null
}

export function installCommand(args: string[]) {
  const [skillName] = args

  if (!skillName) {
    console.log(error('请提供技能名称'))
    console.log(`  用法: codeskills install <技能>`)
    console.log(`  示例: codeskills install agent-builder`)
    return
  }

  // Check if skill already exists locally
  const existing = getSkill(skillName.toLowerCase().replace(/\s+/g, '-'))
  if (existing) {
    console.log(success(`技能 "${existing.name}" 已安装`))
    console.log(`  查看: codeskills group show ${existing.id}`)
    return
  }

  // Fetch from API
  console.log(`${info('正在安装技能:')} ${skillName}`)
  fetch(`https://codeskills.cn/api/skills/${encodeURIComponent(skillName)}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`技能 "${skillName}" 不存在`)
      }
      return res.json()
    })
    .then(async (data: any) => {
      const meta: SkillMeta = {
        id: data.slug,
        name: data.name,
        description: data.description,
        tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
        source: 'local',
        source_url: `https://codeskills.cn/skills/${data.slug}`
      }

      // Save skill file
      const skillPath = path.join(SKILLS_DIR, `${meta.id}.md`)
      fs.mkdirSync(SKILLS_DIR, { recursive: true })

      // Get full content
      const contentRes = await fetch(`https://codeskills.cn/api/skills/${encodeURIComponent(skillName)}/content`)
      const content = await contentRes.text()

      fs.writeFileSync(skillPath, content)

      // Install to database
      installSkill(meta)
      console.log(success(`技能 "${meta.name}" 安装成功！`))
      console.log(`  技能文件: ${skillPath}`)
      console.log(`  查看详情: codeskills group show ${meta.id}`)
    })
    .catch((e: Error) => {
      console.log(error(e.message))
      console.log(`  搜索技能: https://codeskills.cn/search?q=${encodeURIComponent(skillName)}`)
    })
}
