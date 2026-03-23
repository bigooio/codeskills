'use client'

import { useRouter } from 'next/navigation'

interface TagFilterProps {
  tags: string[]
  selectedTag?: string
}

export default function TagFilter({ tags, selectedTag }: TagFilterProps) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => router.push('/discover')}
        className={`px-3 py-1.5 rounded-full text-sm transition ${
          !selectedTag
            ? 'bg-accent text-white'
            : 'bg-card border border-border text-text-secondary hover:border-accent/50'
        }`}
      >
        全部
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => router.push(`/discover?tag=${encodeURIComponent(tag)}`)}
          className={`px-3 py-1.5 rounded-full text-sm transition ${
            selectedTag === tag
              ? 'bg-accent text-white'
              : 'bg-card border border-border text-text-secondary hover:border-accent/50'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}