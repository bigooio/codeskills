import { searchSkills, getAllTags } from '@/lib/skills'
import SkillCard from '@/components/SkillCard'
import TagFilter from '@/components/TagFilter'
import SearchBar from '@/components/SearchBar'

interface DiscoverPageProps {
  searchParams: { q?: string; tag?: string }
}

export function generateMetadata({ searchParams }: DiscoverPageProps) {
  const query = searchParams.q || ''
  const tag = searchParams.tag || ''
  return {
    title: query || tag ? `搜索: ${query || tag}` : '发现',
  }
}

export default function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const query = searchParams.q || ''
  const tag = searchParams.tag || ''
  const skills = searchSkills(query, tag)
  const tags = getAllTags()
  const allTags = [...tags.language, ...tags.category]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">发现 Skills</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="mb-8">
        <TagFilter tags={allTags} selectedTag={tag} />
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-lg">没有找到匹配的 Skills</p>
          <p className="text-sm mt-2">试试其他关键词或标签</p>
        </div>
      ) : (
        <>
          <p className="text-text-secondary mb-4">
            共找到 {skills.length} 个 Skills
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
