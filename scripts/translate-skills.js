#!/usr/bin/env node
/**
 * SKILL.md 格式转换和中文翻译脚本
 *
 * 标准格式:
 * ---
 * name: 技能名称
 * description: 简短描述（50-200字）
 * tags: [分类标签]
 * ---
 *
 * # 技能标题
 *
 * ## 何时使用
 * 描述在什么情况下使用此技能
 *
 * ## 快速开始
 * 基本使用方法
 *
 * ## 详细说明
 * 详细的使用说明和示例
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const SKILLS_DIR = path.join(__dirname, '..', 'skills')

// 简单的中文翻译（基于关键词替换）
function translateToChinese(content, skillName) {
  const translations = {
    // 通用
    'When to Use': '何时使用',
    'When to use': '何时使用',
    'Quick Start': '快速开始',
    'Quick Reference': '快速参考',
    'Examples': '示例',
    'Example': '示例',
    'Usage': '使用方法',
    'Commands': '命令',
    'Options': '选项',
    'Description': '说明',
    'Commands Reference': '命令参考',
    'Best Practices': '最佳实践',
    'Tips': '技巧',
    'Troubleshooting': '故障排除',
    'FAQ': '常见问题',

    // Git
    'Git': 'Git',
    'Branches': '分支',
    'Branch': '分支',
    'Commits': '提交',
    'Commit': '提交',
    'Merge': '合并',
    'Rebase': '变基',
    'Conflict': '冲突',
    'Conflicts': '冲突',
    'History': '历史',
    'Remote': '远程',
    'Repository': '仓库',

    // Docker
    'Docker': 'Docker',
    'Container': '容器',
    'Containers': '容器',
    'Image': '镜像',
    'Images': '镜像',
    'Volume': '存储卷',
    'Network': '网络',

    // Python
    'Python': 'Python',
    'Code Style': '代码风格',
    'Functions': '函数',
    'Classes': '类',

    // JavaScript/TypeScript
    'JavaScript': 'JavaScript',
    'TypeScript': 'TypeScript',
    'React': 'React',
    'Vue': 'Vue',
    'Component': '组件',

    // AI/Agent
    'Agent': '智能体',
    'Prompt': '提示词',
    'LLM': '大语言模型',

    // 常见动词
    'Use when': '适用场景',
    'use when': '适用场景',
    'Install': '安装',
    'Configure': '配置',
    'Setup': '设置',
    'Create': '创建',
    'Delete': '删除',
    'Update': '更新',
    'List': '列出',
    'Show': '显示',
    'Run': '运行',
    'Execute': '执行',
    'Start': '启动',
    'Stop': '停止',
    'Check': '检查',
    'Verify': '验证',
    'Add': '添加',
    'Remove': '移除',
    'Copy': '复制',
    'Move': '移动',
    'Edit': '编辑',
    'Read': '读取',
    'Write': '写入',

    // 常见名词
    'File': '文件',
    'Files': '文件',
    'Directory': '目录',
    'Folder': '文件夹',
    'Path': '路径',
    'URL': '网址',
    'Error': '错误',
    'Warning': '警告',
    'Success': '成功',
    'Status': '状态',
    'Version': '版本',
    'Help': '帮助',
    'Documentation': '文档',
    'Manual': '手册',
    'Guide': '指南',
    'Reference': '参考',
    'Settings': '设置',
    'Config': '配置',
    'Configuration': '配置',
    'Default': '默认',
    'Required': '必需',
    'Optional': '可选',
    'Output': '输出',
    'Input': '输入',
    'Parameter': '参数',
    'Parameters': '参数',
    'Argument': '参数',
    'Arguments': '参数',
    'Flag': '标志',
    'Option': '选项',

    // 状态描述
    'Enable': '启用',
    'Disabled': '已禁用',
    'Enabled': '已启用',
    'Running': '运行中',
    'Stopped': '已停止',
    'Started': '已启动',
    'Finished': '已完成',
    'Failed': '失败',
    'Pending': '等待中',
    'Loading': '加载中',
    'Saving': '保存中',
    'Creating': '创建中',
    'Updating': '更新中',
    'Deleting': '删除中',
  }

  let result = content

  // 替换标题
  for (const [en, zh] of Object.entries(translations)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, 'gi'), zh)
  }

  // 翻译常见技术术语
  const termTranslations = {
    '\\[x\\]': '[x]',
    '\\[ \\]': '[ ]',
    '```': '```',
    '`': '`',
    '# ': '# ',
    '## ': '## ',
    '### ': '### ',
    '-': '-',
    '*': '*',
    '1.': '1.',
    '2.': '2.',
    '3.': '3.',
    '4.': '4.',
    '5.': '5.',
  }

  return result
}

// 转换为标准格式
function convertToStandardFormat(skillPath, skillDir) {
  try {
    const content = fs.readFileSync(skillPath, 'utf8')
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return false

    const frontmatter = match[1]
    const body = content.replace(/^---[\s\S]*?---\n/, '')

    // 翻译内容
    const translatedBody = translateToChinese(body, skillDir)

    // 重新组装
    const newContent = `---\n${frontmatter}\n---\n\n${translatedBody}`

    fs.writeFileSync(skillPath, newContent)
    return true
  } catch (e) {
    console.error(`Error converting ${skillDir}:`, e.message)
    return false
  }
}

// 主处理
const dirs = fs.readdirSync(SKILLS_DIR).filter(f => {
  return fs.statSync(path.join(SKILLS_DIR, f)).isDirectory()
})

console.log(`Processing ${dirs.length} skills...`)

let converted = 0
let errors = 0

for (const dir of dirs) {
  const skillPath = path.join(SKILLS_DIR, dir, 'SKILL.md')
  if (!fs.existsSync(skillPath)) {
    console.log(`  [SKIP] ${dir}: no SKILL.md`)
    continue
  }

  if (convertToStandardFormat(skillPath, dir)) {
    converted++
    if (converted % 20 === 0) {
      console.log(`  Converted ${converted}/${dirs.length}...`)
    }
  } else {
    errors++
  }
}

console.log(`\nDone: ${converted} converted, ${errors} errors`)
