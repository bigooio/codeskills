import { getSkillBySlug } from '@/lib/skills'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const skill = getSkillBySlug(params.slug)

  if (!skill) {
    return Response.json({ error: 'Skill not found' }, { status: 404 })
  }

  // Read full SKILL.md content
  const skillPath = path.join(process.cwd(), 'skills', params.slug, 'SKILL.md')

  if (!fs.existsSync(skillPath)) {
    return Response.json({ error: 'SKILL.md not found' }, { status: 404 })
  }

  const fullContent = fs.readFileSync(skillPath, 'utf8')

  return Response.json({
    ...skill,
    fullContent
  })
}
