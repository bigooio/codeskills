import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-accent tracking-tight">
          CodeSkills
        </Link>
        <nav className="flex gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card/50 rounded-lg transition"
          >
            首页
          </Link>
          <Link
            href="/discover"
            className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card/50 rounded-lg transition"
          >
            探索
          </Link>
          <Link
            href="/discover?sort=popular"
            className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card/50 rounded-lg transition"
          >
            🏆 榜单
          </Link>
          <Link
            href="/discover?category=AI智能"
            className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card/50 rounded-lg transition"
          >
            AI智能
          </Link>
          <Link
            href="/discover?category=开发工具"
            className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card/50 rounded-lg transition"
          >
            开发工具
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-card/50 rounded-lg transition"
          >
            关于
          </Link>
        </nav>
      </div>
    </header>
  )
}
