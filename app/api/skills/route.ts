import { getAllSkills } from '@/lib/skills'

export async function GET() {
  const skills = getAllSkills()
  return Response.json(skills)
}
