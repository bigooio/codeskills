import { searchSkills } from '@/lib/skills'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''
  const tag = url.searchParams.get('tag') || undefined

  const skills = searchSkills(query, tag)

  // Return simplified results for CLI
  const results = skills.map(skill => ({
    slug: skill.slug,
    name: skill.title,
    description: skill.description,
    tags: skill.tags.join(','),
    source: skill.source,
    source_url: skill.sourceUrl
  }))

  return Response.json(results)
}
