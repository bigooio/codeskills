/**
 * Crawl skillhub.tencent.com via API
 * API: https://lightmake.site/api/skills?page=N
 * Total: ~25,000+ skills
 * Run: node scripts/crawl-api.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'skills-skillhub-full.json')
const API_BASE = 'https://lightmake.site/api/skills'
const BATCH_SIZE = 100 // Save every 100 pages

// Category mapping
const TAG_MAP = {
  'ai-intelligence': 'AI智能',
  'developer-tools': '开发工具',
  'productivity': '效率提升',
  'data-analysis': '数据分析',
  'content-creation': '内容创作',
  'security-compliance': '安全合规',
  'automation': '自动化',
  'browser': '浏览器',
  'communication-collaboration': '通讯协作',
  'web': 'Web开发',
  'lifestyle': '生活娱乐',
  'integrations': '集成工具',
  'finance': '金融',
  'social': '社交',
  'headless': '无头浏览器',
}

async function fetchPage(pageNum) {
  const response = await fetch(`${API_BASE}?page=${pageNum}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

async function crawlAllSkills() {
  console.log('Starting crawl of skillhub.tencent.com...')
  console.log(`API: ${API_BASE}`)

  // First, get total count
  console.log('\nFetching first page to get total count...')
  const firstResponse = await fetchPage(1)
  const total = firstResponse.data?.total || 0
  const skillsPerPage = firstResponse.data?.skills?.length || 0

  console.log(`Total skills: ${total}`)
  console.log(`Skills per page: ${skillsPerPage}`)
  console.log(`Estimated pages: ${Math.ceil(total / skillsPerPage)}`)

  const allSkills = []

  // Process first page
  if (firstResponse.data?.skills) {
    const transformed = firstResponse.data.skills.map(transformSkill)
    allSkills.push(...transformed)
    console.log(`Page 1: collected ${transformed.length} skills`)
  }

  // Calculate total pages
  const totalPages = Math.ceil(total / skillsPerPage)

  // Crawl remaining pages
  for (let page = 2; page <= totalPages; page++) {
    try {
      const response = await fetchPage(page)
      if (response.data?.skills) {
        const transformed = response.data.skills.map(transformSkill)
        allSkills.push(...transformed)
      }

      if (page % BATCH_SIZE === 0) {
        console.log(`Page ${page}/${totalPages}: collected ${allSkills.length} skills total`)
        saveSkills(allSkills)
      }

      // Small delay to be respectful to the API
      if (page % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

    } catch (error) {
      console.error(`Error on page ${page}:`, error.message)
      // Retry after delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return allSkills
}

function transformSkill(skill) {
  // Determine tags from category
  const tags = []
  if (skill.category && TAG_MAP[skill.category]) {
    tags.push(skill.category)
  } else if (skill.category) {
    tags.push(skill.category)
  } else {
    tags.push('ai-intelligence') // Default
  }

  return {
    id: skill.slug || skill.name?.toLowerCase().replace(/\s+/g, '-'),
    slug: skill.slug || skill.name?.toLowerCase().replace(/\s+/g, '-'),
    title: skill.name || 'Unknown',
    description: skill.description_zh || skill.description || '',
    content: `# ${skill.name || 'Unknown'}\n\n${skill.description_zh || skill.description || ''}`,
    tags,
    source: 'clawhub',
    sourceUrl: skill.homepage || `https://clawhub.ai/${skill.ownerName}/${skill.slug}`,
    downloads: skill.downloads || 0,
    stars: skill.stars || 0,
    version: skill.version || '1.0.0',
    createdAt: skill.updated_at
      ? new Date(skill.updated_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  }
}

function saveSkills(skills) {
  const dir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(skills, null, 2))
  console.log(`  Saved ${skills.length} skills to ${OUTPUT_FILE}`)
}

async function main() {
  console.log('='.repeat(60))
  console.log('Crawler for skillhub.tencent.com via API')
  console.log('='.repeat(60))

  const startTime = Date.now()

  try {
    const skills = await crawlAllSkills()

    // Final save
    saveSkills(skills)

    const elapsed = Math.round((Date.now() - startTime) / 1000)
    console.log(`\nCompleted in ${elapsed} seconds`)
    console.log(`Total skills: ${skills.length}`)
    console.log(`Output: ${OUTPUT_FILE}`)

    // Show samples
    if (skills.length > 0) {
      console.log('\nSample skills (top 5 by downloads):')
      const sorted = [...skills].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      sorted.slice(0, 5).forEach((skill, i) => {
        console.log(`  ${i + 1}. ${skill.title} (↓${skill.downloads}, ⭐${skill.stars})`)
      })

      console.log('\nSample skills (top 5 by stars):')
      const byStars = sorted.slice(0, 5)
      byStars.forEach((skill, i) => {
        console.log(`  ${i + 1}. ${skill.title} (⭐${skill.stars}, ↓${skill.downloads})`)
      })
    }

  } catch (error) {
    console.error('Fatal error:', error)
  }
}

main().catch(console.error)
