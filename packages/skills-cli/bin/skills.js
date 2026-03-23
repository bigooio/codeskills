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
  reset: '\x1b[0m'
}

function log(color, prefix, message) {
  console.log(`${color}${prefix}${colors.reset} ${message}`)
}

function info(msg) { log(colors.blue, 'ℹ', msg) }
function success(msg) { log(colors.green, '✓', msg) }
function warn(msg) { log(colors.yellow, '⚠', msg) }
function error(msg) { log(colors.red, '✗', msg) }

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const request = url.startsWith('https') ? https : http

    request.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject)
        return
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

function Command() {
  const args = process.argv.slice(2)
  const command = args[0] || 'install'

  console.log(`
${colors.cyan}
╔═══════════════════════════════════════════╗
║         CodeSkills CLI v1.0.0            ║
║      发现编程超能力 - 下载技能工具        ║
╚═══════════════════════════════════════════╝
${colors.reset}
`)

  switch (command) {
    case 'install':
    case 'i':
      install()
      break
    case 'list':
    case 'ls':
      list()
      break
    case 'update':
    case 'u':
      update()
      break
    case 'help':
    case '--help':
    case '-h':
      showHelp()
      break
    default:
      error(`未知命令: ${command}`)
      showHelp()
      process.exit(1)
  }
}

function install() {
  info('开始安装 CodeSkills...')

  const targetDir = path.join(process.cwd(), 'codeskills-data')
  const skillsFile = path.join(targetDir, 'skills.json')

  // 如果已有目录，更新
  if (fs.existsSync(targetDir)) {
    success(`检测到已有目录: ${targetDir}`)
    info('更新 skills.json...')

    try {
      // 使用 gh 或 curl 下载
      const rawUrl = `https://gitcode.com/codeskills/codeskills/raw/${DEFAULT_BRANCH}/data/skills.json`

      info(`下载来源: ${rawUrl}`)
      execSync(`curl -sL "${rawUrl}" -o "${skillsFile}"`, { stdio: 'inherit' })

      const data = JSON.parse(fs.readFileSync(skillsFile, 'utf8'))
      success(`安装完成！共 ${data.length} 个 Skills`)
      console.log(`\n📁 数据位置: ${skillsFile}`)
    } catch (e) {
      warn('下载失败，尝试使用 git...')
      execSync(`cd "${targetDir}" && git pull origin ${DEFAULT_BRANCH}`, { stdio: 'inherit' })
      success('已通过 git 更新')
    }
  } else {
    // 首次安装 - git clone
    success('首次安装，克隆仓库...')
    console.log(`\n🌐 克隆地址: ${GITHUB_REPO}`)
    console.log(`📂 分支: ${DEFAULT_BRANCH}`)
    console.log(`📁 安装目录: ${targetDir}\n`)

    try {
      execSync(`git clone --depth 1 -b ${DEFAULT_BRANCH} ${GITCODDE_REPO} "${targetDir}"`, { stdio: 'inherit' })
      success('安装完成！')

      if (fs.existsSync(skillsFile)) {
        const data = JSON.parse(fs.readFileSync(skillsFile, 'utf8'))
        console.log(`\n${colors.green}✅ 共 ${data.length} 个 Skills${colors.reset}`)
      }
      console.log(`\n📁 安装目录: ${targetDir}`)
      console.log(`\n📖 使用方法:`)
      console.log(`   skills list    - 查看所有 Skills`)
      console.log(`   skills update   - 更新到最新`)
    } catch (e) {
      error('克隆失败，请检查网络连接')
      process.exit(1)
    }
  }
}

function list() {
  const skillsFile = path.join(process.cwd(), 'codeskills-data', 'skills.json')

  if (!fs.existsSync(skillsFile)) {
    warn('未找到数据，请先运行: skills install')
    return
  }

  const data = JSON.parse(fs.readFileSync(skillsFile, 'utf8'))

  console.log(`\n${colors.cyan}📦 CodeSkills 列表${colors.reset}\n`)

  data.forEach((skill, i) => {
    console.log(`${colors.green}${i + 1}.${colors.reset} ${colors.white}${skill.title}${colors.reset}`)
    console.log(`   ${colors.gray}${skill.description}${colors.reset}`)
    console.log(`   标签: ${skill.tags.join(', ')}`)
    console.log('')
  })

  console.log(`${colors.yellow}共 ${data.length} 个 Skills${colors.reset}\n`)
}

function update() {
  info('更新 CodeSkills...')
  install()
}

function showHelp() {
  console.log(`
${colors.cyan}使用方法:${colors.reset}

  ${colors.green}npx skills install${colors.reset}   # 安装/更新 Skills
  ${colors.green}npx skills list${colors.reset}     # 查看所有 Skills
  ${colors.green}npx skills update${colors.reset}  # 更新到最新版本
  ${colors.green}npx skills help${colors.reset}    # 显示帮助

${colors.cyan}示例:${colors.reset}

  ${colors.gray}# 安装 Skills 到当前目录
  npx skills install

  # 查看已安装的 Skills
  cd codeskills-data
  skills list

  # 更新到最新版本
  skills update${colors.reset}
`)
}

// 运行
Command()
