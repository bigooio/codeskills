'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Categories available for filtering
const CATEGORIES = [
  'AI智能', '开发工具', '效率提升', '数据分析',
  '内容创作', '安全合规', '自动化', '浏览器'
]

type SortType = 'relevance' | 'popular' | 'downloads' | 'stars'
const PAGE_SIZE = 20

function DiscoverContent() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<SortType>('relevance')
  const [page, setPage] = useState(1)
  const [skills, setSkills] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  // Initialize from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setQuery(params.get('q') || '')
    setCategory(params.get('category') || '')
    setSort((params.get('sort') as SortType) || 'relevance')
    setPage(parseInt(params.get('page') || '1', 10))
  }, [])

  // Fetch skills when params change
  useEffect(() => {
    const apiParams = new URLSearchParams()
    if (query) apiParams.set('q', query)
    if (category) apiParams.set('category', category)
    if (sort) apiParams.set('sort', sort)
    apiParams.set('page', page.toString())
    apiParams.set('limit', PAGE_SIZE.toString())

    setLoading(true)
    fetch(`/api/skills/search?${apiParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        setSkills(data.skills || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [query, category, sort, page])

  // Update URL when params change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (sort !== 'relevance') params.set('sort', sort)
    if (page > 1) params.set('page', page.toString())

    const newUrl = `/discover${params.toString() ? '?' + params.toString() : ''}`
    window.history.replaceState(null, '', newUrl)
  }, [query, category, sort, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when filters change
  const handleQueryChange = (q: string) => {
    setQuery(q)
    setPage(1)
  }

  const handleCategoryChange = (c: string) => {
    setCategory(c)
    setPage(1)
  }

  const handleSortChange = (s: SortType) => {
    setSort(s)
    setPage(1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {category || query ? '搜索结果' : '发现 Skills'}
        </h1>
        <p className="text-text-secondary">
          探索 AI 技能，发现编程超能力
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="搜索 skills..."
            className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition"
          />
        </form>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as SortType)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
        >
          <option value="relevance">综合排序</option>
          <option value="popular">🔥 热门</option>
          <option value="downloads">📥 下载量</option>
          <option value="stars">⭐ 收藏数</option>
        </select>

        {(query || category || sort !== 'relevance') && (
          <button
            onClick={() => { setQuery(''); setCategory(''); setSort('relevance'); setPage(1) }}
            className="px-4 py-2 bg-card border border-border rounded-lg text-text-secondary hover:border-accent/50 transition"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-text-secondary mb-3">分类</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              !category
                ? 'bg-accent text-white'
                : 'bg-card border border-border text-text-secondary hover:border-accent/50'
            }`}
          >
            全部
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                category === cat
                  ? 'bg-accent text-white'
                  : 'bg-card border border-border text-text-secondary hover:border-accent/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-text-secondary">
          <p>加载中...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-lg">没有找到匹配的 Skills</p>
          <p className="text-sm mt-2">试试其他关键词或分类</p>
        </div>
      ) : (
        <>
          <p className="text-text-secondary mb-4">
            共找到 {total} 个 Skills (第 {page}/{totalPages} 页)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Link key={skill.id} href={`/skill/${skill.slug}`}>
                <div className="bg-card border border-border rounded-lg p-5 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skill.tags.slice(0, 3).map((tag: string) => (
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
                  <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                    {skill.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    {skill.downloads > 0 && (
                      <span>📥 {skill.downloads > 1000 ? (skill.downloads / 1000).toFixed(1) + 'K' : skill.downloads}</span>
                    )}
                    {skill.stars > 0 && (
                      <span>⭐ {skill.stars}</span>
                    )}
                    <span className={skill.source === 'clawhub' ? 'text-success' : 'text-accent'}>
                      {skill.source === 'clawhub' ? 'SkillHub' : skill.source === 'github' ? 'GitHub' : '原创'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent/50 transition"
              >
                上一页
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition ${
                        page === pageNum
                          ? 'bg-accent text-white'
                          : 'bg-card border border-border hover:border-accent/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent/50 transition"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-text-secondary">加载中...</div>}>
      <DiscoverContent />
    </Suspense>
  )
}
