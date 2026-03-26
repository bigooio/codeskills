/**
 * Crawl skillhub.tencent.com for skill data
 * Run: node scripts/crawl-skillhub.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SKILLHUB_API = 'https://lightmake.site/api'
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'skills-skillhub.json')

async function fetchSkillHubSkills() {
  console.log('Fetching skills from skillhub.tencent.com...')

  try {
    // Fetch from the correct API endpoint
    const response = await fetch(`${SKILLHUB_API}/skills/top`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()

    if (result.code !== 0) {
      throw new Error(`API returned error: ${result.message}`)
    }

    const skills = result.data?.skills || []
    console.log(`Fetched ${skills.length} skills from API`)
    return skills
  } catch (error) {
    console.error('Failed to fetch skills:', error.message)
    return []
  }
}

async function main() {
  console.log('='.repeat(50))
  console.log('CodeSkills Crawler - skillhub.tencent.com')
  console.log('='.repeat(50))

  const skills = await fetchSkillHubSkills()

  if (skills.length === 0) {
    console.log('\nNo skills found. Saving empty array.')
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2))
    console.log(`Output: ${OUTPUT_FILE}`)
    return
  }

  // Transform to our format
  const transformedSkills = skills.map((skill, index) => ({
    id: skill.slug || `skillhub-${index}`,
    slug: skill.slug,
    title: skill.name,
    description: skill.description_zh || skill.description || '',
    content: `# ${skill.name}\n\n${skill.description_zh || skill.description || ''}`,
    tags: skill.tags || [skill.category].filter(Boolean),
    source: 'clawhub',
    sourceUrl: skill.homepage || `https://clawhub.ai/${skill.ownerName}/${skill.slug}`,
    downloads: skill.downloads || 0,
    stars: skill.stars || 0,
    version: skill.version || '1.0.0',
    createdAt: skill.updated_at
      ? new Date(skill.updated_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  }))

  // Sort by combined score (stars + downloads) - already sorted from API but ensure
  transformedSkills.sort((a, b) => ((b.stars || 0) * 10 + (b.downloads || 0)) - ((a.stars || 0) * 10 + (a.downloads || 0)))

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformedSkills, null, 2))

  console.log(`\nSuccess!`)
  console.log(`Total skills: ${transformedSkills.length}`)
  console.log(`Output: ${OUTPUT_FILE}`)

  // Show top 5 as preview
  if (transformedSkills.length > 0) {
    console.log('\nTop 5 Skills:')
    transformedSkills.slice(0, 5).forEach((skill, i) => {
      console.log(`  ${i + 1}. ${skill.title} (⭐ ${skill.stars}, ↓ ${skill.downloads})`)
    })
  }
}

main().catch(console.error)
