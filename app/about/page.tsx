export const metadata = {
  title: '关于 - codeskills',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">关于 CodeSkills</h1>

      <div className="prose prose-invert max-w-none">
        <p className="text-text-secondary mb-6">
          CodeSkills 是一个专注于分享编程技能（Skills）的网站。我们收集和整理优质的编程资源，
          帮助开发者发现和学习高质量的工具、代码模式和最佳实践。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">内容来源</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>GitHub Trending 优质项目</li>
          <li>Awesome Lists 精选列表</li>
          <li>原创使用心得和经验总结</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">使用说明</h2>
        <p className="text-text-secondary mb-4">
          网站内容完全免费，你可以：
        </p>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>浏览和搜索感兴趣的 Skills</li>
          <li>通过标签筛选特定语言或分类的内容</li>
          <li>点击查看详细内容和使用示例</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">CodeSkills CLI</h2>
        <p className="text-text-secondary mb-4">
          除了网站浏览，你还可以通过命令行工具管理本地技能和分组。
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">安装 CLI</h3>
        <pre className="bg-card p-4 rounded-lg text-sm overflow-x-auto mb-4">
          <code>curl -fsSL https://codeskills.cn/install.sh | bash</code>
        </pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">codeskills status</h3>
        <pre className="bg-card p-4 rounded-lg text-sm overflow-x-auto mb-4 text-text-secondary">
          <code>{String.raw`╔═══════════════════════════════════════════╗
║           CodeSkills 状态               ║
╚═══════════════════════════════════════════╝

技能统计:
  总数:     ✓ 1 个
  已激活:   ✓ 0 个
  未分组:   ⚠ 1 个

分组统计:
  分组数:   2 个
  已激活:   0 个`}</code>
        </pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">常用命令</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <code className="text-accent">codeskills status</code>
            <p className="text-text-secondary text-sm mt-1">查看技能和分组状态</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <code className="text-accent">codeskills list</code>
            <p className="text-text-secondary text-sm mt-1">列出本地已安装的技能</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <code className="text-accent">codeskills list --remote</code>
            <p className="text-text-secondary text-sm mt-1">浏览远程技能市场</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <code className="text-accent">codeskills search &lt;关键词&gt;</code>
            <p className="text-text-secondary text-sm mt-1">搜索远程技能</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <code className="text-accent">codeskills install &lt;技能&gt;</code>
            <p className="text-text-secondary text-sm mt-1">安装技能到本地</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <code className="text-accent">codeskills activate &lt;组&gt;</code>
            <p className="text-text-secondary text-sm mt-1">激活分组</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Web 管理面板</h3>
        <p className="text-text-secondary mb-4">
          运行 <code className="bg-card px-2 py-1 rounded">codeskills web</code> 启动本地 Web 管理面板，可在浏览器中直观地管理技能和分组。
        </p>

        <div className="my-6">
          <img src="/screenshots/web-groups-view.png" alt="Web 分组管理" className="rounded-lg shadow-lg max-w-full" />
          <p className="text-text-secondary text-sm mt-2 text-center">Web 分组管理界面</p>
        </div>

        <div className="my-6">
          <img src="/screenshots/web-search-view.png" alt="Web 技能市场" className="rounded-lg shadow-lg max-w-full" />
          <p className="text-text-secondary text-sm mt-2 text-center">Web 技能市场 - 搜索和安装</p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">分组管理</h3>
        <div className="bg-card p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>codeskills group list           # 列出所有分组
codeskills group create &lt;名称&gt;  # 创建分组
codeskills group delete &lt;名称&gt;  # 删除分组
codeskills group add &lt;技能&gt; [分组]   # 添加技能到分组
codeskills group remove &lt;技能&gt; [分组] # 从分组移除技能
codeskills group show &lt;名称&gt;   # 显示分组详情</code>
          </pre>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">联系我们</h2>
        <p className="text-text-secondary">
          如果你有优质的编程技能想分享，欢迎联系我们。
        </p>
      </div>
    </div>
  )
}