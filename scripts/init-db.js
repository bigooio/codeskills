/**
 * Initialize SQLite database for skills
 * Run: node scripts/init-db.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'data', 'skills.db')

// Category tag mapping (English to Chinese)
const CATEGORY_TAG_MAP = {
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

function initDb() {
  console.log('Initializing SQLite database...')
  console.log(`Database path: ${DB_PATH}`)

  // Remove existing database
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log('Removed existing database')
  }

  const db = new Database(DB_PATH)

  // Create skills table
  db.exec(`
    CREATE TABLE skills (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT,
      tags TEXT,
      source TEXT,
      sourceUrl TEXT,
      downloads INTEGER DEFAULT 0,
      stars INTEGER DEFAULT 0,
      version TEXT,
      createdAt TEXT,
      category TEXT,
      updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE INDEX idx_skills_slug ON skills(slug);
    CREATE INDEX idx_skills_downloads ON skills(downloads);
    CREATE INDEX idx_skills_stars ON skills(stars);
    CREATE INDEX idx_skills_category ON skills(category);
  `)

  // Create FTS5 table for full-text search
  db.exec(`
    CREATE VIRTUAL TABLE skills_fts USING fts5(
      title,
      description,
      tags,
      content='skills',
      content_rowid='rowid'
    );
  `)

  console.log('Created tables and indexes')

  // Load data from JSON files
  const dataPath = path.join(__dirname, '..', 'data', 'skills.json')
  const skillhubDataPath = path.join(__dirname, '..', 'data', 'skills-skillhub-full.json')

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO skills (id, slug, title, description, content, tags, source, sourceUrl, downloads, stars, version, createdAt, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertFtsStmt = db.prepare(`
    INSERT INTO skills_fts(rowid, title, description, tags)
    VALUES (?, ?, ?, ?)
  `)

  let totalSkills = 0

  // Import skills.json
  if (fs.existsSync(dataPath)) {
    console.log('Importing skills.json...')
    const skills = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    const importStmt = db.transaction((skills) => {
      for (const skill of skills) {
        const tags = Array.isArray(skill.tags) ? skill.tags.join(',') : skill.tags
        const category = skill.tags?.[0] || null
        insertStmt.run(
          skill.id, skill.slug, skill.title, skill.description, skill.content,
          tags, skill.source, skill.sourceUrl, skill.downloads || 0,
          skill.stars || 0, skill.version, skill.createdAt, category
        )
        totalSkills++
      }
    })
    importStmt(skills)
    console.log(`  Imported ${skills.length} skills from skills.json`)
  }

  // Import skills-skillhub-full.json
  if (fs.existsSync(skillhubDataPath)) {
    console.log('Importing skills-skillhub-full.json...')
    const skills = JSON.parse(fs.readFileSync(skillhubDataPath, 'utf8'))
    const importStmt = db.transaction((skills) => {
      for (const skill of skills) {
        const tags = Array.isArray(skill.tags) ? skill.tags.join(',') : skill.tags
        const category = skill.tags?.[0] || null
        insertStmt.run(
          skill.id, skill.slug, skill.title, skill.description, skill.content,
          tags, skill.source, skill.sourceUrl, skill.downloads || 0,
          skill.stars || 0, skill.version, skill.createdAt, category
        )
        totalSkills++
      }
    })
    importStmt(skills)
    console.log(`  Imported ${skills.length} skills from skills-skillhub-full.json`)
  }

  // Rebuild FTS index
  console.log('Rebuilding FTS index...')
  db.exec(`
    INSERT INTO skills_fts(rowid, title, description, tags)
    SELECT rowid, title, description, tags FROM skills;
  `)

  console.log(`\nTotal skills imported: ${totalSkills}`)

  // Create triggers to keep FTS in sync
  db.exec(`
    CREATE TRIGGER skills_ai AFTER INSERT ON skills BEGIN
      INSERT INTO skills_fts(rowid, title, description, tags)
      VALUES (new.rowid, new.title, new.description, new.tags);
    END;

    CREATE TRIGGER skills_ad AFTER DELETE ON skills BEGIN
      INSERT INTO skills_fts(skills_fts, rowid, title, description, tags)
      VALUES ('delete', old.rowid, old.title, old.description, old.tags);
    END;

    CREATE TRIGGER skills_au AFTER UPDATE ON skills BEGIN
      INSERT INTO skills_fts(skills_fts, rowid, title, description, tags)
      VALUES ('delete', old.rowid, old.title, old.description, old.tags);
      INSERT INTO skills_fts(rowid, title, description, tags)
      VALUES (new.rowid, new.title, new.description, new.tags);
    END;
  `)

  db.close()
  console.log('\nDatabase initialized successfully!')
}

initDb()
