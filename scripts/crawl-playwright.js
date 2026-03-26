/**
 * Playwright-based crawler for skillhub.tencent.com
 * Scrapes all skills with pagination support
 * Run: node scripts/crawl-playwright.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'skills-skillhub-full.json')
const BATCH_SIZE = 50

// Category mapping
const TAG_MAP = {
  'AI智能': 'ai-intelligence',
  '开发工具': 'developer-tools',
  '效率提升': 'productivity',
  '数据分析': 'data-analysis',
  '内容创作': 'content-creation',
  '安全合规': 'security-compliance',
  '通讯协作': 'communication-collaboration',
  '浏览器自动化': 'browser',
  '自动化': 'automation',
  '多媒体': 'content-creation',
  '搜索研究': 'ai-intelligence',
  '办公协同': 'productivity',
  '信息处理': 'ai-intelligence',
  '无头浏览器': 'browser',
  'Web开发': 'web',
  '生活娱乐': 'lifestyle',
  '集成工具': 'integrations',
  '金融': 'finance',
  '社交': 'social',
}

function parseChineseNumber(str) {
  if (!str) return 0
  str = str.trim()
  const wanMatch = str.match(/([\d.]+)\s*万/)
  if (wanMatch) return Math.round(parseFloat(wanMatch[1]) * 10000)
  const qianMatch = str.match(/([\d.]+)\s*千/)
  if (qianMatch) return Math.round(parseFloat(qianMatch[1]) * 1000)
  const num = parseFloat(str.replace(/[^\d.]/g, ''))
  return isNaN(num) ? 0 : num
}

function parseSkillFromButton(buttonText) {
  // Pattern: "L letter title description ... downloads stars version"
  // Example: "S self-improving-agent 记录学习经验... 24.0 万 2.2 千 v3.0.4"

  // Skip pagination buttons and small text
  if (!buttonText || buttonText.length < 30) return null
  if (/^\d+$/.test(buttonText.trim())) return null // Page numbers only
  if (buttonText.includes('上一页') || buttonText.includes('下一页')) return null

  // Match the pattern: starts with letter, then title (no spaces), then description
  const match = buttonText.match(/^([A-Z])\s+([a-zA-Z0-9\-\+]+)\s+(.+)/s)
  if (!match) return null

  const [, firstLetter, title, rest] = match

  // Extract stats from end of string
  // Downloads: "24.0 万" or "11.5 万"
  const downloadsMatch = rest.match(/([\d.]+)\s*万\s*$/)
  // Stars: "2.2 千" or "376" (plain number)
  const starsMatch = rest.match(/([\d.]+)\s*千\s*$|(\d+)\s*$/)
  // Version: "v3.0.4"
  const versionMatch = rest.match(/v([\d.]+)\s*$/)

  // Get description (remove stats from end)
  let description = rest
    .replace(/[\d.]+\s*万\s*$/, '')
    .replace(/[\d.]+\s*千\s*$/, '')
    .replace(/v[\d.]+\s*$/, '')
    .trim()

  // Extract category from description if present
  let category = ''
  for (const cat of Object.keys(TAG_MAP)) {
    if (description.includes(cat)) {
      category = cat
      break
    }
  }

  const downloads = downloadsMatch ? parseChineseNumber(downloadsMatch[0]) : 0
  let stars = 0
  if (starsMatch) {
    if (starsMatch[1]) {
      stars = parseChineseNumber(starsMatch[1] + ' 千')
    } else if (starsMatch[2]) {
      stars = parseInt(starsMatch[2], 10)
    }
  }

  return {
    title: title.trim(),
    description: description,
    downloads,
    stars,
    version: versionMatch ? versionMatch[1] : '1.0.0',
    category,
  }
}

async function scrapeSkills() {
  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  const allSkills = []
  let pageNum = 1
  const maxPages = 1053

  console.log(`Will scrape up to ${maxPages} pages...`)

  while (pageNum <= maxPages) {
    try {
      const url = pageNum === 1
        ? 'https://skillhub.tencent.com'
        : `https://skillhub.tencent.com?page=${pageNum}`

      console.log(`\n Scraping page ${pageNum}/${maxPages}...`)
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

      // Wait a bit for JS to render
      await page.waitForTimeout(2000)

      // Get all button texts and parse skill info
      const skillItems = await page.$$eval('button', buttons => {
        const skills = []
        for (const btn of buttons) {
          const text = btn.textContent || ''
          // Look for skill buttons (long text with pattern like "S title description ... 24.0 万 2.2 千 v3.0.4")
          if (text.length > 50 && /^[A-Z]\s+[a-z]/.test(text.trim())) {
            const match = text.match(/^([A-Z])\s+([a-zA-Z0-9\-\+]+)\s+(.+)/s)
            if (match) {
              const [, firstLetter, title, rest] = match
              skills.push({
                firstLetter,
                title,
                fullText: text
              })
            }
          }
        }
        return skills
      })

      console.log(`  Found ${skillItems.length} skill buttons`)

      if (skillItems.length === 0) {
        // Check if we're blocked or page structure changed
        const pageText = await page.textContent('body')
        if (pageText.includes('访问频繁') || pageText.includes('验证码')) {
          console.log('  Detected rate limiting, waiting...')
          await page.waitForTimeout(5000)
        }

        // Try to click next page button directly
        const nextBtn = await page.$('button:has-text("下一页"):not([disabled])')
        if (!nextBtn) {
          console.log('  No next page button found, stopping...')
          break
        }
        pageNum++
        continue
      }

      // Parse each skill
      let pageSkillsCount = 0
      for (const item of skillItems) {
        const parsed = parseSkillFromButton(item.fullText)
        if (parsed && parsed.title) {
          allSkills.push(parsed)
          pageSkillsCount++
        }
      }

      console.log(`  Parsed ${pageSkillsCount} skills`)

      // Save batch periodically
      if (pageNum % BATCH_SIZE === 0) {
        console.log(`\n  Saving batch at page ${pageNum}...`)
        saveSkills(transformSkills(allSkills))
      }

      // Check for next page
      const nextBtn = await page.$('button:has-text("下一页"):not([disabled])')
      if (!nextBtn) {
        console.log('  Reached last page')
        break
      }

      pageNum++

      // Rate limiting
      await page.waitForTimeout(300)

    } catch (error) {
      console.error(`  Error on page ${pageNum}:`, error.message)
      pageNum++
      await page.waitForTimeout(1000)
    }
  }

  await browser.close()

  console.log(`\n Scraping complete!`)
  console.log(`Total skills collected: ${allSkills.length}`)

  // Deduplicate
  const seen = new Set()
  const uniqueSkills = allSkills.filter(s => {
    if (seen.has(s.title)) return false
    seen.add(s.title)
    return true
  })

  console.log(`After deduplication: ${uniqueSkills.length} unique skills`)

  const transformed = transformSkills(uniqueSkills)
  saveSkills(transformed)

  return transformed
}

function transformSkills(skills) {
  return skills.map((skill, index) => {
    const tags = []
    if (skill.category && TAG_MAP[skill.category]) {
      tags.push(TAG_MAP[skill.category])
    } else {
      const lowerDesc = (skill.description || '').toLowerCase()
      const lowerTitle = (skill.title || '').toLowerCase()
      if (lowerDesc.includes('ai') || lowerDesc.includes('智能') || lowerTitle.includes('agent')) {
        tags.push('ai-intelligence')
      }
      if (lowerDesc.includes('browser') || lowerDesc.includes('浏览器') || lowerDesc.includes('网页')) {
        tags.push('browser')
      }
      if (lowerDesc.includes('开发') || lowerDesc.includes('git') || lowerDesc.includes('api')) {
        tags.push('developer-tools')
      }
      if (lowerDesc.includes('自动') || lowerDesc.includes('workflow')) {
        tags.push('automation')
      }
    }
    if (tags.length === 0) {
      tags.push('ai-intelligence')
    }

    return {
      id: skill.title.toLowerCase().replace(/\s+/g, '-'),
      slug: skill.title.toLowerCase().replace(/\s+/g, '-'),
      title: skill.title,
      description: skill.description || '',
      content: `# ${skill.title}\n\n${skill.description || ''}`,
      tags,
      source: 'clawhub',
      sourceUrl: `https://clawhub.ai/${skill.title.toLowerCase().replace(/\s+/g, '-')}`,
      downloads: skill.downloads || 0,
      stars: skill.stars || 0,
      version: skill.version || '1.0.0',
      createdAt: new Date().toISOString().split('T')[0],
    }
  })
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
  console.log('Playwright Crawler for skillhub.tencent.com')
  console.log('='.repeat(60))

  const startTime = Date.now()

  try {
    const skills = await scrapeSkills()

    const elapsed = Math.round((Date.now() - startTime) / 1000)
    console.log(`\nCompleted in ${elapsed} seconds`)
    console.log(`Output: ${OUTPUT_FILE}`)

    if (skills.length > 0) {
      console.log('\nSample skills (top 5 by downloads):')
      const sorted = [...skills].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      sorted.slice(0, 5).forEach((skill, i) => {
        console.log(`  ${i + 1}. ${skill.title} (${skill.downloads} downloads, ${skill.stars} stars)`)
      })
    }

  } catch (error) {
    console.error('Fatal error:', error)
  }
}

main().catch(console.error)
