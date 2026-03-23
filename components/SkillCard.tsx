import Link from 'next/link'
import { Skill } from '@/lib/skills'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link href={`/skill/${skill.slug}`}>
      <article className="bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5">
        <div className="flex flex-wrap gap-2 mb-3">
          {skill.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded bg-accent/10 text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-text-primary hover:text-accent transition">
          {skill.title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {skill.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
          <span>{skill.source === 'github' ? 'GitHub' : '原创'}</span>
          <span>{skill.createdAt}</span>
        </div>
      </article>
    </Link>
  )
}
