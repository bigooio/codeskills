const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const skillsDir = path.join(__dirname, '..', 'skills')
const outputPath = path.join(__dirname, '..', 'data', 'skills.json')

const skills = []

const dirs = fs.readdirSync(skillsDir).filter(f => {
  return fs.statSync(path.join(skillsDir, f)).isDirectory()
})

for (const dir of dirs) {
  const skillPath = path.join(skillsDir, dir, 'SKILL.md')
  if (!fs.existsSync(skillPath)) continue

  try {
    const content = fs.readFileSync(skillPath, 'utf8')
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) continue

    const frontmatter = yaml.load(match[1])
    const body = content.replace(/^---[\s\S]*?---\n/, '')

    const title = frontmatter.name || frontmatter.title || dir
    const description = frontmatter.description || ''
    const tags = frontmatter.tags || []

    skills.push({
      id: dir,
      slug: dir,
      title: title,
      description: description,
      content: body.substring(0, 300),
      tags: tags,
      source: 'github',
      sourceUrl: frontmatter.homepage || `https://github.com/bigooio/codeskills/tree/main/skills/${dir}`,
      createdAt: new Date().toISOString().split('T')[0]
    })
  } catch (e) {
    console.error('Error:', dir, e.message)
  }
}

fs.writeFileSync(outputPath, JSON.stringify(skills, null, 2))
console.log(`Generated ${skills.length} skills`)
