'use client'

import Link from 'next/link'

const CATEGORIES = [
  { name: 'AI智能', icon: '🤖', color: 'from-purple-500 to-blue-500' },
  { name: '开发工具', icon: '🔧', color: 'from-green-500 to-emerald-500' },
  { name: '效率提升', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { name: '数据分析', icon: '📊', color: 'from-blue-500 to-cyan-500' },
  { name: '内容创作', icon: '✍️', color: 'from-pink-500 to-rose-500' },
  { name: '安全合规', icon: '🔒', color: 'from-red-500 to-pink-500' },
  { name: '自动化', icon: '🔄', color: 'from-indigo-500 to-purple-500' },
  { name: '浏览器', icon: '🌐', color: 'from-teal-500 to-green-500' },
]

export default function CategorySection() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span>📁</span> 分类浏览
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={`/discover?category=${encodeURIComponent(cat.name)}`}
            className="group"
          >
            <div className={`bg-gradient-to-br ${cat.color} p-6 rounded-xl text-white text-center group-hover:scale-105 transition-transform`}>
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-medium">{cat.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
