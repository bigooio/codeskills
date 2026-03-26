import { discoverSkills, type SortType } from '@/lib/skills'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''
  const category = url.searchParams.get('category') || undefined
  const tag = url.searchParams.get('tag') || undefined
  const sort = (url.searchParams.get('sort') as SortType) || 'relevance'
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const limit = parseInt(url.searchParams.get('limit') || '20', 10)

  const result = discoverSkills({ query, category, tag, sort, page, limit })

  return Response.json(result)
}
