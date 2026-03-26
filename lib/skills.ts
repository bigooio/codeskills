import path from 'path'
import Database from 'better-sqlite3'

const DB_PATH = path.join(process.cwd(), 'data', 'skills.db')

export interface Skill {
  id: string
  slug: string
  title: string
  description: string
  content: string
  tags: string[]
  source: 'clawhub' | 'github' | 'original'
  sourceUrl?: string
  downloads?: number
  stars?: number
  version?: string
  createdAt: string
}

export type SortType = 'relevance' | 'popular' | 'downloads' | 'stars'

export interface DiscoverOptions {
  query?: string
  category?: string
  tag?: string
  sort?: SortType
  page?: number
  limit?: number
}

let db: Database.Database | null = null

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true })
  }
  return db
}

// Category tag mapping (English to Chinese)
export const CATEGORY_TAG_MAP: Record<string, string> = {
  'ai-intelligence': 'AI智能',
  'developer-tools': '开发工具',
  'productivity': '效率提升',
  'data-analysis': '数据分析',
  'content-creation': '内容创作',
  'security-compliance': '安全合规',
  'automation': '自动化',
  'browser': '浏览器',
  'headless': '无头浏览器',
  'web': 'Web开发',
  'communication-collaboration': '通讯协作',
  'lifestyle': '生活娱乐',
  'integrations': '集成工具',
  'finance': '金融',
  'social': '社交',
}

// Reverse mapping (Chinese to English)
export const TAG_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TAG_MAP).map(([k, v]) => [v, k])
)

export const CATEGORIES = Object.values(CATEGORY_TAG_MAP)

interface DbSkill {
  id: string
  slug: string
  title: string
  description: string
  content: string
  tags: string
  source: string
  sourceUrl: string | null
  downloads: number
  stars: number
  version: string | null
  createdAt: string
}

function rowToSkill(row: DbSkill): Skill {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    content: row.content || '',
    tags: row.tags ? row.tags.split(',') : [],
    source: row.source as 'clawhub' | 'github' | 'original',
    sourceUrl: row.sourceUrl || undefined,
    downloads: row.downloads,
    stars: row.stars,
    version: row.version || undefined,
    createdAt: row.createdAt,
  }
}

export function getAllSkills(): Skill[] {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM skills').all() as DbSkill[]
  return rows.map(rowToSkill)
}

export function getSkillBySlug(slug: string): Skill | undefined {
  const db = getDb()
  const row = db.prepare('SELECT * FROM skills WHERE slug = ?').get(slug) as DbSkill | undefined
  return row ? rowToSkill(row) : undefined
}

export function discoverSkills(options: DiscoverOptions): {
  skills: Skill[]
  total: number
  page: number
  totalPages: number
  limit: number
} {
  const { query, category, tag, sort = 'relevance', page = 1, limit = 20 } = options
  const db = getDb()

  let sql = 'SELECT * FROM skills WHERE 1=1'
  let countSql = 'SELECT COUNT(*) as count FROM skills WHERE 1=1'
  const params: any[] = []

  // Filter by category (Chinese name -> English tag)
  if (category) {
    const engCategory = TAG_CATEGORY_MAP[category]
    if (engCategory) {
      // Match tags stored as 'ai-intelligence' or 'tag1,ai-intelligence,tag2'
      sql += ' AND (tags = ? OR tags LIKE ? OR tags LIKE ? OR tags LIKE ?)'
      countSql += ' AND (tags = ? OR tags LIKE ? OR tags LIKE ? OR tags LIKE ?)'
      params.push(engCategory, `%,${engCategory},%`, `%,${engCategory}`, `${engCategory},%`)
    }
  }

  // Filter by tag
  if (tag) {
    sql += ' AND tags LIKE ?'
    countSql += ' AND tags LIKE ?'
    params.push(`%,${tag},%`)
  }

  // Full-text search
  if (query) {
    // Use FTS5 for search
    const ftsQuery = query.split(/\s+/).map(term => `"${term}"*`).join(' ')
    sql = `
      SELECT skills.* FROM skills
      INNER JOIN skills_fts ON skills.rowid = skills_fts.rowid
      WHERE skills_fts MATCH ?
    `
    countSql = `
      SELECT COUNT(*) as count FROM skills
      INNER JOIN skills_fts ON skills.rowid = skills_fts.rowid
      WHERE skills_fts MATCH ?
    `
    params.length = 0
    params.push(ftsQuery)

    if (category) {
      const engCategory = TAG_CATEGORY_MAP[category]
      if (engCategory) {
        sql += ' AND (tags LIKE ? OR tags LIKE ? OR tags LIKE ?)'
        countSql += ' AND (tags LIKE ? OR tags LIKE ? OR tags LIKE ?)'
        params.push(`%,${engCategory},%`, `%,${engCategory}`, `${engCategory},%`)
      }
    }

    if (tag) {
      sql += ' AND tags LIKE ?'
      countSql += ' AND tags LIKE ?'
      params.push(`%,${tag},%`)
    }
  }

  // Get total count
  const countRow = db.prepare(countSql).get(...params) as { count: number }
  const total = countRow.count

  // Sorting
  switch (sort) {
    case 'popular':
      sql += ' ORDER BY (stars * 10 + downloads) DESC'
      break
    case 'downloads':
      sql += ' ORDER BY downloads DESC'
      break
    case 'stars':
      sql += ' ORDER BY stars DESC'
      break
    case 'relevance':
    default:
      if (query) {
        sql += ' ORDER BY rank' // FTS5 ranking
      }
      break
  }

  // Pagination
  const offset = (page - 1) * limit
  sql += ` LIMIT ${limit} OFFSET ${offset}`

  const rows = db.prepare(sql).all(...params) as DbSkill[]
  const skills = rows.map(rowToSkill)

  return {
    skills,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
  }
}

export function getAllTags(): { language: string[]; category: string[] } {
  return { language: [], category: [] }
}
