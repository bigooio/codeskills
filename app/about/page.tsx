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

        <h2 className="text-xl font-semibold mt-8 mb-4">联系我们</h2>
        <p className="text-text-secondary">
          如果你有优质的编程技能想分享，欢迎联系我们。
        </p>
      </div>
    </div>
  )
}