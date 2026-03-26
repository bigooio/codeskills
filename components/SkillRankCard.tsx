import Link from 'next/link'

interface SkillRankCardProps {
  rank: number
  skill: {
    id: string
    slug: string
    title: string
    description: string
    downloads?: number
    stars?: number
    version?: string
    tags: string[]
  }
}

export default function SkillRankCard({ rank, skill }: SkillRankCardProps) {
  const rankEmojis = ['🥇', '🥈', '🥉']

  return (
    <Link href={`/skill/${skill.slug}`}>
      <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-card/50 transition rounded-lg group">
        <div className={`col-span-1 font-bold text-lg ${rank <= 3 ? 'text-yellow-400' : 'text-text-secondary'}`}>
          {rank <= 3 ? rankEmojis[rank - 1] : rank}
        </div>
        <div className="col-span-5">
          <div className="font-medium group-hover:text-accent transition">{skill.title}</div>
          <div className="text-xs text-text-secondary line-clamp-1">{skill.description}</div>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-sm">{skill.downloads ? (skill.downloads / 1000).toFixed(1) + 'K' : '-'}</span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-sm">⭐ {skill.stars || 0}</span>
        </div>
        <div className="col-span-2 text-right text-xs text-text-secondary">
          v{skill.version || '1.0.0'}
        </div>
      </div>
    </Link>
  )
}
