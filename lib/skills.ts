import fs from 'fs'
import path from 'path'

export interface Skill {
  id: string
  slug: string
  title: string
  description: string
  content: string
  tags: string[]
  source: 'github' | 'original'
  sourceUrl?: string
  createdAt: string
}

const dataPath = path.join(process.cwd(), 'data', 'skills.json')

export function getAllSkills(): Skill[] {
  const fileContents = fs.readFileSync(dataPath, 'utf8')
  return JSON.parse(fileContents)
}

export function getSkillBySlug(slug: string): Skill | undefined {
  const skills = getAllSkills()
  return skills.find((skill) => skill.slug === slug)
}

export function searchSkills(query: string, tag?: string): Skill[] {
  let skills = getAllSkills()

  if (tag) {
    skills = skills.filter((skill) => skill.tags.includes(tag))
  }

  if (query) {
    const lowerQuery = query.toLowerCase()
    skills = skills.filter(
      (skill) =>
        skill.title.toLowerCase().includes(lowerQuery) ||
        skill.description.toLowerCase().includes(lowerQuery)
    )
  }

  return skills
}

export function getAllTags(): { language: string[]; category: string[] } {
  const skills = getAllSkills()
  const languages = new Set<string>()
  const categories = new Set<string>()

  const LANGUAGE_TAGS = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'React', 'Vue']
  const CATEGORY_TAGS = ['前端', '后端', 'DevOps', 'AI', '工具', '数据库']

  skills.forEach((skill) => {
    skill.tags.forEach((tag) => {
      if (LANGUAGE_TAGS.includes(tag)) languages.add(tag)
      if (CATEGORY_TAGS.includes(tag)) categories.add(tag)
    })
  })

  return {
    language: Array.from(languages).sort(),
    category: Array.from(categories).sort(),
  }
}
