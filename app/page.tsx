import Link from 'next/link'
import { getAllSkills } from '@/lib/skills'
import SearchBar from '@/components/SearchBar'
import CategorySection from '@/components/CategorySection'
import SkillRankCard from '@/components/SkillRankCard'

export default function Home() {
  const skills = getAllSkills()

  // Calculate top 50 by combined score (stars + downloads)
  const topSkills = [...skills]
    .map(skill => ({
      ...skill,
      score: (skill.stars || 0) * 10 + (skill.downloads || 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          装上这个 <span className="text-accent">Skill</span>，解锁 AI 超能力
        </h1>
        <p className="text-text-secondary text-lg mb-6 max-w-2xl mx-auto">
          CodeSkills - 收集优质编程技能、工具、代码模式，帮助你提升开发效率
        </p>

        {/* User Type Selection */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Link
            href="/discover"
            className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition"
          >
            🤖 我是 Agent
          </Link>
          <Link
            href="/discover"
            className="px-6 py-3 bg-card border border-border rounded-lg font-medium hover:border-accent/50 transition"
          >
            👤 我是 Human
          </Link>
        </div>

        {/* CLI Install Hint */}
        <div className="bg-card/50 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm text-text-secondary">
          <code className="text-accent">npm install -g codeskills</code>
          <span className="text-text-tertiary">|</span>
          <span>立即体验 CLI</span>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mt-8">
          <SearchBar />
        </div>
      </section>

      {/* CLI & Web Dashboard Feature Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-accent/10 to-purple-10 rounded-2xl p-8 border border-accent/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
              <span>★</span> 本地技能管理 <span className="text-accent">CLI + Web Dashboard</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              安装 CLI 后，你可以在本地管理技能和分组。支持命令行和可视化 Web 界面，自由组合你的技能集
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2">快速安装</h3>
              <p className="text-text-secondary text-sm mb-4">一行命令安装任意技能到本地</p>
              <code className="text-xs bg-black/30 px-3 py-2 rounded block">
                codeskills install git
              </code>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-semibold text-lg mb-2">分组管理</h3>
              <p className="text-text-secondary text-sm mb-4">创建分组、激活/停用、添加技能</p>
              <code className="text-xs bg-black/30 px-3 py-2 rounded block">
                codeskills group create frontend
              </code>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold text-lg mb-2">Web 面板</h3>
              <p className="text-text-secondary text-sm mb-4">可视化界面管理所有技能和分组</p>
              <code className="text-xs bg-black/30 px-3 py-2 rounded block">
                codeskills web
              </code>
            </div>
          </div>

          {/* Screenshots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src="/screenshots/web-groups-view.png"
                alt="Web 分组管理界面"
                className="rounded-lg shadow-lg w-full"
              />
              <p className="text-text-secondary text-sm mt-2 text-center">分组管理</p>
            </div>
            <div>
              <img
                src="/screenshots/web-search-view.png"
                alt="Web 技能市场"
                className="rounded-lg shadow-lg w-full"
              />
              <p className="text-text-secondary text-sm mt-2 text-center">技能搜索与安装</p>
            </div>
          </div>

          {/* CLI Commands */}
          <div className="mt-8 bg-card rounded-xl p-6">
            <h3 className="font-semibold mb-4">常用命令</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <code className="text-accent">status</code>
                <p className="text-text-secondary text-xs mt-1">查看状态</p>
              </div>
              <div>
                <code className="text-accent">list</code>
                <p className="text-text-secondary text-xs mt-1">列出技能</p>
              </div>
              <div>
                <code className="text-accent">search &lt;词&gt;</code>
                <p className="text-text-secondary text-xs mt-1">搜索技能</p>
              </div>
              <div>
                <code className="text-accent">activate &lt;组&gt;</code>
                <p className="text-text-secondary text-xs mt-1">激活分组</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 50 精选榜单 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>🏆</span> TOP 50 精选榜单
          </h2>
          <Link href="/discover?sort=popular" className="text-accent hover:underline text-sm">
            查看全部 →
          </Link>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-text-secondary border-b border-border">
          <div className="col-span-1">排名</div>
          <div className="col-span-5">名称</div>
          <div className="col-span-2 text-right">下载量</div>
          <div className="col-span-2 text-right">收藏数</div>
          <div className="col-span-2 text-right">版本</div>
        </div>

        {/* Skills List */}
        <div className="grid grid-cols-1 gap-2">
          {topSkills.map((skill, index) => (
            <SkillRankCard key={skill.id} rank={index + 1} skill={skill} />
          ))}
        </div>

        {topSkills.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-4xl mb-4">📭</p>
            <p>暂无技能数据</p>
            <p className="text-sm mt-2">运行 <code className="text-accent">node scripts/crawl-skillhub.js</code> 抓取数据</p>
          </div>
        )}
      </section>

      {/* 分类浏览 */}
      <section className="mb-12">
        <CategorySection />
      </section>

    </div>
  )
}
