import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import os from 'os'
import {
  getAllGroups, getActiveGroups, getActiveSkills, getAllSkills, getUngroupedSkills,
  activateGroup, deactivateGroup, createGroup, deleteGroup,
  addSkillToGroup, removeSkillFromGroup, getGroup, getGroupSkills,
  installSkill, getSkill,
  CONFIG_DIR
} from '../db'
import { info, success, error, warn } from '../utils'

const PORT = 3741

export function webCommand(_args: string[]) {
  const pidFile = path.join(CONFIG_DIR, 'web.pid')
  if (fs.existsSync(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, 'utf-8'))
    try {
      process.kill(pid, 0)
      console.log(`Web 面板已在运行 (PID: ${pid})`)
      console.log(`  访问: http://localhost:${PORT}`)
      return
    } catch {
      fs.unlinkSync(pidFile)
    }
  }

  const server = http.createServer(requestHandler)
  server.listen(PORT, () => {
    fs.writeFileSync(pidFile, process.pid.toString())
    console.log(`CodeSkills Web 面板已启动`)
    console.log(`  访问: http://localhost:${PORT}`)
    console.log(`  停止: pkill -f "codeskills web"`)
    console.log()
  })

  server.on('error', (e: NodeJS.ErrnoException) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`端口 ${PORT} 已被占用`)
    }
  })
}

function requestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  // API Routes
  if (url.pathname === '/api/status') {
    const groups = getAllGroups()
    const activeGroups = getActiveGroups()
    const activeSkills = getActiveSkills()
    const allSkills = getAllSkills()
    const ungrouped = getUngroupedSkills()

    res.end(JSON.stringify({
      groups, activeGroups, activeSkills, allSkills, ungrouped,
      stats: {
        totalSkills: allSkills.length,
        activeSkills: activeSkills.length,
        totalGroups: groups.length,
        activeGroups: activeGroups.length,
        ungrouped: ungrouped.length
      }
    }))
    return
  }

  // GET /api/groups
  if (url.pathname === '/api/groups' && req.method === 'GET') {
    const groups = getAllGroups().map(g => ({
      ...g,
      skills: getGroupSkills(g.id),
      isActive: getActiveGroups().some(ag => ag.id === g.id)
    }))
    res.end(JSON.stringify(groups))
    return
  }

  // POST /api/groups - Create group
  if (url.pathname === '/api/groups' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { name, description } = JSON.parse(body)
        if (!name) {
          res.writeHead(400)
          res.end(JSON.stringify({ error: '名称不能为空' }))
          return
        }
        const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const group = createGroup(id, name, description)
        res.end(JSON.stringify(group))
      } catch (e: any) {
        res.writeHead(400)
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  // DELETE /api/groups/:id (but not /api/groups/:id/skills/:skillId)
  if (url.pathname.match(/^\/api\/groups\/[^/]+$/) && req.method === 'DELETE') {
    const id = url.pathname.split('/')[3]
    const group = getGroup(id)
    if (!group) {
      res.writeHead(404)
      res.end(JSON.stringify({ error: '分组不存在' }))
      return
    }
    deleteGroup(id)
    res.end(JSON.stringify({ success: true }))
    return
  }

  // GET /api/groups/:id
  if (url.pathname.match(/^\/api\/groups\/[^/]+$/) && req.method === 'GET') {
    const id = url.pathname.split('/')[3]
    const group = getGroup(id)
    if (!group) {
      res.writeHead(404)
      res.end(JSON.stringify({ error: '分组不存在' }))
      return
    }
    const skills = getGroupSkills(id)
    const isActive = getActiveGroups().some(ag => ag.id === id)
    res.end(JSON.stringify({ ...group, skills, isActive }))
    return
  }

  // POST /api/groups/:id/activate
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/activate$/) && req.method === 'POST') {
    const id = url.pathname.split('/')[3]
    activateGroup(id)
    res.end(JSON.stringify({ success: true }))
    return
  }

  // POST /api/groups/:id/deactivate
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/deactivate$/) && req.method === 'POST') {
    const id = url.pathname.split('/')[3]
    deactivateGroup(id)
    res.end(JSON.stringify({ success: true }))
    return
  }

  // POST /api/groups/:id/skills - Add skill to group
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/skills$/) && req.method === 'POST') {
    const id = url.pathname.split('/')[3]
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { skillId } = JSON.parse(body)
        addSkillToGroup(id, skillId)
        res.end(JSON.stringify({ success: true }))
      } catch (e: any) {
        res.writeHead(400)
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  // DELETE /api/groups/:id/skills/:skillId - Remove skill from group
  if (url.pathname.match(/^\/api\/groups\/[^/]+\/skills\/[^/]+$/) && req.method === 'DELETE') {
    const parts = url.pathname.split('/')
    const groupId = parts[3]
    const skillId = parts[5]
    removeSkillFromGroup(groupId, skillId)
    res.end(JSON.stringify({ success: true }))
    return
  }

  // GET /api/skills - All local skills
  if (url.pathname === '/api/skills' && req.method === 'GET') {
    res.end(JSON.stringify(getAllSkills()))
    return
  }

  // GET /api/skills/ungrouped
  if (url.pathname === '/api/skills/ungrouped' && req.method === 'GET') {
    res.end(JSON.stringify(getUngroupedSkills()))
    return
  }

  // GET /api/remote/skills - Proxy to codeskills.cn to avoid CORS
  if (url.pathname === '/api/remote/skills' && req.method === 'GET') {
    https.get('https://codeskills.cn/api/skills', (apiRes) => {
      let data = ''
      apiRes.on('data', chunk => data += chunk)
      apiRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json')
        res.end(data)
      })
    }).on('error', () => {
      res.writeHead(500)
      res.end(JSON.stringify({ error: '获取远程技能失败' }))
    })
    return
  }

  // GET /api/search?q=keyword - Search remote (uses /api/skills and filters locally)
  if (url.pathname === '/api/search' && req.method === 'GET') {
    const query = (url.searchParams.get('q') || '').toLowerCase()

    https.get('https://codeskills.cn/api/skills', (apiRes) => {
      let data = ''
      apiRes.on('data', chunk => data += chunk)
      apiRes.on('end', () => {
        try {
          const allSkills = JSON.parse(data)
          const results = allSkills
            .filter((s: any) =>
              s.title.toLowerCase().includes(query) ||
              (s.description && s.description.toLowerCase().includes(query)) ||
              (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(query)))
            )
            .map((s: any) => ({
              slug: s.slug,
              name: s.title,
              description: s.description,
              tags: Array.isArray(s.tags) ? s.tags.join(',') : s.tags,
              source: s.source,
              source_url: s.sourceUrl
            }))
          res.end(JSON.stringify(results))
        } catch {
          res.writeHead(500)
          res.end(JSON.stringify({ error: '搜索失败' }))
        }
      })
    }).on('error', () => {
      res.writeHead(500)
      res.end(JSON.stringify({ error: '网络错误，请检查网络连接' }))
    })
    return
  }

  // POST /api/skills/install - Install a skill
  if (url.pathname === '/api/skills/install' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { slug } = JSON.parse(body)

        // Fetch from API
        https.get(`https://codeskills.cn/api/skills/${encodeURIComponent(slug)}`, (apiRes) => {
          let data = ''
          apiRes.on('data', chunk => data += chunk)
          apiRes.on('end', () => {
            try {
              const skillData = JSON.parse(data)

              const SKILLS_DIR = path.join(CONFIG_DIR, 'skills')
              fs.mkdirSync(SKILLS_DIR, { recursive: true })

              // Fetch content
              https.get(`https://codeskills.cn/api/skills/${encodeURIComponent(slug)}/content`, (contentRes) => {
                let content = ''
                contentRes.on('data', chunk => content += chunk)
                contentRes.on('end', () => {
                  fs.writeFileSync(path.join(SKILLS_DIR, `${slug}.md`), content)

                  installSkill({
                    id: slug,
                    name: skillData.title || skillData.name,
                    description: skillData.description,
                    tags: Array.isArray(skillData.tags) ? skillData.tags.join(',') : skillData.tags,
                    source: 'local',
                    source_url: `https://codeskills.cn/skills/${slug}`
                  })

                  res.end(JSON.stringify({ success: true, skill: skillData }))
                })
              }).on('error', () => {
                res.writeHead(500)
                res.end(JSON.stringify({ error: '获取内容失败' }))
              })
            } catch {
              res.writeHead(500)
              res.end(JSON.stringify({ error: '解析失败' }))
            }
          })
        }).on('error', () => {
          res.writeHead(404)
          res.end(JSON.stringify({ error: '技能不存在' }))
        })
      } catch (e: any) {
        res.writeHead(400)
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  // Serve HTML
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.setHeader('Content-Type', 'text/html')
    res.end(getHtml())
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
}

function getHtml() {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeSkills 管理面板</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 1.8rem; }
    .subtitle { color: #64748b; margin-bottom: 2rem; }
    .card { background: #1e293b; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .card h2 { color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; }
    .stat { background: #334155; padding: 1rem; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 2rem; font-weight: bold; color: #38bdf8; }
    .stat-label { color: #94a3b8; font-size: 0.85rem; margin-top: 0.25rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
    .tab { padding: 0.6rem 1.2rem; border-radius: 6px; background: #334155; border: none; color: #94a3b8; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .tab:hover { background: #475569; }
    .tab.active { background: #38bdf8; color: #0f172a; font-weight: 600; }
    .groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .group { background: #334155; padding: 1rem; border-radius: 8px; border: 2px solid transparent; transition: all 0.2s; }
    .group.active { border-color: #22c55e; }
    .group-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .group-name { font-weight: 600; font-size: 1.1rem; }
    .group.active .group-name { color: #22c55e; }
    .group-actions { display: flex; gap: 0.5rem; }
    .btn { padding: 0.4rem 0.8rem; border-radius: 6px; border: none; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; }
    .btn-activate { background: #166534; color: #dcfce7; }
    .btn-activate:hover { background: #15803d; }
    .btn-deactivate { background: #475569; color: #e2e8f0; }
    .btn-deactivate:hover { background: #64748b; }
    .btn-delete { background: #7f1d1d; color: #fecaca; }
    .btn-delete:hover { background: #991b1b; }
    .btn-add { background: #38bdf8; color: #0f172a; font-weight: 600; }
    .btn-add:hover { background: #0ea5e9; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
    .skill-tag { background: #1e293b; padding: 0.3rem 0.7rem; border-radius: 4px; font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; }
    .skill-tag .remove { color: #ef4444; cursor: pointer; font-weight: bold; }
    .skill-tag .remove:hover { color: #f87171; }
    .empty { color: #64748b; font-style: italic; padding: 1rem; text-align: center; }
    .add-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .add-form input { flex: 1; background: #334155; border: 1px solid #475569; padding: 0.6rem 1rem; border-radius: 6px; color: #e2e8f0; font-size: 0.9rem; }
    .add-form input::placeholder { color: #64748b; }
    .add-form button { background: #38bdf8; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; color: #0f172a; font-weight: 600; cursor: pointer; }
    .add-form button:hover { background: #0ea5e9; }
    .search-section { margin-top: 1rem; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal.hidden { display: none; }
    .hidden { display: none; }
    .modal-content { background: #1e293b; border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; }
    .modal-content h2 { margin-bottom: 1rem; color: #38bdf8; }
    .modal-content input, .modal-content textarea { width: 100%; background: #334155; border: 1px solid #475569; padding: 0.75rem; border-radius: 6px; color: #e2e8f0; margin-bottom: 1rem; font-size: 0.9rem; }
    .modal-content textarea { min-height: 80px; resize: vertical; }
    .modal-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .modal-actions button { padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
    .modal-actions .cancel { background: #475569; color: #e2e8f0; }
    .modal-actions .confirm { background: #38bdf8; color: #0f172a; }
    nav { display: flex; gap: 1rem; margin-bottom: 2rem; align-items: center; }
    nav h1 { margin-bottom: 0; }
    nav a { color: #94a3b8; text-decoration: none; padding: 0.5rem 1rem; border-radius: 6px; }
    nav a:hover, nav a.active { background: #334155; color: #38bdf8; }
    .toast { position: fixed; bottom: 2rem; right: 2rem; background: #334155; padding: 1rem 1.5rem; border-radius: 8px; color: #e2e8f0; transform: translateY(100px); opacity: 0; transition: all 0.3s; z-index: 200; }
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast.success { border-left: 4px solid #22c55e; }
    .toast.error { border-left: 4px solid #ef4444; }
    .search-bar { margin-bottom: 1rem; }
    .search-bar input { width: 100%; background: #334155; border: 1px solid #475569; padding: 0.75rem 1rem; border-radius: 8px; color: #e2e8f0; font-size: 0.95rem; }
    .search-bar input::placeholder { color: #64748b; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .skill-card { background: #334155; border-radius: 8px; padding: 1rem; transition: all 0.2s; }
    .skill-card:hover { background: #475569; }
    .skill-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
    .skill-card-name { font-weight: 600; font-size: 1rem; color: #e2e8f0; }
    .skill-card-desc { color: #94a3b8; font-size: 0.85rem; line-height: 1.4; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .skill-card-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; }
    .skill-tag-small { background: #1e293b; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; color: #64748b; }
    .skill-card-actions { display: flex; gap: 0.5rem; }
    .load-more { text-align: center; padding: 1rem; color: #38bdf8; cursor: pointer; font-weight: 600; }
    .load-more:hover { color: #0ea5e9; }
    .load-more.hidden { display: none; }
    .skill-picker-list { max-height: 400px; overflow-y: auto; margin: 1rem 0; }
    .skill-picker-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
    .skill-picker-item:hover { background: #334155; }
    .skill-picker-item-info h4 { font-size: 0.95rem; margin-bottom: 0.2rem; }
    .skill-picker-item-info p { color: #64748b; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="container">
    <nav>
      <h1>CodeSkills</h1>
      <a href="#groups" class="active">分组</a>
      <a href="#search">搜索安装</a>
    </nav>

    <div id="groups-view">
      <div class="card">
        <h2>统计</h2>
        <div class="stats">
          <div class="stat"><div class="stat-value" id="stat-skills">0</div><div class="stat-label">总技能</div></div>
          <div class="stat"><div class="stat-value" id="stat-active-skills">0</div><div class="stat-label">已激活</div></div>
          <div class="stat"><div class="stat-value" id="stat-groups">0</div><div class="stat-label">分组</div></div>
          <div class="stat"><div class="stat-value" id="stat-active-groups">0</div><div class="stat-label">已激活</div></div>
        </div>
      </div>

      <div class="card">
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          我的分组
        </h2>
        <div class="add-form">
          <input type="text" id="new-group-name" placeholder="新分组名称...">
          <button onclick="createGroup()">+ 创建分组</button>
        </div>
        <div class="groups" id="groups-list"></div>
      </div>
    </div>

    <div id="search-view" class="hidden">
      <div class="card">
        <h2>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          远程技能市场 <span id="total-skills" style="color:#64748b;font-weight:normal">(加载中...)</span>
        </h2>
        <div class="search-bar">
          <input type="text" id="search-input" placeholder="搜索技能名称或描述..." oninput="filterSkills()">
        </div>
        <div class="skills-grid" id="skills-grid"></div>
        <div class="load-more" id="load-more" onclick="loadMoreSkills()">加载更多</div>
      </div>
    </div>
  </div>

  <div class="modal hidden" id="add-skill-modal">
    <div class="modal-content" style="max-width:600px;">
      <h2 id="modal-title">添加技能到分组</h2>
      <input type="text" id="skill-search-input" placeholder="搜索技能..." oninput="filterAvailableSkills()">
      <div class="skill-picker-list" id="skill-picker-list"></div>
      <div class="modal-actions">
        <button class="cancel" onclick="closeAddSkillModal()">取消</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    let currentGroupId = null
    let allSkills = []
    let displayedSkills = []
    let skillsPage = 0
    let skillsPerPage = 20
    let searchQuery = ''
    let availableSkills = []

    function navigate(view) {
      document.getElementById('groups-view').style.display = view === 'groups' ? 'block' : 'none'
      document.getElementById('search-view').style.display = view === 'search' ? 'block' : 'none'
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'))
      if (view === 'groups') document.querySelector('nav a:nth-child(2)').classList.add('active')
      if (view === 'search') {
        document.querySelector('nav a:nth-child(3)').classList.add('active')
        if (allSkills.length === 0) loadAllSkills()
      }
    }

    async function loadAllSkills() {
      try {
        const res = await fetch('/api/remote/skills')
        allSkills = await res.json()
        document.getElementById('total-skills').textContent = '(' + allSkills.length + ' 个技能)'
        skillsPage = 0
        searchQuery = ''
        filterSkills()
      } catch (e) {
        console.error('Failed to load skills:', e)
      }
    }

    function filterSkills() {
      searchQuery = document.getElementById('search-input').value.toLowerCase()
      skillsPage = 0
      displayedSkills = allSkills.filter(s =>
        s.title.toLowerCase().includes(searchQuery) ||
        (s.description && s.description.toLowerCase().includes(searchQuery)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(searchQuery)))
      )
      renderSkills()
    }

    function renderSkills() {
      const container = document.getElementById('skills-grid')
      const start = 0
      const end = (skillsPage + 1) * skillsPerPage
      const toShow = displayedSkills.slice(start, end)

      container.innerHTML = toShow.map(s => \`
        <div class="skill-card">
          <div class="skill-card-header">
            <span class="skill-card-name">\${s.title}</span>
          </div>
          <p class="skill-card-desc">\${s.description || ''}</p>
          <div class="skill-card-tags">
            \${(s.tags || []).slice(0, 4).map(t => \`<span class="skill-tag-small">\${t}</span>\`).join('')}
          </div>
          <div class="skill-card-actions">
            <button class="btn btn-add" onclick="installFromSearch('\${s.slug}')">安装</button>
          </div>
        </div>
      \`).join('')

      const loadMoreBtn = document.getElementById('load-more')
      if (end < displayedSkills.length) {
        loadMoreBtn.classList.remove('hidden')
      } else {
        loadMoreBtn.classList.add('hidden')
      }
    }

    function loadMoreSkills() {
      skillsPage++
      renderSkills()
    }

    async function installFromSearch(slug) {
      const statusEl = document.createElement('div')
      statusEl.className = 'skill-card'
      statusEl.style.textAlign = 'center'
      statusEl.style.color = '#38bdf8'
      statusEl.textContent = '安装中...'
      document.getElementById('skills-grid').prepend(statusEl)

      try {
        const res = await fetch('/api/skills/install', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug })
        })

        statusEl.remove()
        if (res.ok) {
          showToast('安装成功', 'success')
          loadData()
        } else {
          const err = await res.json()
          showToast(err.error || '安装失败', 'error')
        }
      } catch {
        statusEl.remove()
        showToast('安装失败', 'error')
      }
    }

    async function loadData() {
      const res = await fetch('/api/status')
      const data = await res.json()
      document.getElementById('stat-skills').textContent = data.stats.totalSkills
      document.getElementById('stat-active-skills').textContent = data.stats.activeSkills
      document.getElementById('stat-groups').textContent = data.stats.totalGroups
      document.getElementById('stat-active-groups').textContent = data.stats.activeGroups
    }

    async function loadGroups() {
      const res = await fetch('/api/groups')
      const groups = await res.json()

      const container = document.getElementById('groups-list')
      if (groups.length === 0) {
        container.innerHTML = '<div class="empty">暂无分组，请创建一个</div>'
        return
      }

      container.innerHTML = groups.map(g => \`
        <div class="group \${g.isActive ? 'active' : ''}">
          <div class="group-header">
            <span class="group-name">\${g.name}</span>
            <div class="group-actions">
              <button class="btn \${g.isActive ? 'btn-deactivate' : 'btn-activate'}" onclick="toggleGroup('\${g.id}', \${!g.isActive})">
                \${g.isActive ? '停用' : '激活'}
              </button>
              <button class="btn btn-add" onclick="openAddSkillModal('\${g.id}')">+ 技能</button>
              <button class="btn btn-delete" onclick="deleteGroup('\${g.id}')">删除</button>
            </div>
          </div>
          <div class="skills-list">
            \${g.skills.length === 0 ? '<span class="empty">暂无技能</span>' : ''}
            \${g.skills.map(s => \`<span class="skill-tag">\${s.name}<span class="remove" onclick="removeSkill('\${g.id}', '\${s.id}')">×</span></span>\`).join('')}
          </div>
        </div>
      \`).join('')
    }

    async function createGroup() {
      const name = document.getElementById('new-group-name').value.trim()
      if (!name) return

      await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      document.getElementById('new-group-name').value = ''
      loadGroups()
      loadData()
      showToast('分组已创建', 'success')
    }

    async function deleteGroup(id) {
      if (!confirm('确定要删除这个分组吗？')) return
      await fetch(\`/api/groups/\${id}\`, { method: 'DELETE' })
      loadGroups()
      loadData()
      showToast('分组已删除', 'success')
    }

    async function toggleGroup(id, activate) {
      await fetch(\`/api/groups/\${id}/\${activate ? 'activate' : 'deactivate'}\`, { method: 'POST' })
      loadGroups()
      loadData()
    }

    async function openAddSkillModal(groupId) {
      currentGroupId = groupId
      document.getElementById('add-skill-modal').classList.remove('hidden')
      document.getElementById('skill-search-input').value = ''
      document.getElementById('skill-search-input').focus()

      // Load all skills if not loaded
      if (availableSkills.length === 0) {
        try {
          availableSkills = await fetch('/api/remote/skills').then(r => r.json())
        } catch (e) {
          console.error('Failed to load skills for picker')
        }
      }

      filterAvailableSkills()
    }

    function filterAvailableSkills() {
      const query = document.getElementById('skill-search-input').value.toLowerCase()
      const container = document.getElementById('skill-picker-list')

      const filtered = availableSkills.filter(s =>
        s.title.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query))
      ).slice(0, 50)

      container.innerHTML = filtered.map(s => \`
        <div class="skill-picker-item" onclick="addSkillToGroup('\${s.slug}')">
          <div class="skill-picker-item-info">
            <h4>\${s.title}</h4>
            <p>\${s.description || ''}</p>
          </div>
          <button class="btn btn-add">+ 添加</button>
        </div>
      \`).join('')

      if (filtered.length === 0) {
        container.innerHTML = '<div class="empty">未找到匹配的技能</div>'
      }
    }

    async function addSkillToGroup(skillSlug) {
      if (!currentGroupId) return

      await fetch(\`/api/groups/\${currentGroupId}/skills\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: skillSlug })
      })

      closeAddSkillModal()
      loadGroups()
      showToast('技能已添加', 'success')
    }

    function closeAddSkillModal() {
      document.getElementById('add-skill-modal').classList.add('hidden')
      currentGroupId = null
    }

    async function removeSkill(groupId, skillId) {
      await fetch(\`/api/groups/\${groupId}/skills/\${skillId}\`, { method: 'DELETE' })
      loadGroups()
    }

    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast')
      toast.textContent = message
      toast.className = \`toast \${type} show\`
      setTimeout(() => toast.classList.remove('show'), 3000)
    }

    // Handle Enter key in inputs
    document.getElementById('new-group-name').addEventListener('keypress', e => { if (e.key === 'Enter') createGroup() })

    // Handle URL hash for navigation
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1)
      const view = (hash === 'groups' || hash === 'search') ? hash : 'groups'
      navigate(view)
    })

    // Init
    loadData()
    loadGroups()
    const initialHash = location.hash.slice(1)
    navigate(initialHash === 'search' ? 'search' : 'groups')
  </script>
</body>
</html>`
}
