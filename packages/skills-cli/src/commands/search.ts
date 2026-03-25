import { info, success, warn, error } from '../utils'

interface SkillSearchResult {
  slug: string
  name: string
  description: string | null
  tags: string | null
  source: string | null
  source_url: string | null
  installed_at: string | null
  updated_at: string | null
}

export function searchCommand(args: string[]) {
  const [query] = args

  if (!query) {
    console.log(error('请提供搜索关键词'))
    console.log(`  用法: codeskills search <关键词>`)
    console.log(`  示例: codeskills search python`)
    return
  }

  console.log(`${info('搜索远程技能:')} ${query}`)
  console.log()

  fetch(`https://codeskills.cn/api/skills/search?q=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('搜索请求失败')
      }
      return res.json()
    })
    .then((skills: SkillSearchResult[]) => {
      if (skills.length === 0) {
        console.log(warn('未找到匹配的技能'))
        console.log(`  浏览全部: https://codeskills.cn`)
        return
      }

      console.log(success(`找到 ${skills.length} 个匹配的技能:`))
      console.log()

      for (const skill of skills.slice(0, 20)) {
        console.log(`  ${success('●')} ${skill.name}`)
        if (skill.description) {
          const desc = skill.description.length > 60
            ? skill.description.substring(0, 60) + '...'
            : skill.description
          console.log(`    ${desc}`)
        }
        if (skill.tags) {
          console.log(`    ${info('标签:')} ${skill.tags}`)
        }
        console.log(`    ${info('安装:')} codeskills install ${skill.slug}`)
        console.log()
      }

      if (skills.length > 20) {
        console.log(warn(`...还有 ${skills.length - 20} 个结果`))
        console.log(`  查看更多: https://codeskills.cn/search?q=${encodeURIComponent(query)}`)
      }
    })
    .catch((e: Error) => {
      console.log(error(e.message))
    })
}
