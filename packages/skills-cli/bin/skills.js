#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

// 配置
const GITCODDE_REPO = 'https://gitcode.com/codeskills/codeskills.git'
const GITHUB_REPO = 'https://github.com/bigooio/codeskills.git'
const DEFAULT_BRANCH = 'develop'

// 颜色输出
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  white: '\x1b[37m'
}

function log(color, prefix, message) {
  console.log(`${color}${prefix}${colors.reset} ${message}`)
}

function info(msg) { log(colors.blue, 'ℹ', msg) }
function success(msg) { log(colors.green, '✓', msg) }
function warn(msg) { log(colors.yellow, '⚠', msg) }
function error(msg) { log(colors.red, '✗', msg) }
function header(msg) { log(colors.cyan, '▸', msg) }

function downloadFile(url, headers) {
  return new Promise((resolve, reject) => {
    const request = url.startsWith('https') ? https : http
    let data = ''

    const options = { headers: headers || {} }
    request.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, headers).then(resolve).catch(reject)
        return
      }
      response.on('data', chunk => data += chunk)
      response.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

const GH_HEADERS = { 'User-Agent': 'codeskills-cli', 'Accept': 'application/json' }

async function listRemoteSkills() {
  try {
    info('获取远程 Skills 列表...')

    // 从 GitHub API 获取 skills 目录内容
    const apiUrl = 'https://api.github.com/repos/bigooio/codeskills/contents/skills'
    const data = await downloadFile(apiUrl, GH_HEADERS)

    if (!data) {
      throw new Error('无法获取远程列表')
    }

    const files = JSON.parse(data)
    const skills = files.filter(f => f.type === 'dir')

    console.log(`\n${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`)
    console.log(`${colors.cyan}║     CodeSkills 远程 Skills${colors.reset}`)
    console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`)

    skills.forEach((skill, i) => {
      console.log(`  ${colors.green}${i + 1}.${colors.reset} ${colors.white}${skill.name}${colors.reset}`)
      console.log(`     ${colors.gray}下载: npx skills install ${skill.name}${colors.reset}\n`)
    })

    console.log(`${colors.yellow}共 ${skills.length} 个 Skills${colors.reset}\n`)

  } catch (e) {
    // 如果 GitHub API 失败，尝试直接 clone
    warn('无法获取远程列表，尝试直接克隆...')
    await cloneAndShow()
  }
}

async function cloneAndShow() {
  const tempDir = path.join(__dirname, '..', '..', 'temp-clone')

  try {
    execSync(`git clone --depth 1 -b ${DEFAULT_BRANCH} ${GITCODDE_REPO} "${tempDir}"`, { stdio: 'pipe' })

    const skillsPath = path.join(tempDir, 'skills')
    if (fs.existsSync(skillsPath)) {
      const skills = fs.readdirSync(skillsPath).filter(f =>
        fs.statSync(path.join(skillsPath, f)).isDirectory()
      )

      console.log(`\n${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`)
      console.log(`${colors.cyan}║     CodeSkills Skills${colors.reset}`)
      console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`)

      skills.forEach((skill, i) => {
        console.log(`  ${colors.green}${i + 1}.${colors.reset} ${colors.white}${skill}${colors.reset}`)
      })

      console.log(`\n${colors.yellow}共 ${skills.length} 个 Skills${colors.reset}\n`)
    }

  } finally {
    // 清理临时目录
    execSync(`rm -rf "${tempDir}"`, { stdio: 'pipe' })
  }
}

// 获取目录下所有文件的 GitHub Contents API
async function getGithubTree(owner, repo, branch, skillName) {
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/skills/${skillName}?ref=${branch}`
    const data = await downloadFile(apiUrl, GH_HEADERS)
    return JSON.parse(data)
  } catch (e) {
    return null
  }
}

// 递归下载目录内容
async function downloadSkillFromGithub(skillName) {
  const GH_OWNER = 'bigooio'
  const GH_REPO = 'codeskills'
  const branch = DEFAULT_BRANCH

  info(`从 GitHub 下载 Skill: ${skillName}`)

  const items = await getGithubTree(GH_OWNER, GH_REPO, branch, skillName)
  if (!items || !Array.isArray(items)) {
    // 降级：只下载 SKILL.md
    const rawUrl = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${branch}/skills/${skillName}/SKILL.md`
    const content = await downloadFile(rawUrl)
    if (!content || content.includes('404')) {
      error(`Skill "${skillName}" 不存在`)
      return false
    }
    const skillDir = path.join(process.cwd(), 'skills', skillName)
    execSync(`mkdir -p "${skillDir}"`)
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content)
    success(`Skill "${skillName}" 安装成功（仅 SKILL.md）`)
    return true
  }

  const skillDir = path.join(process.cwd(), 'skills', skillName)
  execSync(`mkdir -p "${skillDir}"`)

  let downloaded = 0
  for (const item of items) {
    if (item.type === 'file') {
      const rawUrl = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${branch}/skills/${skillName}/${item.name}`
      const content = await downloadFile(rawUrl)
      if (content) {
        fs.writeFileSync(path.join(skillDir, item.name), content)
        downloaded++
      }
    } else if (item.type === 'dir') {
      // 子目录
      execSync(`mkdir -p "${path.join(skillDir, item.name)}"`)
      const subItems = await downloadFile(
        `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/skills/${skillName}/${item.name}?ref=${branch}`,
        GH_HEADERS
      )
      const subFiles = JSON.parse(subItems || '[]')
      for (const sub of subFiles) {
        if (sub.type === 'file') {
          const rawUrl = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${branch}/skills/${skillName}/${item.name}/${sub.name}`
          const content = await downloadFile(rawUrl)
          if (content) {
            fs.writeFileSync(path.join(skillDir, item.name, sub.name), content)
            downloaded++
          }
        }
      }
    }
  }

  return downloaded > 0
}

async function installSkill(skillName) {
  info(`安装 Skill: ${skillName}`)

  const parentSkillsDir = path.join(process.cwd(), 'skills')
  if (fs.existsSync(parentSkillsDir)) {
    const skillDir = path.join(parentSkillsDir, skillName)
    if (fs.existsSync(skillDir)) {
      success(`Skill "${skillName}" 已存在`)
      return
    }
  }

  try {
    const ok = await downloadSkillFromGithub(skillName)
    if (ok) {
      const skillDir = path.join(process.cwd(), 'skills', skillName)
      success(`Skill "${skillName}" 安装成功！`)
      console.log(`\n📁 位置: ${skillDir}`)
    }
  } catch (e) {
    error(`安装失败: ${e.message}`)
  }
}

function showHelp() {
  console.log(`
${colors.cyan}
╔═══════════════════════════════════════════╗
║         CodeSkills CLI v2.0.0            ║
║      发现编程超能力 - AI Agent 技能工具   ║
╚═══════════════════════════════════════════╝
${colors.reset}

${colors.white}使用方法:${colors.reset}

  ${colors.green}npx skills${colors.reset}              # 显示帮助
  ${colors.green}npx skills list${colors.reset}         # 列出所有可用 Skills
  ${colors.green}npx skills install${colors.reset}      # 安装所有 Skills
  ${colors.green}npx skills install <name>${colors.reset} # 安装指定 Skill
  ${colors.green}npx skills update${colors.reset}       # 更新 Skills

${colors.cyan}示例:${colors.reset}

  ${colors.gray}# 查看所有可用的 Skills
  npx skills list

  # 安装所有 Skills 到当前目录
  npx skills install

  # 安装指定的 Skill
  npx skills install react-useeffect-cleanup

  # 更新到最新版本
  npx skills update${colors.reset}
`)
}

async function Command() {
  const args = process.argv.slice(2)
  const command = args[0] || 'help'
  const skillName = args[1]

  console.log(`
${colors.cyan}
╔═══════════════════════════════════════════╗
║         CodeSkills CLI v2.0.0            ║
║      发现编程超能力 - AI Agent 技能工具   ║
╚═══════════════════════════════════════════╝
${colors.reset}
`)

  switch (command) {
    case 'list':
    case 'ls':
      await listRemoteSkills()
      break

    case 'install':
    case 'i':
      if (skillName) {
        await installSkill(skillName)
      } else {
        info('安装所有 Skills...')
        // 完整克隆
        const targetDir = path.join(process.cwd(), 'skills')
        execSync(`mkdir -p "${targetDir}"`)
        try {
          execSync(`git clone --depth 1 -b ${DEFAULT_BRANCH} ${GITCODDE_REPO} temp-cs`, { stdio: 'pipe', cwd: process.cwd() })
          execSync(`cp -r temp-cs/skills/* "${targetDir}/"`, { stdio: 'pipe' })
          execSync(`rm -rf temp-cs`, { stdio: 'pipe' })
          const skills = fs.readdirSync(targetDir).filter(f => fs.statSync(path.join(targetDir, f)).isDirectory())
          success(`安装完成！共 ${skills.length} 个 Skills`)
          console.log(`\n📁 位置: ${targetDir}`)
          console.log(`\n${colors.gray}查看: cd skills && ls${colors.reset}`)
        } catch (e) {
          error('安装失败')
        }
      }
      break

    case 'update':
    case 'u':
      info('更新 Skills...')
      execSync(`rm -rf "${path.join(process.cwd(), 'skills')}"`, { stdio: 'pipe' })
      await Command() // 重新执行 install
      break

    case 'help':
    case '--help':
    case '-h':
    default:
      if (command !== 'help' && command !== '--help' && command !== '-h') {
        error(`未知命令: ${command}\n`)
      }
      showHelp()
  }
}

Command()
