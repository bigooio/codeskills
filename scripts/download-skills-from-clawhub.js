#!/usr/bin/env node
/**
 * 从 ClawHub 批量下载完整 Skills
 * 下载 zip 包并解压到 skills 目录
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 需要下载的编程相关 skills 列表（按下载量排序）
const SKILLS_TO_DOWNLOAD = [
  // 开发工具
  { slug: 'steipete/summarize', name: 'summarize', category: '内容处理' },
  { slug: 'thesethrose/agent-browser', name: 'agent-browser', category: '浏览器自动化' },
  { slug: 'steipete/nano-pdf', name: 'nano-pdf', category: 'PDF工具' },
  { slug: 'steipete/gog', name: 'gog', category: 'Google工具' },
  { slug: 'steipete/weather', name: 'weather', category: '天气' },
  { slug: 'steipete/sonoscli', name: 'sonoscli', category: '智能家居' },
  { slug: 'steipete/nano-banana-pro', name: 'nano-banana-pro', category: '图像生成' },

  // 搜索
  { slug: 'gpyangyoujun/multi-search-engine', name: 'multi-search-engine', category: '搜索引擎' },
  { slug: 'ide-rea/baidu-search', name: 'baidu-search', category: '搜索引擎' },
  { slug: 'jacky1n7/openclaw-tavily-search', name: 'tavily-search', category: '搜索引擎' },

  // 笔记
  { slug: 'steipete/notion', name: 'notion', category: '笔记' },
  { slug: 'steipete/obsidian', name: 'obsidian', category: '笔记' },

  // API 集成
  { slug: 'byungkyu/api-gateway', name: 'api-gateway', category: 'API集成' },

  // AI 相关
  { slug: 'pskoett/self-improving-agent', name: 'self-improving-agent', category: 'AI代理' },
  { slug: 'halthelobster/proactive-agent', name: 'proactive-agent', category: 'AI代理' },
  { slug: 'ivangdavila/self-improving', name: 'self-improving', category: 'AI代理' },
  { slug: 'biostartechnology/humanizer', name: 'humanizer', category: '内容处理' },
  { slug: 'spclaudehome/skill-vetter', name: 'skill-vetter', category: '安全工具' },

  // 自动化
  { slug: 'jk-0001/automation-workflows', name: 'automation-workflows', category: '自动化' },
  { slug: 'maximeprades/auto-updater', name: 'auto-updater', category: '自动化' },

  // 数据分析
  { slug: 'fly0pants/admapix', name: 'admapix', category: '数据分析' },

  // 知识管理
  { slug: 'oswalpalash/ontology', name: 'ontology', category: '知识管理' },

  // 技能创建
  { slug: 'chindden/skill-creator', name: 'skill-creator', category: '技能开发' },
];

const TEMP_DIR = path.join(__dirname, '..', 'temp-skills');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);

    request.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function extractZip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    // 创建目标目录
    fs.mkdirSync(destDir, { recursive: true });

    // 使用 Python 的 zipfile 模块（macOS 默认有 Python）
    const { execSync } = require('child_process');
    const pythonScript = `
import zipfile
import sys
zip_path = sys.argv[1]
dest_dir = sys.argv[2]
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(dest_dir)
`;
    try {
      execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"').replace(/\n/g, ';')}" "${zipPath}" "${destDir}"`, { stdio: 'pipe' });
      resolve();
    } catch (e) {
      reject(new Error('解压失败'));
    }
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const { execSync } = require('child_process');
    try {
      execSync(`curl -sL "${url}" -o "${dest}"`, { stdio: 'pipe' });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

async function downloadSkill(skill) {
  const { slug, name, category } = skill;
  const url = `https://wry-manatee-359.convex.site/api/v1/download?slug=${slug}`;
  const zipPath = path.join(TEMP_DIR, `${name}.zip`);
  const extractDir = path.join(TEMP_DIR, name);
  const skillDir = path.join(SKILLS_DIR, name);

  console.log(`\n📥 下载: ${name} (${category})`);

  try {
    // 下载
    await download(url, zipPath);
    console.log(`  ✓ 下载完成`);

    // 解压
    fs.mkdirSync(extractDir, { recursive: true });
    await extractZip(zipPath, extractDir);
    console.log(`  ✓ 解压完成`);

    // 检查解压出来的目录结构
    const entries = fs.readdirSync(extractDir);
    let skillContentDir = extractDir;

    // 如果有嵌套目录（很多 zip 解压后会有一个父目录）
    if (entries.length === 1) {
      const firstEntry = path.join(extractDir, entries[0]);
      if (fs.statSync(firstEntry).isDirectory()) {
        skillContentDir = firstEntry;
      }
    }

    // 移动内容到目标目录
    if (fs.existsSync(skillDir)) {
      fs.rmSync(skillDir, { recursive: true });
    }
    fs.renameSync(skillContentDir, skillDir);
    console.log(`  ✓ 安装到: ${skillDir}`);

    // 列出文件结构
    const files = getAllFiles(skillDir);
    console.log(`  📁 文件: ${files.join(', ')}`);

    // 清理临时文件
    fs.unlinkSync(zipPath);
    fs.rmSync(extractDir, { recursive: true, force: true });

    return true;
  } catch (err) {
    console.error(`  ✗ 失败: ${err.message}`);
    return false;
  }
}

function getAllFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, relPath));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

async function main() {
  console.log('🚀 开始批量下载 Skills...\n');

  // 创建临时目录
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const skill of SKILLS_TO_DOWNLOAD) {
    const result = await downloadSkill(skill);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n\n========== 下载完成 ==========`);
  console.log(`✅ 成功: ${success}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📁 目录: ${SKILLS_DIR}`);

  // 统计 skills 数量
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(f =>
    fs.statSync(path.join(SKILLS_DIR, f)).isDirectory()
  );
  console.log(`📊 Skills 总数: ${skillDirs.length}`);

  // 清理临时目录
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

main().catch(console.error);
