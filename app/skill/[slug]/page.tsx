import { getSkillBySlug, getAllSkills } from '@/lib/skills'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SkillViewer from '@/components/SkillViewer'

interface SkillPageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: SkillPageProps) {
  const skill = getSkillBySlug(params.slug)
  if (!skill) return { title: 'Not Found' }
  return {
    title: `${skill.title} - codeskills`,
    description: skill.description,
  }
}

export default function SkillPage({ params }: SkillPageProps) {
  const skill = getSkillBySlug(params.slug)

  if (!skill) {
    notFound()
  }

  const allSkills = getAllSkills()
  const relatedSkills = allSkills
    .filter((s) => s.id !== skill.id && s.tags.some((t) => skill.tags.includes(t)))
    .slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/discover" className="text-text-secondary hover:text-accent text-sm mb-6 inline-block">
        ← 返回发现
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {skill.tags.map((tag) => (
              <Link
                key={tag}
                href={`/discover?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20 transition"
              >
                {tag}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-4">{skill.title}</h1>
          <p className="text-xl text-text-secondary mb-4">{skill.description}</p>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className={skill.source === 'github' ? 'text-accent' : 'text-success'}>
              {skill.source === 'github' ? '来自 GitHub' : '原创'}
            </span>
            {skill.sourceUrl && (
              <a
                href={skill.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                查看原文 →
              </a>
            )}
            <span>{skill.createdAt}</span>
          </div>

          {/* CLI Install Command */}
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-sm text-text-secondary mb-3">安装此 Skill:</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm font-mono text-accent">
                npx codeskills install {skill.slug}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`npx codeskills install ${skill.slug}`)}
                className="px-3 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition"
              >
                复制
              </button>
            </div>
          </div>
        </header>

        <SkillViewer slug={skill.slug} initialContent={skill.content} />
      </article>

      {relatedSkills.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-xl font-semibold mb-6">相关 Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedSkills.map((s) => (
              <Link key={s.id} href={`/skill/${s.slug}`} className="block">
                <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition">
                  <h3 className="font-medium text-text-primary hover:text-accent">{s.title}</h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
