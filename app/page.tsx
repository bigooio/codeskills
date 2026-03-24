import Link from 'next/link'
import { getAllSkills, getAllTags } from '@/lib/skills'
import SkillCard from '@/components/SkillCard'
import SearchBar from '@/components/SearchBar'
import InstallSection from '@/components/InstallSection'

export default function Home() {
  const skills = getAllSkills()
  const tags = getAllTags()
  const featuredSkills = skills.slice(0, 6)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          发现编程<span className="text-accent">超能力</span>
        </h1>
        <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
          收集优质编程技能、工具、代码模式，帮助你提升开发效率
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>

        {/* CLI Install */}
        <InstallSection />
      </section>

      {/* Quick Tags */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">快速筛选</h2>
        <div className="flex flex-wrap gap-2">
          {[...tags.language.slice(0, 4), ...tags.category.slice(0, 3)].map((tag) => (
            <Link
              key={tag}
              href={`/discover?tag=${encodeURIComponent(tag)}`}
              className="px-4 py-2 bg-card border border-border rounded-full text-sm text-text-secondary hover:border-accent/50 hover:text-accent transition"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Skills */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">精选 Skills</h2>
          <Link href="/discover" className="text-accent hover:underline text-sm">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  )
}
