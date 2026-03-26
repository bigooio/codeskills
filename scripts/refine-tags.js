/**
 * Refine tags for all skills based on title, description, and content
 * Run: node scripts/refine-tags.js
 */

import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'data', 'skills.db')

// Tag keywords mapping - expanded
const TAG_KEYWORDS = {
  // AI/ML
  'llm': ['llm', 'gpt', 'claude', 'gemini', 'openai', '大模型', '语言模型', 'ai model'],
  'nlp': ['nlp', '自然语言', 'text ', '文本', 'chat', '聊天'],
  'vision': ['vision', '图像', '图片', '视觉', 'ocr', 'yolo', 'detection'],
  'voice': ['voice', '语音', 'tts', 'stt', 'whisper', '音频'],
  'agent': ['agent', '智能体', '代理', 'autonomous', '自主'],
  'rag': ['rag', 'retrieval', 'ragas', '知识库', 'vector'],
  'ml': ['machine learning', 'ml ', '机器学习', '模型训练', 'training'],

  // Development
  'github': ['github', 'git ', 'repo', '仓库', 'pr ', 'issue'],
  'api': ['api', 'rest', 'graphql', 'endpoint', '接口'],
  'browser': ['browser', '浏览器', 'playwright', 'puppeteer', 'selenium', '无头'],
  'database': ['database', 'db ', 'sql', 'postgres', 'mysql', 'mongodb', 'redis'],
  'cloud': ['aws', 'azure', 'gcp', 'cloud', '云', 's3', 'ec2'],
  'docker': ['docker', 'container', '容器', 'kubernetes', 'k8s'],
  'devops': ['ci/cd', 'pipeline', '部署', 'devops', 'jenkins', 'github action'],
  'security': ['security', '安全', 'auth', 'oauth', 'jwt', '加密', 'permission'],

  // Productivity
  'productivity': ['productivity', '效率', '自动化', 'workflow', '工作流', 'notion'],
  'email': ['email', '邮件', 'gmail', 'smtp', 'outlook'],
  'calendar': ['calendar', '日程', 'calendar', 'google calendar'],
  'communication': ['slack', 'discord', 'teams', '通讯', '协作', 'communication'],

  // Content
  'writing': ['writing', '写作', '写', '文案', 'copywriting'],
  'translation': ['translat', '翻译', '多语言', 'i18n'],
  'video': ['video', '视频', 'youtube', 'ffmpeg'],
  'audio': ['audio', '音频', 'music', '音乐', 'podcast'],
  'image': ['image', '图像', '图片', 'stable diffusion', 'midjourney', 'dall-e', '生成图像'],
  'pdf': ['pdf', '文档', 'document'],

  // Data
  'data-analysis': ['analytics', '分析', 'data ', '数据', 'dashboard', 'bi'],
  'spreadsheet': ['spreadsheet', 'excel', '表格', 'csv', 'sheet'],
  'visualization': ['chart', '可视化', 'graph', '图表'],

  // Web
  'web-scraping': ['scrap', '爬虫', 'crawl', 'scrape'],
  'search': ['search', '搜索', 'bing', 'google search', 'tavily'],
  'web-development': ['frontend', 'frontend', 'backend', 'react', 'vue', 'html', 'css'],

  // Tools
  'cli': ['cli', 'command', '命令行', 'terminal', 'bash', 'shell'],
  'productivity-tools': ['notion', 'obsidian', '笔记', 'note', '工具'],
  'file': ['file', '文件', 'upload', '下载', 'storage', '存储'],

  // Lifestyle
  'weather': ['weather', '天气', '气象'],
  'finance': ['finance', '金融', 'bank', '银行', 'payment', '支付', 'stock'],
  'shopping': ['shopping', '购物', 'amazon', 'taobao'],
  'food': ['food', '美食', 'recipe', '食谱', '餐厅'],
  'health': ['health', '健康', '健身', 'exercise', '运动'],
  'travel': ['travel', '旅游', '地图', 'map', '航班', 'flight'],

  // Specific platforms
  'slack': ['slack'],
  'notion': ['notion'],
  'github': ['github'],
  'twitter': ['twitter', 'x.com', 'tweet'],
  'wechat': ['wechat', '微信', 'weixin'],
  'dingtalk': ['dingtalk', '钉钉', 'dingding'],
  'feishu': ['feishu', '飞书', 'lark'],
  'linear': ['linear'],
  'jira': ['jira'],
  'salesforce': ['salesforce', 'crm'],
}

// Category default tags
const CATEGORY_TAGS = {
  'ai-intelligence': ['ai', '人工智能'],
  'developer-tools': ['开发工具'],
  'productivity': ['效率', ' productivity'],
  'data-analysis': ['数据分析'],
  'content-creation': ['内容创作'],
  'security-compliance': ['安全合规'],
  'automation': ['自动化'],
  'browser': ['浏览器'],
  'communication-collaboration': ['通讯协作'],
  'web': ['web开发'],
  'lifestyle': ['生活'],
  'integrations': ['集成'],
  'finance': ['金融'],
  'social': ['社交'],
}

function extractTags(skill) {
  const tags = new Set()
  const text = `${skill.title} ${skill.description} ${skill.content}`.toLowerCase()

  // Add original tags
  if (skill.tags) {
    skill.tags.split(',').forEach(t => tags.add(t.trim()))
  }

  // Match keyword patterns
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        tags.add(tag)
        break
      }
    }
  }

  // Ensure at least one category tag
  let hasCategory = false
  for (const catTag of Object.keys(CATEGORY_TAGS)) {
    if (tags.has(catTag)) {
      hasCategory = true
      break
    }
  }
  if (!hasCategory && skill.tags) {
    // Keep first tag as category
    const firstTag = skill.tags.split(',')[0].trim()
    if (firstTag) tags.add(firstTag)
  }

  return Array.from(tags).slice(0, 8) // Max 8 tags
}

function main() {
  console.log('Refining tags for all skills...')

  const db = new Database(DB_PATH)

  // Get all skills
  const skills = db.prepare('SELECT * FROM skills').all()
  console.log(`Processing ${skills.length} skills...`)

  const updateStmt = db.prepare('UPDATE skills SET tags = ? WHERE id = ?')

  let updated = 0
  const transaction = db.transaction(() => {
    for (const skill of skills) {
      const newTags = extractTags(skill)
      updateStmt.run(newTags.join(','), skill.id)
      updated++
      if (updated % 1000 === 0) {
        console.log(`  Processed ${updated}/${skills.length}...`)
      }
    }
  })

  transaction()

  console.log(`\nUpdated tags for ${updated} skills!`)

  // Show sample
  const samples = db.prepare('SELECT title, tags FROM skills ORDER BY downloads DESC LIMIT 5').all()
  console.log('\nTop 5 by downloads:')
  samples.forEach(s => console.log(`  ${s.title}: ${s.tags}`))

  db.close()
  console.log('\nDone!')
}

main()
